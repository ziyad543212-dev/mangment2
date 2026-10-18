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

export async function signin(req, res ,next) {
 try {
    const { name, email, password } = req.body;
    // ...
    // تأكد من وجود كود الإرجاع في نهاية الدالة:
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Signup error in server:", error); // اطبع الخطأ لتراه في التيرمينال
    return res.status(500).json({ message: "حدث خطأ غير متوقع في الخادم" });
  }
}

export function signout(_req, res) {
  clearSession(res);
  return res.status(204).end();
}

export function currentUser(req, res) {
  return res.json({ user: req.user });
}
