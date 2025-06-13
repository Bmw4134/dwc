/**
 * Commission Management System
 * 90% to sales person, 10% overhead allocation
 */
class CommissionManager {
    constructor() {
        this.commissionStructure = {
            salesPersonPercentage: 90,
            overheadPercentage: 10
        };
        this.salesRecords = [];
        this.payoutHistory = [];
        this.initializeCommissionSystem();
    }

    initializeCommissionSystem() {
        console.log('[COMMISSION] Initializing commission management system');
        this.createCommissionModule();
        this.bindCommissionEvents();
        this.loadSalesData();
    }

    createCommissionModule() {
        const commissionHTML = `
            <div id="commission-management" class="module-container" style="display: none;">
                <div class="module-header">
                    <h2>📊 Commission Management</h2>
                    <div class="commission-summary">
                        <div class="summary-card">
                            <div class="metric-value" id="total-commissions">$0</div>
                            <div class="metric-label">Total Commissions</div>
                        </div>
                        <div class="summary-card">
                            <div class="metric-value" id="pending-payouts">$0</div>
                            <div class="metric-label">Pending Payouts</div>
                        </div>
                        <div class="summary-card">
                            <div class="metric-value" id="overhead-collected">$0</div>
                            <div class="metric-label">Overhead (10%)</div>
                        </div>
                    </div>
                </div>

                <div class="commission-controls">
                    <button onclick="commissionManager.addSale()" class="btn-primary">
                        💰 Record New Sale
                    </button>
                    <button onclick="commissionManager.processPayouts()" class="btn-success">
                        💳 Process Payouts
                    </button>
                    <button onclick="commissionManager.exportReport()" class="btn-secondary">
                        📋 Export Report
                    </button>
                </div>

                <div class="commission-tabs">
                    <button class="tab-btn active" onclick="commissionManager.showTab('sales')">Sales Records</button>
                    <button class="tab-btn" onclick="commissionManager.showTab('payouts')">Payout History</button>
                    <button class="tab-btn" onclick="commissionManager.showTab('analytics')">Analytics</button>
                </div>

                <div id="sales-tab" class="tab-content active">
                    <div class="sales-table-container">
                        <table class="sales-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Sales Person</th>
                                    <th>Client</th>
                                    <th>Sale Amount</th>
                                    <th>Commission (90%)</th>
                                    <th>Overhead (10%)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="sales-table-body">
                                <!-- Sales records will be populated here -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="payouts-tab" class="tab-content">
                    <div class="payouts-container">
                        <div id="payouts-list">
                            <!-- Payout history will be populated here -->
                        </div>
                    </div>
                </div>

                <div id="analytics-tab" class="tab-content">
                    <div class="analytics-container">
                        <div class="charts-grid">
                            <div class="chart-container">
                                <h3>Monthly Sales Performance</h3>
                                <canvas id="sales-chart" width="400" height="200"></canvas>
                            </div>
                            <div class="chart-container">
                                <h3>Top Performers</h3>
                                <div id="top-performers-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into main container
        const mainContainer = document.querySelector('#main-content') || document.body;
        mainContainer.insertAdjacentHTML('beforeend', commissionHTML);

        this.addCommissionStyles();
    }

    addCommissionStyles() {
        const styles = `
            <style>
                .commission-summary {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }

                .summary-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px;
                    border-radius: 12px;
                    color: white;
                    text-align: center;
                }

                .metric-value {
                    font-size: 2em;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .metric-label {
                    font-size: 0.9em;
                    opacity: 0.9;
                }

                .commission-controls {
                    display: flex;
                    gap: 15px;
                    margin: 20px 0;
                    flex-wrap: wrap;
                }

                .commission-controls button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .btn-success {
                    background: #10b981;
                    color: white;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .commission-controls button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .commission-tabs {
                    display: flex;
                    border-bottom: 2px solid #e5e7eb;
                    margin: 20px 0;
                }

                .tab-btn {
                    padding: 12px 24px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-weight: 500;
                    color: #6b7280;
                    border-bottom: 2px solid transparent;
                    transition: all 0.3s ease;
                }

                .tab-btn.active {
                    color: #3b82f6;
                    border-bottom-color: #3b82f6;
                }

                .tab-content {
                    display: none;
                }

                .tab-content.active {
                    display: block;
                }

                .sales-table-container {
                    overflow-x: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .sales-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                }

                .sales-table th,
                .sales-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }

                .sales-table th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #374151;
                }

                .sales-table tr:hover {
                    background: #f9fafb;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8em;
                    font-weight: 500;
                }

                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-paid {
                    background: #d1fae5;
                    color: #065f46;
                }

