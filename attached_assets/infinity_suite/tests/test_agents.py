def test_scheduler_agent():
    from agents.scheduler import SchedulerAgent
    try:
        SchedulerAgent().run()
        print("✅ SchedulerAgent passed.")
    except Exception as e:
        print("❌ SchedulerAgent failed:", e)

def test_validator_agent():
    from agents.validator import ModelValidator
    try:
        ModelValidator().run()
        print("✅ ModelValidator passed.")
    except Exception as e:
        print("❌ ModelValidator failed:", e)
