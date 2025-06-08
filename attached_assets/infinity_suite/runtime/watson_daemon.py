import time
from deploy.deploy_patch import deploy_infinity_patch

def watch():
    print("🛡️ WATSON Runtime Daemon Active...")
    while True:
        try:
            deploy_infinity_patch()
            time.sleep(3600)  # Check every hour
        except Exception as e:
            print("⚠️ Daemon failure:", e)

if __name__ == "__main__":
    watch()
