/**
 * Layout Debugger Fix - Precise sidebar overlap resolution with debugging tools
 */

class LayoutDebuggerFix {
  constructor() {
    this.sidebarWidth = 250;
    this.breakpoint = 768;
    this.debugMode = false;
    this.initializeLayoutDebugger();
  }

  initializeLayoutDebugger() {
    console.log('[LAYOUT-DEBUGGER] Initializing layout debugger and fixes...');
    
    // Apply immediate fixes
    this.applyPreciseLayoutFixes();
    
    // Add debugging tools
    this.addLayoutDebugger();
    
    // Setup monitoring
    this.setupLayoutMonitoring();
    
    // Perform initial sanity check
    this.performLayoutSanityCheck();
  }

  applyPreciseLayoutFixes() {
    // Step 1: Fix dashboard container positioning
    this.fixDashboardContainer();
    
    // Step 2: Fix sidebar z-index and positioning within grid
    this.fixSidebarPositioning();
    
    // Step 3: Ensure content panel proper offset
    this.fixContentPanelOffset();
    
    // Step 4: Add mobile-first responsive behavior
    this.addMobileFirstBehavior();
  }

  fixDashboardContainer() {
    // Find and fix main dashboard containers
    const dashboardContainers = [
      document.getElementById('main-content'),
      document.querySelector('.main-content'),
      document.querySelector('.dashboard-container'),
      document.querySelector('[class*="dashboard"]')
    ].filter(el => el !== null);

    dashboardContainers.forEach(container => {
      container.style.position = 'relative';
      container.style.zIndex = '1';
      container.style.backgroundColor = container.style.backgroundColor || '#ecf0f1';
      container.style.minHeight = '100vh';
      container.style.boxSizing = 'border-box';
      
      // Ensure proper spacing from sidebar
      const isDesktop = window.innerWidth > this.breakpoint;
      if (isDesktop) {
        container.style.marginLeft = `${this.sidebarWidth}px`;
        container.style.width = `calc(100% - ${this.sidebarWidth}px)`;
      } else {
        container.style.marginLeft = '0';
        container.style.width = '100%';
      }
    });

    console.log('[LAYOUT-DEBUGGER] Dashboard container positioning fixed');
  }

  fixSidebarPositioning() {
    const sidebar = this.findSidebar();
    if (!sidebar) {
      console.warn('[LAYOUT-DEBUGGER] Sidebar not found');
      return;
    }

    // Apply precise positioning within grid boundary
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.left = '0';
    sidebar.style.width = `${this.sidebarWidth}px`;
    sidebar.style.height = '100vh';
    sidebar.style.zIndex = '1000'; // Higher than content but contained
    sidebar.style.backgroundColor = sidebar.style.backgroundColor || '#1a1a2e';
    sidebar.style.overflow = 'auto';
    sidebar.style.boxShadow = '2px 0 10px rgba(0,0,0,0.1)';
    
    // Mobile behavior
    if (window.innerWidth <= this.breakpoint) {
      sidebar.style.transform = 'translateX(-100%)';
      sidebar.style.transition = 'transform 0.3s ease';
    } else {
      sidebar.style.transform = 'translateX(0)';
    }

    console.log('[LAYOUT-DEBUGGER] Sidebar positioning fixed with z-index:', sidebar.style.zIndex);
  }

