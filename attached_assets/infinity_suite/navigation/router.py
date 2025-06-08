from agents.scheduler import SchedulerAgent
from agents.validator import ModelValidator
from utils.prompt_loader import load_prompt
from utils.logger import log_action
from utils.sync import sync_to_dashboard

class BIMRouteNavigator:
    def __init__(self):
        self.agents = {
            "scheduler": SchedulerAgent(),
            "validator": ModelValidator()
        }

    def run(self):
        log_action("📡 Router start")
        for name, agent in self.agents.items():
            prompt = load_prompt(f"{name}_prompt")
            log_action(f"Running {name} with prompt: {prompt[:60]}...")
            agent.run(prompt)
        sync_to_dashboard()
