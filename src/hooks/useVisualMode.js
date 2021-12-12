import { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    const newHistory = [...history, newMode];
    if (replace) {
      newHistory.pop();
    }
    setHistory(newHistory);
    setMode(newMode);
  };

  const back = function () {
    if (history.length < 2) {
      return;
    }
    const newHistory = [...history];
    newHistory.pop();
    setMode(newHistory[newHistory.length - 1]);
    setHistory(newHistory);
  };
  return { mode, transition, back };
}
