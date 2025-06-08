import json
import os
from datetime import datetime

def log_drilldown(kpi_id, agent_name, prompt, output_summary, vector):
    log_dir = "drilldown"
    os.makedirs(log_dir, exist_ok=True)
    timestamp = datetime.utcnow().isoformat() + "Z"
    log_data = {
        "timestamp": timestamp,
        "agent": agent_name,
        "prompt": prompt,
        "output_summary": output_summary,
        "vector_signature": vector,
        "kpi_ref": kpi_id
    }
    with open(os.path.join(log_dir, f"{kpi_id}_{agent_name}.json"), "w") as f:
        json.dump(log_data, f, indent=2)

    # Append to master KPI log
    kpi_entry = {
        "id": kpi_id,
        "timestamp": timestamp,
        "agent": agent_name,
        "vector": vector,
        "summary": output_summary
    }

    if os.path.exists("kpi_log.json"):
        with open("kpi_log.json", "r+") as f:
            data = json.load(f)
            data.append(kpi_entry)
            f.seek(0)
            json.dump(data, f, indent=2)
    else:
        with open("kpi_log.json", "w") as f:
            json.dump([kpi_entry], f, indent=2)
