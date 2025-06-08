import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Smartphone } from 'lucide-react';
import { useAdaptiveDisplay } from './adaptive-display-handler';

interface FullscreenToggleProps {
  className?: string;
}

export function FullscreenToggle({ className = "" }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { isMobile } = useAdaptiveDisplay();

  useEffect(() => {
    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone || 
                        document.referrer.includes('android-app://');

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Hide install button if already installed
    if (isStandalone) {
      setCanInstall(false);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.log('Fullscreen not supported or denied');
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.log('Exit fullscreen failed');
      }
    }
  };

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Install as App Button - Mobile Priority */}
      {canInstall && isMobile && (
        <Button
          onClick={installApp}
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Install App
        </Button>
      )}

      {/* Fullscreen Toggle */}
      <Button
        onClick={toggleFullscreen}
        size="sm"
        variant="outline"
        className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="w-4 h-4 mr-2" />
            Exit Fullscreen
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </>
        )}
      </Button>

      {/* Install as App Button - Desktop */}
      {canInstall && !isMobile && (
        <Button
          onClick={installApp}
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Install as App
        </Button>
      )}
    </div>
  );
}