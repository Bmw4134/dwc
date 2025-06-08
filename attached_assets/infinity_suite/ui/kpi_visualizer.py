import streamlit as st
import pandas as pd
import json

def render_kpi_dashboard():
    st.title("📊 KPI Metrics & Visual Insights")

    try:
        with open("kpi_log.json", "r") as f:
            kpis = json.load(f)
    except:
        kpis = []

    if not kpis:
        st.warning("No KPI data available.")
        return

    df = pd.DataFrame(kpis)
    st.line_chart(df.set_index("timestamp")["summary"].astype(str).apply(lambda x: len(x)))
    st.dataframe(df)
