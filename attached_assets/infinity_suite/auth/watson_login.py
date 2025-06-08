import streamlit as st

def render_login():
    st.title("🔐 Login Portal - WATSON Identity")
    user = st.text_input("Username or Email")
    pwd = st.text_input("Password", type="password")
    if st.button("Login"):
        if user == "admin" and pwd == "infinity":
            st.session_state["role"] = "admin"
            st.session_state["user"] = "admin"
        elif user == "dev":
            st.session_state["role"] = "developer"
            st.session_state["user"] = "dev"
        else:
            st.session_state["role"] = "viewer"
            st.session_state["user"] = "guest"
        st.success(f"Welcome, {st.session_state['user']}")

def render_forgot_password():
    st.text_input("Enter your email to reset password")
    st.button("Send Reset Link")

def render_register():
    st.text_input("Choose Username")
    st.text_input("Email")
    st.text_input("Password", type="password")
    st.button("Register")
