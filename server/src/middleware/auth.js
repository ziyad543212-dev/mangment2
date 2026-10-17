import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const cookieName = 'pm_session';

export function issueSession(res, userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearSession(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/'
  });
}

export async function requireAuth(req, _res, next) {
  const token = req.cookies[cookieName];
  if (!token) {
    return next(Object.assign(new Error('Authentication required'), { status: 401 }));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(Object.assign(new Error('Invalid or expired session'), { status: 401 }));
    }
    return next(error);
  }
  if (typeof payload === 'string' || !payload.sub) {
    return next(Object.assign(new Error('Invalid session'), { status: 401 }));
  }

  try {
    req.user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true }
    });
    if (!req.user) {
      return next(Object.assign(new Error('Invalid session'), { status: 401 }));
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
