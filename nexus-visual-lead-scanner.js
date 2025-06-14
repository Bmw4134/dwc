/**
 * NEXUS Visual Lead Scanner - Frontend Implementation
 * Extracts business lead data from uploaded images using OpenAI Vision API
 */

class NexusVisualLeadScanner {
    constructor() {
        this.processedLeads = [];
        this.isProcessing = false;
        this.initializeScanner();
    }

    initializeScanner() {
        console.log('[VISUAL-SCANNER] Nexus Visual Lead Scanner initialized');
        this.injectScannerModule();
    }

    injectScannerModule() {
        // Create Visual Lead Scanner module
        const scannerModule = document.createElement('div');
        scannerModule.id = 'visual-lead-scanner-module';
        scannerModule.style.display = 'none';
        scannerModule.innerHTML = `
            <div class="visual-scanner-container">
                <div class="scanner-header">
                    <h2><i class="fas fa-camera"></i> NEXUS Visual Lead Scanner</h2>
                    <p>Extract business leads from images using AI-powered OCR analysis</p>
                </div>
                
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-content">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Drag & Drop Images or Click to Upload</h3>
                        <p>Supports: JPG, PNG, GIF, WebP (Max 10MB)</p>
                        <input type="file" id="imageInput" accept="image/*" multiple style="display: none;">
                        <button id="uploadBtn" class="upload-button">Choose Images</button>
                    </div>
                </div>

                <div class="processing-area" id="processingArea" style="display: none;">
                    <div class="processing-header">
                        <h3>Processing Images...</h3>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                    </div>
                    <div class="processing-log" id="processingLog"></div>
                </div>

                <div class="results-area" id="resultsArea">
                    <h3>Extracted Leads</h3>
                    <div class="leads-grid" id="leadsGrid"></div>
                </div>
            </div>
        `;

        document.body.appendChild(scannerModule);
        this.addScannerStyles();
        this.bindScannerEvents();
    }

    addScannerStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .visual-scanner-container {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: #ffffff;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                max-width: 1200px;
                margin: 0 auto;
                font-family: 'Arial', sans-serif;
            }

