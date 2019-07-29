const express = require('express');
const UsersRouter = express.Router();
const bodyParser = express.json();
const UsersServices = require('./users-services');
const path = require('path');

UsersRouter
  .route('/register')
  .post(bodyParser, (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Missing username in request body' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password in request body' });
    }

    UsersServices.hasUserWithUsername(req.app.get('db'), username)
      .then(userExists => {
        if (userExists) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        return UsersServices.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              date_created: Date.now(),
            };

            UsersServices.insertUser(req.app.get('db'), newUser)
              .then(user => {
                res.status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json({ user: UsersServices.serializeUser(user) });
              });
          });
      })
      .catch(next);
  });

UsersRouter
  .route('/login')
  .post(bodyParser, (req, res, next) => {
    const { username, password } = req.body;
    const userCreds = { username, password };

    for (const [key, value] of Object.entries(userCreds)) {
      if (!value) {
        return res.status(400).json(
          { error: `Missing ${key} in request body` }
        );
      }
    }

    
  });

module.exports = UsersRouter;