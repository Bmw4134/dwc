/**
 * Website Reinvention Module
 * AI-powered website analysis and redesign preview system
 */

class WebsiteReinventionModule {
    constructor() {
        this.apiKey = this.getAvailableAPIKey();
        this.analysisResults = new Map();
        this.userInputs = [];
        this.moduleId = 'website-reinvention-module';
        this.isAnalyzing = false;
    }

    getAvailableAPIKey() {
        // Check for available API keys from environment variables first
        // These are loaded by the server and made available globally
        if (typeof OPENAI_API_KEY !== 'undefined' && OPENAI_API_KEY) {
            return { type: 'openai', key: OPENAI_API_KEY };
        }
        if (typeof PERPLEXITY_API_KEY !== 'undefined' && PERPLEXITY_API_KEY) {
            return { type: 'perplexity', key: PERPLEXITY_API_KEY };
        }
        
        // Check window API vault as backup
        if (window.apiKeyVault) {
            if (window.apiKeyVault.OPENAI_API_KEY) {
                return { type: 'openai', key: window.apiKeyVault.OPENAI_API_KEY };
            }
            if (window.apiKeyVault.PERPLEXITY_API_KEY) {
                return { type: 'perplexity', key: window.apiKeyVault.PERPLEXITY_API_KEY };
            }
        }
        
        return { type: 'demo', key: 'demo' }; // Demo mode for testing
    }

    injectIntoLandingPage() {
        console.log('[WEBSITE-REINVENTION] Injecting module into landing page...');
        
        // Find landing page container
        const landingPage = document.querySelector('.landing-page, .hero-section, .main-content');
        if (!landingPage) {
            console.log('[WEBSITE-REINVENTION] Landing page not found, creating standalone module');
            this.createStandaloneModule();
            return;
        }
        
        // Create the reinvention module
        const module = this.createReinventionModule();
        
        // Insert after hero section or at the beginning
        const heroSection = landingPage.querySelector('.hero, .hero-section, .header-content');
        if (heroSection && heroSection.nextSibling) {
            landingPage.insertBefore(module, heroSection.nextSibling);
        } else {
            landingPage.appendChild(module);
        }
        
        this.addModuleStyles();
        this.bindEventListeners();
        
        console.log('[WEBSITE-REINVENTION] Module successfully injected into landing page');
    }

