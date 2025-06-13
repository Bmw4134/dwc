/**
 * LLC Formation Engine
 * Comprehensive system for business entity formation and legal compliance
 */

class LLCFormationEngine {
    constructor() {
        this.states = {
            'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
            'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
            'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
            'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
            'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
            'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
            'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
            'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
            'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
            'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
        };
        
        this.filingFees = {
            'DE': 90, 'WY': 100, 'NV': 75, 'FL': 125, 'TX': 300,
            'CA': 70, 'NY': 200, 'IL': 150, 'OH': 99, 'PA': 125,
            'NC': 125, 'GA': 100, 'VA': 100, 'MI': 50, 'WA': 200
        };
        
        this.init();
    }

    init() {
        this.createLLCFormationInterface();
        this.loadSavedData();
        console.log('[LLC Formation] Engine initialized');
    }

    createLLCFormationInterface() {
        const formationModule = document.createElement('div');
        formationModule.id = 'llc-formation-module';
        formationModule.innerHTML = `
            <div class="llc-formation-container">
                <div class="formation-header">
                    <h2>LLC Formation Center</h2>
                    <p>Complete business entity formation in minutes</p>
                </div>
                
                <div class="formation-progress">
                    <div class="progress-steps">
                        <div class="step active" data-step="1">Business Info</div>
                        <div class="step" data-step="2">State Selection</div>
                        <div class="step" data-step="3">Legal Documents</div>
                        <div class="step" data-step="4">Filing</div>
                    </div>
                </div>
                
                <div class="formation-content">
                    <div class="step-content active" data-step="1">
                        <h3>Business Information</h3>
                        <div class="form-group">
                            <label>Business Name</label>
                            <input type="text" id="business-name" placeholder="DWC Systems LLC" value="DWC Systems LLC">
                            <small>Must include "LLC" or "Limited Liability Company"</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Business Purpose</label>
                            <textarea id="business-purpose" placeholder="Professional business intelligence and consulting services">Professional business intelligence and consulting services, lead generation, and technology solutions</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Principal Address</label>
                            <input type="text" id="principal-address" placeholder="Street Address">
                            <input type="text" id="principal-city" placeholder="City">
                            <select id="principal-state">
                                <option value="">Select State</option>
                                ${Object.entries(this.states).map(([code, name]) => 
                                    `<option value="${code}">${name}</option>`
                                ).join('')}
                            </select>
                            <input type="text" id="principal-zip" placeholder="ZIP Code">
                        </div>
                        
                        <button class="formation-btn next-step" onclick="llcEngine.nextStep()">Continue</button>
                    </div>
                    
                    <div class="step-content" data-step="2">
                        <h3>State of Formation</h3>
                        <div class="state-recommendations">
                            <div class="recommended-states">
                                <h4>Recommended States</h4>
                                <div class="state-option recommended" data-state="DE">
                                    <div class="state-info">
                                        <h5>Delaware</h5>
                                        <p>Business-friendly laws, privacy protection</p>
                                        <span class="filing-fee">$90 filing fee</span>
                                    </div>
                                </div>
                                <div class="state-option recommended" data-state="WY">
                                    <div class="state-info">
                                        <h5>Wyoming</h5>
                                        <p>No state income tax, strong privacy</p>
                                        <span class="filing-fee">$100 filing fee</span>
                                    </div>
                                </div>
                                <div class="state-option recommended" data-state="NV">
                                    <div class="state-info">
                                        <h5>Nevada</h5>
                                        <p>No corporate income tax, asset protection</p>
                                        <span class="filing-fee">$75 filing fee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Select Formation State</label>
                            <select id="formation-state">
                                <option value="">Choose State</option>
                                ${Object.entries(this.states).map(([code, name]) => 
                                    `<option value="${code}">${name} - $${this.filingFees[code] || '150'}</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="navigation-buttons">
                            <button class="formation-btn prev-step" onclick="llcEngine.prevStep()">Back</button>
                            <button class="formation-btn next-step" onclick="llcEngine.nextStep()">Continue</button>
                        </div>
                    </div>
                    
                    <div class="step-content" data-step="3">
                        <h3>Legal Documents</h3>
                        <div class="documents-list">
                            <div class="document-item">
                                <h4>Articles of Organization</h4>
                                <p>Primary formation document filed with the state</p>
                                <button class="generate-btn" onclick="llcEngine.generateArticles()">Generate Document</button>
                            </div>
                            
                            <div class="document-item">
                                <h4>Operating Agreement</h4>
                                <p>Internal governance document for your LLC</p>
                                <button class="generate-btn" onclick="llcEngine.generateOperatingAgreement()">Generate Document</button>
                            </div>
                            
                            <div class="document-item">
                                <h4>EIN Application (Form SS-4)</h4>
                                <p>Federal tax identification number application</p>
                                <button class="generate-btn" onclick="llcEngine.generateEINForm()">Generate Form</button>
                            </div>
                        </div>
                        
                        <div class="navigation-buttons">
                            <button class="formation-btn prev-step" onclick="llcEngine.prevStep()">Back</button>
                            <button class="formation-btn next-step" onclick="llcEngine.nextStep()">Continue</button>
                        </div>
                    </div>
                    
                    <div class="step-content" data-step="4">
                        <h3>Filing & Completion</h3>
                        <div class="filing-summary">
                            <h4>Formation Summary</h4>
                            <div class="summary-item">
                                <span>Business Name:</span>
                                <span id="summary-name">-</span>
                            </div>
                            <div class="summary-item">
                                <span>Formation State:</span>
                                <span id="summary-state">-</span>
                            </div>
                            <div class="summary-item">
                                <span>Filing Fee:</span>
                                <span id="summary-fee">-</span>
                            </div>
                        </div>
                        
                        <div class="filing-options">
                            <div class="filing-option">
                                <h4>Expedited Service</h4>
                                <p>Complete formation in 24-48 hours</p>
                                <button class="formation-btn expedited" onclick="llcEngine.startFiling('expedited')">File Now - $497</button>
                            </div>
                            
                            <div class="filing-option">
                                <h4>Standard Service</h4>
                                <p>Complete formation in 5-10 business days</p>
                                <button class="formation-btn standard" onclick="llcEngine.startFiling('standard')">File Now - $297</button>
                            </div>
                            
                            <div class="filing-option">
                                <h4>DIY Package</h4>
                                <p>Download documents and file yourself</p>
                                <button class="formation-btn diy" onclick="llcEngine.startFiling('diy')">Download - $97</button>
                            </div>
                        </div>
                        
                        <div class="navigation-buttons">
                            <button class="formation-btn prev-step" onclick="llcEngine.prevStep()">Back</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addFormationStyles();
        
        // Add to dashboard
        const dashboard = document.querySelector('.main-content') || document.body;
        dashboard.appendChild(formationModule);
        
        this.bindEvents();
    }

    addFormationStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .llc-formation-container {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 32px;
                margin: 20px;
                max-width: 800px;
            }
            
            .formation-header {
                text-align: center;
                margin-bottom: 32px;
            }
            
            .formation-header h2 {
                color: #3b82f6;
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .formation-progress {
                margin-bottom: 32px;
            }
            
            .progress-steps {
                display: flex;
                justify-content: space-between;
                margin-bottom: 24px;
            }
            
            .step {
                flex: 1;
                text-align: center;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                margin: 0 4px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #94a3b8;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .step.active {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                color: white;
                border-color: #3b82f6;
            }
            
            .step-content {
                display: none;
            }
            
            .step-content.active {
                display: block;
            }
            
            .form-group {
                margin-bottom: 24px;
            }
            
            .form-group label {
                display: block;
                color: #e2e8f0;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .form-group small {
                color: #94a3b8;
                font-size: 12px;
            }
            
            .formation-btn {
                background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-right: 12px;
            }
            
            .formation-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
            }
            
            .formation-btn.expedited {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .formation-btn.standard {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
            }
            
            .formation-btn.diy {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            }
            
            .state-recommendations {
                margin-bottom: 24px;
            }
            
            .state-option {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .state-option:hover {
                border-color: #3b82f6;
                background: rgba(59, 130, 246, 0.1);
            }
            
            .state-option.recommended {
                border-color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }
            
            .state-info h5 {
                color: #3b82f6;
                font-size: 1.1rem;
                margin-bottom: 8px;
            }
            
            .filing-fee {
                background: #10b981;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .documents-list {
                margin-bottom: 24px;
            }
            
            .document-item {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
            }
            
            .document-item h4 {
                color: #3b82f6;
                margin-bottom: 8px;
            }
            
            .generate-btn {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                color: white;
                font-size: 12px;
                cursor: pointer;
                margin-top: 12px;
            }
            
            .filing-summary {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 24px;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                color: #e2e8f0;
            }
            
            .filing-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .filing-option {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
            }
            
            .navigation-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 24px;
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        // State selection
        document.querySelectorAll('.state-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.state-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                document.getElementById('formation-state').value = option.dataset.state;
            });
        });
        
        // Form auto-save
        document.querySelectorAll('#llc-formation-module input, #llc-formation-module textarea, #llc-formation-module select').forEach(field => {
            field.addEventListener('change', () => this.saveData());
        });
    }

    nextStep() {
        const currentStep = document.querySelector('.step.active');
        const currentContent = document.querySelector('.step-content.active');
        const stepNumber = parseInt(currentStep.dataset.step);
        
        if (stepNumber < 4) {
            currentStep.classList.remove('active');
            currentContent.classList.remove('active');
            
            const nextStep = document.querySelector(`[data-step="${stepNumber + 1}"]`);
            const nextContent = document.querySelector(`.step-content[data-step="${stepNumber + 1}"]`);
            
            nextStep.classList.add('active');
            nextContent.classList.add('active');
            
            if (stepNumber === 3) {
                this.updateSummary();
            }
        }
    }

    prevStep() {
        const currentStep = document.querySelector('.step.active');
        const currentContent = document.querySelector('.step-content.active');
        const stepNumber = parseInt(currentStep.dataset.step);
        
        if (stepNumber > 1) {
            currentStep.classList.remove('active');
            currentContent.classList.remove('active');
            
            const prevStep = document.querySelector(`[data-step="${stepNumber - 1}"]`);
            const prevContent = document.querySelector(`.step-content[data-step="${stepNumber - 1}"]`);
            
            prevStep.classList.add('active');
            prevContent.classList.add('active');
        }
    }

    updateSummary() {
        const businessName = document.getElementById('business-name').value;
        const formationState = document.getElementById('formation-state').value;
        const stateText = document.getElementById('formation-state').selectedOptions[0]?.text;
        
        document.getElementById('summary-name').textContent = businessName || 'DWC Systems LLC';
        document.getElementById('summary-state').textContent = this.states[formationState] || 'Not selected';
        document.getElementById('summary-fee').textContent = this.filingFees[formationState] ? `$${this.filingFees[formationState]}` : '$150';
    }

    generateArticles() {
        const businessName = document.getElementById('business-name').value || 'DWC Systems LLC';
        const purpose = document.getElementById('business-purpose').value || 'Professional business intelligence and consulting services';
        const state = document.getElementById('formation-state').value;
        
        const articles = `
ARTICLES OF ORGANIZATION
${businessName}

ARTICLE I - NAME
The name of the Limited Liability Company is ${businessName}.

ARTICLE II - PURPOSE
The purpose of the Company is to engage in ${purpose} and any other lawful business purpose.

ARTICLE III - PRINCIPAL OFFICE
The principal office of the Company is located at [ADDRESS TO BE COMPLETED].

ARTICLE IV - REGISTERED AGENT
The registered agent of the Company is [REGISTERED AGENT TO BE DESIGNATED].

ARTICLE V - MANAGEMENT
The Company shall be managed by its members.

ARTICLE VI - DURATION
The Company shall have perpetual existence.

ARTICLE VII - ORGANIZER
The organizer of the Company is [ORGANIZER NAME TO BE COMPLETED].

Signed this _____ day of _________, 2025.

_________________________
Organizer
        `;
        
        this.downloadDocument('Articles-of-Organization.txt', articles);
    }

    generateOperatingAgreement() {
        const businessName = document.getElementById('business-name').value || 'DWC Systems LLC';
        
        const agreement = `
OPERATING AGREEMENT
${businessName}

This Operating Agreement is entered into this _____ day of _________, 2025, by and among the Members of ${businessName}, a Limited Liability Company.

ARTICLE 1 - ORGANIZATION
1.1 Formation: The Company was formed under the laws of [STATE].
1.2 Name: The name of the Company is ${businessName}.
1.3 Purpose: To conduct business intelligence and consulting services.

ARTICLE 2 - MEMBERSHIP
2.1 Initial Members: [TO BE COMPLETED]
2.2 Capital Contributions: [TO BE SPECIFIED]

ARTICLE 3 - MANAGEMENT
3.1 Management Structure: Member-managed
3.2 Voting Rights: Each member has voting rights proportional to their ownership percentage

ARTICLE 4 - DISTRIBUTIONS
4.1 Distributions shall be made at the discretion of the members
4.2 Tax allocations shall follow ownership percentages

ARTICLE 5 - DISSOLUTION
5.1 The Company may be dissolved by unanimous consent of all members

[Additional provisions to be customized based on specific needs]

Members:

_________________________     Date: ___________
[Member Name]

_________________________     Date: ___________
[Member Name]
        `;
        
        this.downloadDocument('Operating-Agreement.txt', agreement);
    }

    generateEINForm() {
        const businessName = document.getElementById('business-name').value || 'DWC Systems LLC';
        
        const einForm = `
Form SS-4 - Application for Employer Identification Number

1. Legal name of entity: ${businessName}
2. Trade name of business: [If different from legal name]
3. Executor, administrator, trustee, "care of" name: N/A
4a. Mailing address: [TO BE COMPLETED]
4b. City, state, ZIP code: [TO BE COMPLETED]
5a. Street address: [TO BE COMPLETED]
5b. City, state, ZIP code: [TO BE COMPLETED]
6. County and state where principal business is located: [TO BE COMPLETED]
7a. Name of principal officer: [TO BE COMPLETED]
7b. SSN, ITIN, or EIN: [TO BE COMPLETED]
8a. Is this application for a limited liability company (LLC)? Yes
8b. If 8a is "Yes," enter the number of LLC members: [TO BE COMPLETED]
9a. Type of entity: Limited Liability Company
9b. If a corporation, name the state or foreign country: N/A
10. Reason for applying: Started new business
11. Date business started or acquired: [TO BE COMPLETED]
12. Closing month of accounting year: December
13. Highest number of employees expected in the next 12 months: [TO BE COMPLETED]
14. Check one box that best describes the principal activity: Professional services
15. Indicate principal line of merchandise sold: N/A
16. Has the applicant entity shown on line 1 ever applied for and received an EIN? No

Complete this form and submit to the IRS at:
- Online: www.irs.gov/ein
- Fax: Based on your state
- Mail: Based on your state

Note: Processing time is typically 4-5 weeks for mail applications, immediate for online applications.
        `;
        
        this.downloadDocument('Form-SS4-EIN-Application.txt', einForm);
    }

    downloadDocument(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Show notification
        this.showNotification(`${filename} downloaded successfully!`);
    }

    startFiling(serviceType) {
        const businessName = document.getElementById('business-name').value || 'DWC Systems LLC';
        const state = document.getElementById('formation-state').value;
        
        const prices = {
            expedited: 497,
            standard: 297,
            diy: 97
        };
        
        const serviceNames = {
            expedited: 'Expedited Service (24-48 hours)',
            standard: 'Standard Service (5-10 days)',
            diy: 'DIY Package (Download only)'
        };
        
        this.showNotification(`Starting ${serviceNames[serviceType]} for ${businessName} - $${prices[serviceType]}`, 'success');
        
        // In a real implementation, this would redirect to payment processing
        setTimeout(() => {
            if (serviceType === 'diy') {
                this.generateAllDocuments();
            } else {
                this.showNotification('Payment processing would be initiated here. Contact support for assistance.', 'info');
            }
        }, 1000);
    }

    generateAllDocuments() {
        this.generateArticles();
        setTimeout(() => this.generateOperatingAgreement(), 500);
        setTimeout(() => this.generateEINForm(), 1000);
        this.showNotification('All LLC formation documents generated!', 'success');
    }

    saveData() {
        const formData = {
            businessName: document.getElementById('business-name')?.value,
            businessPurpose: document.getElementById('business-purpose')?.value,
            principalAddress: document.getElementById('principal-address')?.value,
            principalCity: document.getElementById('principal-city')?.value,
            principalState: document.getElementById('principal-state')?.value,
            principalZip: document.getElementById('principal-zip')?.value,
            formationState: document.getElementById('formation-state')?.value
        };
        
        localStorage.setItem('llc-formation-data', JSON.stringify(formData));
    }

    loadSavedData() {
        const saved = localStorage.getItem('llc-formation-data');
        if (saved) {
            const data = JSON.parse(saved);
            setTimeout(() => {
                Object.keys(data).forEach(key => {
                    const field = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                    if (field && data[key]) {
                        field.value = data[key];
                    }
                });
            }, 100);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize LLC Formation Engine
let llcEngine;
document.addEventListener('DOMContentLoaded', () => {
    llcEngine = new LLCFormationEngine();
});

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(animationStyles);

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLCFormationEngine;
}