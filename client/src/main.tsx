import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced iframe compatibility for Replit preview
const isInIframe = window.self !== window.top;
if (isInIframe) {
  document.body.classList.add('iframe-mode');
  
  // Ensure proper iframe rendering
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.overflow = 'auto';
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />)