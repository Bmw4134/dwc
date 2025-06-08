import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign, Target, ExternalLink, RefreshCw } from 'lucide-react';
import { getMarketResearch, getCompetitorAnalysis, getLocalMarketData, getAutomationOpportunities } from '@/lib/perplexity';

interface MarketResearchProps {
  refreshTrigger: number;
}

export default function MarketResearch({ refreshTrigger }: MarketResearchProps) {
  const [selectedIndustry, setSelectedIndustry] = useState('restaurants');
  const [selectedZipCode, setSelectedZipCode] = useState('76140');
  const [businessName, setBusinessName] = useState('');

  const marketResearchQuery = useQuery({
    queryKey: ['market-research', selectedIndustry, refreshTrigger],
    queryFn: () => getMarketResearch(selectedIndustry),
    enabled: !!selectedIndustry,
  });

  const localDataQuery = useQuery({
    queryKey: ['local-market', selectedZipCode, refreshTrigger],
    queryFn: () => getLocalMarketData(selectedZipCode),
    enabled: !!selectedZipCode,
  });

  const competitorQuery = useQuery({
    queryKey: ['competitors', businessName, selectedIndustry, refreshTrigger],
    queryFn: () => getCompetitorAnalysis(businessName, selectedIndustry),
    enabled: !!businessName && !!selectedIndustry,
  });

  const automationQuery = useQuery({
    queryKey: ['automation-opportunities', selectedIndustry, refreshTrigger],
    queryFn: () => getAutomationOpportunities(selectedIndustry, 25),
    enabled: !!selectedIndustry,
  });

  const industries = [
    'restaurants', 'retail', 'healthcare', 'manufacturing', 'professional-services',
    'real-estate', 'automotive', 'fitness', 'beauty', 'education'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Market Research Intelligence</h1>
          <p className="text-muted-foreground">Real-time market data and competitor analysis powered by AI</p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Target Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ZIP Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={selectedZipCode}
              onChange={(e) => setSelectedZipCode(e.target.value)}
              placeholder="Enter ZIP code"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Business Name (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="market-overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="market-overview">Market Overview</TabsTrigger>
          <TabsTrigger value="local-data">Local Market</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="market-overview" className="space-y-4">
          {marketResearchQuery.isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : marketResearchQuery.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Market Size</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketResearchQuery.data.marketSize}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">{marketResearchQuery.data.growthRate}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Competitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{marketResearchQuery.data.competitorCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Automation Savings</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">{marketResearchQuery.data.avgAutomationSavings}</div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {marketResearchQuery.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Market Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {marketResearchQuery.data.keyTrends.map((trend, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {trend}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Pain Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {marketResearchQuery.data.painPoints.map((pain, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-destructive rounded-full"></div>
                      <span className="text-sm">{pain}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {marketResearchQuery.data?.citations && marketResearchQuery.data.citations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {marketResearchQuery.data.citations.slice(0, 3).map((citation, index) => (
                    <a
                      key={index}
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {citation}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="local-data" className="space-y-4">
          {localDataQuery.isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : localDataQuery.data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Businesses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{localDataQuery.data.businessCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Median Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{localDataQuery.data.economicIndicators.medianIncome}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Business Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-chart-1">{localDataQuery.data.economicIndicators.businessGrowth}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {localDataQuery.data.industryBreakdown.map((industry, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium">{industry.industry}</span>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{industry.percentage}</Badge>
                          <span className="text-sm text-muted-foreground">Avg: {industry.avgEmployees} employees</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          {businessName ? (
            competitorQuery.isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-48">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : competitorQuery.data ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Analysis for {businessName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competitorQuery.data.competitors.map((competitor, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{competitor.name}</h4>
                            <Badge variant="outline">{competitor.marketShare} market share</Badge>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">Automation Level: </span>
                            <Badge 
                              variant={competitor.automationLevel === 'high' ? 'destructive' : 
                                      competitor.automationLevel === 'medium' ? 'default' : 'secondary'}
                            >
                              {competitor.automationLevel}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Weaknesses:</span>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {competitor.weaknesses.map((weakness, idx) => (
                                <li key={idx}>{weakness}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {competitorQuery.data.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                          <span className="text-sm">{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-muted-foreground">Enter a business name to see competitor analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          {automationQuery.isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : automationQuery.data ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Potential Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-1">{automationQuery.data.totalPotentialSavings}</div>
                  <p className="text-muted-foreground">of current operational costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Automation Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {automationQuery.data.opportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{opportunity.process}</h4>
                          <Badge variant="secondary">{opportunity.savings} savings</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Difficulty: <Badge variant="outline">{opportunity.difficulty}</Badge></span>
                          <span>Timeline: {opportunity.timeToImplement}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}