const sessionMiddleware = async(req, res, next) => {
    const { sessionID } = req.headers;
  
    // Check if session ID is provided in the request headers
    if (!sessionID) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Retrieve the session record from the database
    const selectQuery = 'SELECT * FROM sessions WHERE session_id = ?';
    db.query(selectQuery, [sessionID], (err, result) => {
      if (err) {
        console.error('Error retrieving session:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      // Check if session exists and is not expired
      if (result.length === 0 || result[0].expiration_time < new Date()) {
        return res.status(401).json({ message: 'Session expired or not found' });
      }
  
      // Attach the user ID to the request for further processing
      req.userId = result[0].user_id;
  
      next(); // Continue to the next middleware or route handler
    });
  };

  export default sessionMiddleware
  