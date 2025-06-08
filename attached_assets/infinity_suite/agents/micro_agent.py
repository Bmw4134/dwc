from utils.logger import log_action

class MicroAgent:
    def __init__(self, name, target, mission):
        self.name = name
        self.target = target
        self.mission = mission

    def execute(self):
        log_action(f"🧬 {self.name} executing mission: {self.mission} on {self.target}")
