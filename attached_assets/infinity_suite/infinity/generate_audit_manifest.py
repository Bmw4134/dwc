import os
import json
from datetime import datetime

def generate_manifest():
    manifest = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "metrics": {
            "files": len([f for _, _, fs in os.walk(".") for f in fs]),
            "goals": json.load(open("goal_tracker.json", "r")) if os.path.exists("goal_tracker.json") else [],
            "platform": os.name
        }
    }
    with open("audit_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
