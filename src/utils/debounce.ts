export const debounce = <T, A>(fn: (args: A) => T) => {
  let timeout: NodeJS.Timeout;
  return (delay: number, args: A) => {
    clearTimeout(timeout);
    const task = new Promise<T>(resolve => {
      timeout = setTimeout(() => {
        resolve(fn(args));
      }, delay);
    });

    return task;
  };
};
