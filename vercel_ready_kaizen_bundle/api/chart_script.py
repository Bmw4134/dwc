import plotly.graph_objects as go
import pandas as pd

# Create the data
data = [
    {"Platform": "Tableau + Pulse", "Real-time Updates": 4, "AI/ML Features": 5, "Customization": 5, "Ease of Use": 3, "Enterprise Features": 5},
    {"Platform": "Power BI + Copilot", "Real-time Updates": 4, "AI/ML Features": 4, "Customization": 4, "Ease of Use": 4, "Enterprise Features": 5},
    {"Platform": "Grafana", "Real-time Updates": 5, "AI/ML Features": 3, "Customization": 5, "Ease of Use": 3, "Enterprise Features": 4},
    {"Platform": "Sisense Intelligence", "Real-time Updates": 4, "AI/ML Features": 4, "Customization": 4, "Ease of Use": 4, "Enterprise Features": 4},
    {"Platform": "Qlik Sense", "Real-time Updates": 4, "AI/ML Features": 4, "Customization": 5, "Ease of Use": 3, "Enterprise Features": 5},
    {"Platform": "Streamlit", "Real-time Updates": 3, "AI/ML Features": 4, "Customization": 5, "Ease of Use": 4, "Enterprise Features": 2},
    {"Platform": "Retool", "Real-time Updates": 4, "AI/ML Features": 3, "Customization": 5, "Ease of Use": 4, "Enterprise Features": 4},
    {"Platform": "Observable", "Real-time Updates": 3, "AI/ML Features": 3, "Customization": 5, "Ease of Use": 3, "Enterprise Features": 3},
    {"Platform": "Datadog", "Real-time Updates": 5, "AI/ML Features": 4, "Customization": 4, "Ease of Use": 4, "Enterprise Features": 5},
    {"Platform": "New Relic", "Real-time Updates": 5, "AI/ML Features": 4, "Customization": 4, "Ease of Use": 4, "Enterprise Features": 5}
]

df = pd.DataFrame(data)

# Define colors for each category (using the brand colors)
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C']

# Create the figure
fig = go.Figure()

# Categories and their abbreviated names for labels
categories = ['Real-time Updates', 'AI/ML Features', 'Customization', 'Ease of Use', 'Enterprise Features']
category_labels = ['Real-time', 'AI/ML', 'Customization', 'Ease of Use', 'Enterprise']

# Add traces for each category
for i, (category, label) in enumerate(zip(categories, category_labels)):
    fig.add_trace(go.Bar(
        y=df['Platform'],
        x=df[category],
        name=label,
        orientation='h',
        marker_color=colors[i],
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title='Dashboard Tools Capability Comparison',
    xaxis_title='Score (1-5)',
    yaxis_title='Platform',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update x-axis to show range 0-5
fig.update_xaxes(range=[0, 5.5])
fig.update_yaxes()

# Save the chart
fig.write_image('dashboard_comparison.png')