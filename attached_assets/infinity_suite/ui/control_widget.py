import streamlit as st
import json

def load_walkthrough():
    try:
        with open("walkthrough_registry.json", "r") as f:
            return json.load(f)
    except:
        return {}

def render_control_widget(user_role="viewer"):
    st.sidebar.title("🧭 Control Module")
    guide = load_walkthrough()

    def show_help(name):
        entry = guide.get(name, {})
        st.sidebar.markdown(f"**{entry.get('description', '')}**")
        st.sidebar.text(entry.get('how_to_use', ''))
        st.sidebar.text("🔗 Links: " + ", ".join(entry.get('links', [])))

    if user_role == "admin":
        if st.sidebar.button("Run System Audit"):
            show_help("infinity_patch")
        if st.sidebar.button("Trigger Stress Test"):
            show_help("scheduler_agent")
        if st.sidebar.button("Rebuild Agents"):
            show_help("validator_agent")
    elif user_role == "developer":
        if st.sidebar.button("Run Prompt Validator"):
            show_help("validator_agent")
        if st.sidebar.button("Test New Vector"):
            show_help("scheduler_agent")
    else:
        st.sidebar.info("Welcome, Viewer. Metrics only.")
