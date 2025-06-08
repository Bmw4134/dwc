import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard,
  Car,
  Building,
  Target,
  Calculator,
  Zap,
  Shield
} from 'lucide-react';

interface FinancialCommandCenterProps {
  refreshTrigger: number;
}

export default function FinancialCommandCenter({ refreshTrigger }: FinancialCommandCenterProps) {
  const [locAmount, setLocAmount] = useState(250000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(75000);
  const [wifeCarBalance, setWifeCarBalance] = useState(18000);
  const [newCarBudget, setNewCarBudget] = useState(35000);
  const [personalDebt, setPersonalDebt] = useState(25000);

  // Strategic allocation calculations
  const emergencyFund = Math.min(locAmount * 0.15, 50000);
  const debtPayoff = wifeCarBalance + personalDebt;
  const businessReinvestment = locAmount * 0.40;
  const revenueInvestment = locAmount * 0.25;
  const personalRewards = newCarBudget;
  const locReserve = locAmount - (emergencyFund + debtPayoff + businessReinvestment + revenueInvestment + personalRewards);

  const monthlyLocPayment = (locAmount * 0.08) / 12; // 8% annual rate
  const projectedROI = monthlyRevenue * 0.30; // 30% profit margin
  const locPayoffMonths = Math.ceil(locAmount / (projectedROI - monthlyLocPayment));

  const investmentStrategies = [
    {
      strategy: 'High-Yield Business Accounts',
      allocation: 25000,
      expectedReturn: '4.5% APY',
      risk: 'Low',
      purpose: 'Emergency fund with guaranteed returns'
    },
    {
      strategy: 'Client Acquisition Marketing',
      allocation: 50000,
      expectedReturn: '300% ROI',
      risk: 'Medium',
      purpose: 'Direct revenue generation'
    },
    {
      strategy: 'Automation Infrastructure',
      allocation: 75000,
      expectedReturn: '500% ROI',
      risk: 'Low',
      purpose: 'Scalable business systems'
    },
    {
      strategy: 'Treasury Bills (3-month)',
      allocation: 30000,
      expectedReturn: '5.2% APY',
      risk: 'Very Low',
      purpose: 'Stable short-term growth'
    }
  ];

  const debtEliminationPlan = [
    {
      debt: "Wife's Car Loan",
      balance: wifeCarBalance,
      rate: '6.5%',
      payment: 'Pay off immediately',
      savings: '$175/month in interest'
    },
    {
      debt: 'Personal Credit Cards',
      balance: personalDebt,
      rate: '18.9%',
      payment: 'Pay off immediately',
      savings: '$394/month in interest'
    },
    {
      debt: 'Line of Credit',
      balance: locAmount,
      rate: '8.0%',
      payment: `$${Math.round(projectedROI).toLocaleString()}/month from profits`,
      savings: `Payoff in ${locPayoffMonths} months`
    }
  ];

  const revenueMultipliers = [
    {
      action: 'Hire 2 Sales Reps',
      investment: 25000,
      monthlyIncrease: 15000,
      paybackMonths: 1.7
    },
    {
      action: 'Advanced AI Tools',
      investment: 15000,
      monthlyIncrease: 8000,
      paybackMonths: 1.9
    },
    {
      action: 'Marketing Automation',
      investment: 20000,
      monthlyIncrease: 12000,
      paybackMonths: 1.7
    },
    {
      action: 'Premium Software Stack',
      investment: 10000,
      monthlyIncrease: 5000,
      paybackMonths: 2.0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Command Center
          </h1>
          <p className="text-xl text-gray-600">
            Strategic wealth building plan for DWC Systems LLC
          </p>
        </div>

        <Tabs defaultValue="allocation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="allocation">Smart Allocation</TabsTrigger>
            <TabsTrigger value="debt">Debt Elimination</TabsTrigger>
            <TabsTrigger value="investment">Investment Strategy</TabsTrigger>
            <TabsTrigger value="scaling">Revenue Scaling</TabsTrigger>
          </TabsList>

          <TabsContent value="allocation" className="space-y-6">
            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Financial Parameters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Line of Credit Amount</label>
                    <Input
                      type="number"
                      value={locAmount}
                      onChange={(e) => setLocAmount(Number(e.target.value))}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Monthly Revenue Goal</label>
                    <Input
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Wife's Car Balance</label>
                    <Input
                      type="number"
                      value={wifeCarBalance}
                      onChange={(e) => setWifeCarBalance(Number(e.target.value))}
                      className="text-lg font-semibold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Allocation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Emergency Fund</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    ${emergencyFund.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-600">15% of LOC - Business protection</p>
                  <div className="mt-3">
                    <div className="text-xs text-green-600 mb-1">High-yield savings: 4.5% APY</div>
                    <Progress value={100} className="h-2 bg-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-red-600" />
                    <span>Debt Elimination</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-700 mb-2">
                    ${debtPayoff.toLocaleString()}
                  </div>
                  <p className="text-sm text-red-600">Clear all personal debt immediately</p>
                  <div className="mt-3">
                    <div className="text-xs text-red-600 mb-1">Saves $569/month in interest</div>
                    <Progress value={100} className="h-2 bg-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Business Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    ${businessReinvestment.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-600">40% for scaling operations</p>
                  <div className="mt-3">
                    <div className="text-xs text-blue-600 mb-1">Expected ROI: 300-500%</div>
                    <Progress value={100} className="h-2 bg-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span>Revenue Investment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    ${revenueInvestment.toLocaleString()}
                  </div>
                  <p className="text-sm text-purple-600">25% for immediate income generation</p>
                  <div className="mt-3">
                    <div className="text-xs text-purple-600 mb-1">Target: +$40K/month revenue</div>
                    <Progress value={100} className="h-2 bg-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Car className="h-5 w-5 text-yellow-600" />
                    <span>Personal Rewards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-700 mb-2">
                    ${personalRewards.toLocaleString()}
                  </div>
                  <p className="text-sm text-yellow-600">Your new car - well deserved</p>
                  <div className="mt-3">
                    <div className="text-xs text-yellow-600 mb-1">Motivation & lifestyle upgrade</div>
                    <Progress value={100} className="h-2 bg-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <PiggyBank className="h-5 w-5 text-gray-600" />
                    <span>Strategic Reserve</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-700 mb-2">
                    ${locReserve.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Opportunities & contingencies</p>
                  <div className="mt-3">
                    <div className="text-xs text-gray-600 mb-1">Flexible deployment</div>
                    <Progress value={100} className="h-2 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LOC Payoff Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Line of Credit Payoff Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${Math.round(projectedROI).toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Monthly Profit Target</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${Math.round(monthlyLocPayment).toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Monthly LOC Payment</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{locPayoffMonths} months</div>
                    <p className="text-sm text-gray-600">Complete Payoff Timeline</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Success Formula:</h4>
                  <p className="text-sm text-green-800">
                    Generate <strong>${Math.round(projectedROI).toLocaleString()}/month profit</strong> → 
                    Pay LOC <strong>${Math.round(monthlyLocPayment).toLocaleString()}/month</strong> → 
                    Keep <strong>${Math.round(projectedROI - monthlyLocPayment).toLocaleString()}/month</strong> for growth → 
                    <strong>Debt-free in {locPayoffMonths} months</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debt" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Debt Elimination Roadmap</CardTitle>
                <CardDescription>
                  Clear all personal debt immediately, then systematically pay off business debt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {debtEliminationPlan.map((debt, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{debt.debt}</h3>
                        <Badge variant={index === 2 ? 'default' : 'destructive'}>
                          {debt.rate} interest
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Current Balance</p>
                          <p className="text-xl font-bold">${debt.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Strategy</p>
                          <p className="font-medium">{debt.payment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Savings</p>
                          <p className="font-medium text-green-600">{debt.savings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Financial Freedom Timeline:</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div>• <strong>Day 1:</strong> Pay off Christina's car and personal debt (${debtPayoff.toLocaleString()})</div>
                    <div>• <strong>Month 1:</strong> Save $569/month in interest payments</div>
                    <div>• <strong>Month {locPayoffMonths}:</strong> Complete LOC payoff</div>
                    <div>• <strong>Beyond:</strong> 100% debt-free with growing business income</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investmentStrategies.map((strategy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                    <CardDescription>{strategy.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Investment Amount</span>
                        <span className="font-bold text-lg">${strategy.allocation.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Expected Return</span>
                        <span className="font-semibold text-green-600">{strategy.expectedReturn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <Badge variant={strategy.risk === 'Low' ? 'secondary' : 
                                      strategy.risk === 'Medium' ? 'default' : 'destructive'}>
                          {strategy.risk}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scaling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Revenue Multiplication Strategy</span>
                </CardTitle>
                <CardDescription>
                  Smart investments that immediately increase monthly income
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueMultipliers.map((multiplier, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{multiplier.action}</h3>
                        <Badge className="bg-green-600">
                          {multiplier.paybackMonths.toFixed(1)} month payback
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Investment Required</p>
                          <p className="text-xl font-bold">${multiplier.investment.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Revenue Increase</p>
                          <p className="text-xl font-bold text-green-600">+${multiplier.monthlyIncrease.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Impact</p>
                          <p className="text-xl font-bold text-purple-600">
                            +${(multiplier.monthlyIncrease * 12).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Combined Impact:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-purple-600">Total Investment</p>
                      <p className="text-2xl font-bold text-purple-700">
                        ${revenueMultipliers.reduce((sum, m) => sum + m.investment, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Monthly Revenue Boost</p>
                      <p className="text-2xl font-bold text-green-600">
                        +${revenueMultipliers.reduce((sum, m) => sum + m.monthlyIncrease, 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">New Monthly Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(monthlyRevenue + revenueMultipliers.reduce((sum, m) => sum + m.monthlyIncrease, 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}