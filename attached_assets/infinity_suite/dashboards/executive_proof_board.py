import streamlit as st
import json
from datetime import datetime

def render_exec_proof():
    st.title("👔 Executive Intelligence Dashboard")
    st.info("Confidential analytics — For Executives Only")

    try:
        with open("kpi_log.json", "r") as f:
            kpis = json.load(f)
    except:
        kpis = []

    st.markdown("### KPIs & Impact")
    for item in kpis[-5:]:
        st.markdown(f"- **{item['agent']}**: {item['summary']} at {item['timestamp']}")

    if st.button("📄 Download KPI Brief"):
        st.download_button("Download", data=json.dumps(kpis, indent=2), file_name="exec_brief.json")
