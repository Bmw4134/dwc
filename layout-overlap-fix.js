/**
 * Layout Overlap Fix - Resolves sidebar overlapping main content
 */

class LayoutOverlapFixer {
  constructor() {
    this.sidebarWidth = 250;
    this.initializeLayoutFix();
  }

  initializeLayoutFix() {
    console.log('[LAYOUT-FIX] Fixing sidebar overlap issue...');
    
    // Apply fix immediately
    this.fixLayoutOverlap();
    
    // Monitor for dynamic changes
    this.setupLayoutMonitoring();
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  fixLayoutOverlap() {
    // Fix sidebar positioning
    this.fixSidebarPosition();
    
    // Fix main content area
    this.fixMainContentArea();
    
    // Ensure responsive behavior
    this.applyResponsiveLayout();
    
    console.log('[LAYOUT-FIX] Layout overlap resolved');
  }

  fixSidebarPosition() {
    const sidebar = document.getElementById('nexus-sidebar') || 
                   document.querySelector('.sidebar') ||
                   document.querySelector('[class*="sidebar"]');

    if (sidebar) {
      // Ensure sidebar has proper fixed positioning
      sidebar.style.position = 'fixed';
      sidebar.style.left = '0';
      sidebar.style.top = '0';
      sidebar.style.width = `${this.sidebarWidth}px`;
      sidebar.style.height = '100vh';
      sidebar.style.zIndex = '1000';
      sidebar.style.overflow = 'auto';
      sidebar.style.backgroundColor = sidebar.style.backgroundColor || '#1a1a2e';
      
      // Ensure sidebar is visible
      sidebar.style.display = 'block';
      sidebar.style.visibility = 'visible';
      sidebar.style.opacity = '1';
      
      console.log('[LAYOUT-FIX] Sidebar positioning fixed');
    }
  }

  fixMainContentArea() {
    let mainContent = document.getElementById('main-content') ||
                     document.querySelector('.main-content') ||
                     document.querySelector('[class*="content"]');

    if (!mainContent) {
      // Create main content area if it doesn't exist
      mainContent = this.createMainContentArea();
    }

    // Apply proper spacing to avoid sidebar overlap
    mainContent.style.marginLeft = `${this.sidebarWidth}px`;
    mainContent.style.padding = '20px';
    mainContent.style.minHeight = '100vh';
    mainContent.style.backgroundColor = '#ecf0f1';
    mainContent.style.width = `calc(100% - ${this.sidebarWidth}px)`;
    mainContent.style.boxSizing = 'border-box';
    mainContent.style.overflowX = 'auto';
    
    // Ensure content is properly contained
    mainContent.style.maxWidth = 'none';
    mainContent.style.position = 'relative';

    console.log('[LAYOUT-FIX] Main content area positioning fixed');
  }

  createMainContentArea() {
    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    
    // Insert after sidebar or at body start
    const sidebar = document.querySelector('#nexus-sidebar, .sidebar');
    if (sidebar && sidebar.parentNode) {
      sidebar.parentNode.insertBefore(mainContent, sidebar.nextSibling);
    } else {
      document.body.appendChild(mainContent);
    }
    
    return mainContent;
  }

  applyResponsiveLayout() {
    // Add responsive CSS
    const existingStyle = document.getElementById('layout-responsive-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'layout-responsive-styles';
    style.textContent = `
      /* Ensure proper layout on all screen sizes */
      @media (max-width: 768px) {
        #nexus-sidebar, .sidebar {
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        #nexus-sidebar.mobile-open, .sidebar.mobile-open {
          transform: translateX(0);
        }
        
        #main-content, .main-content {
          margin-left: 0 !important;
          width: 100% !important;
        }
      }
      
      @media (min-width: 769px) {
        #nexus-sidebar, .sidebar {
          transform: translateX(0);
        }
        
        #main-content, .main-content {
          margin-left: ${this.sidebarWidth}px !important;
          width: calc(100% - ${this.sidebarWidth}px) !important;
        }
      }
      
      /* Fix any potential overflow issues */
      body {
        overflow-x: hidden;
      }
      
      .dashboard-container {
        max-width: 100%;
        width: 100%;
      }
      
      /* Ensure all content respects the layout */
      .metrics-grid,
      .dashboard-header,
      .quick-actions-panel,
      .system-health-panel,
      .recent-activity-panel {
        max-width: 100%;
        box-sizing: border-box;
      }
    `;
    
    document.head.appendChild(style);
  }

  setupLayoutMonitoring() {
    // Monitor for DOM changes that might affect layout
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if sidebar or main content was modified
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);
          
          const hasLayoutChange = [...addedNodes, ...removedNodes].some(node => {
            return node.nodeType === Node.ELEMENT_NODE && 
                   (node.id === 'nexus-sidebar' || 
                    node.id === 'main-content' ||
                    node.classList?.contains('sidebar') ||
                    node.classList?.contains('main-content'));
          });
          
          if (hasLayoutChange) {
            needsUpdate = true;
          }
        }
      });
      
      if (needsUpdate) {
        setTimeout(() => this.fixLayoutOverlap(), 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  handleResize() {
    // Recalculate layout on window resize
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('.main-content');
    
    if (mainContent) {
      if (window.innerWidth <= 768) {
        // Mobile layout
        mainContent.style.marginLeft = '0';
        mainContent.style.width = '100%';
      } else {
        // Desktop layout
        mainContent.style.marginLeft = `${this.sidebarWidth}px`;
        mainContent.style.width = `calc(100% - ${this.sidebarWidth}px)`;
      }
    }
  }

  addMobileToggle() {
    // Add mobile menu toggle if it doesn't exist
    const existingToggle = document.getElementById('mobile-menu-toggle');
    if (existingToggle) return;

    const toggle = document.createElement('button');
    toggle.id = 'mobile-menu-toggle';
    toggle.innerHTML = '☰';
    toggle.style.cssText = `
      display: none;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: #16a085;
      color: white;
      border: none;
      padding: 12px 15px;
      border-radius: 6px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    // Show toggle on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateToggleVisibility = (e) => {
      toggle.style.display = e.matches ? 'block' : 'none';
    };
    
    mediaQuery.addListener(updateToggleVisibility);
    updateToggleVisibility(mediaQuery);
    
    // Add toggle functionality
    toggle.addEventListener('click', () => {
      const sidebar = document.getElementById('nexus-sidebar') || 
                     document.querySelector('.sidebar');
      
      if (sidebar) {
        sidebar.classList.toggle('mobile-open');
      }
    });
    
    document.body.appendChild(toggle);
  }

  // Public method to manually trigger layout fix
  static fixNow() {
    const fixer = new LayoutOverlapFixer();
    fixer.fixLayoutOverlap();
  }
}

// Initialize the layout fixer
const layoutFixer = new LayoutOverlapFixer();

// Add mobile toggle
layoutFixer.addMobileToggle();

// Expose globally for manual use
window.LayoutOverlapFixer = LayoutOverlapFixer;

console.log('[LAYOUT-FIX] Layout overlap fixer initialized and applied');