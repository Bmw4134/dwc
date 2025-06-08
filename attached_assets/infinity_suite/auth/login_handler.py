import streamlit as st
import json

def login():
    user = st.text_input("Username")
    pwd = st.text_input("Password", type="password")
    if st.button("Login"):
        # Simulated token role (replace with Firebase)
        if user == "admin" and pwd == "infinity":
            st.session_state["role"] = "admin"
        elif user == "dev":
            st.session_state["role"] = "developer"
        else:
            st.session_state["role"] = "viewer"
        st.success(f"Logged in as {st.session_state['role']}")