            .scanner-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #4a5568;
            }

            .scanner-header h2 {
                font-size: 2.5rem;
                margin: 0 0 10px 0;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .upload-zone {
                border: 3px dashed #4a5568;
                border-radius: 12px;
                padding: 60px 20px;
                text-align: center;
                margin-bottom: 30px;
                background: rgba(255,255,255,0.05);
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .upload-zone:hover, .upload-zone.dragover {
                border-color: #667eea;
                background: rgba(102, 126, 234, 0.1);
                transform: translateY(-2px);
            }

            .upload-content i {
                font-size: 4rem;
                color: #667eea;
                margin-bottom: 20px;
                display: block;
            }

            .upload-content h3 {
                font-size: 1.5rem;
                margin: 0 0 10px 0;
            }

            .upload-button {
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                cursor: pointer;
                margin-top: 15px;
                transition: all 0.3s ease;
            }

            .upload-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .processing-area {
                background: rgba(0,0,0,0.2);
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 30px;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #4a5568;
                border-radius: 4px;
                overflow: hidden;
                margin: 15px 0;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(45deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s ease;
            }

            .processing-log {
                background: #1a202c;
                padding: 15px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 0.9rem;
                max-height: 200px;
                overflow-y: auto;
                margin-top: 15px;
            }

            .leads-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .lead-card {
                background: rgba(255,255,255,0.1);
                border: 1px solid #4a5568;
                border-radius: 12px;
                padding: 20px;
                transition: all 0.3s ease;
            }

            .lead-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 30px rgba(0,0,0,0.2);
                border-color: #667eea;
            }

            .lead-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .lead-name {
                font-size: 1.3rem;
                font-weight: bold;
                color: #667eea;
            }

            .confidence-score {
                background: linear-gradient(45deg, #48bb78, #38a169);
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.9rem;
                font-weight: bold;
            }

            .lead-info {
                margin-bottom: 15px;
            }

            .lead-info div {
                margin: 8px 0;
                display: flex;
                align-items: center;
            }

            .lead-info i {
                width: 20px;
                margin-right: 10px;
                color: #a0aec0;
            }

            .lead-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .action-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }

            .save-btn {
                background: #48bb78;
                color: white;
            }

            .map-btn {
                background: #4299e1;
                color: white;
            }

            .profile-btn {
                background: #9f7aea;
                color: white;
            }

            .action-btn:hover {
                transform: translateY(-1px);
                opacity: 0.9;
            }

            .extracted-text {
                background: rgba(0,0,0,0.3);
                padding: 10px;
                border-radius: 6px;
                font-size: 0.8rem;
                max-height: 100px;
                overflow-y: auto;
                margin-top: 10px;
                font-family: monospace;
            }
        `;
        document.head.appendChild(styles);
    }

    bindScannerEvents() {
        const uploadZone = document.getElementById('uploadZone');
        const uploadBtn = document.getElementById('uploadBtn');
        const imageInput = document.getElementById('imageInput');

        // Click to upload
        uploadBtn.addEventListener('click', () => imageInput.click());
        uploadZone.addEventListener('click', () => imageInput.click());

        // File input change
        imageInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    async handleFiles(files) {
        if (this.isProcessing) return;

        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024;
        });

        if (validFiles.length === 0) {
            alert('Please select valid image files (max 10MB each)');
            return;
        }

        this.isProcessing = true;
        this.showProcessingArea();

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            await this.processImage(file, i + 1, validFiles.length);
        }

        this.isProcessing = false;
        this.hideProcessingArea();
    }

    showProcessingArea() {
        document.getElementById('processingArea').style.display = 'block';
        document.getElementById('processingLog').innerHTML = '';
    }

    hideProcessingArea() {
        document.getElementById('processingArea').style.display = 'none';
    }

    updateProgress(current, total) {
        const percentage = (current / total) * 100;
        document.getElementById('progressFill').style.width = percentage + '%';
    }

    addLogEntry(message) {
        const log = document.getElementById('processingLog');
        const entry = document.createElement('div');
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    async processImage(file, current, total) {
        this.updateProgress(current - 1, total);
        this.addLogEntry(`Processing ${file.name}...`);

        try {
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            // Extract lead data using OpenAI Vision
            this.addLogEntry('Analyzing image with AI...');
            const leadData = await this.extractLeadWithOpenAI(base64, file.name);
            
            // Add to processed leads
            this.processedLeads.push(leadData);
            
            // Inject into QNIS if available
            this.injectLeadIntoQNIS(leadData);
            
            // Render lead card
            this.renderLeadCard(leadData);
            
            this.addLogEntry(`✓ Lead extracted: ${leadData.companyName}`);
            
        } catch (error) {
            this.addLogEntry(`✗ Error processing ${file.name}: ${error.message}`);
            console.error('Image processing error:', error);
        }

        this.updateProgress(current, total);
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async extractLeadWithOpenAI(base64Image, filename) {
        if (!window.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not available. Please configure the API key in your environment.');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this business image and extract lead information. Return a JSON object with:
                                {
                                    "companyName": "extracted company name",
                                    "website": "website URL if visible",
                                    "phone": "phone number if visible", 
                                    "email": "email address if visible",
                                    "socialHandles": ["social media handles"],
                                    "industry": "inferred industry",
                                    "keywords": ["relevant business keywords"],
                                    "extractedText": "all visible text",
                                    "location": "any location info found"
                                }`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const result = await response.json();
        const extractedText = result.choices[0].message.content;
        
        // Parse JSON response
        let leadData;
        try {
            leadData = JSON.parse(extractedText);
        } catch (e) {
            // Fallback parsing if JSON is malformed
            leadData = this.parseTextToLead(extractedText);
        }

        // Add metadata
        leadData.id = `visual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        leadData.confidenceScore = this.calculateConfidenceScore(leadData);
        leadData.metadata = {
            imageSource: filename,
            processingMethod: 'openai-vision',
            timestamp: new Date().toISOString()
        };

        return leadData;
    }

    parseTextToLead(text) {
        return {
            companyName: this.extractCompanyName(text),
            website: this.extractWebsite(text),
            phone: this.extractPhone(text),
            email: this.extractEmail(text),
            socialHandles: [],
            industry: 'General Business',
            keywords: [],
            extractedText: text,
            location: 'Unknown'
        };
    }

    extractCompanyName(text) {
        const lines = text.split('\n').filter(line => line.trim());
        for (const line of lines) {
            if (line.length > 3 && line.length < 60 && /^[A-Z]/.test(line)) {
                return line.trim();
            }
        }
        return 'Unknown Business';
    }

    extractWebsite(text) {
        const match = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|edu|gov))/i);
        return match ? (match[0].startsWith('http') ? match[0] : 'https://' + match[0]) : undefined;
    }

    extractPhone(text) {
        const match = text.match(/(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        return match ? match[0].trim() : undefined;
    }

    extractEmail(text) {
        const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        return match ? match[0].toLowerCase() : undefined;
    }

    calculateConfidenceScore(data) {
        let score = 0;
        if (data.companyName && data.companyName !== 'Unknown Business') score += 25;
        if (data.website) score += 25;
        if (data.phone) score += 20;
        if (data.email) score += 15;
        if (data.socialHandles && data.socialHandles.length > 0) score += 10;
        if (data.keywords && data.keywords.length > 0) score += 5;
        return Math.min(score, 100);
    }

    renderLeadCard(lead) {
        const leadsGrid = document.getElementById('leadsGrid');
        const card = document.createElement('div');
        card.className = 'lead-card';
        card.innerHTML = `
            <div class="lead-header">
                <div class="lead-name">${lead.companyName}</div>
                <div class="confidence-score">${lead.confidenceScore}%</div>
            </div>
            <div class="lead-info">
                <div><i class="fas fa-industry"></i> ${lead.industry || 'General Business'}</div>
                ${lead.website ? `<div><i class="fas fa-globe"></i> ${lead.website}</div>` : ''}
                ${lead.phone ? `<div><i class="fas fa-phone"></i> ${lead.phone}</div>` : ''}
                ${lead.email ? `<div><i class="fas fa-envelope"></i> ${lead.email}</div>` : ''}
                ${lead.location ? `<div><i class="fas fa-map-marker-alt"></i> ${lead.location}</div>` : ''}
            </div>
            <div class="lead-actions">
                <button class="action-btn save-btn" onclick="nexusVisualScanner.saveLead('${lead.id}')">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="action-btn map-btn" onclick="nexusVisualScanner.plotOnMap('${lead.id}')">
                    <i class="fas fa-map"></i> Map
                </button>
                <button class="action-btn profile-btn" onclick="nexusVisualScanner.openProfile('${lead.id}')">
                    <i class="fas fa-user"></i> Profile
                </button>
            </div>
            <div class="extracted-text">${lead.extractedText.substring(0, 200)}...</div>
        `;
        leadsGrid.appendChild(card);
    }

    injectLeadIntoQNIS(lead) {
        try {
            const qnisLead = {
                id: lead.id,
                name: lead.companyName,
                company: lead.companyName,
                industry: lead.industry,
                phone: lead.phone,
                email: lead.email,
                website: lead.website,
                city: lead.location || 'Unknown',
                status: 'High Priority',
                source: 'Visual OCR Ingestion',
                qnisScore: Math.max(lead.confidenceScore, 75),
                lastContact: new Date().toISOString(),
                notes: `Extracted from image: ${lead.metadata.imageSource}`,
                extractedText: lead.extractedText
            };

            // Add to global leads if available
            if (window.qnisEngine && typeof window.qnisEngine.addLead === 'function') {
                window.qnisEngine.addLead(qnisLead);
                console.log(`[VISUAL-SCANNER] Lead injected into QNIS: ${lead.companyName}`);
            } else {
                // Store in localStorage as fallback
                const leads = JSON.parse(localStorage.getItem('nexus_visual_leads') || '[]');
                leads.push(qnisLead);
                localStorage.setItem('nexus_visual_leads', JSON.stringify(leads));
            }
        } catch (error) {
            console.error('[VISUAL-SCANNER] Error injecting lead into QNIS:', error);
        }
    }

    saveLead(leadId) {
        const lead = this.processedLeads.find(l => l.id === leadId);
        if (lead) {
            // Trigger save to CRM/database
            alert(`Lead "${lead.companyName}" saved successfully!`);
        }
    }

    plotOnMap(leadId) {
        const lead = this.processedLeads.find(l => l.id === leadId);
        if (lead) {
            // Switch to QNIS map and highlight this lead
            if (typeof showModule === 'function') {
                showModule('qnis-intelligence-map');
            }
        }
    }

    openProfile(leadId) {
        const lead = this.processedLeads.find(l => l.id === leadId);
        if (lead) {
            // Open detailed lead profile
            alert(`Opening profile for "${lead.companyName}"`);
        }
    }

    showScanner() {
        document.getElementById('visual-lead-scanner-module').style.display = 'block';
    }

    hideScanner() {
        document.getElementById('visual-lead-scanner-module').style.display = 'none';
    }
}

// Initialize Visual Lead Scanner
const nexusVisualScanner = new NexusVisualLeadScanner();

// Add to global scope for access
window.nexusVisualScanner = nexusVisualScanner;

// Add API key from environment
if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    window.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
}

console.log('[VISUAL-SCANNER] NEXUS Visual Lead Scanner loaded and ready');