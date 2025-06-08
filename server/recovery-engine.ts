import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface RecoverySnapshot {
  id: string;
  label: string;
  timestamp: Date;
  path: string;
  size: number;
  description: string;
}

interface SystemBackup {
  configFiles: string[];
  moduleFiles: string[];
  logFiles: string[];
  timestamp: Date;
  systemState: any;
}

export class RecoveryEngine {
  private recoveryDir: string;
  private systemDir: string;
  private stateFile: string;

  constructor() {
    this.recoveryDir = path.join(process.cwd(), 'backups');
    this.systemDir = path.join(process.cwd(), 'dwc_system');
    this.stateFile = path.join(process.cwd(), 'configs', 'dwc_config.json');
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.recoveryDir, { recursive: true });
      await fs.mkdir(this.systemDir, { recursive: true });
      await fs.mkdir(path.dirname(this.stateFile), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize recovery directories:', error);
    }
  }

  async createSnapshot(label: string = 'auto'): Promise<RecoverySnapshot> {
    const timestamp = new Date();
    const timestampStr = timestamp.toISOString().replace(/[:.]/g, '-');
    const snapshotId = `${label}_${timestampStr}`;
    const snapshotPath = path.join(this.recoveryDir, snapshotId);

    try {
      // Create backup directory
      await fs.mkdir(snapshotPath, { recursive: true });

      // Backup configuration files
      const configDir = path.join(snapshotPath, 'configs');
      await fs.mkdir(configDir, { recursive: true });
      
      try {
        const configData = await fs.readFile(this.stateFile, 'utf-8');
        await fs.writeFile(path.join(configDir, 'dwc_config.json'), configData);
      } catch (error) {
        // Config file doesn't exist yet
      }

      // Backup funding modules
      const modulesDir = path.join(process.cwd(), 'server', 'funding-modules');
      const moduleBackupDir = path.join(snapshotPath, 'funding-modules');
      
      try {
        await this.copyDirectory(modulesDir, moduleBackupDir);
      } catch (error) {
        // Modules directory doesn't exist yet
      }

      // Backup logs
      const logsDir = path.join(process.cwd(), 'logs');
      const logBackupDir = path.join(snapshotPath, 'logs');
      
      try {
        await this.copyDirectory(logsDir, logBackupDir);
      } catch (error) {
        // Logs directory doesn't exist yet
      }

      // Create metadata
      const metadata = {
        id: snapshotId,
        label,
        timestamp,
        description: `System snapshot created at ${timestamp.toLocaleString()}`,
        systemState: await this.getSystemState()
      };

      await fs.writeFile(
        path.join(snapshotPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      // Calculate size
      const size = await this.getDirectorySize(snapshotPath);

      const snapshot: RecoverySnapshot = {
        id: snapshotId,
        label,
        timestamp,
        path: snapshotPath,
        size,
        description: metadata.description
      };

      console.log(`[SNAPSHOT] Created backup at: ${snapshotPath}`);
      return snapshot;
    } catch (error) {
      throw new Error(`Failed to create snapshot: ${error}`);
    }
  }

  async listSnapshots(): Promise<RecoverySnapshot[]> {
    try {
      const snapshots: RecoverySnapshot[] = [];
      const entries = await fs.readdir(this.recoveryDir);

      for (const entry of entries) {
        const entryPath = path.join(this.recoveryDir, entry);
        const stat = await fs.stat(entryPath);
        
        if (stat.isDirectory()) {
          try {
            const metadataPath = path.join(entryPath, 'metadata.json');
            const metadataData = await fs.readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataData);
            
            snapshots.push({
              id: metadata.id,
              label: metadata.label,
              timestamp: new Date(metadata.timestamp),
              path: entryPath,
              size: await this.getDirectorySize(entryPath),
              description: metadata.description
            });
          } catch (error) {
            // Fallback for snapshots without metadata
            snapshots.push({
              id: entry,
              label: entry.split('_')[0] || 'unknown',
              timestamp: stat.mtime,
              path: entryPath,
              size: await this.getDirectorySize(entryPath),
              description: `Legacy snapshot from ${stat.mtime.toLocaleString()}`
            });
          }
        }
      }

      return snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to list snapshots:', error);
      return [];
    }
  }

  async rollback(snapshotId: string): Promise<string> {
    try {
      const snapshots = await this.listSnapshots();
      const targetSnapshot = snapshots.find(s => s.id === snapshotId || s.id.includes(snapshotId));

      if (!targetSnapshot) {
        throw new Error(`Snapshot with ID '${snapshotId}' not found`);
      }

      // Create a pre-rollback snapshot
      await this.createSnapshot('pre-rollback');

      // Restore configuration
      const configBackupPath = path.join(targetSnapshot.path, 'configs', 'dwc_config.json');
      try {
        const configData = await fs.readFile(configBackupPath, 'utf-8');
        await fs.writeFile(this.stateFile, configData);
      } catch (error) {
        console.warn('Could not restore config file:', error);
      }

      // Restore funding modules
      const moduleBackupPath = path.join(targetSnapshot.path, 'funding-modules');
      const modulesDir = path.join(process.cwd(), 'server', 'funding-modules');
      
      try {
        await fs.rm(modulesDir, { recursive: true, force: true });
        await this.copyDirectory(moduleBackupPath, modulesDir);
      } catch (error) {
        console.warn('Could not restore modules:', error);
      }

      // Restore logs
      const logBackupPath = path.join(targetSnapshot.path, 'logs');
      const logsDir = path.join(process.cwd(), 'logs');
      
      try {
        await fs.rm(logsDir, { recursive: true, force: true });
        await this.copyDirectory(logBackupPath, logsDir);
      } catch (error) {
        console.warn('Could not restore logs:', error);
      }

      return `[ROLLBACK] System restored to: ${targetSnapshot.id}`;
    } catch (error) {
      throw new Error(`Rollback failed: ${error}`);
    }
  }

  async simulateRepair<T>(testFn: () => Promise<T> | T): Promise<{ success: boolean; result?: T; error?: string }> {
    try {
      // Create a test snapshot before attempting repair
      const testSnapshot = await this.createSnapshot('test-repair');
      
      try {
        const result = await testFn();
        return { success: true, result };
      } catch (error) {
        // Rollback to test snapshot
        await this.rollback(testSnapshot.id);
        return { success: false, error: String(error) };
      }
    } catch (error) {
      return { success: false, error: `Simulation setup failed: ${error}` };
    }
  }

  async getSystemHealth(): Promise<{
    diskSpace: number;
    backupCount: number;
    lastBackup: Date | null;
    configIntegrity: boolean;
    moduleCount: number;
  }> {
    try {
      const snapshots = await this.listSnapshots();
      const diskSpace = await this.getDirectorySize(this.recoveryDir);
      
      // Check config integrity
      let configIntegrity = false;
      try {
        await fs.access(this.stateFile);
        const configData = await fs.readFile(this.stateFile, 'utf-8');
        JSON.parse(configData); // Test if valid JSON
        configIntegrity = true;
      } catch (error) {
        configIntegrity = false;
      }

      // Count modules
      let moduleCount = 0;
      try {
        const modulesDir = path.join(process.cwd(), 'server', 'funding-modules');
        const moduleFiles = await fs.readdir(modulesDir);
        moduleCount = moduleFiles.filter(file => file.endsWith('.ts')).length;
      } catch (error) {
        moduleCount = 0;
      }

      return {
        diskSpace,
        backupCount: snapshots.length,
        lastBackup: snapshots.length > 0 ? snapshots[0].timestamp : null,
        configIntegrity,
        moduleCount
      };
    } catch (error) {
      throw new Error(`Failed to get system health: ${error}`);
    }
  }

  private async copyDirectory(src: string, dest: string): Promise<void> {
    try {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src);

      for (const entry of entries) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        const stat = await fs.stat(srcPath);

        if (stat.isDirectory()) {
          await this.copyDirectory(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    } catch (error) {
      throw new Error(`Failed to copy directory: ${error}`);
    }
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      let size = 0;
      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry);
        const stat = await fs.stat(entryPath);

        if (stat.isDirectory()) {
          size += await this.getDirectorySize(entryPath);
        } else {
          size += stat.size;
        }
      }

      return size;
    } catch (error) {
      return 0;
    }
  }

  private async getSystemState(): Promise<any> {
    try {
      const { stdout } = await execAsync('node --version');
      return {
        nodeVersion: stdout.trim(),
        timestamp: new Date().toISOString(),
        platform: process.platform,
        architecture: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        error: 'Could not retrieve system state'
      };
    }
  }
}

export const recoveryEngine = new RecoveryEngine();