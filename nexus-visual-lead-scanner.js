/**
 * NEXUS Visual Lead Scanner
 * Upload images to extract business leads using OCR and AI analysis
 */

class NEXUSVisualLeadScanner {
    constructor() {
        this.extractedLeads = [];
        this.isProcessing = false;
        this.moduleId = 'nexus-visual-scanner';
    }

    initializeVisualScanner() {
        console.log('[NEXUS-VISUAL] Initializing Visual Lead Scanner module');
        
        const existingModule = document.getElementById(this.moduleId);
        if (existingModule) {
            existingModule.remove();
        }

        this.createScannerInterface();
        this.bindEvents();
        
        console.log('[NEXUS-VISUAL] Visual Lead Scanner ready for image uploads');
    }

    createScannerInterface() {
        const scannerHTML = `
            <div id="${this.moduleId}" class="nexus-module" style="display: none;">
                <div class="module-header">
                    <div class="module-title">
                        <span class="module-icon">📸</span>
                        <h2>NEXUS Visual Lead Scanner</h2>
                        <span class="module-status scanning">READY</span>
                    </div>
                    <div class="module-controls">
                        <button class="btn-minimize" onclick="this.parentElement.parentElement.parentElement.style.display='none'">×</button>
                    </div>
                </div>

                <div class="scanner-workspace">
                    <div class="upload-zone" id="upload-zone">
                        <div class="upload-content">
                            <div class="upload-icon">📁</div>
                            <h3>Upload Business Images</h3>
                            <p>Drop images here or click to select</p>
                            <p class="upload-types">Supports: Truck signage, storefronts, business cards, flyers</p>
                            <input type="file" id="image-upload" accept="image/*" multiple style="display: none;">
                            <button class="upload-btn" onclick="document.getElementById('image-upload').click()">
                                Select Images
                            </button>
                        </div>
                    </div>

                    <div class="processing-status" id="processing-status" style="display: none;">
                        <div class="processing-animation">
                            <div class="scanning-beam"></div>
                        </div>
                        <h3>Scanning Image for Business Information</h3>
                        <p id="processing-message">Analyzing image content...</p>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                    </div>

                    <div class="extracted-leads" id="extracted-leads">
                        <h3>Extracted Business Leads</h3>
                        <div class="leads-grid" id="leads-grid">
                            <!-- Extracted leads will appear here -->
                        </div>
                    </div>

                    <div class="scanner-stats">
                        <div class="stat-card">
                            <div class="stat-number" id="total-scanned">0</div>
                            <div class="stat-label">Images Scanned</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="leads-extracted">0</div>
                            <div class="stat-label">Leads Extracted</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="success-rate">0%</div>
                            <div class="stat-label">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', scannerHTML);
        this.addScannerStyles();
    }

    addScannerStyles() {
        const styles = `
            <style id="nexus-visual-scanner-styles">
                .nexus-module {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    z-index: 10000;
                    overflow-y: auto;
                    color: #ffffff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                .module-header {
                    background: rgba(0, 0, 0, 0.8);
                    padding: 15px 20px;
                    border-bottom: 2px solid #00ff88;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    backdrop-filter: blur(10px);
                }

                .module-title {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .module-icon {
                    font-size: 24px;
                }

                .module-title h2 {
                    margin: 0;
                    font-size: 24px;
                    background: linear-gradient(45deg, #00ff88, #00d4ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .module-status {
                    padding: 5px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .module-status.scanning {
                    background: #00ff88;
                    color: #000;
                    animation: pulse 2s infinite;
                }

                .btn-minimize {
                    background: #ff4757;
                    color: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                }

                .scanner-workspace {
                    padding: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .upload-zone {
                    border: 3px dashed #00ff88;
                    border-radius: 15px;
                    padding: 60px 30px;
                    text-align: center;
                    margin-bottom: 30px;
                    background: rgba(0, 255, 136, 0.05);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .upload-zone:hover {
                    background: rgba(0, 255, 136, 0.1);
                    border-color: #00d4ff;
                }

                .upload-zone.dragover {
                    background: rgba(0, 255, 136, 0.2);
                    border-color: #00d4ff;
                    transform: scale(1.02);
                }

                .upload-icon {
                    font-size: 48px;
                    margin-bottom: 20px;
                }

                .upload-content h3 {
                    font-size: 28px;
                    margin: 0 0 10px 0;
                    color: #00ff88;
                }

                .upload-content p {
                    font-size: 16px;
                    color: #ccc;
                    margin: 5px 0;
                }

                .upload-types {
                    font-size: 14px;
                    color: #888;
                    font-style: italic;
                }

                .upload-btn {
                    background: linear-gradient(45deg, #00ff88, #00d4ff);
                    color: #000;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-top: 20px;
                    transition: transform 0.3s ease;
                }

                .upload-btn:hover {
                    transform: scale(1.05);
                }

                .processing-status {
                    text-align: center;
                    padding: 40px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 15px;
                    margin-bottom: 30px;
                }

                .processing-animation {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 20px;
                    position: relative;
                    border: 3px solid #333;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .scanning-beam {
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, #00ff88, transparent);
                    position: absolute;
                    animation: scan 2s linear infinite;
                }

                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 97px; }
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #333;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 20px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(45deg, #00ff88, #00d4ff);
                    width: 0%;
                    transition: width 0.3s ease;
                }

                .extracted-leads h3 {
                    color: #00ff88;
                    margin-bottom: 20px;
                    font-size: 24px;
                }

                .leads-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .lead-card {
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid #333;
                    border-radius: 10px;
                    padding: 20px;
                    transition: transform 0.3s ease;
                }

                .lead-card:hover {
                    transform: translateY(-5px);
                    border-color: #00ff88;
                }

                .lead-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .company-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #00ff88;
                }

                .qnis-score {
                    background: #00ff88;
                    color: #000;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .lead-details {
                    font-size: 14px;
                    line-height: 1.6;
                }

                .lead-details div {
                    margin-bottom: 8px;
                }

                .scanner-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 30px;
                }

                .stat-card {
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid #333;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                }

                .stat-number {
                    font-size: 32px;
                    font-weight: bold;
                    color: #00ff88;
                    margin-bottom: 5px;
                }

                .stat-label {
                    font-size: 14px;
                    color: #ccc;
                    text-transform: uppercase;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                @media (max-width: 768px) {
                    .scanner-workspace {
                        padding: 20px;
                    }
                    
                    .upload-zone {
                        padding: 40px 20px;
                    }
                    
                    .leads-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        if (!document.getElementById('nexus-visual-scanner-styles')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    bindEvents() {
        const uploadZone = document.getElementById('upload-zone');
        const fileInput = document.getElementById('image-upload');

        // Click to upload
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        // File selection
        fileInput.addEventListener('change', (e) => {
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

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                await this.processImage(file);
            }
        }
    }

    async processImage(file) {
        this.isProcessing = true;
        this.showProcessingStatus();

        try {
            // Convert image to base64
            const base64Data = await this.fileToBase64(file);
            
            this.updateProgress(25, 'Converting image format...');
            
            // Send to server for processing
            const response = await fetch('/api/process-image-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imageData: base64Data,
                    fileName: file.name
                })
            });

            this.updateProgress(75, 'Extracting business information...');

            const result = await response.json();
            
            this.updateProgress(100, 'Processing complete!');

            if (result.success) {
                this.addExtractedLead(result.lead);
                this.updateStats();
            } else {
                this.showError(result.error || 'Failed to extract business information');
            }

        } catch (error) {
            console.error('[NEXUS-VISUAL] Error processing image:', error);
            this.showError('Failed to process image');
        }

        this.hideProcessingStatus();
        this.isProcessing = false;
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

    showProcessingStatus() {
        document.getElementById('processing-status').style.display = 'block';
        document.getElementById('upload-zone').style.display = 'none';
    }

    hideProcessingStatus() {
        document.getElementById('processing-status').style.display = 'none';
        document.getElementById('upload-zone').style.display = 'block';
    }

    updateProgress(percentage, message) {
        document.getElementById('progress-fill').style.width = percentage + '%';
        document.getElementById('processing-message').textContent = message;
    }

    addExtractedLead(lead) {
        this.extractedLeads.push(lead);
        
        const leadsGrid = document.getElementById('leads-grid');
        const leadCard = this.createLeadCard(lead);
        leadsGrid.insertAdjacentHTML('afterbegin', leadCard);
    }

    createLeadCard(lead) {
        return `
            <div class="lead-card">
                <div class="lead-header">
                    <div class="company-name">${lead.companyName || 'Unknown Company'}</div>
                    <div class="qnis-score">${lead.qnisScore || lead.confidenceScore || 85}</div>
                </div>
                <div class="lead-details">
                    <div><strong>Industry:</strong> ${lead.industry || 'Not specified'}</div>
                    <div><strong>Location:</strong> ${lead.location?.city || 'Unknown'}</div>
                    <div><strong>Phone:</strong> ${lead.contact?.phone || lead.phone || 'Not available'}</div>
                    <div><strong>Email:</strong> ${lead.contact?.email || lead.email || 'Not available'}</div>
                    <div><strong>Services:</strong> ${lead.services || 'General business services'}</div>
                    <div><strong>Potential Value:</strong> $${lead.potentialValue?.toLocaleString() || '50,000'}</div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalScanned = this.extractedLeads.length;
        const leadsExtracted = this.extractedLeads.filter(lead => lead.companyName).length;
        const successRate = totalScanned > 0 ? Math.round((leadsExtracted / totalScanned) * 100) : 0;

        document.getElementById('total-scanned').textContent = totalScanned;
        document.getElementById('leads-extracted').textContent = leadsExtracted;
        document.getElementById('success-rate').textContent = successRate + '%';
    }

    showError(message) {
        const leadsGrid = document.getElementById('leads-grid');
        leadsGrid.insertAdjacentHTML('afterbegin', `
            <div class="lead-card" style="border-color: #ff4757;">
                <div class="lead-header">
                    <div class="company-name" style="color: #ff4757;">Processing Error</div>
                </div>
                <div class="lead-details">
                    <div>${message}</div>
                </div>
            </div>
        `);
    }

    showScanner() {
        document.getElementById(this.moduleId).style.display = 'block';
        console.log('[NEXUS-VISUAL] Visual Lead Scanner opened');
    }

    hideScanner() {
        document.getElementById(this.moduleId).style.display = 'none';
    }
}

// Initialize Visual Lead Scanner
const nexusVisualScanner = new NEXUSVisualLeadScanner();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        nexusVisualScanner.initializeVisualScanner();
    });
} else {
    nexusVisualScanner.initializeVisualScanner();
}

// Global access for sidebar navigation
window.showNEXUSVisualScanner = () => {
    nexusVisualScanner.showScanner();
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NEXUSVisualLeadScanner;
}