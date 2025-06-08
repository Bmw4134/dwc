import crypto from 'crypto';

interface ChatSession {
  id: string;
  fingerprint: string;
  promptCount: number;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  blocked: boolean;
}

class NexusChatTracker {
  private sessions: Map<string, ChatSession> = new Map();
  private maxPrompts = 20;
  private sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  generateFingerprint(req: any): string {
    const components = [
      req.ip || req.connection.remoteAddress,
      req.headers['user-agent'] || '',
      req.headers['accept-language'] || '',
      req.headers['accept-encoding'] || '',
      // Add more browser characteristics for stronger fingerprinting
      req.headers['sec-ch-ua'] || '',
      req.headers['sec-ch-ua-platform'] || '',
      req.headers['sec-fetch-dest'] || '',
    ];
    
    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex');
  }

  async validateChatRequest(req: any): Promise<{ allowed: boolean; promptsLeft: number; sessionId: string }> {
    const fingerprint = this.generateFingerprint(req);
    let currentSessionId = crypto.createHash('sha256').update(fingerprint + Date.now()).digest('hex');
    
    // Clean up expired sessions
    this.cleanExpiredSessions();
    
    // Find existing session by fingerprint
    let session = Array.from(this.sessions.values()).find(s => s.fingerprint === fingerprint);
    
    if (!session) {
      // Create new session
      session = {
        id: currentSessionId,
        fingerprint,
        promptCount: 0,
        createdAt: new Date(),
        lastActivity: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || '',
        blocked: false
      };
      this.sessions.set(currentSessionId, session);
    } else {
      // Update existing session
      session.lastActivity = new Date();
      currentSessionId = session.id;
    }

    // Check if session is blocked or exceeded limit
    if (session.blocked || session.promptCount >= this.maxPrompts) {
      return {
        allowed: false,
        promptsLeft: 0,
        sessionId: currentSessionId
      };
    }

    return {
      allowed: true,
      promptsLeft: this.maxPrompts - session.promptCount,
      sessionId: currentSessionId
    };
  }

  async recordPromptUsage(sessionId: string): Promise<{ success: boolean; promptsLeft: number }> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { success: false, promptsLeft: 0 };
    }

    session.promptCount++;
    session.lastActivity = new Date();

    // Block session if limit exceeded
    if (session.promptCount >= this.maxPrompts) {
      session.blocked = true;
    }

    return {
      success: true,
      promptsLeft: Math.max(0, this.maxPrompts - session.promptCount)
    };
  }

  private cleanExpiredSessions(): void {
    const now = Date.now();
    const expiredSessionIds: string[] = [];
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.sessionTimeout) {
        expiredSessionIds.push(sessionId);
      }
    }
    
    expiredSessionIds.forEach(id => this.sessions.delete(id));
  }

  // Advanced anti-bypass measures
  detectBypassAttempts(req: any): boolean {
    const fingerprint = this.generateFingerprint(req);
    const recentSessions = Array.from(this.sessions.values()).filter(s => 
      s.fingerprint === fingerprint && 
      Date.now() - s.createdAt.getTime() < 60000 // Within last minute
    );

    // Flag if too many sessions created rapidly
    if (recentSessions.length > 3) {
      recentSessions.forEach(s => s.blocked = true);
      return true;
    }

    return false;
  }

  getSessionStats(): { totalSessions: number; activeSessions: number; blockedSessions: number } {
    const now = Date.now();
    const sessions = Array.from(this.sessions.values());
    
    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(s => 
        now - s.lastActivity.getTime() < this.sessionTimeout && !s.blocked
      ).length,
      blockedSessions: sessions.filter(s => s.blocked).length
    };
  }
}

export const nexusChatTracker = new NexusChatTracker();