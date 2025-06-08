import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'executive' | 'viewer';
    sessionToken: string;
  };
}

// Secure session storage (in production, use Redis or database)
const activeSessions = new Map<string, {
  userId: string;
  role: 'admin' | 'executive' | 'viewer';
  createdAt: Date;
  lastAccess: Date;
}>();

// DWC Systems authorized users
const authorizedUsers = new Map([
  ['dw_brett', { id: 'dw_brett', password: process.env.DW_BW_PW || 'dwc_secure_2024', role: 'admin' as const }],
  ['dw_tina', { id: 'dw_tina', password: process.env.DW_BW_PW || 'dwc_secure_2024', role: 'executive' as const }],
  ['dw_executive', { id: 'dw_executive', password: 'dwc_exec_access', role: 'executive' as const }]
]);

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function authenticateUser(username: string, password: string): { success: boolean; user?: any; sessionToken?: string } {
  const user = authorizedUsers.get(username);
  
  if (!user || user.password !== password) {
    return { success: false };
  }

  // Generate secure session token
  const sessionToken = generateSecureToken();
  
  // Store session
  activeSessions.set(sessionToken, {
    userId: user.id,
    role: user.role,
    createdAt: new Date(),
    lastAccess: new Date()
  });

  return {
    success: true,
    user: {
      id: user.id,
      role: user.role,
      sessionToken
    },
    sessionToken
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.sessionToken;
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. Authentication required.',
      redirectTo: '/dwc-login'
    });
  }

  const session = activeSessions.get(token);
  
  if (!session) {
    return res.status(401).json({ 
      error: 'Invalid session. Please log in again.',
      redirectTo: '/dwc-login'
    });
  }

  // Check session expiry (24 hours)
  const sessionAge = Date.now() - session.createdAt.getTime();
  if (sessionAge > 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return res.status(401).json({ 
      error: 'Session expired. Please log in again.',
      redirectTo: '/dwc-login'
    });
  }

  // Update last access
  session.lastAccess = new Date();
  
  req.user = {
    id: session.userId,
    role: session.role,
    sessionToken: token
  };

  next();
}

export function requireRole(role: 'admin' | 'executive' | 'viewer') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const roleHierarchy = { admin: 3, executive: 2, viewer: 1 };
    const userLevel = roleHierarchy[req.user.role];
    const requiredLevel = roleHierarchy[role];

    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function logoutUser(sessionToken: string): boolean {
  return activeSessions.delete(sessionToken);
}

export function validateSession(sessionToken: string): boolean {
  const session = activeSessions.get(sessionToken);
  if (!session) return false;
  
  // Check if session is still valid (24 hours)
  const sessionAge = Date.now() - session.createdAt.getTime();
  if (sessionAge > 24 * 60 * 60 * 1000) {
    activeSessions.delete(sessionToken);
    return false;
  }
  
  return true;
}