import streamlit as st

def load_widgets():
    widgets = {
        "Agent Controls": "control_widget.py",
        "Profile Menu": "user_profile_widget.py",
        "Exec Board": "executive_proof_board.py",
        "KPI Visuals": "kpi_visualizer.py",
        "Theme Switcher": "theme_toggle.py"
    }
    choice = st.sidebar.selectbox("🧩 Load Module", list(widgets.keys()))
    st.sidebar.markdown(f"Loaded: `{widgets[choice]}` (simulated dynamic import)")
