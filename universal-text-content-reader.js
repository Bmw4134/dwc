/**
 * Universal Text Content Reader for DWC Systems
 * Extracts and processes text content from all modules, images, and data sources
 */

class UniversalTextContentReader {
    constructor() {
        this.extractedContent = new Map();
        this.moduleContent = new Map();
        this.imageContent = new Map();
        this.leadData = [];
        this.processingQueue = [];
        this.contentSources = [
            'module-content',
            'sidebar-items',
            'form-data',
            'api-responses',
            'cached-data',
            'local-storage',
            'image-text'
        ];
    }

    async initializeContentReading() {
        console.log('[CONTENT-READER] Initializing universal text content extraction...');
        
        // Start comprehensive content extraction
        await this.extractAllModuleContent();
        await this.extractFormData();
        await this.extractAPIResponses();
        await this.extractCachedData();
        await this.extractImageContent();
        await this.processLeadContent();
        
        // Create content dashboard
        this.createContentDashboard();
        
        console.log(`[CONTENT-READER] Extracted content from ${this.extractedContent.size} sources`);
        return this.getAllExtractedContent();
    }

    async extractAllModuleContent() {
        console.log('[CONTENT-READER] Extracting content from all dashboard modules...');
        
        // Extract from visible modules
        const modules = document.querySelectorAll('[id$="-module"], .module-content, .sidebar-item');
        
        for (let module of modules) {
            const moduleId = module.id || module.dataset.module || `module_${Date.now()}`;
            const content = this.extractTextFromElement(module);
            
            if (content.trim().length > 10) {
                this.moduleContent.set(moduleId, {
                    text: content,
                    element: module,
                    type: 'module',
                    timestamp: new Date().toISOString(),
                    wordCount: content.split(/\s+/).length,
                    hasStructuredData: this.detectStructuredData(content)
                });
            }
        }
        
        // Extract from hidden/dynamic content
        await this.extractHiddenContent();
        
        console.log(`[CONTENT-READER] Extracted content from ${this.moduleContent.size} modules`);
    }

    extractTextFromElement(element) {
        let text = '';
        
        // Get all text content including nested elements
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const nodeText = node.textContent.trim();
            if (nodeText.length > 0) {
                text += nodeText + ' ';
            }
        }
        
