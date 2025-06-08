from agents.micro_agent import MicroAgent
from utils.logger import log_action

tasks = [
    {"name": "Model Validator Sweep", "target": "validator", "mission": "full_model_validation"},
    {"name": "Prompt Audit", "target": "prompt_loader", "mission": "check_prompt_integrity"},
    {"name": "Goal Sync Check", "target": "goal_tracker", "mission": "validate_goal_alignment"},
    {"name": "Diff Sweep", "target": "diff_engine", "mission": "scan_all_changes"}
]

def run_stress_test():
    log_action("🔥 Stress Test Initiated")
    agents = [MicroAgent(**task) for task in tasks]
    for agent in agents:
        agent.execute()

if __name__ == "__main__":
    run_stress_test()
