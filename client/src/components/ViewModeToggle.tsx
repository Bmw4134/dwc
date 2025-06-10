import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, ToggleLeft, ToggleRight } from "lucide-react";
import { useViewMode } from "@/hooks/useViewMode";

export function ViewModeToggle() {
  const { viewMode, isMobileDevice, toggleViewMode, isDesktopMode } = useViewMode();

  if (!isMobileDevice) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleViewMode}
        className={`
          shadow-lg border-2 transition-all duration-300
          ${isDesktopMode 
            ? 'bg-blue-600 hover:bg-blue-700 border-blue-400' 
            : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400'
          }
        `}
        size="sm"
      >
        {isDesktopMode ? (
          <>
            <Monitor className="w-4 h-4 mr-2" />
            Desktop View
          </>
        ) : (
          <>
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile View
          </>
        )}
      </Button>
    </div>
  );
}