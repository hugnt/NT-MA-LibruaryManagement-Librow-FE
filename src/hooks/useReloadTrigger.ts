import { useCallback, useState } from "react";

export function useReloadTrigger() {
  const [trigger, setTrigger] = useState(false);
  const reload = useCallback(() => setTrigger(prev => !prev), []);
  return [trigger, reload] as const;
}