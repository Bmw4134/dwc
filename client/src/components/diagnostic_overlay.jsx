import { useEffect } from "react";

export default function DiagnosticOverlay() {
  useEffect(() => {
    const blockers = Array.from(document.querySelectorAll("*"))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.position === "fixed" && parseFloat(style.opacity) > 0.8 && parseFloat(style.zIndex) > 10;
      });

    if (blockers.length > 0) {
      console.warn("🛑 UI Blockers Detected:", blockers);
      alert("⚠️ UI interaction blocker detected. Check console.");
    } else {
      console.log("✅ No full-screen blockers detected.");
    }
  }, []);

  return null;
}