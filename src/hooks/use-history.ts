import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState({
    history: [initialState],
    pointer: 0,
  });

  const set = useCallback((val: T) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.pointer + 1);
      newHistory.push(val);
      // Limit history size to prevent memory leaks
      if (newHistory.length > 100) {
        newHistory.shift();
        return { history: newHistory, pointer: newHistory.length - 1 };
      }
      return { history: newHistory, pointer: prev.pointer + 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => ({ ...prev, pointer: Math.max(0, prev.pointer - 1) }));
  }, []);

  const redo = useCallback(() => {
    setState((prev) => ({ ...prev, pointer: Math.min(prev.history.length - 1, prev.pointer + 1) }));
  }, []);

  const reset = useCallback((val: T) => {
    setState({ history: [val], pointer: 0 });
  }, []);

  return {
    state: state.history[state.pointer],
    set,
    undo,
    redo,
    reset,
    canUndo: state.pointer > 0,
    canRedo: state.pointer < state.history.length - 1,
  };
}