    createStandaloneModule() {
        const module = this.createReinventionModule();
        module.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            width: 90vw;
            max-width: 1200px;
            height: 90vh;
            background: #0a0a0a;
            border: 2px solid #00ff88;
            border-radius: 15px;
            overflow-y: auto;
        `;
        
        document.body.appendChild(module);
    }

    createReinventionModule() {
        const module = document.createElement('section');
        module.id = this.moduleId;
        module.className = 'website-reinvention-module';
        
        module.innerHTML = `
            <div class="reinvention-container">
                <div class="module-header">
                    <h2 class="module-title">🚀 Let Us Reinvent Your Website</h2>
                    <p class="module-subtitle">
                        AI-powered website analysis and redesign in under 60 seconds
                    </p>
                </div>
                
                <div class="input-section">
                    <div class="url-input-container">
                        <input 
                            type="url" 
                            id="website-url-input" 
                            placeholder="Enter your company website URL (e.g., https://yourcompany.com)"
                            class="url-input"
                        >
                        <button 
                            id="analyze-website-btn" 
                            class="analyze-btn"
                            onclick="websiteReinvention.analyzeWebsite()"
                        >
                            Analyze & Redesign
                        </button>
                    </div>
                    
                    <div class="ai-status" id="ai-analysis-status">
                        <div class="status-indicator"></div>
                        <span class="status-text">Ready to analyze your website</span>
                    </div>
                </div>
                
                <div class="analysis-results" id="analysis-results" style="display: none;">
                    <div class="results-header">
                        <h3>AI Analysis & Redesign Preview</h3>
                        <div class="analysis-tabs">
                            <button class="tab-btn active" onclick="websiteReinvention.showTab('summary')">
                                Summary
                            </button>
                            <button class="tab-btn" onclick="websiteReinvention.showTab('comparison')">
                                Before/After
                            </button>
                            <button class="tab-btn" onclick="websiteReinvention.showTab('recommendations')">
                                Recommendations
                            </button>
                        </div>
                    </div>
                    
                    <div class="tab-content active" id="summary-tab">
                        <div class="summary-cards">
                            <div class="summary-card">
                                <h4>Current Website Analysis</h4>
                                <div id="current-analysis"></div>
                            </div>
                            <div class="summary-card">
                                <h4>Identified Issues</h4>
                                <div id="identified-issues"></div>
                            </div>
                            <div class="summary-card">
                                <h4>AI Redesign Score</h4>
                                <div id="redesign-score"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="comparison-tab">
                        <div class="comparison-container">
                            <div class="comparison-side">
                                <h4>Original Website</h4>
                                <div class="website-preview" id="original-preview">
                                    <iframe id="original-iframe" src="" frameborder="0"></iframe>
                                </div>
                            </div>
                            <div class="comparison-side">
                                <h4>AI-Generated Redesign</h4>
                                <div class="website-preview" id="redesign-preview">
                                    <div id="redesign-content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="recommendations-tab">
                        <div class="recommendations-list" id="recommendations-list">
                            <!-- Recommendations will be populated here -->
                        </div>
                    </div>
                </div>
                
                <div class="cta-section" id="cta-section" style="display: none;">
                    <div class="cta-buttons">
                        <button class="cta-btn primary" onclick="websiteReinvention.requestConsultation()">
                            Request Full Redesign Consultation
                        </button>
                        <button class="cta-btn secondary" onclick="websiteReinvention.downloadReport()">
                            Download AI Site Report
                        </button>
                        <button class="cta-btn accent" onclick="websiteReinvention.startSubscription()">
                            Start Subscription to Build Now
                        </button>
                    </div>
                    
                    <div class="pricing-preview">
                        <div class="price-item">
                            <span class="price-label">Full Redesign</span>
                            <span class="price-value">$2,499</span>
                        </div>
                        <div class="price-item">
                            <span class="price-label">Monthly Maintenance</span>
                            <span class="price-value">$299/mo</span>
                        </div>
                        <div class="price-item highlight">
                            <span class="price-label">Complete Package</span>
                            <span class="price-value">$4,999</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return module;
    }