                .action-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8em;
                    margin-right: 5px;
                }

                .btn-pay {
                    background: #10b981;
                    color: white;
                }

                .btn-edit {
                    background: #3b82f6;
                    color: white;
                }

                .payout-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 10px 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #10b981;
                }

                .charts-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }

                .chart-container {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .performer-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .performer-name {
                    font-weight: 500;
                }

                .performer-earnings {
                    color: #10b981;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .commission-summary {
                        grid-template-columns: 1fr;
                    }

                    .commission-controls {
                        flex-direction: column;
                    }

                    .charts-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindCommissionEvents() {
        // Add to navigation if sidebar exists
        const sidebar = document.querySelector('.sidebar-nav') || document.querySelector('.nav-menu');
        if (sidebar) {
            const commissionNavItem = `
                <li class="nav-item">
                    <a href="#" onclick="commissionManager.showCommissionModule()" class="nav-link">
                        📊 Commission Management
                    </a>
                </li>
            `;
            sidebar.insertAdjacentHTML('beforeend', commissionNavItem);
        }
    }

    showCommissionModule() {
        // Hide other modules
        document.querySelectorAll('.module-container').forEach(module => {
            module.style.display = 'none';
        });

        // Show commission module
        const commissionModule = document.getElementById('commission-management');
        if (commissionModule) {
            commissionModule.style.display = 'block';
            this.refreshCommissionData();
        }
    }

    loadSalesData() {
        // Load existing sales data or create sample data
        const savedData = localStorage.getItem('dwc_sales_records');
        if (savedData) {
            this.salesRecords = JSON.parse(savedData);
        } else {
            // Create sample sales data
            this.salesRecords = [
                {
                    id: 'sale_001',
                    date: new Date().toISOString().split('T')[0],
                    salesPerson: 'John Smith',
                    client: 'TechCorp Solutions',
                    saleAmount: 15000,
                    commission: 1350, // 90% of 1500 (10% commission)
                    overhead: 150, // 10% of 1500
                    status: 'pending',
                    commissionRate: 10
                },
                {
                    id: 'sale_002',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    salesPerson: 'Sarah Johnson',
                    client: 'MegaCorp Industries',
                    saleAmount: 25000,
                    commission: 2250, // 90% of 2500
                    overhead: 250, // 10% of 2500
                    status: 'paid',
                    commissionRate: 10
                }
            ];
            this.saveSalesData();
        }

        // Load payout history
        const savedPayouts = localStorage.getItem('dwc_payout_history');
        if (savedPayouts) {
            this.payoutHistory = JSON.parse(savedPayouts);
        }
    }

    saveSalesData() {
        localStorage.setItem('dwc_sales_records', JSON.stringify(this.salesRecords));
        localStorage.setItem('dwc_payout_history', JSON.stringify(this.payoutHistory));
    }

    addSale() {
        const saleData = this.promptForSaleData();
        if (saleData) {
            const totalCommission = saleData.saleAmount * (saleData.commissionRate / 100);
            const salesPersonCommission = totalCommission * 0.9; // 90%
            const overheadAmount = totalCommission * 0.1; // 10%

            const newSale = {
                id: 'sale_' + Date.now(),
                date: saleData.date,
                salesPerson: saleData.salesPerson,
                client: saleData.client,
                saleAmount: saleData.saleAmount,
                commission: salesPersonCommission,
                overhead: overheadAmount,
                status: 'pending',
                commissionRate: saleData.commissionRate
            };

            this.salesRecords.push(newSale);
            this.saveSalesData();
            this.refreshCommissionData();
            
            console.log('[COMMISSION] New sale recorded:', newSale);
        }
    }

    promptForSaleData() {
        const salesPerson = prompt('Sales Person Name:');
        if (!salesPerson) return null;

        const client = prompt('Client Name:');
        if (!client) return null;

        const saleAmount = parseFloat(prompt('Sale Amount ($):'));
        if (!saleAmount || saleAmount <= 0) return null;

        const commissionRate = parseFloat(prompt('Commission Rate (%):') || '10');
        if (commissionRate <= 0 || commissionRate > 100) return null;

        const date = prompt('Sale Date (YYYY-MM-DD):') || new Date().toISOString().split('T')[0];

        return {
            salesPerson,
            client,
            saleAmount,
            commissionRate,
            date
        };
    }

    processPayouts() {
        const pendingSales = this.salesRecords.filter(sale => sale.status === 'pending');
        
        if (pendingSales.length === 0) {
            alert('No pending payouts to process.');
            return;
        }

        const confirm = window.confirm(`Process ${pendingSales.length} pending payouts?`);
        if (confirm) {
            const payoutBatch = {
                id: 'payout_' + Date.now(),
                date: new Date().toISOString(),
                sales: pendingSales.map(sale => sale.id),
                totalAmount: pendingSales.reduce((sum, sale) => sum + sale.commission, 0),
                overheadAmount: pendingSales.reduce((sum, sale) => sum + sale.overhead, 0)
            };

            // Mark sales as paid
            pendingSales.forEach(sale => {
                sale.status = 'paid';
                sale.paidDate = new Date().toISOString();
            });

            this.payoutHistory.push(payoutBatch);
            this.saveSalesData();
            this.refreshCommissionData();

            alert(`Successfully processed payouts totaling $${payoutBatch.totalAmount.toFixed(2)}`);
        }
    }

    refreshCommissionData() {
        this.updateSummaryCards();
        this.populateSalesTable();
        this.populatePayoutHistory();
        this.updateAnalytics();
    }

    updateSummaryCards() {
        const totalCommissions = this.salesRecords.reduce((sum, sale) => sum + sale.commission, 0);
        const pendingPayouts = this.salesRecords
            .filter(sale => sale.status === 'pending')
            .reduce((sum, sale) => sum + sale.commission, 0);
        const overheadCollected = this.salesRecords.reduce((sum, sale) => sum + sale.overhead, 0);

        document.getElementById('total-commissions').textContent = `$${totalCommissions.toFixed(2)}`;
        document.getElementById('pending-payouts').textContent = `$${pendingPayouts.toFixed(2)}`;
        document.getElementById('overhead-collected').textContent = `$${overheadCollected.toFixed(2)}`;
    }

    populateSalesTable() {
        const tbody = document.getElementById('sales-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.salesRecords.map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.salesPerson}</td>
                <td>${sale.client}</td>
                <td>$${sale.saleAmount.toLocaleString()}</td>
                <td>$${sale.commission.toFixed(2)}</td>
                <td>$${sale.overhead.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${sale.status}">
                        ${sale.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    ${sale.status === 'pending' ? `
                        <button class="action-btn btn-pay" onclick="commissionManager.paySingle('${sale.id}')">
                            Pay
                        </button>
                    ` : ''}
                    <button class="action-btn btn-edit" onclick="commissionManager.editSale('${sale.id}')">
                        Edit
                    </button>
                </td>
            </tr>
        `).join('');
    }

    populatePayoutHistory() {
        const payoutsList = document.getElementById('payouts-list');
        if (!payoutsList) return;

        payoutsList.innerHTML = this.payoutHistory.map(payout => `
            <div class="payout-card">
                <div class="payout-header">
                    <h4>Payout ${payout.id}</h4>
                    <span>${new Date(payout.date).toLocaleDateString()}</span>
                </div>
                <div class="payout-details">
                    <p><strong>Sales Processed:</strong> ${payout.sales.length}</p>
                    <p><strong>Total Commissions:</strong> $${payout.totalAmount.toFixed(2)}</p>
                    <p><strong>Overhead Collected:</strong> $${payout.overheadAmount.toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }

    updateAnalytics() {
        this.updateTopPerformers();
        // Chart implementation would go here
    }

    updateTopPerformers() {
        const performersList = document.getElementById('top-performers-list');
        if (!performersList) return;

        // Calculate earnings by sales person
        const performerEarnings = {};
        this.salesRecords.forEach(sale => {
            if (!performerEarnings[sale.salesPerson]) {
                performerEarnings[sale.salesPerson] = 0;
            }
            performerEarnings[sale.salesPerson] += sale.commission;
        });

        // Sort by earnings
        const sortedPerformers = Object.entries(performerEarnings)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        performersList.innerHTML = sortedPerformers.map(([name, earnings]) => `
            <div class="performer-item">
                <span class="performer-name">${name}</span>
                <span class="performer-earnings">$${earnings.toFixed(2)}</span>
            </div>
        `).join('');
    }

    paySingle(saleId) {
        const sale = this.salesRecords.find(s => s.id === saleId);
        if (sale && sale.status === 'pending') {
            sale.status = 'paid';
            sale.paidDate = new Date().toISOString();
            
            const payout = {
                id: 'payout_' + Date.now(),
                date: new Date().toISOString(),
                sales: [saleId],
                totalAmount: sale.commission,
                overheadAmount: sale.overhead
            };
            
            this.payoutHistory.push(payout);
            this.saveSalesData();
            this.refreshCommissionData();
            
            alert(`Paid $${sale.commission.toFixed(2)} to ${sale.salesPerson}`);
        }
    }

    editSale(saleId) {
        const sale = this.salesRecords.find(s => s.id === saleId);
        if (sale) {
            const newAmount = parseFloat(prompt('New Sale Amount:', sale.saleAmount));
            if (newAmount && newAmount > 0) {
                const totalCommission = newAmount * (sale.commissionRate / 100);
                sale.saleAmount = newAmount;
                sale.commission = totalCommission * 0.9;
                sale.overhead = totalCommission * 0.1;
                
                this.saveSalesData();
                this.refreshCommissionData();
            }
        }
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(`${tabName}-tab`);
        const selectedBtn = event.target;
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
    }

    exportReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalSales: this.salesRecords.length,
                totalCommissions: this.salesRecords.reduce((sum, sale) => sum + sale.commission, 0),
                totalOverhead: this.salesRecords.reduce((sum, sale) => sum + sale.overhead, 0),
                pendingPayouts: this.salesRecords.filter(sale => sale.status === 'pending').length
            },
            salesRecords: this.salesRecords,
            payoutHistory: this.payoutHistory
        };

        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `commission_report_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Initialize commission manager
const commissionManager = new CommissionManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.commissionManager = commissionManager;
}

console.log('[COMMISSION] Commission Management System loaded - 90% to sales, 10% overhead');