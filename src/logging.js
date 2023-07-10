const logging = {
  silly: () => {},
  trace: console.trace,
  verbose: console.trace,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
};

export default logging;
