import axios from 'axios';

// Downstream service URLs are injected via environment variables in Docker Compose.
// The defaults let the gateway run outside a container, and keep a missing variable
// from silently producing a request to the literal URL "undefined/chargers/...".
export const CHARGER_SERVICE = process.env.CHARGER_SERVICE_URL || 'http://localhost:3001';
export const LOCATION_SERVICE = process.env.LOCATION_SERVICE_URL || 'http://localhost:3002';
export const STATUS_SERVICE = process.env.STATUS_SERVICE_URL || 'http://localhost:3003';

// How long to wait on a downstream service before giving up. Without this, a hung
// service holds the client's request open indefinitely.
export const DOWNSTREAM_TIMEOUT_MS = Number(process.env.DOWNSTREAM_TIMEOUT_MS) || 5000;

// Shared client so every outbound call inherits the same timeout.
export const httpClient = axios.create({ timeout: DOWNSTREAM_TIMEOUT_MS });
