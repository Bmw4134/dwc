/**
 * DWC Systems API Key Vault
 * Secure credential management with encryption at rest
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

class APIKeyVault {
    constructor() {
        this.vaultPath = './api_keys.json';
        this.encryptionKey = this.getEncryptionKey();
        this.keys = new Map();
        this.loadVault();
    }

    getEncryptionKey() {
        // Use environment key or generate deterministic key
        const envKey = process.env.VAULT_ENCRYPTION_KEY;
        if (envKey) {
            return crypto.createHash('sha256').update(envKey).digest();
        }
        
        // Fallback to deterministic key based on system
        const systemKey = process.env.DATABASE_URL || 'dwc-systems-vault-key';
        return crypto.createHash('sha256').update(systemKey).digest();
    }

    encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    decrypt(encryptedText) {
        try {
            const [ivHex, encrypted] = encryptedText.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error('[VAULT] Decryption failed:', error.message);
            return null;
        }
    }

    async loadVault() {
        try {
            const data = await fs.readFile(this.vaultPath, 'utf8');
            const vaultData = JSON.parse(data);
            
            for (const [id, keyData] of Object.entries(vaultData)) {
                this.keys.set(id, {
                    ...keyData,
                    value: this.decrypt(keyData.encryptedValue)
                });
            }
            
            console.log(`[VAULT] Loaded ${this.keys.size} API keys`);
        } catch (error) {
            // First time setup or empty vault
            console.log('[VAULT] Initializing new vault');
            await this.saveVault();
        }
    }

    async saveVault() {
        try {
            const vaultData = {};
            
            for (const [id, keyData] of this.keys.entries()) {
                vaultData[id] = {
                    id: keyData.id,
                    name: keyData.name,
                    scope: keyData.scope,
                    createdAt: keyData.createdAt,
                    expiresAt: keyData.expiresAt,
                    isActive: keyData.isActive,
                    encryptedValue: this.encrypt(keyData.value)
                };
            }
            
            await fs.writeFile(this.vaultPath, JSON.stringify(vaultData, null, 2));
            console.log('[VAULT] Saved vault to disk');
        } catch (error) {
            console.error('[VAULT] Failed to save vault:', error.message);
            throw error;
        }
    }

    generateKeyId() {
        return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async addKey(name, value, scope, expiresAt = null) {
        const id = this.generateKeyId();
        
        const keyData = {
            id,
            name,
            value,
            scope,
            createdAt: new Date().toISOString(),
            expiresAt,
            isActive: true,
            lastUsed: null
        };

        this.keys.set(id, keyData);
        await this.saveVault();
        
        console.log(`[VAULT] Added new API key: ${name} (${scope})`);
        return id;
    }

    async updateKey(id, updates) {
        const keyData = this.keys.get(id);
        if (!keyData) {
            throw new Error('API key not found');
        }

        const updatedKey = { ...keyData, ...updates };
        this.keys.set(id, updatedKey);
        await this.saveVault();
        
        console.log(`[VAULT] Updated API key: ${id}`);
        return updatedKey;
    }

    async revokeKey(id) {
        const keyData = this.keys.get(id);
        if (!keyData) {
            throw new Error('API key not found');
        }

        keyData.isActive = false;
        keyData.revokedAt = new Date().toISOString();
        await this.saveVault();
        
        console.log(`[VAULT] Revoked API key: ${id}`);
        return keyData;
    }

    async deleteKey(id) {
        if (!this.keys.has(id)) {
            throw new Error('API key not found');
        }

        this.keys.delete(id);
        await this.saveVault();
        
        console.log(`[VAULT] Deleted API key: ${id}`);
        return true;
    }

    getKey(id) {
        const keyData = this.keys.get(id);
        if (!keyData || !keyData.isActive) {
            return null;
        }

        // Check expiration
        if (keyData.expiresAt && new Date() > new Date(keyData.expiresAt)) {
            keyData.isActive = false;
            this.saveVault();
            return null;
        }

        // Update last used
        keyData.lastUsed = new Date().toISOString();
        
        return keyData;
    }

    getKeyByScope(scope) {
        for (const keyData of this.keys.values()) {
            if (keyData.isActive && (keyData.scope === scope || keyData.scope === 'all')) {
                // Check expiration
                if (keyData.expiresAt && new Date() > new Date(keyData.expiresAt)) {
                    continue;
                }
                return keyData;
            }
        }
        return null;
    }

    listKeys(includeValues = false) {
        const keyList = [];
        
        for (const keyData of this.keys.values()) {
            const safeKey = {
                id: keyData.id,
                name: keyData.name,
                scope: keyData.scope,
                createdAt: keyData.createdAt,
                expiresAt: keyData.expiresAt,
                isActive: keyData.isActive,
                lastUsed: keyData.lastUsed,
                status: this.getKeyStatus(keyData)
            };

            if (includeValues) {
                safeKey.value = keyData.value;
                safeKey.maskedValue = this.maskValue(keyData.value);
            } else {
                safeKey.maskedValue = this.maskValue(keyData.value);
            }

            keyList.push(safeKey);
        }
        
        return keyList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    maskValue(value) {
        if (!value || value.length < 8) {
            return '••••••••';
        }
        
        const start = value.substring(0, 4);
        const end = value.substring(value.length - 4);
        const middle = '•'.repeat(Math.max(4, value.length - 8));
        
        return `${start}${middle}${end}`;
    }

    getKeyStatus(keyData) {
        if (!keyData.isActive) {
            return 'inactive';
        }
        
        if (keyData.expiresAt && new Date() > new Date(keyData.expiresAt)) {
            return 'expired';
        }
        
        return 'active';
    }

    getVaultStats() {
        const total = this.keys.size;
        const active = Array.from(this.keys.values()).filter(k => k.isActive).length;
        const expired = Array.from(this.keys.values()).filter(k => 
            k.expiresAt && new Date() > new Date(k.expiresAt)
        ).length;

        const scopeCounts = {};
        for (const keyData of this.keys.values()) {
            if (keyData.isActive) {
                scopeCounts[keyData.scope] = (scopeCounts[keyData.scope] || 0) + 1;
            }
        }

        return {
            total,
            active,
            expired,
            inactive: total - active,
            scopeCounts,
            lastUpdate: new Date().toISOString()
        };
    }
}

export default APIKeyVault;