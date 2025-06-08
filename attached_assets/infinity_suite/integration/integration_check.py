import os

def scan_for_integrations():
    integrations = []
    if os.path.exists("firebase.json"):
        integrations.append("Firebase Auth")
    if os.path.exists("supabase.js"):
        integrations.append("Supabase Sync")
    if os.path.exists("replit.yaml"):
        integrations.append("Replit Deployment")
    return integrations
