from core.vector_matrix import VectorMatrix
from agents.micro_agent import MicroAgent
from utils.logger import log_action

def run_automation():
    matrix = VectorMatrix()
    log_action("🚦 Automation Suite Starting with BIM Infinity Vectors")

    for agent, vector in matrix.summary().items():
        mission = f"auto_mission_{agent}"
        matrix.update_state(agent, "running")
        log_action(f"🚀 Launching {agent} with mission {mission} | Vector: {vector}")
        MicroAgent(name=agent, target=agent, mission=mission).execute()
        matrix.update_state(agent, "complete")

if __name__ == "__main__":
    run_automation()
