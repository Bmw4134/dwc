**Given**: A BIM model in IFC format with multiple HVAC systems  
**When**: The validator agent runs schema compliance and detects geometry overlaps  
**Then**: It must report:
- Number of violations
- Locations (Room/Zone)
- Suggested correction scripts (Dynamo or Python-based)

> Prompt:  
"Given an IFC file with HVAC layers, validate it against BIM Infinity clash rules and output a JSON report with errors and Dynamo rectification scripts."
