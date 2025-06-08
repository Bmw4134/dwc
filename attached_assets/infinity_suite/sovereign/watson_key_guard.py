import streamlit as st
import hashlib
import os

def is_watson_authorized():
    secret_phrase = st.session_state.get("watson_key", "")
    secret_hash = hashlib.sha256(secret_phrase.encode()).hexdigest()
    return secret_hash == os.getenv("WATSON_MASTER_HASH", "a-hardcoded-dev-hash-for-now")
