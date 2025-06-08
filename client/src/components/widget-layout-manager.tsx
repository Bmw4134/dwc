import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Move, Minimize2, Maximize2, RotateCcw } from 'lucide-react';

interface WidgetPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isVisible: boolean;
}

interface WidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
  priority?: 'high' | 'medium' | 'low';
}

interface WidgetLayoutManagerProps {
  widgets: WidgetProps[];
  onWidgetRemove?: (id: string) => void;
}

export function WidgetLayoutManager({ widgets, onWidgetRemove }: WidgetLayoutManagerProps) {
  const [positions, setPositions] = useState<Map<string, WidgetPosition>>(new Map());
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    widgetId: string | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({
    isDragging: false,
    widgetId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [highestZIndex, setHighestZIndex] = useState(1000);

  // Initialize widget positions
  useEffect(() => {
    const newPositions = new Map<string, WidgetPosition>();
    
    widgets.forEach((widget, index) => {
      if (!positions.has(widget.id)) {
        const position: WidgetPosition = {
          id: widget.id,
          x: widget.defaultPosition?.x ?? (50 + index * 20),
          y: widget.defaultPosition?.y ?? (50 + index * 20),
          width: widget.defaultSize?.width ?? 400,
          height: widget.defaultSize?.height ?? 300,
          zIndex: 1000 + index,
          isMinimized: false,
          isVisible: true
        };
        newPositions.set(widget.id, position);
      }
    });

    if (newPositions.size > 0) {
      setPositions(prev => new Map([...prev, ...newPositions]));
    }
  }, [widgets]);

  // Collision detection
  const checkCollision = useCallback((pos1: WidgetPosition, pos2: WidgetPosition): boolean => {
    if (pos1.isMinimized || pos2.isMinimized || !pos1.isVisible || !pos2.isVisible) {
      return false;
    }

    return !(
      pos1.x + pos1.width < pos2.x ||
      pos2.x + pos2.width < pos1.x ||
      pos1.y + pos1.height < pos2.y ||
      pos2.y + pos2.height < pos1.y
    );
  }, []);

  // Auto-arrange widgets to prevent collisions
  const autoArrangeWidgets = useCallback(() => {
    const positionsArray = Array.from(positions.values()).filter(p => p.isVisible);
    const arranged = new Map<string, WidgetPosition>();
    
    positionsArray.forEach((position, index) => {
      let newX = 50 + (index % 3) * 420; // 3 columns
      let newY = 50 + Math.floor(index / 3) * 320; // Stack rows
      
      // Ensure widgets stay within container bounds
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        newX = Math.min(newX, containerRect.width - position.width - 20);
        newY = Math.min(newY, containerRect.height - position.height - 20);
      }

      arranged.set(position.id, {
        ...position,
        x: newX,
        y: newY
      });
    });

    setPositions(prev => new Map([...prev, ...arranged]));
  }, [positions]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent, widgetId: string) => {
    if ((e.target as HTMLElement).closest('.widget-controls')) {
      return; // Don't drag when clicking controls
    }

    const position = positions.get(widgetId);
    if (!position) return;

    // Bring to front
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    setPositions(prev => new Map(prev.set(widgetId, {
      ...position,
      zIndex: newZIndex
    })));

    setDragState({
      isDragging: true,
      widgetId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    });

    e.preventDefault();
  }, [positions, highestZIndex]);

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.widgetId) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;
      
      let newX = dragState.initialX + deltaX;
      let newY = dragState.initialY + deltaY;

      // Boundary constraints
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const position = positions.get(dragState.widgetId);
        if (position) {
          newX = Math.max(0, Math.min(newX, containerRect.width - position.width));
          newY = Math.max(0, Math.min(newY, containerRect.height - position.height));
        }
      }

      const position = positions.get(dragState.widgetId);
      if (position) {
        setPositions(prev => new Map(prev.set(dragState.widgetId!, {
          ...position,
          x: newX,
          y: newY
        })));
      }
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        widgetId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
      });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, positions]);

  // Widget controls
  const toggleMinimize = useCallback((widgetId: string) => {
    const position = positions.get(widgetId);
    if (position) {
      setPositions(prev => new Map(prev.set(widgetId, {
        ...position,
        isMinimized: !position.isMinimized,
        height: position.isMinimized ? 300 : 40
      })));
    }
  }, [positions]);

  const closeWidget = useCallback((widgetId: string) => {
    const position = positions.get(widgetId);
    if (position) {
      setPositions(prev => new Map(prev.set(widgetId, {
        ...position,
        isVisible: false
      })));
      onWidgetRemove?.(widgetId);
    }
  }, [positions, onWidgetRemove]);

  const resetLayout = useCallback(() => {
    const newPositions = new Map<string, WidgetPosition>();
    
    widgets.forEach((widget, index) => {
      const position: WidgetPosition = {
        id: widget.id,
        x: 50 + (index % 3) * 420,
        y: 50 + Math.floor(index / 3) * 320,
        width: widget.defaultSize?.width ?? 400,
        height: widget.defaultSize?.height ?? 300,
        zIndex: 1000 + index,
        isMinimized: false,
        isVisible: true
      };
      newPositions.set(widget.id, position);
    });

    setPositions(newPositions);
  }, [widgets]);

  // Collision warning system
  const getCollisionWarnings = useCallback(() => {
    const warnings: string[] = [];
    const positionsArray = Array.from(positions.values()).filter(p => p.isVisible && !p.isMinimized);
    
    for (let i = 0; i < positionsArray.length; i++) {
      for (let j = i + 1; j < positionsArray.length; j++) {
        if (checkCollision(positionsArray[i], positionsArray[j])) {
          const widget1 = widgets.find(w => w.id === positionsArray[i].id);
          const widget2 = widgets.find(w => w.id === positionsArray[j].id);
          if (widget1 && widget2) {
            warnings.push(`${widget1.title} overlaps with ${widget2.title}`);
          }
        }
      }
    }
    
    return warnings;
  }, [positions, widgets, checkCollision]);

  const collisionWarnings = getCollisionWarnings();

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Layout Controls */}
      <div className="absolute top-4 right-4 z-[10000] flex gap-2">
        <Button
          onClick={autoArrangeWidgets}
          size="sm"
          variant="outline"
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
        >
          <Move className="w-4 h-4 mr-2" />
          Auto Arrange
        </Button>
        <Button
          onClick={resetLayout}
          size="sm"
          variant="outline"
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Layout
        </Button>
      </div>

      {/* Collision Warnings */}
      {collisionWarnings.length > 0 && (
        <div className="absolute top-4 left-4 z-[10000] max-w-sm">
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-800 dark:text-amber-200">
                Widget Collisions Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {collisionWarnings.slice(0, 3).map((warning, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                >
                  {warning}
                </Badge>
              ))}
              {collisionWarnings.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{collisionWarnings.length - 3} more
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Widgets */}
      {widgets.map((widget) => {
        const position = positions.get(widget.id);
        if (!position || !position.isVisible) return null;

        return (
          <Card
            key={widget.id}
            className={`absolute shadow-lg transition-all duration-200 ${
              dragState.isDragging && dragState.widgetId === widget.id 
                ? 'shadow-2xl ring-2 ring-blue-500 ring-opacity-50' 
                : ''
            } ${
              position.isMinimized ? 'overflow-hidden' : ''
            } ${
              widget.priority === 'high' ? 'border-red-200 dark:border-red-800' :
              widget.priority === 'medium' ? 'border-yellow-200 dark:border-yellow-800' :
              'border-gray-200 dark:border-gray-700'
            }`}
            style={{
              left: position.x,
              top: position.y,
              width: position.width,
              height: position.height,
              zIndex: position.zIndex,
              cursor: dragState.isDragging && dragState.widgetId === widget.id ? 'grabbing' : 'grab'
            }}
            onMouseDown={(e) => handleMouseDown(e, widget.id)}
          >
            <CardHeader 
              className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b cursor-grab"
              onMouseDown={(e) => handleMouseDown(e, widget.id)}
            >
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {widget.title}
                {widget.priority === 'high' && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    High
                  </Badge>
                )}
              </CardTitle>
              <div className="widget-controls flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize(widget.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  {position.isMinimized ? (
                    <Maximize2 className="h-3 w-3" />
                  ) : (
                    <Minimize2 className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeWidget(widget.id);
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            {!position.isMinimized && (
              <CardContent className="p-4 overflow-auto" style={{ height: position.height - 60 }}>
                {widget.children}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default WidgetLayoutManager;