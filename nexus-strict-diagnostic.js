/**
 * NEXUS STRICT DIAGNOSTIC MODE - Non-stacking Module Integrity Scanner
 * Phase Lock: Stabilization - Inspection Only, No Mutations
 */

class NEXUSStrictDiagnostic {
  constructor() {
    this.diagnosticMode = 'STRICT_INSPECTION';
    this.phaseLock = 'STABILIZATION';
    this.modulesFound = [];
    this.modulesBroken = [];
    this.hiddenModules = [];
    this.userPathConflicts = [];
    this.sidebarCollapseIssues = [];
    this.mapOverlayIntegrity = [];
    this.kpiBlockFailures = [];
    this.domAuditTrail = [];
    this.clickSimulations = [];
    this.routePathCorrelations = [];
    this.userStateContext = {};
  }

  async initializeStrictDiagnostic() {
    console.log('🧠 NEXUS DEEP DIAGNOSTIC MODE - PHASE LOCK: STABILIZATION');
    console.log('🔒 STRICT MODE: Inspection only, no mutations allowed');
    
    // Phase 1: Scan all sidebar modules
    await this.scanSidebarModules();
    
    // Phase 2: Simulate user clicks
    await this.simulateUserClickthrough();
    
    // Phase 3: DOM structure audit
    await this.auditDOMStructure();
    
    // Phase 4: Module registration check
    await this.checkModuleRegistration();
    
    // Phase 5: Route-path correlation
    await this.validateRoutePathCorrelation();
    
    // Phase 6: User state context analysis
    await this.analyzeUserStateContext();
    
    // Generate final diagnostic manifest
    return this.generateDiagnosticManifest();
  }

