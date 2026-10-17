export function requireTrustedOrigin(req, _res, next) {
  const origin = req.get('origin');
  if (origin && origin !== process.env.CLIENT_ORIGIN) {
    return next(Object.assign(new Error('Untrusted request origin'), { status: 403 }));
  }
  if (!origin && process.env.NODE_ENV === 'production') {
    return next(Object.assign(new Error('Request origin is required'), { status: 403 }));
  }
  return next();
}
