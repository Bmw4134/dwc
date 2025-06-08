from infinity.infinity_patch import InfinityPatch
from stress_test_launcher import run_stress_test
from automation.automation_suite import run_automation

def run_all_tests():
    print("🔥 Launching Infinity Patch...")
    InfinityPatch().run_self_heal()
    print("🚦 Running Automation Suite...")
    run_automation()
    print("💥 Running Stress Test...")
    run_stress_test()
    print("✅ All CLI triggers executed.")

if __name__ == "__main__":
    run_all_tests()
