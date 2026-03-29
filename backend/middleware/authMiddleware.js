const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Robust check for user in file
      let user = null;
      if (fs.existsSync(usersFilePath)) {
          const data = fs.readFileSync(usersFilePath, 'utf-8');
          const users = JSON.parse(data || '[]');
          user = users.find(u => u.id === decoded.id);
      }
      
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found. Please log in again.');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
