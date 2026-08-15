import { AxiosError } from 'axios';
import { Response } from 'express';

// Maps a failure from a downstream call to an honest HTTP response instead of
// flattening every failure mode into a generic 500.
export function handleDownstreamError(res: Response, error: unknown, context: string): void {
  console.error(`[api-gateway] ${context}:`, error);

  const axiosError = error as AxiosError;

  if (axiosError?.response) {
    // The downstream service answered with an error status (e.g. 404) — pass it through
    // rather than reporting a gateway fault for a perfectly normal "not found".
    res.status(axiosError.response.status).json({ message: `Downstream error: ${context}` });
    return;
  }

  if (axiosError?.code === 'ECONNABORTED' || axiosError?.code === 'ETIMEDOUT') {
    res.status(504).json({ message: `Timed out ${context}` });
    return;
  }

  if (axiosError?.code === 'ECONNREFUSED' || axiosError?.code === 'ENOTFOUND') {
    res.status(502).json({ message: `Unable to reach downstream service: ${context}` });
    return;
  }

  res.status(500).json({ message: `Unexpected error: ${context}` });
}
