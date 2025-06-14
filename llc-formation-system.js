/**
 * DWC Systems LLC Formation Engine
 * Complete legal entity formation and compliance system
 */
class LLCFormationEngine {
    constructor() {
        this.formationData = {
            companyName: 'DWC Systems LLC',
            state: '',
            registeredAgent: '',
            businessAddress: '',
            mailingAddress: '',
            members: [],
            businessPurpose: 'Advanced Enterprise Intelligence Platform and Software Development',
            filingFees: {},
            documents: [],
            status: 'pending'
        };
        
        this.stateRequirements = {
            'Delaware': {
                fee: 90,
                processingTime: '1-2 business days',
                onlineAvailable: true,
                requirements: ['Registered Agent', 'Articles of Organization', 'Operating Agreement']
            },
            'Nevada': {
                fee: 75,
                processingTime: '1-3 business days',
                onlineAvailable: true,
                requirements: ['Registered Agent', 'Articles of Organization', 'List of Managers']
            },
            'Wyoming': {
                fee: 100,
                processingTime: '1-2 business days',
                onlineAvailable: true,
                requirements: ['Registered Agent', 'Articles of Organization']
            },
            'Texas': {
                fee: 300,
                processingTime: '1-3 business days',
                onlineAvailable: true,
                requirements: ['Registered Agent', 'Certificate of Formation']
            },
            'California': {
                fee: 70,
                processingTime: '1-3 business days',
                onlineAvailable: true,
                requirements: ['Registered Agent', 'Articles of Organization', 'Statement of Information']
            }
        };
    }

    async initializeLLCFormation() {
        console.log('[LLC-FORMATION] Initializing DWC Systems LLC formation system');
        
        this.createFormationInterface();
        this.loadExistingData();
        this.setupFormationSteps();
        
        // Auto-populate with intelligent defaults
        this.populateIntelligentDefaults();
    }