  async scanSidebarModules() {
    console.log('🧩 Step 1: Scanning sidebar modules...');
    
    const sidebar = document.querySelector('.sidebar') || 
                   document.querySelector('[class*="sidebar"]') ||
                   document.querySelector('nav') ||
                   document.querySelector('.navigation');
    
    if (!sidebar) {
      this.sidebarCollapseIssues.push({
        type: 'SIDEBAR_NOT_FOUND',
        severity: 'CRITICAL',
        message: 'Primary sidebar element not detected in DOM'
      });
      return;
    }

    // Find all clickable module elements
    const moduleSelectors = [
      '.sidebar-item',
      '.nav-item', 
      '.module-link',
      'button[data-module]',
      'a[href*="module"]',
      '[onclick*="module"]',
      '[onclick*="showModule"]',
      '.sidebar li',
      '.navigation li'
    ];

    for (const selector of moduleSelectors) {
      const elements = sidebar.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const moduleInfo = this.extractModuleInfo(element);
        if (moduleInfo) {
          this.modulesFound.push({
            ...moduleInfo,
            selector: selector,
            index: index,
            element: element
          });
        }
      });
    }

    console.log(`Found ${this.modulesFound.length} modules in sidebar`);
  }

  extractModuleInfo(element) {
    const moduleInfo = {
      id: null,
      name: null,
      visible: true,
      clickable: true,
      hasIcon: false,
      route: null,
      onclick: null
    };

    // Extract module ID
    moduleInfo.id = element.getAttribute('data-module') ||
                   element.getAttribute('id') ||
                   element.getAttribute('data-target') ||
                   element.className.match(/module-(\w+)/)?.[1] ||
                   `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Extract module name
    moduleInfo.name = element.textContent?.trim() ||
                     element.getAttribute('title') ||
                     element.getAttribute('aria-label') ||
                     'Unnamed Module';

    // Check visibility
    const computedStyle = window.getComputedStyle(element);
    moduleInfo.visible = computedStyle.display !== 'none' && 
                        computedStyle.visibility !== 'hidden' &&
                        computedStyle.opacity !== '0';

    // Check if clickable
    moduleInfo.clickable = element.tagName.toLowerCase() === 'button' ||
                          element.tagName.toLowerCase() === 'a' ||
                          element.hasAttribute('onclick') ||
                          element.style.cursor === 'pointer' ||
                          computedStyle.cursor === 'pointer';

    // Check for icon
    moduleInfo.hasIcon = element.querySelector('i, .icon, svg') !== null ||
                        element.classList.toString().includes('icon');

    // Extract route information
    if (element.tagName.toLowerCase() === 'a') {
      moduleInfo.route = element.getAttribute('href');
    }

    // Extract onclick handler
    moduleInfo.onclick = element.getAttribute('onclick') ||
                        element.onclick?.toString();

    return moduleInfo;
  }

  async simulateUserClickthrough() {
    console.log('🌐 Step 2: Simulating user click-through...');
    
    for (const module of this.modulesFound) {
      const clickResult = await this.simulateModuleClick(module);
      this.clickSimulations.push(clickResult);
      
      // Small delay between clicks to observe state changes
      await this.delay(100);
    }
  }

  async simulateModuleClick(module) {
    const simulation = {
      moduleId: module.id,
      moduleName: module.name,
      timestamp: new Date().toISOString(),
      preClickState: this.capturePageState(),
      clickExecuted: false,
      postClickState: null,
      errors: [],
      warnings: [],
      renderResult: 'UNKNOWN'
    };

    try {
      // Attempt to click the module
      if (module.element && module.clickable) {
        // Capture before state
        const beforeDOM = document.body.innerHTML.length;
        const beforeURL = window.location.href;
        
        // Execute click
        if (module.element.click) {
          module.element.click();
          simulation.clickExecuted = true;
        } else if (module.onclick) {
          // Execute onclick handler manually
          eval(module.onclick);
          simulation.clickExecuted = true;
        }
        
        // Wait for potential DOM changes
        await this.delay(200);
        
        // Capture after state
        const afterDOM = document.body.innerHTML.length;
        const afterURL = window.location.href;
        
        simulation.postClickState = this.capturePageState();
        
        // Analyze what happened
        if (afterURL !== beforeURL) {
          simulation.renderResult = 'URL_CHANGE';
        } else if (afterDOM !== beforeDOM) {
          simulation.renderResult = 'DOM_CHANGE';
        } else {
          simulation.renderResult = 'NO_CHANGE';
          simulation.warnings.push('Click did not produce visible changes');
        }
        
        // Check for specific module content
        const moduleContentVisible = this.checkModuleContentVisible(module.id);
        if (!moduleContentVisible) {
          simulation.warnings.push('Module content not visible after click');
          this.modulesBroken.push({
            moduleId: module.id,
            issue: 'CONTENT_NOT_RENDERED',
            severity: 'HIGH'
          });
        }
        
      } else {
        simulation.errors.push('Module element not clickable');
        this.modulesBroken.push({
          moduleId: module.id,
          issue: 'NOT_CLICKABLE',
          severity: 'MEDIUM'
        });
      }
      
    } catch (error) {
      simulation.errors.push(`Click simulation error: ${error.message}`);
      simulation.renderResult = 'ERROR';
      this.modulesBroken.push({
        moduleId: module.id,
        issue: 'CLICK_ERROR',
        error: error.message,
        severity: 'HIGH'
      });
    }

    return simulation;
  }

  capturePageState() {
    return {
      url: window.location.href,
      title: document.title,
      activeElements: document.querySelectorAll('.active, [aria-selected="true"]').length,
      visibleModules: document.querySelectorAll('[style*="block"], [style*="flex"]:not([style*="none"])').length,
      errorElements: document.querySelectorAll('.error, .warning, [class*="error"]').length,
      loadingElements: document.querySelectorAll('.loading, .spinner, [class*="loading"]').length,
      modalElements: document.querySelectorAll('.modal, .popup, .overlay').length
    };
  }

  checkModuleContentVisible(moduleId) {
    const possibleSelectors = [
      `#${moduleId}`,
      `[data-module="${moduleId}"]`,
      `.${moduleId}`,
      `#${moduleId}-module`,
      `#${moduleId}-content`,
      `.module-${moduleId}`,
      `[class*="${moduleId}"]`
    ];

    for (const selector of possibleSelectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          const style = window.getComputedStyle(element);
          if (style.display !== 'none' && style.visibility !== 'hidden') {
            return true;
          }
        }
      } catch (error) {
        // Invalid selector, continue
      }
    }

    return false;
  }

  async auditDOMStructure() {
    console.log('🧱 Step 3: Auditing DOM structure...');
    
    const domAudit = {
      timestamp: new Date().toISOString(),
      totalElements: document.querySelectorAll('*').length,
      duplicateIds: this.findDuplicateIds(),
      orphanedElements: this.findOrphanedElements(),
      missingStructure: this.checkMissingStructure(),
      accessibilityIssues: this.checkAccessibility(),
      performanceIssues: this.checkDOMPerformance()
    };

    this.domAuditTrail.push(domAudit);

    // Check for broken module containers
    const moduleContainers = document.querySelectorAll('[class*="module"], [id*="module"]');
    moduleContainers.forEach(container => {
      const hasContent = container.children.length > 0 || container.textContent.trim().length > 0;
      const isVisible = window.getComputedStyle(container).display !== 'none';
      
      if (!hasContent && isVisible) {
        this.modulesBroken.push({
          moduleId: container.id || container.className,
          issue: 'EMPTY_CONTAINER',
          severity: 'MEDIUM',
          element: container.tagName + (container.id ? '#' + container.id : '')
        });
      }
    });
  }

  findDuplicateIds() {
    const ids = {};
    const duplicates = [];
    
    document.querySelectorAll('[id]').forEach(element => {
      const id = element.id;
      if (ids[id]) {
        duplicates.push(id);
      } else {
        ids[id] = true;
      }
    });
    
    return duplicates;
  }

  findOrphanedElements() {
    const orphaned = [];
    
    // Check for elements that should have parents
    const elementsNeedingParents = document.querySelectorAll('li, option, td, th');
    elementsNeedingParents.forEach(element => {
      const expectedParents = {
        'li': ['ul', 'ol'],
        'option': ['select'],
        'td': ['tr'],
        'th': ['tr']
      };
      
      const tagName = element.tagName.toLowerCase();
      const expectedParentTags = expectedParents[tagName];
      
      if (expectedParentTags) {
        const hasValidParent = expectedParentTags.some(parentTag => 
          element.closest(parentTag)
        );
        
        if (!hasValidParent) {
          orphaned.push({
            element: tagName,
            id: element.id || 'no-id',
            expectedParents: expectedParentTags
          });
        }
      }
    });
    
    return orphaned;
  }

  checkMissingStructure() {
    const requiredStructure = [
      { selector: 'main, [role="main"]', name: 'Main content area' },
      { selector: 'nav, [role="navigation"]', name: 'Navigation' },
      { selector: 'header, [role="banner"]', name: 'Header' },
      { selector: '.sidebar, [role="complementary"]', name: 'Sidebar' }
    ];

    const missing = [];
    
    requiredStructure.forEach(({ selector, name }) => {
      if (!document.querySelector(selector)) {
        missing.push(name);
      }
    });
    
    return missing;
  }

  checkAccessibility() {
    const issues = [];
    
    // Check for missing alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    }
    
    // Check for buttons without accessible names
    const buttonsWithoutNames = document.querySelectorAll('button:not([aria-label]):not([title])');
    buttonsWithoutNames.forEach(button => {
      if (!button.textContent.trim()) {
        issues.push('Button without accessible name found');
      }
    });
    
    // Check for missing form labels
    const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputsWithoutLabels.forEach(input => {
      const id = input.id;
      if (!id || !document.querySelector(`label[for="${id}"]`)) {
        issues.push('Input without associated label found');
      }
    });
    
    return issues;
  }

  checkDOMPerformance() {
    const issues = [];
    
    // Check for excessive nesting
    const deeplyNested = document.querySelectorAll('div div div div div div div div div div');
    if (deeplyNested.length > 0) {
      issues.push(`${deeplyNested.length} deeply nested elements (10+ levels)`);
    }
    
    // Check for excessive elements
    const totalElements = document.querySelectorAll('*').length;
    if (totalElements > 5000) {
      issues.push(`Excessive DOM size: ${totalElements} elements`);
    }
    
    // Check for inline styles
    const inlineStyles = document.querySelectorAll('[style]').length;
    if (inlineStyles > 50) {
      issues.push(`${inlineStyles} elements with inline styles`);
    }
    
    return issues;
  }

  async checkModuleRegistration() {
    console.log('🧩 Step 4: Checking module registration...');
    
    // Check for module registration patterns
    const registrationPatterns = [
      'window.modules',
      'window.moduleRegistry', 
      'window.registeredModules',
      'moduleManager',
      'ModuleLoader'
    ];

    const registeredModules = [];
    
    registrationPatterns.forEach(pattern => {
      try {
        const moduleRegistry = eval(pattern);
        if (moduleRegistry && typeof moduleRegistry === 'object') {
          Object.keys(moduleRegistry).forEach(key => {
            registeredModules.push({
              source: pattern,
              id: key,
              module: moduleRegistry[key]
            });
          });
        }
      } catch (error) {
        // Pattern not found, continue
      }
    });

    // Compare registered vs visible modules
    const visibleModuleIds = this.modulesFound.map(m => m.id);
    const registeredModuleIds = registeredModules.map(m => m.id);
    
    // Find hidden modules (registered but not visible)
    registeredModuleIds.forEach(id => {
      if (!visibleModuleIds.includes(id)) {
        this.hiddenModules.push({
          moduleId: id,
          status: 'REGISTERED_NOT_VISIBLE',
          severity: 'MEDIUM'
        });
      }
    });
    
    // Find unregistered modules (visible but not registered)
    visibleModuleIds.forEach(id => {
      if (!registeredModuleIds.includes(id)) {
        this.hiddenModules.push({
          moduleId: id,
          status: 'VISIBLE_NOT_REGISTERED',
          severity: 'LOW'
        });
      }
    });
  }

  async validateRoutePathCorrelation() {
    console.log('🌐 Step 5: Validating route-path correlation...');
    
    // Check each module's routing behavior
    for (const module of this.modulesFound) {
      const routeCorrelation = {
        moduleId: module.id,
        moduleName: module.name,
        expectedRoute: this.getExpectedRoute(module),
        actualRoute: module.route,
        routingMethod: this.detectRoutingMethod(module),
        conflicts: []
      };

      // Check for conflicts
      if (routeCorrelation.expectedRoute && routeCorrelation.actualRoute) {
        if (routeCorrelation.expectedRoute !== routeCorrelation.actualRoute) {
          routeCorrelation.conflicts.push('ROUTE_MISMATCH');
          this.userPathConflicts.push({
            moduleId: module.id,
            conflict: 'ROUTE_MISMATCH',
            expected: routeCorrelation.expectedRoute,
            actual: routeCorrelation.actualRoute
          });
        }
      }

      // Check for duplicate routes
      const duplicateRoute = this.routePathCorrelations.find(r => 
        r.actualRoute === routeCorrelation.actualRoute && 
        routeCorrelation.actualRoute
      );
      
      if (duplicateRoute) {
        routeCorrelation.conflicts.push('DUPLICATE_ROUTE');
        this.userPathConflicts.push({
          moduleId: module.id,
          conflict: 'DUPLICATE_ROUTE',
          duplicateWith: duplicateRoute.moduleId,
          route: routeCorrelation.actualRoute
        });
      }

      this.routePathCorrelations.push(routeCorrelation);
    }
  }

  getExpectedRoute(module) {
    // Generate expected route based on module name/id
    const baseName = module.name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `/${baseName}`;
  }

  detectRoutingMethod(module) {
    if (module.route) {
      return 'HREF_BASED';
    } else if (module.onclick && module.onclick.includes('showModule')) {
      return 'FUNCTION_BASED';
    } else if (module.onclick && module.onclick.includes('location')) {
      return 'LOCATION_BASED';
    } else {
      return 'UNKNOWN';
    }
  }

  async analyzeUserStateContext() {
    console.log('🧠 Step 6: Analyzing user state context...');
    
    this.userStateContext = {
      authentication: this.checkAuthenticationState(),
      sessionData: this.checkSessionData(),
      localStorageData: this.checkLocalStorageData(),
      urlParameters: this.checkUrlParameters(),
      activeStates: this.checkActiveStates(),
      errorStates: this.checkErrorStates()
    };

    // Check for state conflicts
    this.checkStateConflicts();
  }

  checkAuthenticationState() {
    const authIndicators = {
      loggedIn: false,
      userInfo: null,
      authMethod: 'UNKNOWN'
    };

    // Check for authentication indicators
    const authElements = [
      document.querySelector('.user-info'),
      document.querySelector('.profile'),
      document.querySelector('[class*="auth"]'),
      document.querySelector('.login'),
      document.querySelector('.logout')
    ].filter(Boolean);

    if (authElements.length > 0) {
      authIndicators.loggedIn = !authElements.some(el => 
        el.textContent.toLowerCase().includes('login') ||
        el.textContent.toLowerCase().includes('sign in')
      );
    }

    // Check for user data in DOM
    const userNameElement = document.querySelector('[class*="username"], [class*="user-name"], .user .name');
    if (userNameElement) {
      authIndicators.userInfo = userNameElement.textContent.trim();
    }

    return authIndicators;
  }

  checkSessionData() {
    const sessionKeys = Object.keys(sessionStorage);
    return {
      hasSessionData: sessionKeys.length > 0,
      sessionKeys: sessionKeys,
      relevantSessions: sessionKeys.filter(key => 
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('session')
      )
    };
  }

  checkLocalStorageData() {
    const localKeys = Object.keys(localStorage);
    return {
      hasLocalData: localKeys.length > 0,
      localKeys: localKeys,
      relevantLocal: localKeys.filter(key => 
        key.toLowerCase().includes('user') ||
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('token')
      )
    };
  }

  checkUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
      hasParams: params.toString().length > 0,
      params: Object.fromEntries(params.entries())
    };
  }

  checkActiveStates() {
    return {
      activeElements: Array.from(document.querySelectorAll('.active')).map(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className
      })),
      selectedElements: Array.from(document.querySelectorAll('[aria-selected="true"]')).length,
      focusedElement: document.activeElement ? {
        tagName: document.activeElement.tagName,
        id: document.activeElement.id
      } : null
    };
  }

  checkErrorStates() {
    return {
      errorElements: Array.from(document.querySelectorAll('.error, [class*="error"]')).map(el => ({
        text: el.textContent.trim(),
        visible: window.getComputedStyle(el).display !== 'none'
      })),
      consoleErrors: this.getConsoleErrors()
    };
  }

  getConsoleErrors() {
    // This would require console monitoring setup
    return {
      note: 'Console error monitoring would require setup during page load',
      hasConsoleErrors: typeof window.console._errors !== 'undefined'
    };
  }

  checkStateConflicts() {
    // Check for authentication conflicts
    if (this.userStateContext.authentication.loggedIn) {
      const loginButtons = document.querySelectorAll('[class*="login"], [onclick*="login"]');
      if (loginButtons.length > 0) {
        this.userPathConflicts.push({
          type: 'AUTH_CONFLICT',
          issue: 'Login buttons visible while user appears authenticated',
          severity: 'MEDIUM'
        });
      }
    }

    // Check for module access conflicts
    this.modulesFound.forEach(module => {
      if (module.name.toLowerCase().includes('admin') && 
          !this.userStateContext.authentication.loggedIn) {
        this.userPathConflicts.push({
          type: 'ACCESS_CONFLICT',
          moduleId: module.id,
          issue: 'Admin module accessible without authentication',
          severity: 'HIGH'
        });
      }
    });
  }

  async checkMapOverlayIntegrity() {
    console.log('🗺️ Checking map overlay integrity...');
    
    const mapElements = document.querySelectorAll('[id*="map"], [class*="map"], .leaflet-container');
    
    mapElements.forEach((mapElement, index) => {
      const integrity = {
        mapId: mapElement.id || `map-${index}`,
        isVisible: window.getComputedStyle(mapElement).display !== 'none',
        hasOverlays: mapElement.querySelectorAll('[class*="overlay"], [class*="marker"]').length,
        hasControls: mapElement.querySelectorAll('[class*="control"], [class*="zoom"]').length,
        loadingState: mapElement.querySelector('[class*="loading"]') !== null,
        errorState: mapElement.querySelector('[class*="error"]') !== null,
        dataLoaded: this.checkMapDataLoaded(mapElement)
      };

      if (!integrity.isVisible) {
        integrity.issues = ['MAP_NOT_VISIBLE'];
      } else if (integrity.errorState) {
        integrity.issues = ['MAP_ERROR_STATE'];
      } else if (integrity.loadingState) {
        integrity.issues = ['MAP_STILL_LOADING'];
      } else if (!integrity.dataLoaded) {
        integrity.issues = ['MAP_NO_DATA'];
      }

      this.mapOverlayIntegrity.push(integrity);
    });
  }

  checkMapDataLoaded(mapElement) {
    // Check for common indicators that map has loaded data
    return mapElement.querySelectorAll('[class*="marker"], [class*="pin"], [class*="location"]').length > 0 ||
           mapElement.textContent.includes('lead') ||
           mapElement.textContent.includes('location');
  }

  async checkKPIBlocks() {
    console.log('📊 Checking KPI block failures...');
    
    const kpiSelectors = [
      '[class*="kpi"]',
      '[class*="metric"]',
      '[class*="stat"]',
      '[class*="card"]',
      '.revenue',
      '.pipeline',
      '.leads'
    ];

    kpiSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const kpiCheck = {
          selector: selector,
          index: index,
          id: element.id || `kpi-${selector}-${index}`,
          hasValue: this.elementHasValue(element),
          isVisible: window.getComputedStyle(element).display !== 'none',
          hasLoading: element.querySelector('[class*="loading"]') !== null,
          hasError: element.querySelector('[class*="error"]') !== null,
          value: this.extractKPIValue(element)
        };

        if (!kpiCheck.hasValue && kpiCheck.isVisible && !kpiCheck.hasLoading) {
          this.kpiBlockFailures.push({
            ...kpiCheck,
            failure: 'NO_VALUE_DISPLAYED',
            severity: 'HIGH'
          });
        } else if (kpiCheck.hasError) {
          this.kpiBlockFailures.push({
            ...kpiCheck,
            failure: 'ERROR_STATE',
            severity: 'HIGH'
          });
        }
      });
    });
  }

  elementHasValue(element) {
    const text = element.textContent.trim();
    return text.length > 0 && 
           !text.toLowerCase().includes('loading') &&
           !text.toLowerCase().includes('error') &&
           text !== '0' &&
           text !== '$0' &&
           text !== 'N/A';
  }

  extractKPIValue(element) {
    const text = element.textContent.trim();
    const numberMatch = text.match(/[\d,]+(\.\d+)?/);
    return numberMatch ? numberMatch[0] : text;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateDiagnosticManifest() {
    const manifest = {
      diagnosticMode: this.diagnosticMode,
      phaseLock: this.phaseLock,
      timestamp: new Date().toISOString(),
      
      modulesFound: this.modulesFound.map(m => ({
        id: m.id,
        name: m.name,
        visible: m.visible,
        clickable: m.clickable,
        hasIcon: m.hasIcon,
        route: m.route
      })),
      
      modulesBroken: this.modulesBroken,
      hiddenModules: this.hiddenModules,
      userPathConflicts: this.userPathConflicts,
      sidebarCollapseIssues: this.sidebarCollapseIssues,
      mapOverlayIntegrity: this.mapOverlayIntegrity,
      kpiBlockFailures: this.kpiBlockFailures,
      
      // Additional diagnostic data
      clickSimulations: this.clickSimulations.map(sim => ({
        moduleId: sim.moduleId,
        moduleName: sim.moduleName,
        clickExecuted: sim.clickExecuted,
        renderResult: sim.renderResult,
        errors: sim.errors,
        warnings: sim.warnings
      })),
      
      domAuditTrail: this.domAuditTrail,
      routePathCorrelations: this.routePathCorrelations,
      userStateContext: this.userStateContext,
      
      // Summary statistics
      summary: {
        totalModulesFound: this.modulesFound.length,
        totalModulesBroken: this.modulesBroken.length,
        totalHiddenModules: this.hiddenModules.length,
        totalConflicts: this.userPathConflicts.length,
        totalKPIFailures: this.kpiBlockFailures.length,
        systemHealthScore: this.calculateHealthScore()
      },
      
      // Suggested corrections
      suggestedCorrections: this.generateSuggestedCorrections()
    };

    console.log('📋 NEXUS Diagnostic Manifest Generated');
    console.log(`Modules Found: ${manifest.summary.totalModulesFound}`);
    console.log(`Modules Broken: ${manifest.summary.totalModulesBroken}`);
    console.log(`System Health: ${manifest.summary.systemHealthScore}%`);
    
    return manifest;
  }

  calculateHealthScore() {
    const totalIssues = this.modulesBroken.length + 
                       this.userPathConflicts.length + 
                       this.kpiBlockFailures.length + 
                       this.sidebarCollapseIssues.length;
    
    const totalModules = Math.max(this.modulesFound.length, 1);
    const issueRatio = totalIssues / totalModules;
    
    return Math.max(0, Math.min(100, Math.round(100 - (issueRatio * 50))));
  }

  generateSuggestedCorrections() {
    const corrections = [];
    
    // Module-specific corrections
    this.modulesBroken.forEach(broken => {
      switch (broken.issue) {
        case 'CONTENT_NOT_RENDERED':
          corrections.push({
            type: 'MODULE_FIX',
            moduleId: broken.moduleId,
            suggestion: 'Ensure module content container exists and is properly shown/hidden',
            priority: 'HIGH'
          });
          break;
        case 'NOT_CLICKABLE':
          corrections.push({
            type: 'MODULE_FIX',
            moduleId: broken.moduleId,
            suggestion: 'Add click event handler or proper href attribute',
            priority: 'MEDIUM'
          });
          break;
        case 'CLICK_ERROR':
          corrections.push({
            type: 'MODULE_FIX',
            moduleId: broken.moduleId,
            suggestion: `Fix JavaScript error: ${broken.error}`,
            priority: 'HIGH'
          });
          break;
      }
    });
    
    // KPI corrections
    this.kpiBlockFailures.forEach(failure => {
      corrections.push({
        type: 'KPI_FIX',
        kpiId: failure.id,
        suggestion: 'Ensure KPI data source is connected and displaying values',
        priority: failure.severity
      });
    });
    
    // Route corrections
    this.userPathConflicts.forEach(conflict => {
      if (conflict.conflict === 'ROUTE_MISMATCH') {
        corrections.push({
          type: 'ROUTING_FIX',
          moduleId: conflict.moduleId,
          suggestion: `Update route from "${conflict.actual}" to "${conflict.expected}"`,
          priority: 'MEDIUM'
        });
      }
    });
    
    return corrections;
  }
}

// Initialize and execute when DOM is ready
if (typeof window !== 'undefined') {
  window.NEXUSStrictDiagnostic = NEXUSStrictDiagnostic;
  
  const executeNEXUSDiagnostic = async () => {
    const diagnostic = new NEXUSStrictDiagnostic();
    
    // Run all diagnostic phases
    const manifest = await diagnostic.initializeStrictDiagnostic();
    
    // Check map integrity
    await diagnostic.checkMapOverlayIntegrity();
    
    // Check KPI blocks
    await diagnostic.checkKPIBlocks();
    
    // Generate final manifest
    const finalManifest = diagnostic.generateDiagnosticManifest();
    
    // Store result globally
    window.nexusModuleDiagnostic = finalManifest;
    
    console.log('🔬 NEXUS Diagnostic Complete - Results stored in window.nexusModuleDiagnostic');
    
    return finalManifest;
  };
  
  // Execute immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeNEXUSDiagnostic);
  } else {
    executeNEXUSDiagnostic();
  }
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NEXUSStrictDiagnostic;
}