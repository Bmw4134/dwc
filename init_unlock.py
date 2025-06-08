#!/usr/bin/env python3
"""
Watson DW Unlock Protocol - Final Test Initialization
Validates TRD handlers, module access, and UI readiness across all dashboards
"""
import requests
import json
import time
import sys
from datetime import datetime

class WatsonUnlockValidator:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.test_results = {}
        self.validation_log = []
        
    def log_test(self, test_name, status, details=""):
        """Log test results with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.validation_log.append({
            "timestamp": timestamp,
            "test": test_name,
            "status": status,
            "details": details
        })
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"[{timestamp}] {status_icon} {test_name}: {status}")
        if details:
            print(f"    └─ {details}")
    
    def test_watson_unlock_api(self):
        """Test Watson DW unlock protocol API endpoints"""
        print("\n🔓 Testing Watson DW Unlock Protocol APIs...")
        
        try:
            # Test unlock status endpoint
            response = requests.get(f"{self.base_url}/api/watson/unlock-status")
            if response.status_code == 200:
                status_data = response.json()
                self.log_test("Unlock Status API", "PASS", f"Protocol Active: {status_data.get('protocolActive', False)}")
                self.test_results['unlock_status'] = status_data
            else:
                self.log_test("Unlock Status API", "FAIL", f"HTTP {response.status_code}")
                
            # Test TRD handlers endpoint
            response = requests.get(f"{self.base_url}/api/watson/trd-handlers")
            if response.status_code == 200:
                handlers_data = response.json()
                handler_count = handlers_data.get('total', 0)
                self.log_test("TRD Handlers API", "PASS", f"Found {handler_count} handlers")
                self.test_results['trd_handlers'] = handlers_data
            else:
                self.log_test("TRD Handlers API", "FAIL", f"HTTP {response.status_code}")
                
            # Test restricted modules endpoint
            response = requests.get(f"{self.base_url}/api/watson/restricted-modules")
            if response.status_code == 200:
                modules_data = response.json()
                module_count = modules_data.get('total', 0)
                self.log_test("Restricted Modules API", "PASS", f"Found {module_count} modules")
                self.test_results['restricted_modules'] = modules_data
            else:
                self.log_test("Restricted Modules API", "FAIL", f"HTTP {response.status_code}")
                
            # Test intelligence core endpoint
            response = requests.get(f"{self.base_url}/api/watson/intelligence-core")
            if response.status_code == 200:
                core_data = response.json()
                clearance = core_data.get('clearanceLevel', 'unknown')
                self.log_test("Intelligence Core API", "PASS", f"Clearance: {clearance}")
                self.test_results['intelligence_core'] = core_data
            else:
                self.log_test("Intelligence Core API", "FAIL", f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Watson API Test", "FAIL", f"Connection error: {str(e)}")
    
    def test_dashboard_access(self):
        """Test access to all dashboard endpoints"""
        print("\n📊 Testing Dashboard Access...")
        
        dashboard_endpoints = [
            "/api/infinity/system-status",
            "/api/kaizen/deployment-status", 
            "/api/kaizen/introspection",
            "/api/kaizen/watson-console",
            "/api/admin/system-status",
            "/api/admin/automation-tasks",
            "/api/system/metrics",
            "/api/layer-chart/live-report",
            "/api/layer-chart/active-goals"
        ]
        
        accessible_dashboards = 0
        for endpoint in dashboard_endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}")
                if response.status_code == 200:
                    accessible_dashboards += 1
                    self.log_test(f"Dashboard Access - {endpoint.split('/')[-1]}", "PASS")
                else:
                    self.log_test(f"Dashboard Access - {endpoint.split('/')[-1]}", "FAIL", f"HTTP {response.status_code}")
            except Exception as e:
                self.log_test(f"Dashboard Access - {endpoint.split('/')[-1]}", "FAIL", f"Error: {str(e)}")
        
        if accessible_dashboards >= len(dashboard_endpoints) * 0.8:  # 80% success rate
            self.log_test("Overall Dashboard Access", "PASS", f"{accessible_dashboards}/{len(dashboard_endpoints)} accessible")
        else:
            self.log_test("Overall Dashboard Access", "FAIL", f"Only {accessible_dashboards}/{len(dashboard_endpoints)} accessible")
    
    def execute_unlock_protocol(self):
        """Execute the actual unlock protocol with DW credentials"""
        print("\n🔑 Executing Watson DW Unlock Protocol...")
        
        # DW credentials for unlock protocol
        unlock_credentials = {
            "username": "watson",
            "passcode": "quantum2024",
            "adminFingerprint": "DW_SYSTEMS_LLC_MAXIMUM_CLEARANCE"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/watson/execute-unlock-protocol",
                json=unlock_credentials,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                unlock_result = response.json()
                if unlock_result.get('success', False):
                    self.log_test("Unlock Protocol Execution", "PASS", "Maximum clearance granted")
                    self.test_results['unlock_execution'] = unlock_result
                    
                    # Wait for system sync
                    time.sleep(2)
                    
                    # Re-test unlock status after execution
                    status_response = requests.get(f"{self.base_url}/api/watson/unlock-status")
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        if status_data.get('protocolActive', False):
                            self.log_test("Post-Unlock Status Validation", "PASS", "Protocol now active")
                        else:
                            self.log_test("Post-Unlock Status Validation", "FAIL", "Protocol not activated")
                else:
                    self.log_test("Unlock Protocol Execution", "FAIL", unlock_result.get('error', 'Unknown error'))
            else:
                self.log_test("Unlock Protocol Execution", "FAIL", f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Unlock Protocol Execution", "FAIL", f"Request error: {str(e)}")
    
    def validate_trd_handlers(self):
        """Validate TRD handler override functionality"""
        print("\n⚡ Validating TRD Handler Overrides...")
        
        try:
            response = requests.get(f"{self.base_url}/api/watson/trd-handlers")
            if response.status_code == 200:
                handlers_data = response.json()
                handlers = handlers_data.get('handlers', [])
                
                override_handlers = [h for h in handlers if h.get('override', False)]
                restricted_handlers = [h for h in handlers if h.get('restricted', False)]
                
                self.log_test("TRD Override Handlers", "PASS" if override_handlers else "FAIL", 
                            f"Found {len(override_handlers)} override handlers")
                self.log_test("TRD Restricted Handlers", "PASS" if restricted_handlers else "FAIL",
                            f"Found {len(restricted_handlers)} restricted handlers")
                
                # Validate handler priorities
                priorities = [h.get('priority', 0) for h in handlers]
                if len(set(priorities)) == len(priorities):  # All unique priorities
                    self.log_test("TRD Handler Priorities", "PASS", "All handlers have unique priorities")
                else:
                    self.log_test("TRD Handler Priorities", "WARN", "Some handlers share priorities")
                    
        except Exception as e:
            self.log_test("TRD Handler Validation", "FAIL", f"Error: {str(e)}")
    
    def validate_module_access(self):
        """Validate unrestricted module access"""
        print("\n🔐 Validating Module Access...")
        
        try:
            response = requests.get(f"{self.base_url}/api/watson/restricted-modules")
            if response.status_code == 200:
                modules_data = response.json()
                modules = modules_data.get('modules', [])
                
                critical_modules = [
                    'admin_panel_access',
                    'database_direct_access', 
                    'system_configuration',
                    'watson_intelligence_core'
                ]
                
                found_critical = [m for m in modules if m in critical_modules]
                
                if len(found_critical) == len(critical_modules):
                    self.log_test("Critical Module Access", "PASS", "All critical modules present")
                else:
                    missing = set(critical_modules) - set(found_critical)
                    self.log_test("Critical Module Access", "FAIL", f"Missing: {', '.join(missing)}")
                
                self.log_test("Total Restricted Modules", "PASS", f"Managing {len(modules)} modules")
                
        except Exception as e:
            self.log_test("Module Access Validation", "FAIL", f"Error: {str(e)}")
    
    def validate_ui_readiness(self):
        """Validate UI component readiness and responsiveness"""
        print("\n🖥️  Validating UI Component Readiness...")
        
        # Test main application endpoint
        try:
            response = requests.get(f"{self.base_url}/")
            if response.status_code == 200:
                self.log_test("Main UI Endpoint", "PASS", "Application serving successfully")
            else:
                self.log_test("Main UI Endpoint", "FAIL", f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Main UI Endpoint", "FAIL", f"Connection error: {str(e)}")
        
        # Test component-specific endpoints
        ui_endpoints = [
            "/api/watson/business-valuation",
            "/api/watson/valuation-realtime", 
            "/api/dashboard/stats",
            "/api/leads"
        ]
        
        responsive_endpoints = 0
        for endpoint in ui_endpoints:
            try:
                start_time = time.time()
                response = requests.get(f"{self.base_url}{endpoint}")
                response_time = (time.time() - start_time) * 1000  # ms
                
                if response.status_code == 200 and response_time < 1000:  # Under 1 second
                    responsive_endpoints += 1
                    self.log_test(f"UI Component - {endpoint.split('/')[-1]}", "PASS", f"{response_time:.0f}ms")
                else:
                    self.log_test(f"UI Component - {endpoint.split('/')[-1]}", "FAIL", 
                                f"HTTP {response.status_code} ({response_time:.0f}ms)")
            except Exception as e:
                self.log_test(f"UI Component - {endpoint.split('/')[-1]}", "FAIL", f"Error: {str(e)}")
        
        ui_readiness_score = (responsive_endpoints / len(ui_endpoints)) * 100
        if ui_readiness_score >= 80:
            self.log_test("UI Readiness Score", "PASS", f"{ui_readiness_score:.0f}% responsive")
        else:
            self.log_test("UI Readiness Score", "FAIL", f"Only {ui_readiness_score:.0f}% responsive")
    
    def generate_final_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*60)
        print("🎯 WATSON DW UNLOCK PROTOCOL - FINAL TEST REPORT")
        print("="*60)
        
        total_tests = len(self.validation_log)
        passed_tests = len([t for t in self.validation_log if t['status'] == 'PASS'])
        failed_tests = len([t for t in self.validation_log if t['status'] == 'FAIL'])
        warned_tests = len([t for t in self.validation_log if t['status'] == 'WARN'])
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests} ✅")
        print(f"   Failed: {failed_tests} ❌")
        print(f"   Warnings: {warned_tests} ⚠️")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        print(f"\n🔓 Protocol Status:")
        unlock_status = self.test_results.get('unlock_status', {})
        print(f"   Protocol Active: {unlock_status.get('protocolActive', False)}")
        print(f"   Watson Authenticated: {unlock_status.get('watsonAuthenticated', False)}")
        print(f"   Clearance Level: {unlock_status.get('clearanceLevel', 'unknown').upper()}")
        print(f"   TRD Handlers: {unlock_status.get('trdHandlersCount', 0)}")
        print(f"   Restricted Modules: {unlock_status.get('restrictedModulesCount', 0)}")
        
        if success_rate >= 90:
            print(f"\n🚀 UNLOCK PROTOCOL: FULLY OPERATIONAL")
            print(f"   All systems validated and ready for deployment")
        elif success_rate >= 80:
            print(f"\n⚡ UNLOCK PROTOCOL: OPERATIONAL WITH WARNINGS")
            print(f"   Core functionality validated, minor issues detected")
        else:
            print(f"\n⚠️  UNLOCK PROTOCOL: REQUIRES ATTENTION")
            print(f"   Critical issues detected, manual review required")
        
        print("\n" + "="*60)
        
        # Save detailed log
        with open('watson_unlock_validation.json', 'w') as f:
            json.dump({
                'test_summary': {
                    'total_tests': total_tests,
                    'passed': passed_tests,
                    'failed': failed_tests,
                    'warnings': warned_tests,
                    'success_rate': success_rate
                },
                'test_results': self.test_results,
                'validation_log': self.validation_log,
                'timestamp': datetime.now().isoformat()
            }, f, indent=2)
        
        print(f"📄 Detailed validation log saved to: watson_unlock_validation.json")
        
        return success_rate >= 80

def main():
    """Main execution function"""
    print("🔓 Watson DW Unlock Protocol - Final Test Initialization")
    print("="*60)
    
    validator = WatsonUnlockValidator()
    
    # Execute validation sequence
    validator.test_watson_unlock_api()
    validator.test_dashboard_access()
    validator.execute_unlock_protocol()
    validator.validate_trd_handlers()
    validator.validate_module_access()
    validator.validate_ui_readiness()
    
    # Generate final report
    success = validator.generate_final_report()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()