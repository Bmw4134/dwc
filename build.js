import { build } from 'vite';
import fs from 'fs';
import path from 'path';

async function buildForProduction() {
  console.log('Building DWC Systems LLC platform for production...');
  
  try {
    // Build the client application
    await build({
      configFile: './vite.config.ts',
      root: './client',
      base: '/',
      build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
          input: './client/index.html'
        }
      }
    });

    // Copy dist to public for server static serving
    const distPath = './dist';
    const publicPath = './server/public';
    
    if (fs.existsSync(publicPath)) {
      fs.rmSync(publicPath, { recursive: true, force: true });
    }
    
    fs.mkdirSync(publicPath, { recursive: true });
    fs.cpSync(distPath, publicPath, { recursive: true });
    
    console.log('Production build completed successfully');
    console.log('Static files copied to server/public');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForProduction();