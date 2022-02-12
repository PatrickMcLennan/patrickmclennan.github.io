import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

/**
 * Likely there would be much more logic tied to this error handling / message, but keeping it simple due to lack of requirements.
 */

interface Props {
  message: string;
}

export const Error: FC<Props> = ({ message }) => (
  <Typography component="h2" variant="h2">
    {message}
  </Typography>
);
