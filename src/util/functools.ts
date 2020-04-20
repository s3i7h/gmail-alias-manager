export const dispatch: (func: Function, delay: number) => void = (() => {
  const dispatchFunctions = new Map<Function, number>();
  return (func: Function, delay: number) => {
    if (dispatchFunctions.has(func)) clearTimeout(dispatchFunctions.get(func));
    dispatchFunctions.set(
      func,
      setTimeout(() => {
        dispatchFunctions.delete(func);
        func();
      }, delay)
    );
  };
})();
