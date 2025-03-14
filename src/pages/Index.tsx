
import React, { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Widget from '@/components/Widget';
import WidgetMenu from '@/components/WidgetMenu';
import TabNavigation from '@/components/TabNavigation';
import { WidgetProvider, useWidget } from '@/context/WidgetContext';
import ChartWidget from '@/components/widgets/Chart';
import PortfolioWidget from '@/components/widgets/Portfolio';
import OrderFormWidget from '@/components/widgets/OrderForm';
import TransactionHistoryWidget from '@/components/widgets/TransactionHistory';
import AlignmentGuides from '@/components/AlignmentGuides';
import { useAlignmentGuides } from '@/hooks/useAlignmentGuides';
import { GuideLineType } from '@/types/alignmentGuides';

const widgetComponents: Record<string, React.FC<any>> = {
  chart: ChartWidget,
  portfolio: PortfolioWidget,
  orderForm: OrderFormWidget,
  transactions: TransactionHistoryWidget,
  watchlist: PortfolioWidget, // Placeholder
  news: TransactionHistoryWidget, // Placeholder
  calendar: ChartWidget, // Placeholder
  positions: OrderFormWidget // Placeholder
};

const TradingTerminal: React.FC = () => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const { widgets, removeWidget } = useWidget();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const [guideLines, setGuideLines] = useState<GuideLineType[]>([]);
  
  const { calculateGuides, clearGuides } = useAlignmentGuides(widgets, mainContainerRef);
  
  const handleWidgetMove = useCallback((widgetId: string, rect: DOMRect) => {
    setActiveWidgetId(widgetId);
    const guides = calculateGuides(widgetId, rect);
    setGuideLines(guides);
    return { x: null, y: null };
  }, [calculateGuides]);
  
  const handleWidgetResize = useCallback((widgetId: string, rect: DOMRect) => {
    setActiveWidgetId(widgetId);
    const guides = calculateGuides(widgetId, rect, true);
    setGuideLines(guides);
    return { x: null, y: null };
  }, [calculateGuides]);
  
  const handleWidgetDragEnd = useCallback(() => {
    setActiveWidgetId(null);
    clearGuides();
    setGuideLines([]);
  }, [clearGuides]);
  
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  }, []);
  
  return (
    <div 
      className="min-h-screen bg-terminal-bg text-terminal-text flex flex-col"
      onContextMenu={handleContextMenu}
      onClick={() => contextMenuPosition && setContextMenuPosition(null)}
    >
      <Header />
      <TabNavigation />
      
      <main 
        ref={mainContainerRef}
        className="flex-1 p-0 h-[calc(100vh-86px)] relative"
        style={{ marginTop: 0 }}
      >
        <AlignmentGuides guideLines={guideLines} />
        
        {widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type];
          
          return (
            <Widget
              key={widget.id}
              id={widget.id}
              title={widget.title}
              position={widget.position}
              size={widget.size}
              zIndex={widget.zIndex}
              isActive={widget.isActive}
              onRemove={() => removeWidget(widget.id)}
            >
              <WidgetComponent />
            </Widget>
          );
        })}
      </main>
      
      {contextMenuPosition && (
        <WidgetMenu 
          position={contextMenuPosition} 
          onClose={() => setContextMenuPosition(null)} 
        />
      )}
      
      <div className="fixed bottom-2 right-2 flex items-center text-terminal-muted text-xs bg-terminal-accent/30 px-3 py-1 rounded-md">
        <span className="mr-2">22:54:42</span>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
          <span>Онлайн</span>
        </div>
      </div>
    </div>
  );
};

const Index = () => (
  <WidgetProvider>
    <TradingTerminal />
  </WidgetProvider>
);

export default Index;