  fixContentPanelOffset() {
    // Find all content panels and modules
    const contentPanels = [
      ...document.querySelectorAll('.dashboard-module'),
      ...document.querySelectorAll('.module-container'),
      ...document.querySelectorAll('[data-module]'),
      ...document.querySelectorAll('#qnis-map-container'),
      ...document.querySelectorAll('.map-container')
    ];

    contentPanels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      
      // Check if panel is overlapped by sidebar
      if (rect.left < this.sidebarWidth && window.innerWidth > this.breakpoint) {
        console.warn('[LAYOUT-DEBUGGER] Content panel overlap detected, fixing...');
        
        // Auto-shift the panel
        const parentContainer = panel.closest('#main-content, .main-content') || panel.parentElement;
        if (parentContainer) {
          parentContainer.style.marginLeft = `${this.sidebarWidth}px`;
          parentContainer.style.width = `calc(100% - ${this.sidebarWidth}px)`;
        }
      }
      
      // Ensure panel has proper positioning
      panel.style.position = 'relative';
      panel.style.zIndex = '1';
      panel.style.maxWidth = '100%';
      panel.style.overflow = 'visible';
    });

    console.log('[LAYOUT-DEBUGGER] Content panel offsets verified and fixed');
  }

  addMobileFirstBehavior() {
    // Create responsive CSS with mobile-first approach
    const existingStyle = document.getElementById('mobile-first-layout');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement('style');
    style.id = 'mobile-first-layout';
    style.textContent = `
      /* Mobile-first base styles */
      .sidebar, #nexus-sidebar {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: ${this.sidebarWidth}px !important;
        height: 100vh !important;
        z-index: 1000 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.3s ease !important;
      }

      .main-content, #main-content {
        margin-left: 0 !important;
        width: 100% !important;
        position: relative !important;
        z-index: 1 !important;
        padding: 60px 20px 20px 20px !important;
      }

      /* Desktop override */
      @media (min-width: ${this.breakpoint + 1}px) {
        .sidebar, #nexus-sidebar {
          transform: translateX(0) !important;
        }

        .main-content, #main-content {
          margin-left: ${this.sidebarWidth}px !important;
          width: calc(100% - ${this.sidebarWidth}px) !important;
          padding: 20px !important;
        }
      }

      /* Sidebar open state on mobile */
      .sidebar.mobile-open, #nexus-sidebar.mobile-open {
        transform: translateX(0) !important;
      }

      /* Prevent horizontal overflow */
      body {
        overflow-x: hidden !important;
      }

      /* Fix for specific modules */
      .dashboard-module,
      .module-container,
      #qnis-map-container,
      .map-container {
        position: relative !important;
        z-index: 1 !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
    `;

    document.head.appendChild(style);

    // Bind sidebar collapse to viewport width
    this.bindViewportWidthHandler();
  }

  bindViewportWidthHandler() {
    const handleResize = () => {
      const sidebar = this.findSidebar();
      const mainContent = document.getElementById('main-content') || document.querySelector('.main-content');
      
      if (sidebar && mainContent) {
        if (window.innerWidth <= this.breakpoint) {
          // Mobile mode
          sidebar.classList.remove('mobile-open');
          sidebar.style.transform = 'translateX(-100%)';
          mainContent.style.marginLeft = '0';
          mainContent.style.width = '100%';
        } else {
          // Desktop mode
          sidebar.style.transform = 'translateX(0)';
          mainContent.style.marginLeft = `${this.sidebarWidth}px`;
          mainContent.style.width = `calc(100% - ${this.sidebarWidth}px)`;
        }
      }
      
      // Rerun sanity check after resize
      setTimeout(() => this.performLayoutSanityCheck(), 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 500);
    });
  }

  addLayoutDebugger() {
    // Create debug button
    this.createDebugButton();
    
    // Add debug panel
    this.createDebugPanel();
  }

  createDebugButton() {
    // Remove existing button
    const existingButton = document.getElementById('layout-debug-button');
    if (existingButton) existingButton.remove();

    const button = document.createElement('button');
    button.id = 'layout-debug-button';
    button.innerHTML = '🧠 Rerun Layout IQ';
    button.style.cssText = `
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 1003;
      background: #9b59b6;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-weight: 600;
      transition: background-color 0.3s ease;
    `;

    button.addEventListener('click', () => {
      this.runLayoutDebugger();
    });

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#8e44ad';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#9b59b6';
    });

    document.body.appendChild(button);
  }

  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'layout-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 60px;
      right: 15px;
      width: 350px;
      max-height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 1002;
      font-family: monospace;
      font-size: 12px;
      overflow: auto;
      display: none;
      border: 1px solid #ddd;
    `;

    panel.innerHTML = `
      <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
        <span>Layout Debugger</span>
        <button onclick="this.parentElement.parentElement.style.display='none'" style="background: none; border: none; font-size: 16px; cursor: pointer;">&times;</button>
      </div>
      <div id="debug-content" style="padding: 15px;">
        Click "🧠 Rerun Layout IQ" to analyze layout
      </div>
    `;

    document.body.appendChild(panel);
  }

  runLayoutDebugger() {
    console.log('[LAYOUT-DEBUGGER] Running comprehensive layout analysis...');
    
    this.debugMode = true;
    
    // Show debug panel
    const panel = document.getElementById('layout-debug-panel');
    if (panel) {
      panel.style.display = 'block';
    }

    // Collect layout data
    const debugData = this.collectLayoutDebugData();
    
    // Analyze for issues
    const issues = this.analyzeLayoutIssues(debugData);
    
    // Apply automatic fixes
    const fixes = this.applyAutomaticFixes(issues);
    
    // Update debug panel
    this.updateDebugPanel(debugData, issues, fixes);
    
    // Log results
    console.log('[LAYOUT-DEBUGGER] Debug results:', { debugData, issues, fixes });
  }

  collectLayoutDebugData() {
    const sidebar = this.findSidebar();
    const mainContent = this.findMainContent();
    
    const data = {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= this.breakpoint
      },
      sidebar: sidebar ? {
        width: sidebar.offsetWidth,
        height: sidebar.offsetHeight,
        left: sidebar.getBoundingClientRect().left,
        top: sidebar.getBoundingClientRect().top,
        zIndex: getComputedStyle(sidebar).zIndex,
        position: getComputedStyle(sidebar).position,
        transform: getComputedStyle(sidebar).transform,
        display: getComputedStyle(sidebar).display,
        visibility: getComputedStyle(sidebar).visibility
      } : null,
      mainContent: mainContent ? {
        width: mainContent.offsetWidth,
        height: mainContent.offsetHeight,
        left: mainContent.getBoundingClientRect().left,
        top: mainContent.getBoundingClientRect().top,
        marginLeft: getComputedStyle(mainContent).marginLeft,
        zIndex: getComputedStyle(mainContent).zIndex,
        position: getComputedStyle(mainContent).position
      } : null,
      modules: this.collectModuleData()
    };

    return data;
  }

  collectModuleData() {
    const modules = document.querySelectorAll('.dashboard-module, .module-container, [data-module], #qnis-map-container');
    
    return Array.from(modules).map((module, index) => {
      const rect = module.getBoundingClientRect();
      return {
        index,
        id: module.id || `module-${index}`,
        className: module.className,
        width: module.offsetWidth,
        height: module.offsetHeight,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        zIndex: getComputedStyle(module).zIndex,
        position: getComputedStyle(module).position,
        overflow: getComputedStyle(module).overflow,
        isOverlapped: rect.left < this.sidebarWidth && window.innerWidth > this.breakpoint
      };
    });
  }

  analyzeLayoutIssues(data) {
    const issues = [];

    // Check sidebar positioning
    if (data.sidebar) {
      if (data.sidebar.left !== 0 && !data.viewport.isMobile) {
        issues.push('Sidebar not positioned at left edge');
      }
      if (parseInt(data.sidebar.zIndex) < 1000) {
        issues.push('Sidebar z-index too low');
      }
      if (data.sidebar.width !== this.sidebarWidth) {
        issues.push(`Sidebar width mismatch: ${data.sidebar.width}px vs expected ${this.sidebarWidth}px`);
      }
    } else {
      issues.push('Sidebar not found');
    }

    // Check main content positioning
    if (data.mainContent) {
      const expectedMargin = data.viewport.isMobile ? 0 : this.sidebarWidth;
      const actualMargin = parseInt(data.mainContent.marginLeft);
      
      if (Math.abs(actualMargin - expectedMargin) > 5) {
        issues.push(`Main content margin mismatch: ${actualMargin}px vs expected ${expectedMargin}px`);
      }
      
      if (data.mainContent.left < this.sidebarWidth && !data.viewport.isMobile) {
        issues.push('Main content overlapped by sidebar');
      }
    } else {
      issues.push('Main content area not found');
    }

    // Check module overlaps
    const overlappedModules = data.modules.filter(module => module.isOverlapped);
    if (overlappedModules.length > 0) {
      issues.push(`${overlappedModules.length} modules overlapped by sidebar`);
    }

    // Check z-index conflicts
    const highZModules = data.modules.filter(module => 
      parseInt(module.zIndex) > 1000 && parseInt(module.zIndex) !== parseInt(module.zIndex)
    );
    if (highZModules.length > 0) {
      issues.push(`${highZModules.length} modules with conflicting z-index`);
    }

    return issues;
  }

  applyAutomaticFixes(issues) {
    const fixes = [];

    issues.forEach(issue => {
      if (issue.includes('Sidebar not positioned')) {
        this.fixSidebarPositioning();
        fixes.push('Fixed sidebar positioning');
      }
      
      if (issue.includes('Main content margin mismatch') || issue.includes('Main content overlapped')) {
        this.fixContentPanelOffset();
        fixes.push('Fixed main content offset');
      }
      
      if (issue.includes('modules overlapped')) {
        this.fixOverlappedModules();
        fixes.push('Fixed overlapped modules');
      }
      
      if (issue.includes('z-index')) {
        this.fixZIndexConflicts();
        fixes.push('Fixed z-index conflicts');
      }
    });

    return fixes;
  }

  fixOverlappedModules() {
    const modules = document.querySelectorAll('.dashboard-module, .module-container, [data-module], #qnis-map-container');
    
    modules.forEach(module => {
      const rect = module.getBoundingClientRect();
      
      if (rect.left < this.sidebarWidth && window.innerWidth > this.breakpoint) {
        // Move module container
        const container = module.closest('#main-content, .main-content') || module.parentElement;
        if (container) {
          container.style.marginLeft = `${this.sidebarWidth}px`;
          container.style.width = `calc(100% - ${this.sidebarWidth}px)`;
        }
      }
    });
  }

  fixZIndexConflicts() {
    const modules = document.querySelectorAll('.dashboard-module, .module-container, [data-module]');
    
    modules.forEach(module => {
      const zIndex = parseInt(getComputedStyle(module).zIndex);
      if (zIndex > 1000 && zIndex < 10000) {
        module.style.zIndex = '1';
      }
    });
  }

  updateDebugPanel(data, issues, fixes) {
    const debugContent = document.getElementById('debug-content');
    if (!debugContent) return;

    const timestamp = new Date().toLocaleTimeString();
    
    debugContent.innerHTML = `
      <div style="margin-bottom: 15px;">
        <strong>Analysis completed at ${timestamp}</strong>
      </div>
      
      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Viewport Info</h4>
        <div>Width: ${data.viewport.width}px</div>
        <div>Height: ${data.viewport.height}px</div>
        <div>Mode: ${data.viewport.isMobile ? 'Mobile' : 'Desktop'}</div>
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Sidebar Status</h4>
        ${data.sidebar ? `
          <div>Width: ${data.sidebar.width}px</div>
          <div>Left: ${data.sidebar.left}px</div>
          <div>Z-Index: ${data.sidebar.zIndex}</div>
          <div>Position: ${data.sidebar.position}</div>
          <div>Transform: ${data.sidebar.transform}</div>
        ` : '<div style="color: red;">Sidebar not found</div>'}
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Main Content Status</h4>
        ${data.mainContent ? `
          <div>Width: ${data.mainContent.width}px</div>
          <div>Left: ${data.mainContent.left}px</div>
          <div>Margin Left: ${data.mainContent.marginLeft}</div>
          <div>Z-Index: ${data.mainContent.zIndex}</div>
        ` : '<div style="color: red;">Main content not found</div>'}
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Modules (${data.modules.length})</h4>
        ${data.modules.slice(0, 3).map(module => `
          <div style="margin-bottom: 5px; padding: 5px; background: #f8f9fa; border-radius: 3px;">
            <div style="font-weight: bold;">${module.id || module.className}</div>
            <div>Left: ${module.left}px | Z-Index: ${module.zIndex}</div>
            <div style="color: ${module.isOverlapped ? 'red' : 'green'};">
              ${module.isOverlapped ? 'OVERLAPPED' : 'OK'}
            </div>
          </div>
        `).join('')}
        ${data.modules.length > 3 ? `<div>...and ${data.modules.length - 3} more</div>` : ''}
      </div>

      <div style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 8px 0; color: ${issues.length ? '#e74c3c' : '#27ae60'};">
          Issues Found (${issues.length})
        </h4>
        ${issues.length ? issues.map(issue => `
          <div style="color: #e74c3c; margin-bottom: 3px;">• ${issue}</div>
        `).join('') : '<div style="color: #27ae60;">No issues detected</div>'}
      </div>

      <div>
        <h4 style="margin: 0 0 8px 0; color: #3498db;">Auto-Fixes Applied (${fixes.length})</h4>
        ${fixes.length ? fixes.map(fix => `
          <div style="color: #3498db; margin-bottom: 3px;">✓ ${fix}</div>
        `).join('') : '<div>No fixes needed</div>'}
      </div>
    `;
  }

  performLayoutSanityCheck() {
    console.log('[LAYOUT-DEBUGGER] Performing layout sanity check...');
    
    const sidebar = this.findSidebar();
    const mainContent = this.findMainContent();
    
    if (sidebar && mainContent) {
      const sidebarWidth = sidebar.offsetWidth;
      const contentOffset = mainContent.getBoundingClientRect().left;
      const isDesktop = window.innerWidth > this.breakpoint;
      
      // Auto-shift grid if content is overlapped
      if (sidebarWidth > 0 && contentOffset < sidebarWidth && isDesktop) {
        console.warn('[LAYOUT-DEBUGGER] Layout overlap detected, auto-shifting...');
        
        mainContent.style.marginLeft = `${sidebarWidth}px`;
        mainContent.style.width = `calc(100% - ${sidebarWidth}px)`;
        
        // Trigger reflow
        setTimeout(() => {
          this.performLayoutSanityCheck();
        }, 100);
      }
    }
  }

  setupLayoutMonitoring() {
    // Monitor for DOM changes that affect layout
    const observer = new MutationObserver((mutations) => {
      let needsCheck = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const hasLayoutNodes = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.sidebar, #nexus-sidebar, .main-content, #main-content, .dashboard-module') ||
             node.querySelector('.sidebar, #nexus-sidebar, .main-content, #main-content, .dashboard-module'))
          );
          
          if (hasLayoutNodes) {
            needsCheck = true;
          }
        }
      });
      
      if (needsCheck) {
        setTimeout(() => this.performLayoutSanityCheck(), 200);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Utility methods
  findSidebar() {
    const selectors = ['#nexus-sidebar', '.sidebar', '[class*="sidebar"]'];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  findMainContent() {
    const selectors = ['#main-content', '.main-content', '[class*="main-content"]'];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  // Public methods
  static runDebugger() {
    const instance = window.LayoutDebuggerFixer;
    if (instance) {
      instance.runLayoutDebugger();
    }
  }

  static fixLayout() {
    const instance = window.LayoutDebuggerFixer;
    if (instance) {
      instance.applyPreciseLayoutFixes();
      instance.performLayoutSanityCheck();
    }
  }
}

// Initialize the layout debugger fix
const layoutDebuggerFixer = new LayoutDebuggerFix();

// Expose globally
window.LayoutDebuggerFixer = layoutDebuggerFixer;
window.layoutDebugger = () => layoutDebuggerFixer.runLayoutDebugger();

console.log('[LAYOUT-DEBUGGER] Layout debugger fix initialized with debugging tools');