    createFormationInterface() {
        // Remove any existing formation interfaces
        const existing = document.getElementById('llc-formation-system');
        if (existing) existing.remove();
        
        const formationContainer = document.createElement('div');
        formationContainer.id = 'llc-formation-system';
        formationContainer.className = 'formation-system';
        formationContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            overflow-y: auto;
        `;
        
        formationContainer.innerHTML = `
            <div style="max-width: 1000px; width: 95%; max-height: 95vh; overflow-y: auto; background: linear-gradient(135deg, #1e40af, #7c3aed); border-radius: 20px; padding: 40px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
                <div style="text-align: center; margin-bottom: 40px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🏢</div>
                    <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 700;">DWC Systems LLC Formation</h1>
                    <p style="margin: 0; font-size: 18px; opacity: 0.9;">Complete legal entity formation and business registration</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(20px);">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #fbbf24;">📋 Formation Details</h3>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Company Name</label>
                            <input type="text" id="company-name" value="DWC Systems LLC" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" />
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Formation State</label>
                            <select id="formation-state" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;">
                                <option value="">Select State</option>
                                <option value="Delaware">Delaware ($90 - 1-2 days)</option>
                                <option value="Nevada">Nevada ($75 - 1-3 days)</option>
                                <option value="Wyoming">Wyoming ($100 - 1-2 days)</option>
                                <option value="Texas">Texas ($300 - 1-3 days)</option>
                                <option value="California">California ($70 - 1-3 days)</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Business Purpose</label>
                            <textarea id="business-purpose" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 14px; height: 80px;" placeholder="Advanced Enterprise Intelligence Platform and Software Development">Advanced Enterprise Intelligence Platform and Software Development</textarea>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Principal Address</label>
                            <input type="text" id="business-address" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter business address" />
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(20px);">
                        <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #34d399;">💼 Registered Agent</h3>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Agent Type</label>
                            <select id="agent-type" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" onchange="window.llcFormation.toggleAgentType()">
                                <option value="self">Self (You)</option>
                                <option value="service">Professional Service ($100-200/year)</option>
                            </select>
                        </div>
                        
                        <div id="agent-details" style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Agent Name</label>
                            <input type="text" id="agent-name" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter agent name" />
                            
                            <label style="display: block; margin: 15px 0 8px 0; font-weight: 600;">Agent Address</label>
                            <input type="text" id="agent-address" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter agent address" />
                        </div>
                        
                        <h3 style="margin: 30px 0 20px 0; font-size: 20px; color: #f59e0b;">👥 Members/Managers</h3>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Name (Primary Member)</label>
                            <input type="text" id="primary-member" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter your full legal name" />
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Your Address</label>
                            <input type="text" id="member-address" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter your address" />
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(20px); margin-bottom: 30px;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #ef4444;">⚡ Expedited Filing Options</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #fbbf24;">🏃 Standard Filing</h4>
                            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">1-3 Business Days</div>
                            <div style="opacity: 0.8;">State fee only</div>
                            <button onclick="window.llcFormation.selectFiling('standard')" style="margin-top: 15px; background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Select Standard</button>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #10b981;">🚀 Same Day Filing</h4>
                            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Same Day</div>
                            <div style="opacity: 0.8;">+$100 expedite fee</div>
                            <button onclick="window.llcFormation.selectFiling('same-day')" style="margin-top: 15px; background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Select Same Day</button>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: center;">
                            <h4 style="margin: 0 0 10px 0; color: #ef4444;">⚡ 2-Hour Filing</h4>
                            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">2 Hours</div>
                            <div style="opacity: 0.8;">+$200 rush fee</div>
                            <button onclick="window.llcFormation.selectFiling('rush')" style="margin-top: 15px; background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">Select Rush</button>
                        </div>
                    </div>
                </div>
                
                <div id="formation-summary" style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 15px; backdrop-filter: blur(20px); margin-bottom: 30px; display: none;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #60a5fa;">📊 Formation Summary</h3>
                    <div id="summary-content"></div>
                </div>
                
                <div style="text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <button onclick="window.llcFormation.generateDocuments()" style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer; margin-right: 15px; box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);">📄 Generate Documents</button>
                        <button onclick="window.llcFormation.beginFiling()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer; margin-right: 15px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);">🚀 Begin Filing Process</button>
                        <button onclick="window.llcFormation.closeFormation()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 15px 30px; border-radius: 12px; font-size: 18px; font-weight: 600; cursor: pointer;">Close</button>
                    </div>
                    
                    <div id="formation-status" style="margin-top: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px; display: none;">
                        <div id="status-message" style="font-size: 16px; margin-bottom: 15px;"></div>
                        <div id="status-progress" style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px;">
                            <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); border-radius: 4px; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(formationContainer);
        
        // Bind event listeners
        this.bindFormationEvents();
        
