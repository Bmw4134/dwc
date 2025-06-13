/**
 * Comprehensive Layout Fix - Resolves all sidebar overlap and rendering issues
 */

class ComprehensiveLayoutFix {
  constructor() {
    this.sidebarWidth = 250;
    this.breakpoint = 768;
    this.isInitialized = false;
    this.initializeComprehensiveFix();
  }

  initializeComprehensiveFix() {
    console.log('[LAYOUT-COMPREHENSIVE] Initializing comprehensive layout fix...');
    
    // Wait for DOM and apply immediate fixes
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.applyComprehensiveFix());
    } else {
      this.applyComprehensiveFix();
    }

    // Monitor for dynamic changes
    this.setupLayoutIntelligence();
  }

  applyComprehensiveFix() {
    if (this.isInitialized) return;
    
    // Step 1: Fix z-index and positioning conflicts
    this.resolveZIndexConflicts();
    
    // Step 2: Implement proper layout structure
    this.implementProperLayoutStructure();
    
    // Step 3: Add responsive layout system
    this.addResponsiveLayoutSystem();
    
    // Step 4: Fix content overflow and clipping
    this.fixContentOverflowIssues();
    
    // Step 5: Add mobile toggle functionality
    this.addMobileToggleFunctionality();
    
    // Step 6: Startup validation
    this.performStartupValidation();
    
    this.isInitialized = true;
    console.log('[LAYOUT-COMPREHENSIVE] Layout fix applied successfully');
  }

  resolveZIndexConflicts() {
    // Fix sidebar z-index and positioning
    const sidebar = this.findSidebar();
    if (sidebar) {
      sidebar.style.position = 'fixed';
      sidebar.style.left = '0';
      sidebar.style.top = '0';
      sidebar.style.width = `${this.sidebarWidth}px`;
      sidebar.style.height = '100vh';
      sidebar.style.zIndex = '1000';
      sidebar.style.backgroundColor = sidebar.style.backgroundColor || '#1a1a2e';
      sidebar.style.overflow = 'auto';
      sidebar.style.transition = 'transform 0.3s ease';
      
      // Ensure sidebar is visible
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
      sidebar.style.opacity = '1';
    }

    // Fix any conflicting z-index elements
    this.fixConflictingZIndex();
  }

  findSidebar() {
    const selectors = [
      '#nexus-sidebar',
      '.sidebar',
      '[class*="sidebar"]',
      '[id*="sidebar"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  fixConflictingZIndex() {
    // Find elements with high z-index that might conflict
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element).zIndex);
      
      // Reset problematic z-index values that interfere with sidebar
      if (zIndex > 1000 && zIndex < 10000 && !element.closest('.sidebar, #nexus-sidebar')) {
        const rect = element.getBoundingClientRect();
        // If element is in sidebar area, reduce its z-index
        if (rect.left < this.sidebarWidth) {
          element.style.zIndex = '999';
        }
      }
    });
  }

  implementProperLayoutStructure() {
    // Ensure proper body layout
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.boxSizing = 'border-box';
    document.body.style.fontFamily = '"Segoe UI", Arial, sans-serif';
    document.body.style.overflow = 'hidden'; // Prevent horizontal scroll

    // Create or fix main content area
    this.createOrFixMainContent();
    
    // Apply flex layout to body if needed
    this.applyFlexLayout();
  }

  createOrFixMainContent() {
    let mainContent = this.findMainContent();
    
    if (!mainContent) {
      mainContent = this.createMainContentArea();
    }

    // Apply proper styling to main content
    this.styleMainContent(mainContent);
    
    // Ensure all modules are contained within main content
    this.ensureModulesInMainContent(mainContent);
  }

  findMainContent() {
    const selectors = [
      '#main-content',
      '.main-content',
      '.content',
      '[class*="main-content"]',
      '[id*="main-content"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  createMainContentArea() {
    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    mainContent.className = 'main-content';

    // Find where to insert the main content
    const sidebar = this.findSidebar();
    
    // Move existing content into main content area
    const existingContent = Array.from(document.body.children).filter(child => 
      !child.matches('.sidebar, #nexus-sidebar, script, style, #mobile-menu-toggle')
    );

    existingContent.forEach(element => {
      mainContent.appendChild(element);
    });

    document.body.appendChild(mainContent);
    return mainContent;
  }

  styleMainContent(mainContent) {
    const isDesktop = window.innerWidth > this.breakpoint;
    
    mainContent.style.marginLeft = isDesktop ? `${this.sidebarWidth}px` : '0';
    mainContent.style.width = isDesktop ? `calc(100% - ${this.sidebarWidth}px)` : '100%';
    mainContent.style.minHeight = '100vh';
    mainContent.style.padding = '20px';
    mainContent.style.backgroundColor = '#ecf0f1';
    mainContent.style.boxSizing = 'border-box';
    mainContent.style.overflow = 'auto';
    mainContent.style.position = 'relative';
    mainContent.style.zIndex = '1';
    mainContent.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
  }

  ensureModulesInMainContent(mainContent) {
    // Find any orphaned modules and move them to main content
    const moduleSelectors = [
      '.dashboard-module',
      '.module-container',
      '[data-module]',
      '[class*="module"]',
      '.map-container',
      '#qnis-map-container'
    ];

    moduleSelectors.forEach(selector => {
      const modules = document.querySelectorAll(selector);
      modules.forEach(module => {
        if (!mainContent.contains(module) && !module.closest('.sidebar, #nexus-sidebar')) {
          mainContent.appendChild(module);
        }
      });
    });
  }

  applyFlexLayout() {
    // Only apply flex layout if not already set
    const bodyStyle = getComputedStyle(document.body);
    
    if (bodyStyle.display !== 'flex') {
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'row';
      document.body.style.height = '100vh';
    }

    const sidebar = this.findSidebar();
    const mainContent = this.findMainContent();

    if (sidebar && mainContent) {
      sidebar.style.flexShrink = '0';
      mainContent.style.flex = '1';
      mainContent.style.marginLeft = '0'; // Remove margin when using flex
    }
  }

  addResponsiveLayoutSystem() {
    // Remove existing responsive styles
    const existingStyle = document.getElementById('comprehensive-responsive-styles');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement('style');
    style.id = 'comprehensive-responsive-styles';
    style.textContent = `
      /* Reset and base styles */
      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow-x: hidden;
      }

      /* Desktop layout */
      @media (min-width: ${this.breakpoint + 1}px) {
        body {
          display: flex;
          flex-direction: row;
        }

        .sidebar, #nexus-sidebar {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: ${this.sidebarWidth}px !important;
          height: 100vh !important;
          z-index: 1000 !important;
          transform: translateX(0) !important;
          transition: transform 0.3s ease !important;
        }

        .main-content, #main-content {
          margin-left: ${this.sidebarWidth}px !important;
          width: calc(100% - ${this.sidebarWidth}px) !important;
          min-height: 100vh !important;
          padding: 20px !important;
          overflow: auto !important;
          position: relative !important;
          z-index: 1 !important;
        }

        #mobile-menu-toggle {
          display: none !important;
        }
      }

      /* Mobile and tablet layout */
      @media (max-width: ${this.breakpoint}px) {
        body {
          display: block;
          position: relative;
        }

        .sidebar, #nexus-sidebar {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: ${this.sidebarWidth}px !important;
          height: 100vh !important;
          z-index: 1001 !important;
          transform: translateX(-100%) !important;
          transition: transform 0.3s ease !important;
        }

        .sidebar.mobile-open, #nexus-sidebar.mobile-open {
          transform: translateX(0) !important;
        }

        .main-content, #main-content {
          margin-left: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          padding: 60px 20px 20px 20px !important;
          overflow: auto !important;
          position: relative !important;
          z-index: 1 !important;
        }

        #mobile-menu-toggle {
          display: block !important;
          position: fixed !important;
          top: 15px !important;
          left: 15px !important;
          z-index: 1002 !important;
        }

        /* Overlay when mobile menu is open */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: none;
        }

        .mobile-menu-overlay.active {
          display: block;
        }
      }

      /* Fix common layout issues */
      .dashboard-container,
      .module-container,
      .map-container {
        max-width: 100% !important;
        overflow: visible !important;
      }

      /* Ensure proper spacing for grid layouts */
      .metrics-grid,
      .dashboard-header,
      .quick-actions-panel,
      .system-health-panel,
      .recent-activity-panel {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }

      /* Fix map container positioning */
      #qnis-map-container,
      .leaflet-container {
        position: relative !important;
        z-index: 1 !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Prevent content from going under sidebar */
      .content-wrapper {
        position: relative;
        z-index: 1;
      }
    `;

    document.head.appendChild(style);
  }

  fixContentOverflowIssues() {
    // Fix common overflow and clipping issues
    const problematicElements = document.querySelectorAll('*');
    
    problematicElements.forEach(element => {
      const styles = getComputedStyle(element);
      
      // Fix elements that might cause horizontal overflow
      if (styles.position === 'absolute' || styles.position === 'fixed') {
        const rect = element.getBoundingClientRect();
        
        // If element extends beyond viewport, adjust it
        if (rect.right > window.innerWidth) {
          element.style.maxWidth = 'calc(100% - 20px)';
        }
      }

      // Fix elements with problematic overflow settings
      if (styles.overflow === 'visible' && element.scrollWidth > element.clientWidth) {
        element.style.overflow = 'auto';
      }
    });

    // Ensure all modules are properly contained
    this.ensureModuleContainment();
  }

  ensureModuleContainment() {
    const modules = document.querySelectorAll('.dashboard-module, .module-container, [data-module]');
    
    modules.forEach(module => {
      module.style.maxWidth = '100%';
      module.style.overflow = 'visible';
      module.style.position = 'relative';
      module.style.zIndex = '1';
    });
  }

  addMobileToggleFunctionality() {
    // Remove existing toggle
    const existingToggle = document.getElementById('mobile-menu-toggle');
    if (existingToggle) existingToggle.remove();

    // Create mobile menu toggle
    const toggle = document.createElement('button');
    toggle.id = 'mobile-menu-toggle';
    toggle.innerHTML = '☰';
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    toggle.style.cssText = `
      position: fixed;
      top: 15px;
      left: 15px;
      z-index: 1002;
      background: #16a085;
      color: white;
      border: none;
      padding: 12px 15px;
      border-radius: 6px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: background-color 0.3s ease;
      display: none;
    `;

    // Add hover effect
    toggle.addEventListener('mouseenter', () => {
      toggle.style.backgroundColor = '#148f77';
    });

    toggle.addEventListener('mouseleave', () => {
      toggle.style.backgroundColor = '#16a085';
    });

    // Add click functionality
    toggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    document.body.appendChild(toggle);

    // Create overlay for mobile menu
    this.createMobileOverlay();
  }

  createMobileOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.className = 'mobile-menu-overlay';
    
    overlay.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    document.body.appendChild(overlay);
  }

  toggleMobileMenu() {
    const sidebar = this.findSidebar();
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar) {
      const isOpen = sidebar.classList.contains('mobile-open');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    }
  }

  openMobileMenu() {
    const sidebar = this.findSidebar();
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar) {
      sidebar.classList.add('mobile-open');
    }
    
    if (overlay) {
      overlay.classList.add('active');
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const sidebar = this.findSidebar();
    const overlay = document.getElementById('mobile-menu-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
    }
    
    if (overlay) {
      overlay.classList.remove('active');
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }

  performStartupValidation() {
    console.log('[LAYOUT-COMPREHENSIVE] Performing startup validation...');
    
    const issues = [];
    
    // Check sidebar visibility
    const sidebar = this.findSidebar();
    if (!sidebar) {
      issues.push('Sidebar not found');
    } else if (getComputedStyle(sidebar).display === 'none') {
      issues.push('Sidebar is hidden');
      sidebar.style.display = 'block';
    }

    // Check main content positioning
    const mainContent = this.findMainContent();
    if (!mainContent) {
      issues.push('Main content area not found');
    } else {
      const rect = mainContent.getBoundingClientRect();
      if (rect.left < this.sidebarWidth && window.innerWidth > this.breakpoint) {
        issues.push('Main content overlapped by sidebar');
        this.styleMainContent(mainContent);
      }
    }

    // Check for z-index conflicts
    const highZElements = document.querySelectorAll('*');
    let zIndexConflicts = 0;
    
    highZElements.forEach(element => {
      const zIndex = parseInt(getComputedStyle(element).zIndex);
      if (zIndex > 1000 && zIndex < 10000) {
        const rect = element.getBoundingClientRect();
        if (rect.left < this.sidebarWidth && !element.closest('.sidebar')) {
          zIndexConflicts++;
        }
      }
    });

    if (zIndexConflicts > 0) {
      issues.push(`${zIndexConflicts} z-index conflicts detected`);
      this.fixConflictingZIndex();
    }

    // Log validation results
    if (issues.length > 0) {
      console.log('[LAYOUT-COMPREHENSIVE] Issues found and fixed:', issues);
    } else {
      console.log('[LAYOUT-COMPREHENSIVE] Layout validation passed');
    }

    // Verify responsive behavior
    this.testResponsiveBehavior();
  }

  testResponsiveBehavior() {
    const originalWidth = window.innerWidth;
    
    // Test mobile breakpoint
    if (window.innerWidth <= this.breakpoint) {
      const sidebar = this.findSidebar();
      const mainContent = this.findMainContent();
      
      if (sidebar && mainContent) {
        const sidebarRect = sidebar.getBoundingClientRect();
        const mainContentRect = mainContent.getBoundingClientRect();
        
        // Sidebar should be off-screen or properly positioned
        if (sidebarRect.left > -this.sidebarWidth && !sidebar.classList.contains('mobile-open')) {
          console.log('[LAYOUT-COMPREHENSIVE] Mobile sidebar positioning corrected');
          sidebar.style.transform = 'translateX(-100%)';
        }
        
        // Main content should use full width
        if (mainContentRect.width < window.innerWidth * 0.9) {
          console.log('[LAYOUT-COMPREHENSIVE] Mobile main content width corrected');
          mainContent.style.width = '100%';
          mainContent.style.marginLeft = '0';
        }
      }
    }
  }

  setupLayoutIntelligence() {
    // Monitor for layout changes and auto-correct
    const observer = new MutationObserver((mutations) => {
      let needsRecalculation = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          
          // Check if new elements might affect layout
          const hasLayoutAffectingChanges = addedNodes.some(node => {
            return node.nodeType === Node.ELEMENT_NODE && 
                   (node.matches('.sidebar, #nexus-sidebar, .main-content, #main-content') ||
                    node.querySelector('.sidebar, #nexus-sidebar, .main-content, #main-content'));
          });
          
          if (hasLayoutAffectingChanges) {
            needsRecalculation = true;
          }
        }
      });
      
      if (needsRecalculation) {
        setTimeout(() => this.performLayoutRecalculation(), 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Monitor window resize
    window.addEventListener('resize', () => {
      this.handleWindowResize();
    });

    // Monitor orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleWindowResize(), 500);
    });
  }

  performLayoutRecalculation() {
    console.log('[LAYOUT-COMPREHENSIVE] Performing layout recalculation...');
    
    const sidebar = this.findSidebar();
    const mainContent = this.findMainContent();
    
    if (sidebar && mainContent) {
      this.styleMainContent(mainContent);
      this.fixConflictingZIndex();
    }
  }

  handleWindowResize() {
    const isDesktop = window.innerWidth > this.breakpoint;
    const sidebar = this.findSidebar();
    const mainContent = this.findMainContent();
    
    if (sidebar && mainContent) {
      if (isDesktop) {
        // Desktop layout
        sidebar.style.transform = 'translateX(0)';
        sidebar.classList.remove('mobile-open');
        mainContent.style.marginLeft = `${this.sidebarWidth}px`;
        mainContent.style.width = `calc(100% - ${this.sidebarWidth}px)`;
        mainContent.style.paddingTop = '20px';
        
        // Close mobile overlay if open
        this.closeMobileMenu();
      } else {
        // Mobile layout
        if (!sidebar.classList.contains('mobile-open')) {
          sidebar.style.transform = 'translateX(-100%)';
        }
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
        mainContent.style.paddingTop = '60px';
      }
    }
  }

  // Public methods for manual control
  static forceLayoutRecalculation() {
    const instance = window.ComprehensiveLayoutFixer;
    if (instance) {
      instance.performLayoutRecalculation();
    }
  }

  static validateLayout() {
    const instance = window.ComprehensiveLayoutFixer;
    if (instance) {
      instance.performStartupValidation();
    }
  }

  static toggleMobileMenu() {
    const instance = window.ComprehensiveLayoutFixer;
    if (instance) {
      instance.toggleMobileMenu();
    }
  }
}

// Initialize the comprehensive layout fix
const comprehensiveLayoutFixer = new ComprehensiveLayoutFix();

// Expose globally for manual control
window.ComprehensiveLayoutFixer = comprehensiveLayoutFixer;

// Add keyboard shortcut for mobile menu (ESC to close)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    comprehensiveLayoutFixer.closeMobileMenu();
  }
});

console.log('[LAYOUT-COMPREHENSIVE] Comprehensive layout fix initialized and applied');