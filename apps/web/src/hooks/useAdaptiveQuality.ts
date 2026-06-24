import { useCallback, useRef, useState } from "react";

const BUDGET_MS = 300;
const STEP_DOWN_THRESHOLD = 3;
const STEP_UP_THRESHOLD = 5;
const SCALES = [1, 0.75, 0.5, 0.35];

export function useAdaptiveQuality() {
  const [scaleIndex, setScaleIndex] = useState(0);
  const slowFramesRef = useRef(0);
  const fastFramesRef = useRef(0);

  const reportDuration = useCallback((durationMs: number) => {
    if (durationMs > BUDGET_MS) {
      slowFramesRef.current += 1;
      fastFramesRef.current = 0;
      if (slowFramesRef.current >= STEP_DOWN_THRESHOLD && scaleIndex < SCALES.length - 1) {
        setScaleIndex((idx) => idx + 1);
        slowFramesRef.current = 0;
      }
    } else {
      fastFramesRef.current += 1;
      slowFramesRef.current = 0;
      if (fastFramesRef.current >= STEP_UP_THRESHOLD && scaleIndex > 0) {
        setScaleIndex((idx) => idx - 1);
        fastFramesRef.current = 0;
      }
    }
  }, [scaleIndex]);

  return {
    scale: SCALES[scaleIndex] ?? 1,
    reportDuration
  };
}
