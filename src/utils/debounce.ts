export const debounce =
  <T, A>(fn: (args: A) => T) =>
  (delay: number, args: A) => {
    let timeout: NodeJS.Timeout;
    const task = new Promise<T>(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        resolve(fn(args));
      }, delay);
    });

    return task;
  };
