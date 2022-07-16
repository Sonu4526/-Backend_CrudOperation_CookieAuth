const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
    // console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
                // error: 'Email is taken'
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Invalid Password !'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 'authcookie' in cookie with expiry date
        res.cookie('authcookie', token, { expire: new Date() + 9999,httpOnly:true });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.authorization = (req, res, next) => {
    const token = req.cookies.authcookie;
    console.log('token', token)
    if (!token) {
        console.log("error: @Token was Obsent in Query Params. for deleting, updating pass Token")
      return res.sendStatus(403)
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = data._id;
      return next();
    } catch {
      return res.sendStatus(403);
    }
  };

  exports.signout = (req, res) => {
    res.clearCookie('authcookie');
    res.json({ message: 'Signout success' });
};