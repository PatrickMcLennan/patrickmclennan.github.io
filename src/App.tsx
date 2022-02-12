import React, { FC } from 'react';
import Container from '@mui/material/Container';
import type { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { PriceProvider } from './contexts';
import { Graph } from './components';

const sx = {
  h1: {
    marginBottom: (theme: Theme) => theme.spacing(5),
  },
  main: {
    height: `100%`,
    paddingTop: (theme: Theme) => theme.spacing(10),
  },
} as const;

export const App: FC = () => {
  return (
    <PriceProvider>
      <Container component="main" maxWidth="md" sx={sx.main}>
        <Typography component="h1" variant="h1" sx={sx.h1}>
          Your Shakepay Net Worth
        </Typography>
        <Graph />
      </Container>
    </PriceProvider>
  );
};
