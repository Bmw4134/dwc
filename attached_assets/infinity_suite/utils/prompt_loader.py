def load_prompt(name):
    try:
        with open(f"training/{name}.md", "r") as f:
            return f.read()
    except FileNotFoundError:
        return f"[No prompt found for {name}]"
