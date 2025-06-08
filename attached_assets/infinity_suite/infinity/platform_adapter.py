import platform

def detect_platform():
    os_type = platform.system()
    if os_type == "Darwin":
        return "macOS"
    elif os_type == "Windows":
        return "windows"
    elif os_type == "Linux":
        return "linux"
    else:
        return "unknown"
