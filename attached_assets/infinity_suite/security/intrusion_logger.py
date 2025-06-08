import json
from datetime import datetime

def log_intrusion(source_ip, vector, agent_name):
    log = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "source_ip": source_ip,
        "attack_vector": vector,
        "agent_targeted": agent_name
    }
    with open("intrusion_log.json", "a") as f:
        f.write(json.dumps(log) + "\n")
