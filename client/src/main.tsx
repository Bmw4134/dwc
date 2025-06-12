import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.jsx'
import './index.css'

// Force immediate DOM readiness for iframe
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Enhanced iframe compatibility
  const isInIframe = window.self !== window.top;
  if (isInIframe) {
    document.body.classList.add('iframe-mode');
    document.documentElement.style.cssText = 'height: 100% !important; margin: 0 !important; padding: 0 !important;';
    document.body.style.cssText = 'height: 100% !important; margin: 0 !important; padding: 0 !important; visibility: visible !important; opacity: 1 !important;';
    rootElement.style.cssText = 'width: 100% !important; min-height: 100vh !important; display: block !important; visibility: visible !important; opacity: 1 !important;';
  }

  // Mount React app
  createRoot(rootElement).render(
    <SimpleApp />
  );
  
  console.log("DWC Systems LLC app mounted successfully");
  
  // Clear loading screen once React app mounts
  setTimeout(() => {
    const loadingDiv = rootElement.firstElementChild;
    if (loadingDiv && loadingDiv.style && loadingDiv.style.position === 'fixed') {
      loadingDiv.remove();
    }
  }, 1000);
};

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}