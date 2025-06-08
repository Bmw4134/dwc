# BIM Infinity Vector Matrixes
class VectorMatrix:
    def __init__(self):
        # Define agents with their [velocity, priority, compute_weight, sync_state]
        self.vectors = {
            "scheduler": [1.0, 3, 0.7, "idle"],
            "validator": [0.9, 4, 0.9, "idle"],
            "diff_engine": [0.6, 2, 0.5, "idle"],
            "prompt_loader": [0.8, 5, 0.4, "idle"]
        }

    def get_vector(self, agent_name):
        return self.vectors.get(agent_name, None)

    def update_state(self, agent_name, new_state):
        if agent_name in self.vectors:
            self.vectors[agent_name][3] = new_state

    def summary(self):
        return {k: {"velocity": v[0], "priority": v[1], "load": v[2], "state": v[3]} for k, v in self.vectors.items()}
