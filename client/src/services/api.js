import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export function getApiError(error, t) {
  const message = error.response?.data?.error;
  if (!message) return t ? t('networkError') : 'Something went wrong. Please try again.';
  const translations = {
    'Invalid request': 'requestError',
    'Authentication required': 'authRequired',
    'Invalid session': 'invalidSession',
    'Invalid or expired session': 'invalidSession',
    'Email or password is incorrect': 'credentialsError',
    'A record with that value already exists': 'duplicateRecord',
    'Project not found': 'projectMissing',
    'Task not found': 'taskMissing',
    'Too many authentication attempts. Try again later.': 'tooManyAttempts',
    'An unexpected server error occurred': 'unexpectedError',
    'Untrusted request origin': 'untrustedOrigin',
    'Request origin is required': 'requestOriginRequired'
  };
  return t && translations[message] ? t(translations[message]) : message;
}
