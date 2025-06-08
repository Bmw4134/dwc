import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Monitor } from 'lucide-react';

interface Props {
  isVisible: boolean;
  onToggle: () => void;
}

export default function QuantumUXUnifier({ isVisible, onToggle }: Props) {
  const [info, setInfo] = useState({ width: 0, height: 0, platform: "" });

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        platform: navigator.platform || "unknown"
      });
    };
    updateInfo();
    window.addEventListener("resize", updateInfo);
    return () => window.removeEventListener("resize", updateInfo);
  }, []);

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed top-2 right-2 h-8 w-8 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 hover:bg-black/90 text-white shadow-lg z-50"
        size="sm"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed top-2 right-2 bg-white/95 backdrop-blur-sm text-black rounded-lg shadow-lg px-3 py-2 text-xs z-50 border border-gray-300">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold">Quantum UX</p>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <p>Width: {info.width}px</p>
      <p>Height: {info.height}px</p>
      <p>Platform: {info.platform}</p>
    </div>
  );
}