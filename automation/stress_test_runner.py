#!/usr/bin/env python3
"""
DWC Systems Comprehensive Stress Test Runner
Validates all five control interfaces and system resilience for deployment
"""

import asyncio
import aiohttp
import time
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Any

class DWCStressTestRunner:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.test_results = []
        self.error_count = 0
        self.success_count = 0
        self.start_time = time.time()
        
        # Critical endpoints for all five control interfaces
        self.endpoints = {
            "infinity_control": [
                "/api/infinity/system-status",
                "/api/system/metrics"
            ],
            "kaizen_dashboard": [
                "/api/kaizen/deployment-status",
                "/api/kaizen/enhancement-log",
                "/api/kaizen/introspection",
                "/api/kaizen/watson-console"
            ],
            "watson_console": [
                "/api/watson/intelligence-core",
                "/api/watson/unlock-status",
                "/api/watson/trd-handlers",
                "/api/watson/restricted-modules"
            ],
            "dw_unlock": [
                "/api/watson/quantum-override"
            ],
            "user_management": [
                "/api/users",
                "/api/users/roles",
                "/api/users/summary"
            ],
            "admin_systems": [
                "/api/admin/system-status",
                "/api/admin/automation-tasks"
            ],
            "layer_chart": [
                "/api/layer-chart/active-goals",
                "/api/layer-chart/live-report"
            ]
        }

    def log(self, message: str, level: str = "INFO"):
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")

    async def test_endpoint(self, session: aiohttp.ClientSession, endpoint: str, method: str = "GET"):
        """Test individual endpoint with timeout and error handling"""
        try:
            start_time = time.time()
            
            if method == "POST":
                async with session.post(f"{self.base_url}{endpoint}", json={}) as response:
                    response_time = (time.time() - start_time) * 1000
                    status = response.status
                    
            else:
                async with session.get(f"{self.base_url}{endpoint}") as response:
                    response_time = (time.time() - start_time) * 1000
                    status = response.status

            if status == 200:
                self.success_count += 1
                self.log(f"✓ {method} {endpoint} - {status} ({response_time:.2f}ms)")
            else:
                self.error_count += 1
                self.log(f"✗ {method} {endpoint} - {status} ({response_time:.2f}ms)", "ERROR")
                
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "status": status,
                "response_time": response_time,
                "success": status == 200
            })
            
        except asyncio.TimeoutError:
            self.error_count += 1
            self.log(f"✗ {method} {endpoint} - TIMEOUT", "ERROR")
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "status": 0,
                "response_time": 30000,
                "success": False,
                "error": "timeout"
            })
            
        except Exception as e:
            self.error_count += 1
            self.log(f"✗ {method} {endpoint} - ERROR: {str(e)}", "ERROR")
            self.test_results.append({
                "endpoint": endpoint,
                "method": method,
                "status": 0,
                "response_time": 0,
                "success": False,
                "error": str(e)
            })

    async def stress_test_interface(self, session: aiohttp.ClientSession, interface_name: str, endpoints: List[str], concurrent_requests: int = 10):
        """Stress test a specific interface with concurrent requests"""
        self.log(f"Stress testing {interface_name} with {concurrent_requests} concurrent requests...")
        
        tasks = []
        for _ in range(concurrent_requests):
            for endpoint in endpoints:
                tasks.append(self.test_endpoint(session, endpoint))
                
        await asyncio.gather(*tasks, return_exceptions=True)

    async def test_quantum_override_protocol(self, session: aiohttp.ClientSession):
        """Specifically test Watson quantum override protocol"""
        self.log("Testing Watson quantum override protocol...")
        
        for i in range(5):
            await self.test_endpoint(session, "/api/watson/quantum-override", "POST")
            await asyncio.sleep(0.5)  # Brief pause between override tests

    async def test_error_recovery(self, session: aiohttp.ClientSession):
        """Test system error recovery mechanisms"""
        self.log("Testing error recovery mechanisms...")
        
        error_endpoints = [
            "/api/nonexistent",
            "/api/watson/invalid-endpoint",
            "/api/users/99999"
        ]
        
        for endpoint in error_endpoints:
            await self.test_endpoint(session, endpoint)

    async def run_comprehensive_stress_test(self):
        """Execute comprehensive stress test across all systems"""
        self.log("Starting DWC Systems comprehensive stress test...")
        
        timeout = aiohttp.ClientTimeout(total=30)
        connector = aiohttp.TCPConnector(limit=100, limit_per_host=50)
        
        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            # Test each interface with increasing load
            for interface_name, endpoints in self.endpoints.items():
                await self.stress_test_interface(session, interface_name, endpoints, 15)
                await asyncio.sleep(1)  # Brief pause between interfaces
            
            # Test Watson quantum override protocol
            await self.test_quantum_override_protocol(session)
            
            # Test error recovery
            await self.test_error_recovery(session)
            
            # Final high-load test
            self.log("Executing final high-load test...")
            all_endpoints = []
            for endpoints in self.endpoints.values():
                all_endpoints.extend(endpoints)
            
            tasks = []
            for _ in range(25):  # 25 concurrent requests per endpoint
                for endpoint in all_endpoints:
                    tasks.append(self.test_endpoint(session, endpoint))
            
            await asyncio.gather(*tasks, return_exceptions=True)

    def generate_report(self):
        """Generate comprehensive test report"""
        end_time = time.time()
        total_time = end_time - self.start_time
        total_tests = len(self.test_results)
        success_rate = (self.success_count / total_tests * 100) if total_tests > 0 else 0
        
        # Calculate average response times by interface
        interface_stats = {}
        for interface_name, endpoints in self.endpoints.items():
            interface_results = [r for r in self.test_results if r["endpoint"] in endpoints]
            if interface_results:
                avg_response_time = sum(r["response_time"] for r in interface_results) / len(interface_results)
                success_count = sum(1 for r in interface_results if r["success"])
                interface_stats[interface_name] = {
                    "avg_response_time": avg_response_time,
                    "success_rate": (success_count / len(interface_results)) * 100,
                    "total_tests": len(interface_results)
                }

        report = {
            "summary": {
                "total_tests": total_tests,
                "successful_tests": self.success_count,
                "failed_tests": self.error_count,
                "success_rate": f"{success_rate:.2f}%",
                "total_time": f"{total_time:.2f}s",
                "avg_response_time": f"{sum(r['response_time'] for r in self.test_results) / total_tests:.2f}ms" if total_tests > 0 else "0ms"
            },
            "interface_stats": interface_stats,
            "deployment_ready": success_rate >= 95.0 and self.error_count < 10
        }
        
        self.log("\n" + "="*60)
        self.log("DWC SYSTEMS STRESS TEST REPORT")
        self.log("="*60)
        self.log(f"Total Tests: {total_tests}")
        self.log(f"Successful: {self.success_count}")
        self.log(f"Failed: {self.error_count}")
        self.log(f"Success Rate: {success_rate:.2f}%")
        self.log(f"Total Time: {total_time:.2f}s")
        self.log(f"Average Response Time: {report['summary']['avg_response_time']}")
        
        self.log("\nINTERFACE PERFORMANCE:")
        for interface, stats in interface_stats.items():
            self.log(f"  {interface}: {stats['success_rate']:.1f}% success, {stats['avg_response_time']:.2f}ms avg")
        
        if report["deployment_ready"]:
            self.log("\n✓ SYSTEM READY FOR DEPLOYMENT", "SUCCESS")
            return True
        else:
            self.log(f"\n✗ DEPLOYMENT NOT RECOMMENDED - Success rate: {success_rate:.2f}%", "ERROR")
            return False

async def main():
    """Main execution function"""
    runner = DWCStressTestRunner()
    
    try:
        await runner.run_comprehensive_stress_test()
        deployment_ready = runner.generate_report()
        
        # Save detailed results
        with open("stress_test_results.json", "w") as f:
            json.dump({
                "results": runner.test_results,
                "summary": {
                    "success_count": runner.success_count,
                    "error_count": runner.error_count,
                    "deployment_ready": deployment_ready
                }
            }, f, indent=2)
        
        sys.exit(0 if deployment_ready else 1)
        
    except Exception as e:
        runner.log(f"FATAL ERROR: {str(e)}", "ERROR")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())