import React, { useEffect, useState, memo } from 'react';
import { ModuleBase, useSafeModule, type ModuleProps } from '../ModuleBase';

interface AuditResult {
  category: string;
  passed: boolean;
  score: number;
  details: string[];
}

const AuditModule = memo(function AuditModule(props: ModuleProps) {
  const { addTimer, addInterval, updateStatus, addLog, canUpdate } = useSafeModule(props.moduleId, props);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [currentCheck, setCurrentCheck] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (props.status === 'running') {
      performAudit();
    }
  }, [props.status]);

  const performAudit = async () => {
    if (!canUpdate()) return;

    updateStatus('running');
    addLog('Starting comprehensive platform audit');
    
    const auditCategories = [
      { name: 'DOM Integrity', weight: 0.25 },
      { name: 'KPI Validation', weight: 0.25 },
      { name: 'Module Detection', weight: 0.25 },
      { name: 'System Health', weight: 0.25 }
    ];

    const results: AuditResult[] = [];
    
    for (let i = 0; i < auditCategories.length; i++) {
      const category = auditCategories[i];
      setCurrentCheck(category.name);
      setProgress((i / auditCategories.length) * 100);
      
      await new Promise(resolve => addTimer(resolve, 1000));
      
      const result = await auditCategory(category.name);
      results.push(result);
      
      addLog(`${category.name}: ${result.passed ? 'PASS' : 'FAIL'} (${result.score}%)`);
    }

    setAuditResults(results);
    setProgress(100);
    setCurrentCheck('Audit Complete');
    
    const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const allPassed = results.every(r => r.passed);
    
    updateStatus(allPassed ? 'complete' : 'error');
    addLog(`Audit completed: ${overallScore.toFixed(1)}% overall score`);
  };

  const auditCategory = async (category: string): Promise<AuditResult> => {
    const details: string[] = [];
    let score = 0;
    let passed = false;

    switch (category) {
      case 'DOM Integrity':
        const domElements = document.querySelectorAll('.kpi-value, .module-item, .sidebar-item');
        const validElements = Array.from(domElements).filter(el => el.textContent && el.textContent !== 'NaN');
        score = domElements.length > 0 ? (validElements.length / domElements.length) * 100 : 0;
        passed = score >= 90;
        details.push(`${validElements.length}/${domElements.length} elements valid`);
        break;

      case 'KPI Validation':
        const kpiElements = document.querySelectorAll('[data-metric], .kpi-value');
        const validKPIs = Array.from(kpiElements).filter(el => {
          const text = el.textContent?.trim();
          return text && !text.includes('NaN') && !text.includes('undefined');
        });
        score = kpiElements.length > 0 ? (validKPIs.length / kpiElements.length) * 100 : 0;
        passed = score >= 95;
        details.push(`${validKPIs.length}/${kpiElements.length} KPIs valid`);
        break;

      case 'Module Detection':
        const modules = document.querySelectorAll('.module-item, [data-module]');
        score = modules.length >= 20 ? 100 : (modules.length / 20) * 100;
        passed = modules.length >= 20;
        details.push(`${modules.length} modules detected`);
        break;

      case 'System Health':
        try {
          const response = await fetch('/health');
          if (response.ok) {
            score = 100;
            passed = true;
            details.push('Health endpoint responsive');
          } else {
            score = 50;
            passed = false;
            details.push('Health endpoint error');
          }
        } catch (error) {
          score = 0;
          passed = false;
          details.push('Health endpoint unreachable');
        }
        break;
    }

    return { category, passed, score, details };
  };

  return (
    <ModuleBase moduleId={props.moduleId} title="System Audit Module">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Progress</span>
          <span className="text-sm font-mono text-blue-400">{progress.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {currentCheck && (
          <div className="text-sm text-gray-400">
            Current: {currentCheck}
          </div>
        )}

        <div className="space-y-2">
          {auditResults.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
              <span className="text-sm">{result.category}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono">{result.score.toFixed(0)}%</span>
                <span className={`text-sm ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {result.passed ? '✓' : '✗'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {auditResults.length > 0 && (
          <div className="text-xs text-gray-500 space-y-1">
            {auditResults.flatMap(r => r.details).map((detail, i) => (
              <div key={i}>• {detail}</div>
            ))}
          </div>
        )}
      </div>
    </ModuleBase>
  );
});

export default AuditModule;