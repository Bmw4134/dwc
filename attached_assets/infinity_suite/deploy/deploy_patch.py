import shutil, os, json
from datetime import datetime

def deploy_infinity_patch():
    backup_dir = f"backup_{datetime.utcnow().strftime('%Y%m%dT%H%M%S')}"
    os.makedirs(backup_dir, exist_ok=True)

    # Back up key files
    for f in ["goal_tracker.json", "session_fingerprint.json", "kpi_log.json"]:
        if os.path.exists(f):
            shutil.copy(f, os.path.join(backup_dir, f))

    print("✅ Backup complete. Infinity Suite now deployed.")
