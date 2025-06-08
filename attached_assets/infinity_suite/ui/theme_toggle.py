import streamlit as st

def render_theme_controls():
    theme = st.sidebar.radio("🎨 Choose Theme", options=["Light", "Dark", "Terminal", "Modern"])
    st.session_state["theme"] = theme
    st.sidebar.markdown(f"Current: **{theme}** (simulated)")
