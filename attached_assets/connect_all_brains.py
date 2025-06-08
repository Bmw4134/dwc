from kaizen_gpt import KaizenGPT
import json
import os

def activate_brain_hub(current_dashboard="Nexus"):
    print(f"🧠 Activating Brain Hub in {current_dashboard}...")

    brain = {
        "goal_tracker": "goal_tracker.json" if os.path.exists("goal_tracker.json") else "Not found",
        "session_audit": "session_audit.json" if os.path.exists("session_audit.json") else "Not found",
        "diff_watcher": "diff_watcher.py" if os.path.exists("diff_watcher.py") else "Not found",
        "prompt_fingerprint": "fingerprint.json" if os.path.exists("fingerprint.json") else "Not found",
        "llm_test": "llm_test.py" if os.path.exists("llm_test.py") else "Not found"
    }

    for key, path in brain.items():
        print(f"{key}: Connected → {path}" if os.path.exists(path) else f"{key}: Missing")

    print("✅ All available subsystems now bound to", current_dashboard)

if __name__ == "__main__":
    activate_brain_hub()
