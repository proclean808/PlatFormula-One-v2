import { createHash, randomBytes } from "crypto";
import { Router, Request, Response } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "../shared/const.js";

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

interface Session {
  userId: string;
  createdAt: Date;
}

// In-memory stores
const users = new Map<string, User>();
const sessions = new Map<string, Session>();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function generateId(): string {
  return randomBytes(16).toString("hex");
}

export function getCurrentUser(req: Request): User | null {
  const sessionId = req.cookies?.[COOKIE_NAME];
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (!session) return null;
  return users.get(session.userId) ?? null;
}

export function createAuthRouter(): Router {
  const router = Router();

  // GET /api/auth/me
  router.get("/me", (req: Request, res: Response) => {
    const user = getCurrentUser(req);
    if (!user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
  });

  // POST /api/auth/register
  router.post("/register", (req: Request, res: Response) => {
    const { email, name, password } = req.body as { email?: string; name?: string; password?: string };

    if (!email || !name || !password) {
      res.status(400).json({ error: "Email, name, and password are required" });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const existing = Array.from(users.values()).find(u => u.email === emailLower);
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const user: User = {
      id: generateId(),
      email: emailLower,
      name: name.trim(),
      passwordHash: hashPassword(password),
      createdAt: new Date(),
    };
    users.set(user.id, user);

    const sessionId = generateId();
    sessions.set(sessionId, { userId: user.id, createdAt: new Date() });

    res.cookie(COOKIE_NAME, sessionId, {
      httpOnly: true,
      maxAge: ONE_YEAR_MS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
  });

  // POST /api/auth/login
  router.post("/login", (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const user = Array.from(users.values()).find(u => u.email === emailLower);

    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const sessionId = generateId();
    sessions.set(sessionId, { userId: user.id, createdAt: new Date() });

    res.cookie(COOKIE_NAME, sessionId, {
      httpOnly: true,
      maxAge: ONE_YEAR_MS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
  });

  // POST /api/auth/logout
  router.post("/logout", (req: Request, res: Response) => {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.clearCookie(COOKIE_NAME);
    res.json({ success: true });
  });

  return router;
}
