const tryCatchHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      errorHandler(res, error);
    }
  };
};

const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message });
};

export { tryCatchHandler, errorHandler };
