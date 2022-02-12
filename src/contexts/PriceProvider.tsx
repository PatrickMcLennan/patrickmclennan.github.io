import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import { isProd } from '../../src/utils';

/**
 * For an app this simple, I typically wouldn't overcomplicate it with something like Global State, I'd use props instead to pass values around.
 *
 * That being said I'm building this as though it were a production app that is likely to scale with new features.
 * 
 * I would also likely extrapolate all of this into a shared library of types
 */

interface Props {
  children: ReactNode;
}

interface IPriceContext {
  error: string;
  loading: boolean;
  currentRates: CurrentRates;
  transactions: Transaction[];
}

interface CurrentRates {
  BTC_CAD: number; 
  ETH_CAD: number
}

export enum SupportedCurrencies {
  CAD = "CAD",
  BTC = "BTC",
  ETH = "ETH"
}

export interface Transaction {
  createdAt: string;
  amount: number;
  currency: SupportedCurrencies; // I would make this an Enum when I knew all supported currencies
  type: string; // likely an enum as well
  direction: string | null; // likely an enum as well
  from: {
    currency: SupportedCurrencies; 
    amount: number;
  };
  to: {
    currency: SupportedCurrencies;
    amount: number;
  }
}

export const PriceContext = createContext({} as IPriceContext);

export const PriceProvider = ({ children }: Props) => {
  const [error, setError] = useState<string>(``);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentRates, setCurrentRates] = useState<CurrentRates>();
  const [transactions, setTransactions] = useState<Transaction[]>();

  /**
   * Making re-usable functions from these in case future requirements want to fetch independantly
   */
  const getCurrentRates = useCallback(async () => {
    let data;
    try {
      const res = await axios.get(`https://api.shakepay.co/rates`);
      data = res?.data;
    } catch (err) {
      if (!isProd) {
        console.error(err);
      }
      setError(`The current rates could not be fetched at this time, please try again later`);
    }

    if (!data) {
      setError(`The current rates could not be fetched at this time, please try again later`);
    } else {
      setCurrentRates({ BTC_CAD: data.BTC_CAD, ETH_CAD: data.ETH_CAD });
    }
  }, []);

  const getTransactionHistory = useCallback(async () => {
    let data;
    try {
      const res = await axios.get(`https://shakepay.github.io/programming-exercise/web/transaction_history.json`);
      data = res?.data
    } catch (err) {
      if (!isProd) {
        console.error(err);
      }
      setError(`Your transaction history could not be fetched at this time, please try again later`);
    }

    return !data 
      ? setError(`The current rates could not be fetched at this time, please try again later`)
      : setTransactions(data)

  }, []);

  const fetchAllInformation = useCallback(async () => {
    setLoading(true);
    await Promise.all([getCurrentRates(), getTransactionHistory()]);
    setLoading(false);
  }, [])

  useEffect(() => {
    fetchAllInformation();
  }, []);

  return <PriceContext.Provider value={{ error, loading, currentRates, transactions }}>{children}</PriceContext.Provider>;
};

export const usePriceProvider = () => useContext(PriceContext);
