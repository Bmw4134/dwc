from core.vector_matrix import VectorMatrix
from utils.logger import log_action
from backup_restore import backup_all

class InfinityPatch:
    def __init__(self):
        self.vm = VectorMatrix()

    def run_self_heal(self):
        log_action("♾️ Running Infinity Self-Heal")
        for agent in self.vm.vectors:
            if self.vm.vectors[agent][3] != "complete":
                log_action(f"🔧 Healing {agent}...")
                self.vm.update_state(agent, "healed")

        backup_all()
        log_action("✅ Infinity Self-Heal Complete")
