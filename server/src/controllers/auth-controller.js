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
  const { email, password } = req.validated.body;
  const record = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = record ? await bcrypt.compare(password, record.passwordHash) : false;
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Email or password is incorrect' });
  }
  issueSession(res, record.id);
  return res.json({ user: publicUser(record) });
}

export function signout(_req, res) {
  clearSession(res);
  return res.status(204).end();
}

export function currentUser(req, res) {
  return res.json({ user: req.user });
}
