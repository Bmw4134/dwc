/**
 * PASSKEY AUTHENTICATION SYSTEM
 * Seamless iPhone to Desktop Login with WebAuthn
 */

interface PasskeyCredential {
  id: string;
  publicKey: string;
  userId: string;
  deviceName: string;
  createdAt: Date;
  lastUsed: Date;
}

interface PasskeyAuthSession {
  sessionId: string;
  userId: string;
  deviceFingerprint: string;
  expiresAt: Date;
}

export class PasskeyAuthenticationSystem {
  private credentials: Map<string, PasskeyCredential> = new Map();
  private activeSessions: Map<string, PasskeyAuthSession> = new Map();

  async createPasskeyCredential(userId: string, deviceName: string): Promise<{
    success: boolean;
    credentialId?: string;
    challenge?: string;
  }> {
    try {
      const credentialId = `pk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const challenge = this.generateChallenge();
      
      const credential: PasskeyCredential = {
        id: credentialId,
        publicKey: this.generatePublicKey(),
        userId,
        deviceName,
        createdAt: new Date(),
        lastUsed: new Date()
      };
      
      this.credentials.set(credentialId, credential);
      
      return {
        success: true,
        credentialId,
        challenge
      };
    } catch (error) {
      return { success: false };
    }
  }

  async authenticateWithPasskey(credentialId: string, signature: string): Promise<{
    success: boolean;
    sessionId?: string;
    userId?: string;
  }> {
    try {
      const credential = this.credentials.get(credentialId);
      if (!credential) {
        return { success: false };
      }

      // Validate signature (simplified for demo)
      if (this.verifySignature(signature, credential.publicKey)) {
        const sessionId = this.createSession(credential.userId);
        
        // Update last used
        credential.lastUsed = new Date();
        this.credentials.set(credentialId, credential);
        
        return {
          success: true,
          sessionId,
          userId: credential.userId
        };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async validateSession(sessionId: string): Promise<{
    valid: boolean;
    userId?: string;
  }> {
    const session = this.activeSessions.get(sessionId);
    
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        this.activeSessions.delete(sessionId);
      }
      return { valid: false };
    }
    
    return {
      valid: true,
      userId: session.userId
    };
  }

  private generateChallenge(): string {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');
  }

  private generatePublicKey(): string {
    return `pk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private verifySignature(signature: string, publicKey: string): boolean {
    // Simplified signature verification
    return signature.length > 10 && publicKey.length > 10;
  }

  private createSession(userId: string): string {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
    
    const session: PasskeyAuthSession = {
      sessionId,
      userId,
      deviceFingerprint: this.generateDeviceFingerprint(),
      expiresAt
    };
    
    this.activeSessions.set(sessionId, session);
    return sessionId;
  }

  private generateDeviceFingerprint(): string {
    return `fp_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
  }

  getUserCredentials(userId: string): PasskeyCredential[] {
    return Array.from(this.credentials.values())
      .filter(cred => cred.userId === userId);
  }

  revokeCredential(credentialId: string): boolean {
    return this.credentials.delete(credentialId);
  }

  getSessionInfo(sessionId: string): PasskeyAuthSession | undefined {
    return this.activeSessions.get(sessionId);
  }
}

export const passkeyAuth = new PasskeyAuthenticationSystem();