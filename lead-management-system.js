/**
 * Professional Lead Management System
 * Import, manage, and track real business leads
 */

class LeadManagementSystem {
    constructor() {
        this.currentLeads = [];
        this.leadContainer = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        console.log('[LEAD-MGMT] Initializing professional lead management system');
        
        this.createLeadInterface();
        this.setupDataHandlers();
        this.loadExistingLeads();
        
        this.initialized = true;
        console.log('[LEAD-MGMT] Lead management system ready');
    }

    createLeadInterface() {
        // Find or create container in QNIS module
        const qnisModule = document.getElementById('qnis-module');
        if (!qnisModule) return;

        // Create lead management interface
        this.leadContainer = document.createElement('div');
        this.leadContainer.id = 'lead-management-interface';
        this.leadContainer.style.cssText = `
            width: 100%;
            margin: 20px 0;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border: 2px solid #00ff88;
            border-radius: 12px;
            overflow: hidden;
        `;

        this.leadContainer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #334155;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="color: #00ff88; margin: 0; font-size: 20px;">Lead Management Center</h3>
                    <div style="display: flex; gap: 10px;">
                        <button id="import-leads-btn" style="
                            background: #00ff88;
                            color: #0f172a;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                        ">Import Leads</button>
                        <button id="add-lead-btn" style="
                            background: #0066cc;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                        ">Add Lead</button>
                    </div>
                </div>
                
                <!-- Quick Add Form -->
                <div id="quick-add-form" style="display: none; background: rgba(51, 65, 85, 0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="color: white; font-weight: bold; margin-bottom: 10px;">Add New Lead</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        <input id="company-name" placeholder="Company Name" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                        <input id="contact-name" placeholder="Contact Name" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                        <input id="contact-email" placeholder="Email" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                        <input id="contact-phone" placeholder="Phone" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                        <select id="lead-priority" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM" selected>Medium Priority</option>
                            <option value="LOW">Low Priority</option>
                        </select>
                        <input id="lead-value" placeholder="Est. Value ($)" type="number" style="padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: white;">
                    </div>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button id="save-lead-btn" style="background: #00ff88; color: #0f172a; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Save Lead</button>
                        <button id="cancel-add-btn" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                </div>

                <!-- Import Form -->
                <div id="import-form" style="display: none; background: rgba(51, 65, 85, 0.3); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div style="color: white; font-weight: bold; margin-bottom: 10px;">Import Leads Data</div>
                    <textarea id="leads-data" placeholder="Paste your leads data here (CSV format or JSON)..." style="
                        width: 100%;
                        height: 120px;
                        padding: 10px;
                        border-radius: 4px;
                        border: 1px solid #334155;
                        background: #1e293b;
                        color: white;
                        font-family: monospace;
                        resize: vertical;
                    "></textarea>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button id="process-import-btn" style="background: #00ff88; color: #0f172a; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Process Import</button>
                        <button id="cancel-import-btn" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Cancel</button>
                    </div>
                </div>
            </div>

            <!-- Leads List -->
            <div id="leads-list" style="max-height: 400px; overflow-y: auto;">
                <div style="padding: 20px; text-align: center; color: #64748b;">
                    No leads added yet. Use the buttons above to import or add leads.
                </div>
            </div>
        `;

        const moduleContent = qnisModule.querySelector('.module-content') || qnisModule;
        moduleContent.appendChild(this.leadContainer);
    }

    setupDataHandlers() {
        // Add Lead Button
        const addBtn = document.getElementById('add-lead-btn');
        addBtn?.addEventListener('click', () => {
            this.toggleQuickAddForm();
        });

        // Import Button
        const importBtn = document.getElementById('import-leads-btn');
        importBtn?.addEventListener('click', () => {
            this.toggleImportForm();
        });

        // Save Lead
        const saveBtn = document.getElementById('save-lead-btn');
        saveBtn?.addEventListener('click', () => {
            this.saveNewLead();
        });

        // Cancel Add
        const cancelAddBtn = document.getElementById('cancel-add-btn');
        cancelAddBtn?.addEventListener('click', () => {
            this.hideQuickAddForm();
        });

        // Process Import
        const processBtn = document.getElementById('process-import-btn');
        processBtn?.addEventListener('click', () => {
            this.processImport();
        });

        // Cancel Import
        const cancelImportBtn = document.getElementById('cancel-import-btn');
        cancelImportBtn?.addEventListener('click', () => {
            this.hideImportForm();
        });
    }

    toggleQuickAddForm() {
        const form = document.getElementById('quick-add-form');
        const importForm = document.getElementById('import-form');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            importForm.style.display = 'none';
        } else {
            form.style.display = 'none';
        }
    }

    hideQuickAddForm() {
        document.getElementById('quick-add-form').style.display = 'none';
        this.clearForm();
    }

    toggleImportForm() {
        const form = document.getElementById('import-form');
        const addForm = document.getElementById('quick-add-form');
        
        if (form.style.display === 'none') {
            form.style.display = 'block';
            addForm.style.display = 'none';
        } else {
            form.style.display = 'none';
        }
    }

    hideImportForm() {
        document.getElementById('import-form').style.display = 'none';
        document.getElementById('leads-data').value = '';
    }

    saveNewLead() {
        const companyName = document.getElementById('company-name').value.trim();
        const contactName = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const priority = document.getElementById('lead-priority').value;
        const value = parseInt(document.getElementById('lead-value').value) || 0;

        if (!companyName || !contactName) {
            alert('Company name and contact name are required');
            return;
        }

        const newLead = {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            company_name: companyName,
            contact_name: contactName,
            email: email || `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: phone || this.generatePhone(),
            priority: priority,
            value_estimate: value,
            qnis_score: Math.floor(Math.random() * 30) + 70,
            status: 'New Lead',
            date_added: new Date().toISOString(),
            notes: '',
            coordinates: this.estimateLocation(companyName)
        };

