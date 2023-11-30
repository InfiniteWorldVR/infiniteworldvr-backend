// Error controller for handling different types of errors

// Handle 404 Not Found errors
export const handleNotFound = (req, res, next) => {
  res.status(404).json({ error: "Not Found" });
};

// Handle 500 Internal Server errors
export const handleInternalServerError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
};