    addModuleStyles() {
        if (document.getElementById('website-reinvention-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'website-reinvention-styles';
        styles.textContent = `
            .website-reinvention-module {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
                border: 1px solid rgba(0, 255, 136, 0.3);
                border-radius: 15px;
                padding: 40px;
                margin: 40px 0;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .reinvention-container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .module-header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .module-title {
                font-size: 32px;
                color: #00ff88;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .module-subtitle {
                font-size: 18px;
                color: #cccccc;
                margin: 0;
            }
            
            .input-section {
                margin-bottom: 40px;
            }
            
            .url-input-container {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                align-items: center;
            }
            
            .url-input {
                flex: 1;
                padding: 15px 20px;
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }
            
            .url-input:focus {
                outline: none;
                border-color: #00ff88;
            }
            
            .analyze-btn {
                padding: 15px 30px;
                background: linear-gradient(135deg, #0066cc, #00ff88);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .analyze-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
            }
            
            .analyze-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .ai-status {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px 20px;
                background: rgba(0, 255, 136, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            
            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #00ff88;
            }
            
            .status-indicator.analyzing {
                background: #ffc107;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .analysis-results {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 15px;
                padding: 30px;
                margin-bottom: 30px;
            }
            
            .results-header {
                margin-bottom: 30px;
            }
            
            .results-header h3 {
                color: #00ff88;
                margin-bottom: 20px;
                font-size: 24px;
            }
            
            .analysis-tabs {
                display: flex;
                gap: 10px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 15px;
            }
            
            .tab-btn {
                padding: 10px 20px;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #cccccc;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tab-btn.active {
                background: rgba(0, 255, 136, 0.2);
                border-color: #00ff88;
                color: #00ff88;
            }
            
            .tab-content {
                display: none;
                padding-top: 30px;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .summary-card {
                background: rgba(0, 255, 136, 0.05);
                border: 1px solid rgba(0, 255, 136, 0.2);
                border-radius: 10px;
                padding: 20px;
            }
            
            .summary-card h4 {
                color: #00ff88;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .comparison-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            
            .comparison-side h4 {
                color: #00ff88;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .website-preview {
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                height: 400px;
                overflow: hidden;
                background: #fff;
            }
            
            .website-preview iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .recommendations-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .recommendation-item {
                background: rgba(255, 255, 255, 0.05);
                border-left: 4px solid #00ff88;
                padding: 20px;
                border-radius: 8px;
            }
            
            .recommendation-item h5 {
                color: #00ff88;
                margin-bottom: 10px;
            }
            
            .cta-section {
                text-align: center;
                padding: 40px 0;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .cta-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }
            
            .cta-btn {
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 200px;
            }
            
            .cta-btn.primary {
                background: linear-gradient(135deg, #0066cc, #00ff88);
                color: white;
            }
            
            .cta-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #00ff88;
                border: 1px solid #00ff88;
            }
            
            .cta-btn.accent {
                background: linear-gradient(135deg, #ff6b6b, #feca57);
                color: white;
            }
            
            .cta-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .pricing-preview {
                display: flex;
                justify-content: center;
                gap: 30px;
                flex-wrap: wrap;
            }
            
            .price-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                min-width: 150px;
            }
            
            .price-item.highlight {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid #00ff88;
            }
            
            .price-label {
                color: #cccccc;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .price-value {
                color: #00ff88;
                font-size: 24px;
                font-weight: bold;
            }
            
            @media (max-width: 768px) {
                .website-reinvention-module {
                    padding: 20px;
                    margin: 20px 0;
                }
                
                .module-title {
                    font-size: 24px;
                }
                
                .url-input-container {
                    flex-direction: column;
                }
                
                .comparison-container {
                    grid-template-columns: 1fr;
                }
                
                .cta-buttons {
                    flex-direction: column;
                    align-items: center;
                }
                
                .pricing-preview {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindEventListeners() {
        // Enter key support for URL input
        const urlInput = document.getElementById('website-url-input');
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.analyzeWebsite();
                }
            });
        }
        
        // Store global reference
        window.websiteReinvention = this;
    }

    async analyzeWebsite() {
        const urlInput = document.getElementById('website-url-input');
        const analyzeBtn = document.getElementById('analyze-website-btn');
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (!urlInput || !urlInput.value.trim()) {
            this.showError('Please enter a valid website URL');
            return;
        }
        
        const url = this.normalizeURL(urlInput.value.trim());
        
        // Log user input
        this.logUserInput(url);
        
        // Update UI to analyzing state
        this.isAnalyzing = true;
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Analyzing...';
        statusIndicator.classList.add('analyzing');
        statusText.textContent = 'AI is analyzing your website...';
        
        try {
            // Check if API key is available
            if (!this.apiKey) {
                throw new Error('No AI API key available. Please configure OpenAI or Perplexity API key.');
            }
            
            // Analyze website
            const analysis = await this.performAIAnalysis(url);
            
            // Display results
            this.displayAnalysisResults(url, analysis);
            
            // Log to Nexus Console
            if (window.nexusOperatorConsole) {
                window.nexusOperatorConsole.log(`Website analysis completed for: ${url}`, 'system');
                window.nexusOperatorConsole.log(`Using ${this.apiKey.type.toUpperCase()} API for analysis`, 'system');
            }
            
        } catch (error) {
            console.error('[WEBSITE-REINVENTION] Analysis failed:', error);
            this.showError(error.message);
            
            if (window.nexusOperatorConsole) {
                window.nexusOperatorConsole.log(`Website analysis failed: ${error.message}`, 'error');
            }
        } finally {
            // Reset UI
            this.isAnalyzing = false;
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze & Redesign';
            statusIndicator.classList.remove('analyzing');
            statusText.textContent = 'Analysis complete';
        }
    }

    normalizeURL(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }

    logUserInput(url) {
        const inputLog = {
            url: url,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
        };
        
        this.userInputs.push(inputLog);
        
        // Store in localStorage for analytics
        const existingLogs = JSON.parse(localStorage.getItem('website-analysis-logs') || '[]');
        existingLogs.push(inputLog);
        localStorage.setItem('website-analysis-logs', JSON.stringify(existingLogs));
        
        console.log('[WEBSITE-REINVENTION] User input logged:', inputLog);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('website-analysis-session');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            sessionStorage.setItem('website-analysis-session', sessionId);
        }
        return sessionId;
    }

    async performAIAnalysis(url) {
        console.log(`[WEBSITE-REINVENTION] Starting AI analysis using ${this.apiKey.type} for ${url}`);
        
        // First, try to fetch website content
        const websiteContent = await this.fetchWebsiteContent(url);
        
        // Perform AI analysis based on available API
        if (this.apiKey.type === 'openai') {
            return await this.analyzeWithOpenAI(url, websiteContent);
        } else if (this.apiKey.type === 'perplexity') {
            return await this.analyzeWithPerplexity(url, websiteContent);
        } else if (this.apiKey.type === 'demo') {
            return this.createDemoAnalysis(url, websiteContent);
        } else {
            throw new Error('No valid AI API configured');
        }
    }

    async fetchWebsiteContent(url) {
        try {
            // Use server-side endpoint to fetch content
            const proxyUrl = `/api/fetch-website?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch website content');
            }
            
            const data = await response.json();
            if (data.success && data.content) {
                return this.extractKeyContent(data.content);
            } else {
                throw new Error(data.error || 'Invalid response format');
            }
        } catch (error) {
            console.log('[WEBSITE-REINVENTION] Could not fetch content, using URL analysis only');
            return { html: '', text: '', title: '', meta: {} };
        }
    }

    extractKeyContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        return {
            title: doc.title || '',
            text: doc.body?.textContent?.substring(0, 2000) || '',
            html: html.substring(0, 5000),
            meta: {
                description: doc.querySelector('meta[name="description"]')?.content || '',
                keywords: doc.querySelector('meta[name="keywords"]')?.content || ''
            }
        };
    }

    async analyzeWithOpenAI(url, content) {
        const prompt = `Analyze this website and provide a comprehensive redesign strategy:

Website URL: ${url}
Title: ${content.title}
Description: ${content.meta.description}
Content Sample: ${content.text}

Please provide a JSON response with the following structure:
{
  "current_analysis": {
    "purpose": "Main purpose of the website",
    "brand_tone": "Brand tone and personality",
    "structure": "Current structure assessment",
    "strengths": ["list of strengths"],
    "weaknesses": ["list of weaknesses"]
  },
  "issues": [
    {
      "category": "UX/Design/Content/Technical",
      "issue": "Specific issue description",
      "impact": "High/Medium/Low",
      "fix": "Recommended solution"
    }
  ],
  "redesign": {
    "layout": "Recommended new layout structure",
    "color_scheme": "Suggested color palette",
    "typography": "Typography recommendations",
    "cta_strategy": "Call-to-action strategy",
    "content_structure": "Content organization suggestions"
  },
  "score": {
    "current": 65,
    "potential": 92,
    "improvement_areas": ["list of key improvement areas"]
  },
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description",
      "priority": "High/Medium/Low",
      "effort": "Low/Medium/High"
    }
  ]
}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert web designer and UX consultant. Analyze websites and provide detailed redesign recommendations. Always respond with valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }

    async analyzeWithPerplexity(url, content) {
        const prompt = `Analyze this website and provide redesign recommendations:

Website: ${url}
Title: ${content.title}
Content: ${content.text}

Provide analysis in JSON format with current issues, redesign suggestions, and improvement score.`;

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-sonar-small-128k-online',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a web design expert. Analyze websites and provide redesign recommendations in JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.2
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse JSON from response or create structured response
        try {
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            // Fallback if response isn't JSON
            return this.createFallbackAnalysis(url, data.choices[0].message.content);
        }
    }

    createFallbackAnalysis(url, textResponse) {
        return {
            current_analysis: {
                purpose: "Website analysis completed",
                brand_tone: "Professional",
                structure: "Standard layout",
                strengths: ["Functional website"],
                weaknesses: ["Needs modern design"]
            },
            issues: [
                {
                    category: "Design",
                    issue: "Modern design update needed",
                    impact: "High",
                    fix: "Implement contemporary design patterns"
                }
            ],
            redesign: {
                layout: "Modern, responsive grid layout",
                color_scheme: "Professional color palette",
                typography: "Clean, readable fonts",
                cta_strategy: "Strategic call-to-action placement",
                content_structure: "Optimized content hierarchy"
            },
            score: {
                current: 70,
                potential: 90,
                improvement_areas: ["Design", "UX", "Content"]
            },
            recommendations: [
                {
                    title: "Modern Design Implementation",
                    description: textResponse.substring(0, 200),
                    priority: "High",
                    effort: "Medium"
                }
            ]
        };
    }

    createDemoAnalysis(url, content) {
        const domain = new URL(url).hostname;
        
        return {
            current_analysis: {
                purpose: `Business website for ${domain}`,
                brand_tone: "Professional and trustworthy",
                structure: "Traditional corporate layout",
                strengths: ["Established online presence", "Clear domain identity"],
                weaknesses: ["Outdated design patterns", "Limited mobile optimization", "Weak conversion elements"]
            },
            issues: [
                {
                    category: "Design",
                    issue: "Visual hierarchy needs improvement",
                    impact: "High",
                    fix: "Implement modern visual design principles"
                },
                {
                    category: "UX",
                    issue: "Navigation could be more intuitive",
                    impact: "Medium",
                    fix: "Redesign navigation structure"
                },
                {
                    category: "Conversion",
                    issue: "Weak call-to-action placement",
                    impact: "High",
                    fix: "Strategic CTA positioning and design"
                },
                {
                    category: "Technical",
                    issue: "Page load speed optimization needed",
                    impact: "Medium",
                    fix: "Optimize images and reduce code bloat"
                }
            ],
            redesign: {
                layout: "Modern responsive grid with hero section, clear navigation, and strategic content blocks",
                color_scheme: "Contemporary palette with brand-aligned primary colors and high contrast",
                typography: "Professional sans-serif font stack optimized for readability",
                cta_strategy: "Multiple conversion points with A/B tested button designs",
                content_structure: "Scannable hierarchy with clear value propositions"
            },
            score: {
                current: 67,
                potential: 94,
                improvement_areas: ["Visual Design", "User Experience", "Conversion Optimization", "Mobile Responsiveness"]
            },
            recommendations: [
                {
                    title: "Complete Visual Redesign",
                    description: "Modernize the entire visual identity with contemporary design trends, improved color schemes, and professional typography.",
                    priority: "High",
                    effort: "High"
                },
                {
                    title: "Mobile-First Responsive Design",
                    description: "Rebuild with mobile-first approach ensuring perfect display across all devices and screen sizes.",
                    priority: "High",
                    effort: "Medium"
                },
                {
                    title: "Conversion Rate Optimization",
                    description: "Strategic placement of call-to-action buttons, forms, and conversion elements to maximize lead generation.",
                    priority: "High",
                    effort: "Medium"
                },
                {
                    title: "Performance Optimization",
                    description: "Optimize loading speeds, implement caching, and reduce bandwidth usage for better user experience.",
                    priority: "Medium",
                    effort: "Low"
                },
                {
                    title: "Content Strategy Enhancement",
                    description: "Restructure content for better readability, SEO optimization, and user engagement.",
                    priority: "Medium",
                    effort: "Medium"
                }
            ]
        };
    }

    displayAnalysisResults(url, analysis) {
        // Store analysis results
        this.analysisResults.set(url, analysis);
        
        // Show results section
        const resultsSection = document.getElementById('analysis-results');
        const ctaSection = document.getElementById('cta-section');
        
        if (resultsSection) {
            resultsSection.style.display = 'block';
        }
        if (ctaSection) {
            ctaSection.style.display = 'block';
        }
        
        // Populate summary tab
        this.populateSummaryTab(analysis);
        
        // Populate comparison tab
        this.populateComparisonTab(url, analysis);
        
        // Populate recommendations tab
        this.populateRecommendationsTab(analysis);
        
        // Scroll to results
        resultsSection?.scrollIntoView({ behavior: 'smooth' });
    }

    populateSummaryTab(analysis) {
        const currentAnalysis = document.getElementById('current-analysis');
        const identifiedIssues = document.getElementById('identified-issues');
        const redesignScore = document.getElementById('redesign-score');
        
        if (currentAnalysis) {
            currentAnalysis.innerHTML = `
                <p><strong>Purpose:</strong> ${analysis.current_analysis?.purpose || 'Business website'}</p>
                <p><strong>Brand Tone:</strong> ${analysis.current_analysis?.brand_tone || 'Professional'}</p>
                <p><strong>Structure:</strong> ${analysis.current_analysis?.structure || 'Standard layout'}</p>
                <div class="strengths">
                    <strong>Strengths:</strong>
                    <ul>
                        ${(analysis.current_analysis?.strengths || []).map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (identifiedIssues) {
            identifiedIssues.innerHTML = (analysis.issues || []).map(issue => `
                <div class="issue-item" style="margin-bottom: 10px; padding: 10px; background: rgba(255, 68, 68, 0.1); border-radius: 5px;">
                    <strong>${issue.category}:</strong> ${issue.issue}
                    <br><small style="color: #ffc107;">Impact: ${issue.impact}</small>
                </div>
            `).join('');
        }
        
        if (redesignScore) {
            const current = analysis.score?.current || 70;
            const potential = analysis.score?.potential || 90;
            
            redesignScore.innerHTML = `
                <div class="score-display">
                    <div class="score-item">
                        <span class="score-label">Current Score</span>
                        <span class="score-value" style="color: #ffc107;">${current}/100</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Potential Score</span>
                        <span class="score-value" style="color: #00ff88;">${potential}/100</span>
                    </div>
                    <div class="score-improvement">
                        <strong>Improvement: +${potential - current} points</strong>
                    </div>
                </div>
            `;
        }
    }

    populateComparisonTab(url, analysis) {
        const originalIframe = document.getElementById('original-iframe');
        const redesignContent = document.getElementById('redesign-content');
        
        if (originalIframe) {
            originalIframe.src = url;
        }
        
        if (redesignContent) {
            redesignContent.innerHTML = `
                <div class="redesign-preview">
                    <div class="mockup-browser">
                        <div class="browser-header">
                            <div class="browser-buttons">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="browser-url">${url}</div>
                        </div>
                        <div class="browser-content">
                            <div class="redesign-layout">
                                <header style="background: ${analysis.redesign?.color_scheme || 'linear-gradient(135deg, #0066cc, #00ff88)'}; color: white; padding: 20px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 28px;">Redesigned Website</h1>
                                    <p style="margin: 10px 0 0 0;">Modern, responsive, and optimized for conversions</p>
                                </header>
                                <nav style="background: #f8f9fa; padding: 15px; text-align: center;">
                                    <span style="margin: 0 15px; color: #333;">Home</span>
                                    <span style="margin: 0 15px; color: #333;">About</span>
                                    <span style="margin: 0 15px; color: #333;">Services</span>
                                    <span style="margin: 0 15px; color: #333;">Contact</span>
                                </nav>
                                <main style="padding: 30px;">
                                    <section style="text-align: center; margin-bottom: 30px;">
                                        <h2 style="color: #333; margin-bottom: 15px;">Clean, Modern Design</h2>
                                        <p style="color: #666; line-height: 1.6;">${analysis.redesign?.content_structure || 'Optimized content structure with clear hierarchy and improved readability.'}</p>
                                        <button style="background: #0066cc; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Get Started Today</button>
                                    </section>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                                            <h3 style="color: #333; margin-bottom: 10px;">Feature 1</h3>
                                            <p style="color: #666;">Enhanced user experience</p>
                                        </div>
                                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                                            <h3 style="color: #333; margin-bottom: 10px;">Feature 2</h3>
                                            <p style="color: #666;">Mobile-first design</p>
                                        </div>
                                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                                            <h3 style="color: #333; margin-bottom: 10px;">Feature 3</h3>
                                            <p style="color: #666;">Conversion optimization</p>
                                        </div>
                                    </div>
                                </main>
                                <footer style="background: #333; color: white; padding: 20px; text-align: center; margin-top: 30px;">
                                    <p style="margin: 0;">&copy; 2024 Redesigned Website. Powered by AI.</p>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    .mockup-browser {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        overflow: hidden;
                        background: white;
                    }
                    .browser-header {
                        background: #f0f0f0;
                        padding: 10px 15px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    .browser-buttons {
                        display: flex;
                        gap: 5px;
                    }
                    .browser-buttons span {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #ff5f56;
                    }
                    .browser-buttons span:nth-child(2) {
                        background: #ffbd2e;
                    }
                    .browser-buttons span:nth-child(3) {
                        background: #27ca3f;
                    }
                    .browser-url {
                        background: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        color: #666;
                        flex: 1;
                    }
                    .browser-content {
                        height: 350px;
                        overflow-y: auto;
                    }
                </style>
            `;
        }
    }

    populateRecommendationsTab(analysis) {
        const recommendationsList = document.getElementById('recommendations-list');
        
        if (recommendationsList) {
            recommendationsList.innerHTML = (analysis.recommendations || []).map(rec => `
                <div class="recommendation-item">
                    <h5>${rec.title}</h5>
                    <p>${rec.description}</p>
                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                        <span style="background: ${rec.priority === 'High' ? '#ff4444' : rec.priority === 'Medium' ? '#ffc107' : '#00ff88'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${rec.priority} Priority
                        </span>
                        <span style="background: rgba(255, 255, 255, 0.1); padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${rec.effort} Effort
                        </span>
                    </div>
                </div>
            `).join('');
        }
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to selected button
        event.target.classList.add('active');
    }

    requestConsultation() {
        const currentUrl = document.getElementById('website-url-input')?.value;
        this.logCTAClick('consultation', currentUrl);
        
        // Open consultation form or redirect
        window.open('/api/consultation-request', '_blank');
        
        if (window.nexusOperatorConsole) {
            window.nexusOperatorConsole.log('Consultation requested for: ' + currentUrl, 'system');
        }
    }

    downloadReport() {
        const currentUrl = document.getElementById('website-url-input')?.value;
        const analysis = this.analysisResults.get(currentUrl);
        
        this.logCTAClick('download', currentUrl);
        
        if (analysis) {
            const report = this.generatePDFReport(currentUrl, analysis);
            this.downloadFile(report, `website-analysis-report-${Date.now()}.json`);
        }
        
        if (window.nexusOperatorConsole) {
            window.nexusOperatorConsole.log('Report downloaded for: ' + currentUrl, 'system');
        }
    }

    startSubscription() {
        const currentUrl = document.getElementById('website-url-input')?.value;
        this.logCTAClick('subscription', currentUrl);
        
        // Redirect to subscription page
        window.location.href = '/subscription?website=' + encodeURIComponent(currentUrl);
        
        if (window.nexusOperatorConsole) {
            window.nexusOperatorConsole.log('Subscription started for: ' + currentUrl, 'system');
        }
    }

    logCTAClick(action, url) {
        const ctaLog = {
            action: action,
            url: url,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };
        
        // Store in analytics
        const existingCTALogs = JSON.parse(localStorage.getItem('website-cta-logs') || '[]');
        existingCTALogs.push(ctaLog);
        localStorage.setItem('website-cta-logs', JSON.stringify(existingCTALogs));
        
        console.log('[WEBSITE-REINVENTION] CTA clicked:', ctaLog);
    }

    generatePDFReport(url, analysis) {
        return {
            url: url,
            analysis: analysis,
            generated: new Date().toISOString(),
            report_type: 'ai_website_analysis'
        };
    }

    downloadFile(content, filename) {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    showError(message) {
        const statusText = document.querySelector('.status-text');
        const statusIndicator = document.querySelector('.status-indicator');
        
        if (statusText) {
            statusText.textContent = message;
            statusText.style.color = '#ff4444';
        }
        
        if (statusIndicator) {
            statusIndicator.style.background = '#ff4444';
        }
        
        setTimeout(() => {
            if (statusText) {
                statusText.textContent = 'Ready to analyze your website';
                statusText.style.color = '';
            }
            if (statusIndicator) {
                statusIndicator.style.background = '#00ff88';
            }
        }, 5000);
    }
}

// Initialize and inject the module
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const websiteReinvention = new WebsiteReinventionModule();
        websiteReinvention.injectIntoLandingPage();
        
        // Store global reference
        window.websiteReinventionModule = websiteReinvention;
        
        console.log('[WEBSITE-REINVENTION] Module initialized and injected');
    }, 2000);
});

console.log('[WEBSITE-REINVENTION] Website Reinvention Module loaded');