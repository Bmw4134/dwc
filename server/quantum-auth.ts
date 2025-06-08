/**
 * Quantum-Level Replit Authentication System
 * Enhanced security with role-based access control
 */
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Quantum Security Levels
export enum QuantumSecurityLevel {
  BASIC = 1,
  ENHANCED = 2,
  CLASSIFIED = 3,
  QUANTUM = 4,
  OMEGA = 5
}

// Role-based permissions
export interface UserPermissions {
  modules: {
    dashboard: boolean;
    leads: boolean;
    clients: boolean;
    analytics: boolean;
    watson_valuation: boolean;
    quantum_intelligence: boolean;
    team_collaboration: boolean;
    admin_panel: boolean;
  };
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
  };
}

export const DEFAULT_PERMISSIONS: Record<string, UserPermissions> = {
  team_member: {
    modules: {
      dashboard: true,
      leads: true,
      clients: true,
      analytics: false,
      watson_valuation: false,
      quantum_intelligence: false,
      team_collaboration: true,
      admin_panel: false,
    },
    actions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: false,
    }
  },
  admin: {
    modules: {
      dashboard: true,
      leads: true,
      clients: true,
      analytics: true,
      watson_valuation: false,
      quantum_intelligence: true,
      team_collaboration: true,
      admin_panel: true,
    },
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    }
  },
  owner: {
    modules: {
      dashboard: true,
      leads: true,
      clients: true,
      analytics: true,
      watson_valuation: true,
      quantum_intelligence: true,
      team_collaboration: true,
      admin_panel: true,
    },
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
    }
  }
};

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getQuantumSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
      sameSite: 'strict' // Enhanced security
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUserWithQuantumSecurity(claims: any) {
  const isOwner = claims["email"] === "watson@example.com"; // Watson is the owner
  const role = isOwner ? "owner" : "team_member";
  const quantumLevel = isOwner ? QuantumSecurityLevel.OMEGA : QuantumSecurityLevel.BASIC;
  
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
    role,
    quantumSecurityLevel: quantumLevel,
    permissions: DEFAULT_PERMISSIONS[role],
    lastLogin: new Date(),
  });
}

export async function setupQuantumAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getQuantumSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUserWithQuantumSecurity(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `quantumauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/auth/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Authentication routes
  app.get("/api/auth/login", (req, res, next) => {
    passport.authenticate(`quantumauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/auth/callback", (req, res, next) => {
    passport.authenticate(`quantumauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/auth/login",
    })(req, res, next);
  });

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

// Quantum authentication middleware
export const quantumAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Quantum authentication required" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Quantum session expired" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Quantum authentication failed" });
    return;
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUser(userId);
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      req.authenticatedUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization check failed" });
    }
  };
};

// Module access control
export const requireModule = (moduleName: keyof UserPermissions['modules']) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const permissions = user.permissions as UserPermissions;
      if (!permissions?.modules?.[moduleName]) {
        return res.status(403).json({ message: `Access denied to ${moduleName} module` });
      }

      req.authenticatedUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Module access check failed" });
    }
  };
};

// Watson-only access for business valuation
export const watsonOnly: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.claims?.sub;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "owner" || user.quantumSecurityLevel !== QuantumSecurityLevel.OMEGA) {
      return res.status(403).json({ message: "Watson-only access required" });
    }

    req.authenticatedUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Watson authentication failed" });
  }
};