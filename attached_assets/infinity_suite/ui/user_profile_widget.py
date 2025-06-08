import streamlit as st

def render_profile_dropdown():
    if "user" in st.session_state:
        with st.sidebar.expander(f"👤 {st.session_state['user']}"):
            st.write("Role:", st.session_state.get("role", "Unknown"))
            st.button("My Profile")
            st.button("Settings")
            st.button("Reset Password")
            if st.button("Logout"):
                st.session_state.clear()
