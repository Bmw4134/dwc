import streamlit as st
import json

def render_automation_dashboard():
    st.title("⚙️ Automation Cockpit")
    try:
        with open("metadata/automation_registry.json", "r") as f:
            tools = json.load(f)
    except:
        tools = []

    for tool in tools:
        with st.expander(tool["name"]):
            st.markdown(f"**Owner**: {tool['owner']}")
            st.markdown(f"**Goal**: {tool['goal']}")
            st.markdown(f"**Last Run**: {tool['last_run']}")
            st.markdown(f"**Vector Priority**: {tool['priority']}")
            if st.button(f"Run {tool['name']}"):
                st.write(f"🚀 Executing {tool['name']}...")