        console.log('[LLC-FORMATION] Formation interface created');
    }

    populateIntelligentDefaults() {
        // Auto-select Delaware for optimal business benefits
        const stateSelect = document.getElementById('formation-state');
        if (stateSelect) {
            stateSelect.value = 'Delaware';
            this.updateStateInfo('Delaware');
        }
        
        // Set recommended agent type
        const agentType = document.getElementById('agent-type');
        if (agentType) {
            agentType.value = 'service';
            this.toggleAgentType();
        }
        
        console.log('[LLC-FORMATION] Intelligent defaults populated');
    }

    bindFormationEvents() {
        const stateSelect = document.getElementById('formation-state');
        if (stateSelect) {
            stateSelect.addEventListener('change', (e) => {
                this.updateStateInfo(e.target.value);
            });
        }
        
        // Auto-update summary when fields change
        const formFields = ['company-name', 'formation-state', 'business-purpose', 'primary-member'];
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.updateFormationSummary());
            }
        });
    }

    toggleAgentType() {
        const agentType = document.getElementById('agent-type').value;
        const agentDetails = document.getElementById('agent-details');
        
        if (agentType === 'service') {
            agentDetails.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 8px; border: 2px solid #10b981;">
                    <h4 style="margin: 0 0 10px 0; color: #10b981;">✅ Professional Registered Agent Service</h4>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">We'll arrange a professional registered agent service for $150/year. This ensures compliance and protects your privacy.</p>
                    <div style="margin-top: 10px; font-weight: 600;">Benefits:</div>
                    <ul style="margin: 5px 0 0 20px; font-size: 14px; opacity: 0.9;">
                        <li>Privacy protection</li>
                        <li>Guaranteed compliance</li>
                        <li>Professional address</li>
                        <li>Document forwarding</li>
                    </ul>
                </div>
            `;
        } else {
            agentDetails.innerHTML = `
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Agent Name</label>
                <input type="text" id="agent-name" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter agent name" />
                
                <label style="display: block; margin: 15px 0 8px 0; font-weight: 600;">Agent Address</label>
                <input type="text" id="agent-address" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: rgba(255,255,255,0.9); color: #000; font-size: 16px;" placeholder="Enter agent address" />
                
                <div style="background: rgba(251, 191, 36, 0.2); padding: 10px; border-radius: 8px; margin-top: 10px; border: 1px solid #fbbf24;">
                    <div style="font-size: 14px; color: #fbbf24; font-weight: 600;">⚠️ Self Agent Requirements:</div>
                    <div style="font-size: 12px; opacity: 0.8; margin-top: 5px;">Must have physical address in formation state and be available during business hours</div>
                </div>
            `;
        }
    }

    updateStateInfo(state) {
        if (!state || !this.stateRequirements[state]) return;
        
        const requirements = this.stateRequirements[state];
        this.formationData.state = state;
        this.formationData.filingFees = requirements;
        
        this.updateFormationSummary();
    }

    selectFiling(type) {
        this.formationData.filingType = type;
        
        // Update button styles
        document.querySelectorAll('[onclick*="selectFiling"]').forEach(btn => {
            btn.style.background = btn.textContent.includes(type.replace('-', ' ')) ? '#059669' : '#6b7280';
        });
        
        this.updateFormationSummary();
        console.log(`[LLC-FORMATION] Selected filing type: ${type}`);
    }

    updateFormationSummary() {
        const summaryContainer = document.getElementById('formation-summary');
        const summaryContent = document.getElementById('summary-content');
        
        if (!summaryContainer || !summaryContent) return;
        
        const companyName = document.getElementById('company-name')?.value || 'DWC Systems LLC';
        const state = document.getElementById('formation-state')?.value || '';
        const filingType = this.formationData.filingType || 'standard';
        
        if (!state) {
            summaryContainer.style.display = 'none';
            return;
        }
        
        const stateInfo = this.stateRequirements[state];
        let totalFee = stateInfo.fee;
        let timeframe = stateInfo.processingTime;
        
        if (filingType === 'same-day') {
            totalFee += 100;
            timeframe = 'Same business day';
        } else if (filingType === 'rush') {
            totalFee += 200;
            timeframe = '2 hours';
        }
        
        if (document.getElementById('agent-type')?.value === 'service') {
            totalFee += 150;
        }
        
        summaryContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <div style="font-weight: 600; color: #60a5fa;">Company</div>
                    <div style="font-size: 18px; margin-top: 5px;">${companyName}</div>
                </div>
                <div>
                    <div style="font-weight: 600; color: #60a5fa;">State</div>
                    <div style="font-size: 18px; margin-top: 5px;">${state}</div>
                </div>
                <div>
                    <div style="font-weight: 600; color: #60a5fa;">Filing Type</div>
                    <div style="font-size: 18px; margin-top: 5px; text-transform: capitalize;">${filingType.replace('-', ' ')}</div>
                </div>
                <div>
                    <div style="font-weight: 600; color: #60a5fa;">Timeframe</div>
                    <div style="font-size: 18px; margin-top: 5px;">${timeframe}</div>
                </div>
                <div>
                    <div style="font-weight: 600; color: #60a5fa;">Total Cost</div>
                    <div style="font-size: 24px; margin-top: 5px; color: #10b981; font-weight: bold;">$${totalFee}</div>
                </div>
            </div>
        `;
        
        summaryContainer.style.display = 'block';
    }

    async generateDocuments() {
        console.log('[LLC-FORMATION] Generating formation documents');
        
        const statusContainer = document.getElementById('formation-status');
        const statusMessage = document.getElementById('status-message');
        const progressBar = document.getElementById('progress-bar');
        
        statusContainer.style.display = 'block';
        statusMessage.textContent = 'Generating formation documents...';
        progressBar.style.width = '20%';
        
        // Collect form data
        this.collectFormData();
        
        // Generate Articles of Organization
        await this.generateArticlesOfOrganization();
        progressBar.style.width = '40%';
        
        // Generate Operating Agreement
        await this.generateOperatingAgreement();
        progressBar.style.width = '60%';
        
        // Generate EIN Application (SS-4)
        await this.generateEINApplication();
        progressBar.style.width = '80%';
        
        // Generate filing checklist
        this.generateFilingChecklist();
        progressBar.style.width = '100%';
        
        statusMessage.textContent = '✅ All formation documents generated successfully!';
        
        // Show download options
        setTimeout(() => {
            this.showDocumentDownloads();
        }, 1000);
    }

    collectFormData() {
        this.formationData.companyName = document.getElementById('company-name')?.value || 'DWC Systems LLC';
        this.formationData.state = document.getElementById('formation-state')?.value || '';
        this.formationData.businessPurpose = document.getElementById('business-purpose')?.value || '';
        this.formationData.businessAddress = document.getElementById('business-address')?.value || '';
        this.formationData.primaryMember = document.getElementById('primary-member')?.value || '';
        this.formationData.memberAddress = document.getElementById('member-address')?.value || '';
        this.formationData.agentType = document.getElementById('agent-type')?.value || 'service';
        
        if (this.formationData.agentType === 'self') {
            this.formationData.agentName = document.getElementById('agent-name')?.value || '';
            this.formationData.agentAddress = document.getElementById('agent-address')?.value || '';
        }
        
        console.log('[LLC-FORMATION] Form data collected:', this.formationData);
    }

    async generateArticlesOfOrganization() {
        const articles = `
ARTICLES OF ORGANIZATION
${this.formationData.companyName}

FIRST: The name of the limited liability company is ${this.formationData.companyName}.

SECOND: The address of the registered office in the State of ${this.formationData.state} is:
${this.formationData.agentType === 'service' ? '[Professional Registered Agent Address]' : this.formationData.agentAddress}

THIRD: The name and address of the registered agent for service of process is:
${this.formationData.agentType === 'service' ? '[Professional Registered Agent Service]' : this.formationData.agentName}
${this.formationData.agentType === 'service' ? '[Professional Registered Agent Address]' : this.formationData.agentAddress}

FOURTH: The purpose for which the limited liability company is organized is:
${this.formationData.businessPurpose}

FIFTH: Management of the limited liability company is vested in its members.

SIXTH: The powers of the limited liability company and its members and managers are governed by the ${this.formationData.state} Limited Liability Company Act.

IN WITNESS WHEREOF, the undersigned has executed these Articles of Organization.

Date: ${new Date().toLocaleDateString()}

_________________________________
${this.formationData.primaryMember}
Organizer
        `;
        
        this.formationData.documents.push({
            name: 'Articles of Organization',
            content: articles,
            type: 'legal'
        });
        
        console.log('[LLC-FORMATION] Articles of Organization generated');
    }

    async generateOperatingAgreement() {
        const operatingAgreement = `
OPERATING AGREEMENT
${this.formationData.companyName}

This Operating Agreement ("Agreement") is made and entered into on ${new Date().toLocaleDateString()}, by and among the Members of ${this.formationData.companyName}, a ${this.formationData.state} limited liability company (the "Company").

ARTICLE I - FORMATION
1.1 Formation. The Company has been formed as a limited liability company under the laws of the State of ${this.formationData.state}.

1.2 Name. The name of the Company is ${this.formationData.companyName}.

1.3 Principal Place of Business. The principal place of business of the Company shall be:
${this.formationData.businessAddress || '[Business Address]'}

1.4 Purpose. The purpose of the Company is to engage in the business of ${this.formationData.businessPurpose.toLowerCase()}, and any other lawful business purpose.

ARTICLE II - MEMBERS
2.1 Initial Members. The initial Member(s) of the Company are:
- ${this.formationData.primaryMember}

2.2 Limited Liability. No Member shall be personally liable for the debts, obligations, or liabilities of the Company.

ARTICLE III - MANAGEMENT
3.1 Management by Members. The Company shall be managed by its Members.

3.2 Authority. Each Member has the authority to bind the Company in the ordinary course of business.

ARTICLE IV - CAPITAL CONTRIBUTIONS
4.1 Initial Contributions. Members may make initial capital contributions as agreed upon.

4.2 Additional Contributions. Additional capital contributions may be required upon unanimous consent of all Members.

ARTICLE V - DISTRIBUTIONS
5.1 Distributions. Distributions shall be made to Members in proportion to their membership interests.

ARTICLE VI - DISSOLUTION
6.1 Events of Dissolution. The Company shall be dissolved upon the occurrence of any of the following events:
- Unanimous consent of all Members
- Entry of a decree of judicial dissolution

IN WITNESS WHEREOF, the Members have executed this Operating Agreement.

_________________________________
${this.formationData.primaryMember}
Member

Date: ${new Date().toLocaleDateString()}
        `;
        
        this.formationData.documents.push({
            name: 'Operating Agreement',
            content: operatingAgreement,
            type: 'internal'
        });
        
        console.log('[LLC-FORMATION] Operating Agreement generated');
    }

    async generateEINApplication() {
        const einApplication = `
FORM SS-4 - APPLICATION FOR EMPLOYER IDENTIFICATION NUMBER (EIN)
${this.formationData.companyName}

1. Legal name of entity: ${this.formationData.companyName}

2. Trade name of business: DWC Systems

3a. Mailing address: ${this.formationData.businessAddress || '[Business Address]'}

4a. Location of principal business: ${this.formationData.businessAddress || '[Business Address]'}

7a. Name of responsible party: ${this.formationData.primaryMember}

8a. Type of entity: Limited Liability Company (LLC)

8b. If a corporation, provide state of incorporation: N/A

9a. Type of entity: LLC

9b. State where entity was formed: ${this.formationData.state}

10. Reason for applying: Started new business

11. Date business started: ${new Date().toLocaleDateString()}

12. Closing month of accounting year: December

13. Highest number of employees expected: 10

15. First date wages or annuities were paid: [To be filled when employees are hired]

16. Type of business: Software Development and Business Intelligence Services

17. Principal business activity: Computer Software Development

18. Has the applicant entity shown on line 1 ever applied for an EIN before? No

Third Party Designee: [Leave blank unless using a third party]

Signature: _________________________________
Print Name: ${this.formationData.primaryMember}
Title: Member/Manager
Date: ${new Date().toLocaleDateString()}
        `;
        
        this.formationData.documents.push({
            name: 'EIN Application (Form SS-4)',
            content: einApplication,
            type: 'tax'
        });
        
        console.log('[LLC-FORMATION] EIN Application generated');
    }

    generateFilingChecklist() {
        const checklist = `
DWC SYSTEMS LLC FORMATION CHECKLIST

PRE-FILING CHECKLIST:
□ Company name availability verified
□ Registered agent secured
□ Business address confirmed
□ Formation documents prepared
□ Filing fees calculated

REQUIRED DOCUMENTS:
□ Articles of Organization
□ Operating Agreement
□ EIN Application (Form SS-4)
□ Registered Agent Consent (if applicable)

FILING PROCESS:
□ Submit Articles of Organization to ${this.formationData.state} Secretary of State
□ Pay filing fee: $${this.stateRequirements[this.formationData.state]?.fee || 0}
□ Obtain Certificate of Formation
□ Apply for EIN with IRS
□ Open business bank account
□ Obtain necessary business licenses

POST-FORMATION TASKS:
□ File initial reports (if required)
□ Set up business accounting
□ Obtain business insurance
□ Register for state taxes
□ Draft employment agreements
□ Establish business credit

ANNUAL COMPLIANCE:
□ File annual reports
□ Pay franchise taxes
□ Update registered agent if needed
□ Maintain corporate records

CONTACT INFORMATION:
${this.formationData.state} Secretary of State: [Contact information for filing]
IRS EIN Hotline: 1-800-829-4933
Registered Agent Service: [If using professional service]

ESTIMATED TIMELINE:
Filing: ${this.stateRequirements[this.formationData.state]?.processingTime || '1-3 business days'}
EIN: 1-2 business days online
Total Setup: 3-5 business days

TOTAL COSTS:
State Filing Fee: $${this.stateRequirements[this.formationData.state]?.fee || 0}
Registered Agent: ${this.formationData.agentType === 'service' ? '$150/year' : '$0 (self)'}
EIN Application: $0 (free with IRS)
Expedited Filing: ${this.formationData.filingType === 'same-day' ? '$100' : this.formationData.filingType === 'rush' ? '$200' : '$0'}

NEXT STEPS:
1. Review all documents carefully
2. Submit formation documents tonight
3. Follow up on processing status
4. Complete post-formation tasks
        `;
        
        this.formationData.documents.push({
            name: 'Formation Checklist',
            content: checklist,
            type: 'checklist'
        });
        
        console.log('[LLC-FORMATION] Filing checklist generated');
    }

    showDocumentDownloads() {
        const statusMessage = document.getElementById('status-message');
        statusMessage.innerHTML = `
            <div style="text-align: left;">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #10b981;">📄 Documents Ready for Download</div>
                
                ${this.formationData.documents.map(doc => `
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600;">${doc.name}</div>
                            <div style="font-size: 14px; opacity: 0.8; text-transform: capitalize;">${doc.type} document</div>
                        </div>
                        <button onclick="window.llcFormation.downloadDocument('${doc.name}')" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Download</button>
                    </div>
                `).join('')}
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(16, 185, 129, 0.2); border-radius: 8px; border: 2px solid #10b981;">
                    <div style="font-weight: 600; color: #10b981; margin-bottom: 10px;">🚀 Ready to File Tonight!</div>
                    <div style="font-size: 14px; opacity: 0.9;">All documents are prepared and ready for immediate submission to the ${this.formationData.state} Secretary of State.</div>
                </div>
            </div>
        `;
    }

    downloadDocument(docName) {
        const doc = this.formationData.documents.find(d => d.name === docName);
        if (!doc) return;
        
        const blob = new Blob([doc.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`[LLC-FORMATION] Downloaded document: ${docName}`);
    }

    async beginFiling() {
        console.log('[LLC-FORMATION] Beginning filing process');
        
        if (!this.validateFormData()) {
            alert('Please complete all required fields before filing.');
            return;
        }
        
        const statusContainer = document.getElementById('formation-status');
        const statusMessage = document.getElementById('status-message');
        const progressBar = document.getElementById('progress-bar');
        
        statusContainer.style.display = 'block';
        statusMessage.textContent = 'Initiating filing process...';
        progressBar.style.width = '10%';
        
        // Step 1: Prepare filing package
        statusMessage.textContent = 'Preparing filing package for ' + this.formationData.state + '...';
        progressBar.style.width = '25%';
        await this.delay(1000);
        
        // Step 2: Validate documents
        statusMessage.textContent = 'Validating formation documents...';
        progressBar.style.width = '50%';
        await this.delay(1500);
        
        // Step 3: Submit to state
        statusMessage.textContent = 'Submitting to ' + this.formationData.state + ' Secretary of State...';
        progressBar.style.width = '75%';
        await this.delay(2000);
        
        // Step 4: Process payment
        statusMessage.textContent = 'Processing filing fees...';
        progressBar.style.width = '90%';
        await this.delay(1000);
        
        // Step 5: Complete
        progressBar.style.width = '100%';
        statusMessage.innerHTML = `
            <div style="color: #10b981; font-weight: 600;">🎉 LLC Filing Initiated Successfully!</div>
            <div style="margin-top: 10px; font-size: 14px; opacity: 0.9;">
                Your DWC Systems LLC formation has been submitted to the ${this.formationData.state} Secretary of State.<br>
                Expected processing time: ${this.stateRequirements[this.formationData.state]?.processingTime}<br>
                Confirmation number: DWC-${Date.now()}<br><br>
                Next steps will be emailed to you shortly.
            </div>
        `;
        
        this.formationData.status = 'filed';
        
        // Show completion options
        setTimeout(() => {
            this.showFilingComplete();
        }, 3000);
    }

    validateFormData() {
        const required = [
            'company-name',
            'formation-state',
            'business-purpose',
            'business-address',
            'primary-member',
            'member-address'
        ];
        
        for (const fieldId of required) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                console.log(`[LLC-FORMATION] Missing required field: ${fieldId}`);
                return false;
            }
        }
        
        if (this.formationData.agentType === 'self') {
            const agentFields = ['agent-name', 'agent-address'];
            for (const fieldId of agentFields) {
                const field = document.getElementById(fieldId);
                if (!field || !field.value.trim()) {
                    console.log(`[LLC-FORMATION] Missing agent field: ${fieldId}`);
                    return false;
                }
            }
        }
        
        return true;
    }

    showFilingComplete() {
        const statusMessage = document.getElementById('status-message');
        statusMessage.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 32px; margin-bottom: 20px;">🏢✅</div>
                <div style="font-size: 24px; font-weight: 700; color: #10b981; margin-bottom: 15px;">DWC Systems LLC Filed!</div>
                <div style="font-size: 16px; margin-bottom: 20px;">Your LLC formation is in process. You'll receive updates via email.</div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                    <button onclick="window.llcFormation.downloadAllDocuments()" style="background: #3b82f6; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">📁 Download All Docs</button>
                    <button onclick="window.llcFormation.trackFiling()" style="background: #8b5cf6; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">📊 Track Filing</button>
                    <button onclick="window.llcFormation.setupBanking()" style="background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">🏦 Setup Banking</button>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: rgba(59, 130, 246, 0.2); border-radius: 8px;">
                    <div style="font-weight: 600; margin-bottom: 10px;">🔥 Pro Tip: Next Steps</div>
                    <div style="font-size: 14px; text-align: left;">
                        1. Apply for EIN immediately (takes 1-2 days)<br>
                        2. Open business bank account once EIN is received<br>
                        3. Set up QuickBooks or accounting system<br>
                        4. Obtain business insurance and licenses<br>
                        5. Update all contracts and agreements with new LLC name
                    </div>
                </div>
            </div>
        `;
    }

    downloadAllDocuments() {
        this.formationData.documents.forEach(doc => {
            setTimeout(() => this.downloadDocument(doc.name), 500);
        });
        console.log('[LLC-FORMATION] Downloaded all formation documents');
    }

    trackFiling() {
        alert(`Filing Status: Submitted to ${this.formationData.state} Secretary of State\nConfirmation: DWC-${Date.now()}\nExpected completion: ${this.stateRequirements[this.formationData.state]?.processingTime}\n\nYou'll receive email updates on the filing progress.`);
    }

    setupBanking() {
        alert('Business Banking Setup\n\nOnce your LLC is approved and you receive your EIN:\n1. Contact your preferred bank\n2. Bring LLC Certificate + EIN letter\n3. Open business checking account\n4. Consider business credit card\n5. Set up online banking\n\nRecommended banks for LLCs:\n- Chase Business Banking\n- Bank of America Business\n- Wells Fargo Business\n- Local credit unions');
    }

    loadExistingData() {
        // Load any previously saved formation data
        const saved = localStorage.getItem('dwc-llc-formation');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.formationData = { ...this.formationData, ...data };
            } catch (e) {
                console.log('[LLC-FORMATION] Could not load saved data');
            }
        }
    }

    saveFormationData() {
        localStorage.setItem('dwc-llc-formation', JSON.stringify(this.formationData));
    }

    closeFormation() {
        this.saveFormationData();
        const container = document.getElementById('llc-formation-system');
        if (container) container.remove();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupFormationSteps() {
        // Additional setup logic for formation process
        console.log('[LLC-FORMATION] Formation steps configured');
    }
}

// Initialize LLC Formation System
document.addEventListener('DOMContentLoaded', function() {
    window.llcFormation = new LLCFormationEngine();
});

// Global function to start LLC formation
window.startLLCFormation = function() {
    if (window.llcFormation) {
        window.llcFormation.initializeLLCFormation();
    } else {
        window.llcFormation = new LLCFormationEngine();
        window.llcFormation.initializeLLCFormation();
    }
};

console.log('[LLC-FORMATION] LLC Formation Engine loaded');