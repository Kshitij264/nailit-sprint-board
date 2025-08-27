module.exports = (req, res, next) => {
  // Simulate a 10% failure rate for POST and PATCH requests
  if ((req.method === 'POST' || req.method === 'PATCH') && Math.random() < 0.1) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  // Otherwise, continue to the json-server router
  next();
};