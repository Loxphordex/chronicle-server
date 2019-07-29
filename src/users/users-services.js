const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const xss = require('xss');

const UsersServices = {
  getById(db, id) {
    return db('users')
      .select('*')
      .where('users.id', id)
      .first();
  },
  hasUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  insertUser(db, user) {
    return db
      .insert(user)
      .into('users')
      .returning('*')
      .then(([ user ]) => user)
      .then(user => {
        return UsersServices.getById(db, user.id);
      });
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
    };
  },
};

module.exports = UsersServices;