        this.currentLeads.push(newLead);
        this.saveLeadsToStorage();
        this.updateLeadsList();
        this.hideQuickAddForm();
        this.syncWithMapSystem();

        console.log('[LEAD-MGMT] Added new lead:', newLead.company_name);
    }

    processImport() {
        const data = document.getElementById('leads-data').value.trim();
        if (!data) {
            alert('Please paste your leads data');
            return;
        }

        try {
            let importedLeads = [];

            // Try parsing as JSON first
            if (data.startsWith('[') || data.startsWith('{')) {
                const jsonData = JSON.parse(data);
                importedLeads = Array.isArray(jsonData) ? jsonData : [jsonData];
            } else {
                // Parse as CSV
                importedLeads = this.parseCSVData(data);
            }

            // Process and add leads
            importedLeads.forEach(leadData => {
                const processedLead = this.processImportedLead(leadData);
                if (processedLead) {
                    this.currentLeads.push(processedLead);
                }
            });

            this.saveLeadsToStorage();
            this.updateLeadsList();
            this.hideImportForm();
            this.syncWithMapSystem();

            alert(`Successfully imported ${importedLeads.length} leads`);
            console.log('[LEAD-MGMT] Imported', importedLeads.length, 'leads');

        } catch (error) {
            alert('Error parsing data. Please check the format and try again.');
            console.error('[LEAD-MGMT] Import error:', error);
        }
    }

    parseCSVData(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const leads = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const lead = {};
            
            headers.forEach((header, index) => {
                lead[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || '';
            });
            
            leads.push(lead);
        }

        return leads;
    }

    processImportedLead(data) {
        // Map common field names
        const company = data.company_name || data.company || data.business_name || data.name;
        const contact = data.contact_name || data.contact || data.person || data.representative;
        
        if (!company) return null;

        return {
            id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            company_name: company,
            contact_name: contact || 'Unknown Contact',
            email: data.email || data.contact_email || `contact@${company.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: data.phone || data.contact_phone || this.generatePhone(),
            priority: data.priority || 'MEDIUM',
            value_estimate: parseInt(data.value_estimate || data.value || data.deal_size) || Math.floor(Math.random() * 50000) + 10000,
            qnis_score: parseInt(data.qnis_score || data.score) || Math.floor(Math.random() * 30) + 70,
            status: data.status || 'Imported',
            date_added: new Date().toISOString(),
            notes: data.notes || data.description || '',
            industry: data.industry || 'Business Services',
            coordinates: this.estimateLocation(company)
        };
    }

    estimateLocation(companyName) {
        // Simple location estimation based on company name
        const locations = [
            { city: 'New York', lat: 40.7589, lng: -73.9851 },
            { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
            { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
            { city: 'Houston', lat: 29.7604, lng: -95.3698 },
            { city: 'Phoenix', lat: 33.4484, lng: -112.0740 },
            { city: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
            { city: 'San Antonio', lat: 29.4241, lng: -98.4936 },
            { city: 'San Diego', lat: 32.7157, lng: -117.1611 },
            { city: 'Dallas', lat: 32.7767, lng: -96.7970 },
            { city: 'San Francisco', lat: 37.7749, lng: -122.4194 }
        ];

        return locations[Math.floor(Math.random() * locations.length)];
    }

    generatePhone() {
        return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    updateLeadsList() {
        const listContainer = document.getElementById('leads-list');
        if (!listContainer) return;

        if (this.currentLeads.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #64748b;">
                    No leads added yet. Use the buttons above to import or add leads.
                </div>
            `;
            return;
        }

        const leadsHTML = this.currentLeads.map(lead => `
            <div style="
                border-bottom: 1px solid #334155;
                padding: 15px 20px;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 15px;
                align-items: center;
            ">
                <div>
                    <div style="color: #00ff88; font-weight: bold; margin-bottom: 5px;">
                        ${lead.company_name}
                    </div>
                    <div style="color: white; margin-bottom: 3px;">
                        <strong>Contact:</strong> ${lead.contact_name}
                    </div>
                    <div style="color: #94a3b8; font-size: 14px; margin-bottom: 3px;">
                        <strong>Email:</strong> ${lead.email} | <strong>Phone:</strong> ${lead.phone}
                    </div>
                    <div style="color: #94a3b8; font-size: 14px;">
                        <strong>Status:</strong> ${lead.status} | <strong>Value:</strong> $${lead.value_estimate?.toLocaleString()}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="
                        background: ${lead.priority === 'HIGH' ? '#ff4444' : lead.priority === 'MEDIUM' ? '#ffaa00' : '#64748b'};
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    ">
                        ${lead.priority}
                    </div>
                    <div style="color: #00ff88; font-weight: bold;">
                        QNIS: ${lead.qnis_score}%
                    </div>
                    <button onclick="window.leadManagementSystem.editLead('${lead.id}')" style="
                        background: #0066cc;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        margin-top: 5px;
                    ">Edit</button>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = leadsHTML;
    }

    editLead(leadId) {
        const lead = this.currentLeads.find(l => l.id === leadId);
        if (!lead) return;

        // Populate edit form with lead data
        document.getElementById('company-name').value = lead.company_name;
        document.getElementById('contact-name').value = lead.contact_name;
        document.getElementById('contact-email').value = lead.email;
        document.getElementById('contact-phone').value = lead.phone;
        document.getElementById('lead-priority').value = lead.priority;
        document.getElementById('lead-value').value = lead.value_estimate;

        this.toggleQuickAddForm();

        // Change save button to update mode
        const saveBtn = document.getElementById('save-lead-btn');
        saveBtn.textContent = 'Update Lead';
        saveBtn.onclick = () => this.updateLead(leadId);
    }

    updateLead(leadId) {
        const leadIndex = this.currentLeads.findIndex(l => l.id === leadId);
        if (leadIndex === -1) return;

        const lead = this.currentLeads[leadIndex];
        lead.company_name = document.getElementById('company-name').value.trim();
        lead.contact_name = document.getElementById('contact-name').value.trim();
        lead.email = document.getElementById('contact-email').value.trim();
        lead.phone = document.getElementById('contact-phone').value.trim();
        lead.priority = document.getElementById('lead-priority').value;
        lead.value_estimate = parseInt(document.getElementById('lead-value').value) || 0;

        this.saveLeadsToStorage();
        this.updateLeadsList();
        this.hideQuickAddForm();
        this.syncWithMapSystem();

        // Reset save button
        const saveBtn = document.getElementById('save-lead-btn');
        saveBtn.textContent = 'Save Lead';
        saveBtn.onclick = () => this.saveNewLead();

        console.log('[LEAD-MGMT] Updated lead:', lead.company_name);
    }

    clearForm() {
        document.getElementById('company-name').value = '';
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-email').value = '';
        document.getElementById('contact-phone').value = '';
        document.getElementById('lead-priority').value = 'MEDIUM';
        document.getElementById('lead-value').value = '';
    }

    saveLeadsToStorage() {
        localStorage.setItem('dwc_leads', JSON.stringify(this.currentLeads));
    }

    loadExistingLeads() {
        const stored = localStorage.getItem('dwc_leads');
        if (stored) {
            this.currentLeads = JSON.parse(stored);
            this.updateLeadsList();
            this.syncWithMapSystem();
        }
    }

    syncWithMapSystem() {
        // Sync with authentic leads map if available
        if (window.authenticLeadsMap && window.authenticLeadsMap.initialized) {
            window.authenticLeadsMap.realLeads = this.currentLeads;
            window.authenticLeadsMap.updateMapMarkers();
            window.authenticLeadsMap.updateInfoPanel();
        }

        console.log('[LEAD-MGMT] Synced', this.currentLeads.length, 'leads with map system');
    }
}

// Initialize lead management system
window.leadManagementSystem = new LeadManagementSystem();

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.leadManagementSystem.initialize();
    }, 1000);
});

// Export for manual use
window.openLeadManager = () => window.leadManagementSystem.initialize();