import streamlit as st
import os
import json

def render_watson_backend_sync():
    st.sidebar.title("🛰 Backend Sync Status")

    if os.path.exists("session_fingerprint.json"):
        with open("session_fingerprint.json", "r") as f:
            state = json.load(f)
            st.sidebar.markdown(f"**Active Session Owner**: {state['session_owner']}")
            st.sidebar.markdown(f"**Last Vector Trail**: {', '.join(state['vector_trail'])}")
            st.sidebar.markdown(f"**Last Executed**: {state['last_exec']}")
    else:
        st.sidebar.info("No backend fingerprint log detected.")
