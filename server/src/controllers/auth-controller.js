import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { clearSession, issueSession } from '../middleware/auth.js';

const publicUser = ({ id, email, name }) => ({ id, email, name });

export async function signup(req, res) {
  const { name, email, password } = req.validated.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, email: true, name: true }
  });
  issueSession(res, user.id);
  return res.status(201).json({ user });
}

export async function signin(req, res) {
  try {
    const { email, password } = req.validated?.body || req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email or password is incorrect' });
    }

    issueSession(res, user.id);

    return res.status(200).json({
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Signin error in server:", error);
    return res.status(500).json({ error: 'An unexpected server error occurred' });
  }
}

export function signout(_req, res) {
  clearSession(res);
  return res.status(204).end();
}

export function currentUser(req, res) {
  return res.json({ user: req.user });
}