import shutil
import os
from datetime import datetime

def backup_all():
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H%M%S')
    backup_dir = f"backups/backup_{timestamp}"
    os.makedirs(backup_dir, exist_ok=True)

    for file in ["goal_tracker.json", "dna_registry.json"]:
        if os.path.exists(file):
            shutil.copy(file, os.path.join(backup_dir, file))
