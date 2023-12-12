const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('./dbConfig');

const JWT_SECRET_KEY = '12345';


function encryptPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

function generateToken(user) {
  const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY);
  return token;
}

function comparePasswords(inputPassword, hashedPassword) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}


function sendPasswordResetEmail(username, temporaryPassword) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'letsplannn@gmail.com',
      pass: 'Letsplannn@1'
    }
  });

  pool.getConnection((err, connection) => {
    if (err) {
      return console.error('Error connecting to the database:', err.message);
    }

    const getEmail = 'SELECT email FROM Users WHERE username = ?';
    connection.query(getEmail, [username], (error, results) => {
      if (error) {
        connection.release();
        return console.error('Error executing query:', error.message);
      }

      const userMail = results[0].email;

      const resetLink = `http://localhost:4200/reset-password?token=${temporaryPassword}`;
      let mailOptions = {
        from: 'letsplannn@gmail.com',
        to: userMail,
        subject: 'Password Reset Link',
        text: `Dear ${username},\n\nPlease click on the following link to reset your password:\n\n${resetLink}\n\nThank you,\nThe Support Team`
      };

      transporter.sendMail(mailOptions, (emailError, info) => {
        connection.release();

        if (emailError) {
          return console.error('Error sending email:', emailError.message);
        }
        console.log('Email sent:', info.response);
      });
    });
  });
}

function signup(firstName, lastName, email, username, password, callback) {
  const pwd = encryptPassword(password);

  pool.getConnection((err, connection) => {
    if (err) {
      return callback({ success: false, message: 'Error connecting to the database' });
    }

    // Check if the username already exists
    connection.query('SELECT * FROM Users WHERE username = ?', [username], (error, results, fields) => {
      if (error) {
        connection.release();
        return callback({ success: false, message: 'Error executing query' });
      }

      if (results.length > 0) {
        connection.release();
        return callback({ success: false, message: 'Username already exists' });
      }

      // Check if the email already exists
      connection.query('SELECT * FROM Users WHERE email = ?', [email], (error, results, fields) => {
        if (error) {
          connection.release();
          return callback({ success: false, message: 'Error executing query' });
        }

        if (results.length > 0) {
          connection.release();
          return callback({ success: false, message: 'Email already registered' });
        }

        // Insert new user if username and email don't exist
        connection.query('INSERT INTO Users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, email, username, pwd], (insertError, insertResults) => {
          connection.release();
          if (insertError) {
            return callback({ success: false, message: 'Error inserting user' });
          }
          return callback({ success: true });
        });
      });
    });
  });
}


function login(username, password, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback({ success: false, message: 'Error connecting to the database' });
    }

    console.log("entered login function"); //temppp

    connection.query('SELECT password FROM Users WHERE username = ?', [username], (error, results, fields) => {
      connection.release();
      if (error) {
        return callback({ success: false, message: 'Error executing query' });
      }

      if (results.length === 0) {
        return callback({ success: false, message: 'Username not found' });
      }

      const storedPassword = results[0].password;

      if (comparePasswords(password, storedPassword)) {
        const token = generateToken({ username });
        return callback({ success: true, message: 'Login successful', token });
      } else {
        return callback({ success: false, message: 'Invalid password' });
      }
    });
  });
}


function forgotPassword(username, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      return callback({ success: false, message: 'Error connecting to the database' });
    }

    const checkIfUserExists = 'SELECT * FROM Users WHERE username = ?';
    connection.query(checkIfUserExists, [username], (error, results, fields) => {
      if (error) {
        connection.release();
        return callback({ success: false, message: 'Error executing query' });
      }

      if (results.length === 0) {
        connection.release();
        return callback({ success: false, message: 'Username does not exist' });
      }

      const token = generateToken();

      const storeResetTokenQuery = 'UPDATE Users SET reset_token = ? WHERE username = ?';
      connection.query(storeResetTokenQuery, [token, username], (error, updateResults) => {
        connection.release();
        if (error) {
          return callback({ success: false, message: 'Error storing reset token' });
        }

        return callback({ success: true, message: 'Password reset link sent successfully' });
      });
    });
  });
}

function refreshToken(token, callback) {
  jwt.verify(token, '12345', (err, decoded) => {
    if (err) {
      return callback({ success: false, message: 'Invalid token' });
    }

    const newToken = generateToken(decoded);
    return callback({ success: true, token: newToken });
  });
}

function getUserIdFromToken(token, callback) {
  if (!token) {
    return callback({ success: false, message: 'Unauthorized' });
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return callback({ success: false, message: 'Invalid token' });
    }

    const username = decoded.username;

    pool.getConnection((err, connection) => {
      if (err) {
        return callback({ success: false, message: 'Error connecting to the database' });
      }

      const getUserIdSql = 'SELECT user_id FROM Users WHERE username = ?';
      connection.query(getUserIdSql, [username], (err, userRows) => {
        connection.release();
        if (err || userRows.length === 0) {
          return callback({ success: false, message: 'Error fetching user' });
        }

        const user_id = userRows[0].user_id;
        callback({ success: true, user_id: user_id });
      });
    });
  });
}

module.exports = {
  encryptPassword,
  comparePasswords,
  generateToken,
  sendPasswordResetEmail,
  signup,
  login,
  forgotPassword,
  refreshToken,
  getUserIdFromToken
};