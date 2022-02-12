import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import type {Theme} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';
import {  SupportedCurrencies, usePriceProvider } from '../../contexts';
import { Error } from '../Error';
import CircularProgress from '@mui/material/CircularProgress';
import { mixins } from '../../styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns'

/**
 * This would absolutely have unit tests on it in a production setting, but unfortunately out of time
 */

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DataPoint = {
  date: string;
  worth: number;
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      // text: 'Your Net Worth in CAD',
    },
  },
};

const sx = {
  header: {
    width: `100%`,
    marginBottom: (theme: Theme) => theme.spacing(5)
  },
  selectWrapper: {
    fontSize: `2rem`
  },
  spinner: {
    margin: `auto`
  },
  typography: {
    fontSize: `2rem`
  },
  wrapper: {
    ...mixins.flex({jc: `flex-start`, ai: `stretch`, fd: `column`}),
    width: `100%`,
  },
} as const;

export const Graph = () => {
  const { error, loading, currentRates, transactions } = usePriceProvider();

  const [selectedYear, setSelectedYear] = useState<string>(`All`);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const cache = useRef<Map<string, DataPoint[]>>(new Map());

  const theme = useTheme()

  const changeYear = useCallback(
    (event: SelectChangeEvent) => setSelectedYear(event?.target?.value?.toString?.() ?? `2022`),
    []
  );

  const data = useMemo(
    () => {
      if (loading) {
        return {};
      }
      let yearlyTransactions: DataPoint[] = [];
      let btc_balance = 0;
      let eth_balance = 0;
      let cad_balance = 0;
      for (let i = 0; i <= transactions.length - 1; i+= 1) {
        const date = new Date(transactions[i]?.createdAt);
        const year = date.getFullYear().toString();

        if (selectedYear !== `All` && year !== selectedYear) {
          continue;
        }


        const cached = cache?.current?.get?.(year);
        if (cached) {
          yearlyTransactions = cached
        } else {
          /**
           * The below logic is really, really gross, I would extrapolate this logic to a much more strongly typed + structured + tested env
           * Unfortunately running out of time though
           */
          const {amount, direction, type, from, to, currency} = transactions[i];
          if (type === `conversion`) {
            const fromCurrency = from?.currency;
            const toCurrency = to?.currency;
            if (fromCurrency === SupportedCurrencies.CAD) {
              cad_balance = cad_balance - from.amount;
            } else if (fromCurrency === SupportedCurrencies.BTC) {
              btc_balance = btc_balance - from.amount;
            } else if (fromCurrency === SupportedCurrencies.ETH) {
              btc_balance = eth_balance - from.amount;
            }

            if (toCurrency === SupportedCurrencies.CAD) {
              cad_balance = cad_balance + to.amount;
            } else if (toCurrency === SupportedCurrencies.BTC) {
              btc_balance = btc_balance + to.amount;
            } else if (toCurrency === SupportedCurrencies.ETH) {
              eth_balance = eth_balance + to.amount
            }
          } else if (direction === "debit") {
            // Operating under the assumption that debit means currency has been withdrawn
            if (currency === SupportedCurrencies.CAD) {
              cad_balance = cad_balance - amount;
            } else if (currency === SupportedCurrencies.BTC) {
              btc_balance = btc_balance - amount;
            } else if (currency === SupportedCurrencies.ETH) {
              btc_balance = eth_balance - amount;
            }
          } else if (direction === "credit") {
            // Operating under the assumption that credit means currency has been deposited
            if (currency === SupportedCurrencies.CAD) {
              cad_balance = cad_balance + amount;
            } else if (currency === SupportedCurrencies.BTC) {
              btc_balance = btc_balance + amount;
            } else if (currency === SupportedCurrencies.ETH) {
              btc_balance = eth_balance + amount;
            }
            yearlyTransactions.push({date: format(new Date(transactions[i].createdAt), `MM-dd-yyyy`), worth: cad_balance + (btc_balance * currentRates.BTC_CAD) + (eth_balance * currentRates.ETH_CAD)});
            continue;
        }

        }
      }

      return {
        labels: yearlyTransactions.map(({ date }) => date),
        datasets: [
          {
            label: 'Your Net Worth in CAD',
            data: yearlyTransactions.map(({ worth }) => worth),
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.divider,
          },
        ],
      } as const
    },
    [loading, selectedYear, transactions]
  );

  const markup = useMemo(() => {
    if (error) {
      return <Error message={error} />;
    } else if (loading) {
      return <CircularProgress />;
    } else {
      return <Line options={options} data={data} />
    };
  }, [data, selectedYear, error, loading]);

  useEffect(() => {
    if (transactions?.length) {
      let availableYears = [];
      for (let i = 0; i <= transactions.length - 1; i += 1) {
        const year = new Date(transactions[i].createdAt).getFullYear();
        if (availableYears.includes(year)) {
          continue
        } else {
          availableYears.push(year);
          continue;
        }
      }
      // })
      setAvailableYears(availableYears)
    }
  }, [transactions])

  return (
    <>
      <Box component="section" sx={sx.wrapper}>
        <Box component="header" sx={sx.header}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" sx={sx.typography}>Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedYear.toString()}
              label="Select Year"
              onChange={changeYear} sx={sx.typography}
            >
              <MenuItem value={`All`} sx={sx.typography}>All</MenuItem>
              {availableYears.map(year => (
                <MenuItem key={year} value={year} sx={sx.typography}>{year}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
        {markup}
      </Box>
    </>
  );
};
