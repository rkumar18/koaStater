const bcrypt = require('bcrypt');

function hash(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashValue) => {
      if (err) {
        reject(err);
      }
      resolve(hashValue);
    });
  });
}

function verify(candidatePassword, passwordHash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, passwordHash, (err, matched) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(matched);
    });
  });
}

module.exports = { hash, verify };
