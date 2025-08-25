import React from 'react';
import useMediaQuery from '../../utils/useMediaQuery';

const ResponsiveLayout = ({
  children,
  className = '',
  sidebar,
  sidebarWidth = '300px',
  sidebarPosition = 'left',
  sidebarBreakpoint = 'lg',
  stackOnMobile = true,
  gap = '2rem',
  contentMinWidth = '0',
  sidebarCollapsible = false,
  initialCollapsed = false,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(initialCollapsed);
  
  // Determine if we're at the breakpoint where sidebar should be hidden/shown differently
  const isMobile = useMediaQuery(`(max-width: ${sidebarBreakpoint === 'sm' ? '640px' : sidebarBreakpoint === 'md' ? '768px' : '1024px'})`);
  
  // Toggle sidebar visibility (for collapsible sidebar)
  const toggleSidebar = () => {
    if (sidebarCollapsible) {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  
  // Determine if sidebar should be shown
  const showSidebar = sidebar && (!isMobile || (isMobile && !stackOnMobile));
  const showCollapsedSidebar = sidebarCollapsible && sidebarCollapsed && !isMobile;
  
  // Layout styles
  const layoutStyle = {
    display: isMobile && stackOnMobile ? 'block' : 'flex',
    flexDirection: sidebarPosition === 'right' ? 'row-reverse' : 'row',
    gap: isMobile && stackOnMobile ? '1rem' : gap,
  };
  
  // Sidebar styles
  const sidebarStyle = {
    width: showCollapsedSidebar ? '60px' : sidebarWidth,
    transition: 'width 0.3s ease',
    overflow: 'hidden',
  };
  
  // Content styles
  const contentStyle = {
    flexGrow: 1,
    minWidth: contentMinWidth,
  };
  
  // Mobile sidebar (shown as a full-width element above or below content)
  const renderMobileSidebar = () => {
    if (!sidebar || !isMobile || !stackOnMobile) return null;
    
    return (
      <div className="w-full">
        {sidebar}
      </div>
    );
  };
  
  // Toggle button for collapsible sidebar
  const renderToggleButton = () => {
    if (!sidebarCollapsible || isMobile) return null;
    
    return (
      <button 
        onClick={toggleSidebar}
        className="absolute top-4 -right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm z-10"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    );
  };
  
  return (
    <div className={`responsive-layout ${className}`} style={layoutStyle}>
      {/* Sidebar - shown inline on desktop, or stacked on mobile */}
      {showSidebar && (
        <div className="relative" style={sidebarStyle}>
          {renderToggleButton()}
          {sidebar}
        </div>
      )}
      
      {/* Main content */}
      <div style={contentStyle}>
        {children}
      </div>
      
      {/* Mobile sidebar placement - can be above or below content */}
      {renderMobileSidebar()}
    </div>
  );
};

export default ResponsiveLayout;