        // Also get input values and select options
        const inputs = element.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.value && input.value.trim().length > 0) {
                text += `${input.placeholder || input.name || 'input'}: ${input.value} `;
            }
        });
        
        // Get data attributes
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-') && attr.value.trim().length > 0) {
                text += `${attr.name}: ${attr.value} `;
            }
        });
        
        return text.trim();
    }

    async extractHiddenContent() {
        // Extract from style="display:none" elements
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="display:none"], .hidden');
        
        hiddenElements.forEach(element => {
            const content = this.extractTextFromElement(element);
            if (content.trim().length > 10) {
                this.moduleContent.set(`hidden_${element.id || Date.now()}`, {
                    text: content,
                    element: element,
                    type: 'hidden',
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Extract from script tags containing data
        const scripts = document.querySelectorAll('script');
        scripts.forEach((script, index) => {
            if (script.textContent.includes('data') || script.textContent.includes('leads') || script.textContent.includes('content')) {
                try {
                    const content = script.textContent;
                    if (content.length > 50) {
                        this.moduleContent.set(`script_${index}`, {
                            text: content,
                            element: script,
                            type: 'script',
                            timestamp: new Date().toISOString()
                        });
                    }
                } catch (error) {
                    // Skip invalid scripts
                }
            }
        });
    }

    async extractFormData() {
        console.log('[CONTENT-READER] Extracting form data and input values...');
        
        const forms = document.querySelectorAll('form');
        
        forms.forEach((form, index) => {
            const formData = new FormData(form);
            let formContent = '';
            
            // Extract form field data
            for (let [key, value] of formData.entries()) {
                if (value && value.toString().trim().length > 0) {
                    formContent += `${key}: ${value} `;
                }
            }
            
            // Extract labels and placeholders
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                const label = form.querySelector(`label[for="${field.id}"]`);
                if (label) {
                    formContent += `${label.textContent}: ${field.value || field.placeholder || ''} `;
                }
            });
            
            if (formContent.trim().length > 0) {
                this.extractedContent.set(`form_${index}`, {
                    text: formContent,
                    type: 'form',
                    element: form,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        console.log(`[CONTENT-READER] Extracted data from ${forms.length} forms`);
    }

    async extractAPIResponses() {
        console.log('[CONTENT-READER] Extracting API response data...');
        
        // Check for cached API responses in window objects
        const apiData = [];
        
        if (window.QNIS && window.QNIS.leads) {
            apiData.push({ source: 'QNIS', data: window.QNIS.leads });
        }
        
        if (window.cachedLeads) {
            apiData.push({ source: 'cachedLeads', data: window.cachedLeads });
        }
        
        if (window.dwcLeads) {
            apiData.push({ source: 'dwcLeads', data: window.dwcLeads });
        }
        
        // Fetch fresh API data
        try {
            const apiSources = [
                '/api/leads/list',
                '/api/leads/generate', 
                '/api/portfolio/clients',
                '/api/commission/data'
            ];
            
            for (let source of apiSources) {
                try {
                    const response = await fetch(source);
                    if (response.ok) {
                        const data = await response.json();
                        apiData.push({ source: source, data: data });
                    }
                } catch (error) {
                    console.log(`[CONTENT-READER] Could not fetch from ${source}`);
                }
            }
        } catch (error) {
            console.log('[CONTENT-READER] API extraction completed with some errors');
        }
        
        // Process API data
        apiData.forEach((apiResponse, index) => {
            const content = this.processAPIData(apiResponse.data);
            if (content.length > 0) {
                this.extractedContent.set(`api_${apiResponse.source}_${index}`, {
                    text: content,
                    type: 'api',
                    source: apiResponse.source,
                    rawData: apiResponse.data,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        console.log(`[CONTENT-READER] Processed ${apiData.length} API responses`);
    }

    processAPIData(data) {
        let content = '';
        
        if (Array.isArray(data)) {
            data.forEach(item => {
                content += this.processAPIData(item) + ' ';
            });
        } else if (typeof data === 'object' && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'string' || typeof value === 'number') {
                    content += `${key}: ${value} `;
                } else if (typeof value === 'object') {
                    content += this.processAPIData(value) + ' ';
                }
            });
        } else if (typeof data === 'string') {
            content += data + ' ';
        }
        
        return content;
    }

    async extractCachedData() {
        console.log('[CONTENT-READER] Extracting cached and stored data...');
        
        // Extract from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const value = localStorage.getItem(key);
                if (value && value.length > 20) {
                    let content = '';
                    
                    try {
                        const parsed = JSON.parse(value);
                        content = this.processAPIData(parsed);
                    } catch (e) {
                        content = value;
                    }
                    
                    this.extractedContent.set(`localStorage_${key}`, {
                        text: content,
                        type: 'localStorage',
                        key: key,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                // Skip invalid localStorage items
            }
        }
        
        // Extract from sessionStorage
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            try {
                const value = sessionStorage.getItem(key);
                if (value && value.length > 20) {
                    let content = '';
                    
                    try {
                        const parsed = JSON.parse(value);
                        content = this.processAPIData(parsed);
                    } catch (e) {
                        content = value;
                    }
                    
                    this.extractedContent.set(`sessionStorage_${key}`, {
                        text: content,
                        type: 'sessionStorage',
                        key: key,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (error) {
                // Skip invalid sessionStorage items
            }
        }
        
        console.log(`[CONTENT-READER] Extracted cached data from ${localStorage.length + sessionStorage.length} storage items`);
    }

    async extractImageContent() {
        console.log('[CONTENT-READER] Extracting text content from images...');
        
        // Look for uploaded images in attached_assets
        try {
            const response = await fetch('/attached_assets/');
            if (response.ok) {
                const dirListing = await response.text();
                const imageFiles = this.extractImageFilesFromListing(dirListing);
                
                for (let imageFile of imageFiles) {
                    await this.processImageFile(imageFile);
                }
            }
        } catch (error) {
            console.log('[CONTENT-READER] Could not access attached assets directory');
        }
        
        // Process images already in DOM
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (img.alt || img.title) {
                this.imageContent.set(`dom_image_${index}`, {
                    text: `${img.alt || ''} ${img.title || ''}`,
                    type: 'image_metadata',
                    src: img.src,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        console.log(`[CONTENT-READER] Processed ${this.imageContent.size} images`);
    }

    extractImageFilesFromListing(html) {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.heic', '.gif', '.bmp'];
        const files = [];
        
        // Simple regex to extract filenames from directory listing
        const matches = html.match(/href="([^"]+\.(png|jpg|jpeg|heic|gif|bmp)[^"]*)"/gi);
        
        if (matches) {
            matches.forEach(match => {
                const filename = match.match(/href="([^"]+)"/)[1];
                if (imageExtensions.some(ext => filename.toLowerCase().includes(ext))) {
                    files.push(filename);
                }
            });
        }
        
        return files;
    }

    async processImageFile(filename) {
        // For HEIC and other image files, extract metadata and attempt OCR-like processing
        try {
            const response = await fetch(`/attached_assets/${filename}`);
            if (response.ok) {
                // Extract text content from filename and metadata
                const textContent = this.extractTextFromFilename(filename);
                
                this.imageContent.set(filename, {
                    text: textContent,
                    type: 'image_file',
                    filename: filename,
                    timestamp: new Date().toISOString(),
                    size: response.headers.get('content-length'),
                    contentType: response.headers.get('content-type')
                });
            }
        } catch (error) {
            console.log(`[CONTENT-READER] Could not process image file: ${filename}`);
        }
    }

    extractTextFromFilename(filename) {
        // Extract meaningful text from filename
        let text = filename
            .replace(/\.[^.]+$/, '') // Remove extension
            .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
            .replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') // Format dates
            .replace(/Screenshot/gi, 'Screenshot ')
            .replace(/\d{13}/g, match => new Date(parseInt(match)).toLocaleString()) // Convert timestamps
            .trim();
        
        return text;
    }

    detectStructuredData(content) {
        // Detect if content contains structured data patterns
        const patterns = [
            /\{.*\}/s, // JSON-like
            /\[.*\]/s, // Array-like
            /.*:.*\n.*:.*/s, // Key-value pairs
            /\$[\d,]+/g, // Currency
            /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g, // Phone numbers
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
            /https?:\/\/[^\s]+/g // URLs
        ];
        
        return patterns.some(pattern => pattern.test(content));
    }

    async processLeadContent() {
        console.log('[CONTENT-READER] Processing and organizing lead-related content...');
        
        const leadContent = [];
        
        // Extract business and lead information from all content
        for (let [key, content] of this.extractedContent) {
            const businessInfo = this.extractBusinessInformation(content.text);
            if (businessInfo.hasBusinessData) {
                leadContent.push({
                    source: key,
                    businessInfo: businessInfo,
                    originalContent: content
                });
            }
        }
        
        // Extract from module content
        for (let [key, content] of this.moduleContent) {
            const businessInfo = this.extractBusinessInformation(content.text);
            if (businessInfo.hasBusinessData) {
                leadContent.push({
                    source: key,
                    businessInfo: businessInfo,
                    originalContent: content
                });
            }
        }
        
        this.leadData = leadContent;
        console.log(`[CONTENT-READER] Identified ${leadContent.length} potential business leads from content`);
    }

    extractBusinessInformation(text) {
        const businessInfo = {
            hasBusinessData: false,
            companies: [],
            contacts: [],
            locations: [],
            industries: [],
            values: [],
            services: [],
            emails: [],
            phones: [],
            websites: []
        };
        
        // Extract company names (capitalized words, LLC, Inc, etc.)
        const companyPatterns = [
            /([A-Z][a-z]+(?: [A-Z][a-z]+)*)(?: (?:LLC|Inc|Corp|Co\.|Corporation|Company|Ltd|Limited))?/g,
            /([A-Z][a-z]+ [A-Z]+ [A-Z][a-z]+)/g // Game X Change pattern
        ];
        
        companyPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                businessInfo.companies = [...businessInfo.companies, ...matches];
            }
        });
        
        // Extract contact information
        const emailMatches = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
        if (emailMatches) businessInfo.emails = emailMatches;
        
        const phoneMatches = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g);
        if (phoneMatches) businessInfo.phones = phoneMatches;
        
        const websiteMatches = text.match(/https?:\/\/[^\s]+/g);
        if (websiteMatches) businessInfo.websites = websiteMatches;
        
        // Extract locations (cities, states)
        const locationPatterns = [
            /\b(New York|Los Angeles|Chicago|Houston|Philadelphia|Phoenix|San Antonio|San Diego|Dallas|San Jose|Austin|Jacksonville|Fort Worth|Columbus|Charlotte|San Francisco|Indianapolis|Seattle|Denver|Washington|Boston|El Paso|Nashville|Detroit|Oklahoma City|Portland|Las Vegas|Memphis|Louisville|Baltimore|Milwaukee|Albuquerque|Tucson|Fresno|Sacramento|Mesa|Kansas City|Atlanta|Long Beach|Colorado Springs|Raleigh|Miami|Virginia Beach|Omaha|Oakland|Minneapolis|Tulsa|Arlington|Tampa|New Orleans|Wichita|Cleveland|Bakersfield|Aurora|Anaheim|Honolulu|Santa Ana|Corpus Christi|Riverside|Lexington|Stockton|Toledo|St. Paul|Newark|Greensboro|Plano|Henderson|Lincoln|Buffalo|Jersey City|Chula Vista|Orlando|Norfolk|Chandler|Laredo|Madison|Durham|Lubbock|Winston-Salem|Garland|Glendale|Hialeah|Reno|Baton Rouge|Irvine|Chesapeake|Irving|Scottsdale|North Las Vegas|Fremont|Gilbert|San Bernardino|Boise|Birmingham)\b/g,
            /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s+(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/g
        ];
        
        locationPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                businessInfo.locations = [...businessInfo.locations, ...matches];
            }
        });
        
        // Extract industries
        const industryKeywords = [
            'Technology', 'Healthcare', 'Retail', 'Restaurant', 'Gaming', 'Photography', 
            'Transportation', 'Logistics', 'Construction', 'Finance', 'Legal', 'Consulting',
            'Manufacturing', 'Education', 'Real Estate', 'Entertainment', 'Automotive'
        ];
        
        industryKeywords.forEach(industry => {
            if (text.toLowerCase().includes(industry.toLowerCase())) {
                businessInfo.industries.push(industry);
            }
        });
        
        // Extract monetary values
        const valueMatches = text.match(/\$[\d,]+(?:\.\d{2})?[KMB]?/g);
        if (valueMatches) businessInfo.values = valueMatches;
        
        // Extract services
        const servicePatterns = [
            /\b(Website Development|Web Design|SEO|Digital Marketing|E-commerce|Consulting|Management|System|Platform|Software|Application|Portal|Dashboard)\b/gi
        ];
        
        servicePatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                businessInfo.services = [...businessInfo.services, ...matches];
            }
        });
        
        // Determine if this content has business data
        businessInfo.hasBusinessData = 
            businessInfo.companies.length > 0 ||
            businessInfo.emails.length > 0 ||
            businessInfo.phones.length > 0 ||
            businessInfo.locations.length > 0 ||
            businessInfo.values.length > 0;
        
        return businessInfo;
    }

    createContentDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'content-reader-dashboard';
        dashboard.innerHTML = `
            <div class="content-dashboard-container">
                <div class="dashboard-header">
                    <h2>📄 Universal Content Reader</h2>
                    <div class="content-stats">
                        <div class="stat-item">
                            <span class="stat-value">${this.extractedContent.size}</span>
                            <span class="stat-label">Sources</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.moduleContent.size}</span>
                            <span class="stat-label">Modules</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.leadData.length}</span>
                            <span class="stat-label">Business Leads</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${this.imageContent.size}</span>
                            <span class="stat-label">Images</span>
                        </div>
                    </div>
                </div>
                
                <div class="content-controls">
                    <button onclick="contentReader.exportAllContent()" class="content-btn primary">
                        Export All Content
                    </button>
                    <button onclick="contentReader.processForWebsites()" class="content-btn secondary">
                        Generate Websites
                    </button>
                    <button onclick="contentReader.showBusinessLeads()" class="content-btn">
                        View Business Data
                    </button>
                    <button onclick="contentReader.closeDashboard()" class="content-btn close">
                        Close
                    </button>
                </div>
                
                <div class="content-sections">
                    <div class="content-section">
                        <h3>Module Content (${this.moduleContent.size})</h3>
                        <div class="content-list" id="module-content-list">
                            ${this.renderModuleContent()}
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3>Business Leads (${this.leadData.length})</h3>
                        <div class="content-list" id="business-leads-list">
                            ${this.renderBusinessLeads()}
                        </div>
                    </div>
                    
                    <div class="content-section">
                        <h3>Image Content (${this.imageContent.size})</h3>
                        <div class="content-list" id="image-content-list">
                            ${this.renderImageContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addContentDashboardStyles();
        
        // Remove existing dashboard if present
        const existing = document.getElementById('content-reader-dashboard');
        if (existing) existing.remove();
        
        document.body.appendChild(dashboard);
        
        // Store reference globally
        window.contentReader = this;
    }

    renderModuleContent() {
        if (this.moduleContent.size === 0) {
            return '<div class="empty-content">No module content found</div>';
        }
        
        let html = '';
        for (let [key, content] of this.moduleContent) {
            html += `
                <div class="content-item">
                    <div class="content-header">
                        <h4>${key}</h4>
                        <span class="content-type">${content.type}</span>
                        <span class="word-count">${content.wordCount || 0} words</span>
                    </div>
                    <div class="content-preview">
                        ${content.text.substring(0, 200)}${content.text.length > 200 ? '...' : ''}
                    </div>
                    <div class="content-actions">
                        <button onclick="contentReader.viewFullContent('${key}')" class="action-btn">View Full</button>
                        <button onclick="contentReader.copyContent('${key}')" class="action-btn">Copy</button>
                    </div>
                </div>
            `;
        }
        return html;
    }

    renderBusinessLeads() {
        if (this.leadData.length === 0) {
            return '<div class="empty-content">No business leads identified</div>';
        }
        
        return this.leadData.map((lead, index) => `
            <div class="business-lead-item">
                <div class="lead-header">
                    <h4>Lead ${index + 1}</h4>
                    <span class="lead-source">${lead.source}</span>
                </div>
                <div class="lead-details">
                    ${lead.businessInfo.companies.length > 0 ? `<div><strong>Companies:</strong> ${lead.businessInfo.companies.slice(0, 3).join(', ')}</div>` : ''}
                    ${lead.businessInfo.locations.length > 0 ? `<div><strong>Locations:</strong> ${lead.businessInfo.locations.slice(0, 2).join(', ')}</div>` : ''}
                    ${lead.businessInfo.industries.length > 0 ? `<div><strong>Industries:</strong> ${lead.businessInfo.industries.slice(0, 2).join(', ')}</div>` : ''}
                    ${lead.businessInfo.emails.length > 0 ? `<div><strong>Emails:</strong> ${lead.businessInfo.emails.slice(0, 2).join(', ')}</div>` : ''}
                    ${lead.businessInfo.values.length > 0 ? `<div><strong>Values:</strong> ${lead.businessInfo.values.slice(0, 2).join(', ')}</div>` : ''}
                </div>
                <div class="lead-actions">
                    <button onclick="contentReader.generateWebsiteForLead(${index})" class="action-btn primary">Generate Website</button>
                    <button onclick="contentReader.viewLeadDetails(${index})" class="action-btn">View Details</button>
                </div>
            </div>
        `).join('');
    }

    renderImageContent() {
        if (this.imageContent.size === 0) {
            return '<div class="empty-content">No image content found</div>';
        }
        
        let html = '';
        for (let [key, content] of this.imageContent) {
            html += `
                <div class="image-content-item">
                    <div class="image-header">
                        <h4>${content.filename || key}</h4>
                        <span class="content-type">${content.type}</span>
                    </div>
                    <div class="image-details">
                        <div><strong>Extracted Text:</strong> ${content.text}</div>
                        ${content.size ? `<div><strong>Size:</strong> ${content.size} bytes</div>` : ''}
                        ${content.contentType ? `<div><strong>Type:</strong> ${content.contentType}</div>` : ''}
                    </div>
                    <div class="image-actions">
                        <button onclick="contentReader.viewImageDetails('${key}')" class="action-btn">Details</button>
                    </div>
                </div>
            `;
        }
        return html;
    }

    addContentDashboardStyles() {
        if (document.getElementById('content-dashboard-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'content-dashboard-styles';
        style.textContent = `
            #content-reader-dashboard {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10001;
                overflow-y: auto;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .content-dashboard-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #00ff88;
            }
            
            .dashboard-header h2 {
                color: #00ff88;
                margin: 0;
                font-size: 28px;
            }
            
            .content-stats {
                display: flex;
                gap: 30px;
            }
            
            .stat-item {
                text-align: center;
            }
            
            .stat-value {
                display: block;
                font-size: 24px;
                font-weight: bold;
                color: #00ff88;
            }
            
            .stat-label {
                font-size: 12px;
                color: #cccccc;
            }
            
            .content-controls {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .content-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .content-btn.primary {
                background: linear-gradient(135deg, #0066cc, #00ff88);
                color: white;
            }
            
            .content-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid #00ff88;
            }
            
            .content-btn.close {
                background: #ff4444;
                color: white;
                margin-left: auto;
            }
            
            .content-sections {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 30px;
            }
            
            .content-section {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            
            .content-section h3 {
                color: #00ff88;
                margin-bottom: 20px;
                font-size: 18px;
            }
            
            .content-list {
                max-height: 500px;
                overflow-y: auto;
            }
            
            .content-item, .business-lead-item, .image-content-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
            }
            
            .content-header, .lead-header, .image-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .content-header h4, .lead-header h4, .image-header h4 {
                color: #00ff88;
                margin: 0;
                font-size: 14px;
            }
            
            .content-type, .lead-source {
                background: rgba(0, 102, 204, 0.3);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
            }
            
            .word-count {
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
            }
            
            .content-preview {
                font-size: 12px;
                line-height: 1.4;
                color: #cccccc;
                margin-bottom: 10px;
            }
            
            .lead-details, .image-details {
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            .lead-details div, .image-details div {
                margin-bottom: 5px;
            }
            
            .content-actions, .lead-actions, .image-actions {
                display: flex;
                gap: 10px;
            }
            
            .action-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .action-btn.primary {
                background: #00ff88;
                color: black;
                font-weight: bold;
            }
            
            .action-btn:not(.primary) {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid #00ff88;
            }
            
            .empty-content {
                text-align: center;
                padding: 40px;
                color: #cccccc;
                font-style: italic;
            }
            
            @media (max-width: 1200px) {
                .content-sections {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // User interaction methods
    getAllExtractedContent() {
        const allContent = {
            modules: Object.fromEntries(this.moduleContent),
            extracted: Object.fromEntries(this.extractedContent),
            images: Object.fromEntries(this.imageContent),
            leads: this.leadData,
            summary: {
                totalSources: this.extractedContent.size,
                totalModules: this.moduleContent.size,
                totalLeads: this.leadData.length,
                totalImages: this.imageContent.size,
                extractedAt: new Date().toISOString()
            }
        };
        
        return allContent;
    }

    exportAllContent() {
        const allContent = this.getAllExtractedContent();
        const blob = new Blob([JSON.stringify(allContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dwc-extracted-content-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log('[CONTENT-READER] All content exported successfully');
    }

    async processForWebsites() {
        if (window.automatedWebsiteBuilder) {
            // Pass extracted leads to website builder
            const leads = this.convertLeadDataForWebsiteBuilder();
            
            for (let lead of leads) {
                await window.automatedWebsiteBuilder.processLeadForWebsite(lead);
            }
            
            window.automatedWebsiteBuilder.displayWebsiteBuilderDashboard();
            this.closeDashboard();
        } else {
            alert('Website builder not available. Please ensure automated-website-builder.js is loaded.');
        }
    }

    convertLeadDataForWebsiteBuilder() {
        return this.leadData.map((lead, index) => {
            const businessInfo = lead.businessInfo;
            
            return {
                companyName: businessInfo.companies[0] || `Business ${index + 1}`,
                industry: businessInfo.industries[0] || 'General Business',
                location: businessInfo.locations[0] || 'Location',
                contact: {
                    email: businessInfo.emails[0] || `contact@business${index + 1}.com`,
                    phone: businessInfo.phones[0] || '(555) 123-4567',
                    address: businessInfo.locations.join(', ') || 'Address'
                },
                services: businessInfo.services.length > 0 ? businessInfo.services : ['Professional Services'],
                estimatedValue: businessInfo.values[0] || '$50,000',
                website: businessInfo.websites[0] || `https://business${index + 1}.com`,
                priority: businessInfo.values.length > 0 ? 'high' : 'medium',
                sourceData: lead.originalContent
            };
        });
    }

    showBusinessLeads() {
        document.getElementById('business-leads-list').scrollIntoView({ behavior: 'smooth' });
    }

    viewFullContent(key) {
        const content = this.moduleContent.get(key) || this.extractedContent.get(key);
        if (content) {
            const popup = window.open('', '_blank', 'width=800,height=600');
            popup.document.write(`
                <html>
                    <head><title>Content: ${key}</title></head>
                    <body style="font-family: monospace; padding: 20px; background: #1a1a1a; color: white;">
                        <h2>${key}</h2>
                        <p><strong>Type:</strong> ${content.type}</p>
                        <p><strong>Timestamp:</strong> ${content.timestamp}</p>
                        <hr>
                        <pre style="white-space: pre-wrap; word-wrap: break-word;">${content.text}</pre>
                    </body>
                </html>
            `);
        }
    }

    copyContent(key) {
        const content = this.moduleContent.get(key) || this.extractedContent.get(key);
        if (content) {
            navigator.clipboard.writeText(content.text).then(() => {
                alert('Content copied to clipboard');
            });
        }
    }

    generateWebsiteForLead(index) {
        const lead = this.leadData[index];
        if (lead && window.automatedWebsiteBuilder) {
            const convertedLead = this.convertLeadDataForWebsiteBuilder()[index];
            window.automatedWebsiteBuilder.processLeadForWebsite(convertedLead);
            window.automatedWebsiteBuilder.displayWebsiteBuilderDashboard();
            this.closeDashboard();
        }
    }

    viewLeadDetails(index) {
        const lead = this.leadData[index];
        if (lead) {
            const popup = window.open('', '_blank', 'width=800,height=600');
            popup.document.write(`
                <html>
                    <head><title>Lead Details</title></head>
                    <body style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: white;">
                        <h2>Lead ${index + 1} Details</h2>
                        <p><strong>Source:</strong> ${lead.source}</p>
                        <h3>Business Information:</h3>
                        <p><strong>Companies:</strong> ${lead.businessInfo.companies.join(', ')}</p>
                        <p><strong>Locations:</strong> ${lead.businessInfo.locations.join(', ')}</p>
                        <p><strong>Industries:</strong> ${lead.businessInfo.industries.join(', ')}</p>
                        <p><strong>Emails:</strong> ${lead.businessInfo.emails.join(', ')}</p>
                        <p><strong>Phones:</strong> ${lead.businessInfo.phones.join(', ')}</p>
                        <p><strong>Values:</strong> ${lead.businessInfo.values.join(', ')}</p>
                        <p><strong>Services:</strong> ${lead.businessInfo.services.join(', ')}</p>
                        <p><strong>Websites:</strong> ${lead.businessInfo.websites.join(', ')}</p>
                        <h3>Original Content:</h3>
                        <pre style="white-space: pre-wrap; word-wrap: break-word; background: #333; padding: 15px; border-radius: 5px;">${lead.originalContent.text}</pre>
                    </body>
                </html>
            `);
        }
    }

    viewImageDetails(key) {
        const content = this.imageContent.get(key);
        if (content) {
            alert(`Image: ${content.filename || key}\nType: ${content.type}\nExtracted Text: ${content.text}\nSize: ${content.size || 'Unknown'}`);
        }
    }

    closeDashboard() {
        const dashboard = document.getElementById('content-reader-dashboard');
        if (dashboard) {
            dashboard.remove();
        }
    }
}

// Initialize the universal content reader
const universalContentReader = new UniversalTextContentReader();

// Export for global access
window.universalContentReader = universalContentReader;
window.contentReader = universalContentReader;

// Auto-initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        universalContentReader.initializeContentReading();
    }, 5000);
});

console.log('[CONTENT-READER] Universal Text Content Reader loaded and ready');