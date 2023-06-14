export const withTimeout = <T>(seconds: number, promise: Promise<T>): Promise<T> => {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${seconds} seconds.`)), seconds * 1000)
  );

  return Promise.race([promise, timeout]);
};
