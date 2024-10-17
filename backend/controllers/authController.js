const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res) => {
  const user = req.user;
  const redirectUrl = `http://localhost:3001/dashboard?name=${encodeURIComponent(user.displayName)}&id=${encodeURIComponent(user.id)}&image=${encodeURIComponent(user.image)}`;
  res.redirect(redirectUrl);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.redirect('http://localhost:3001/'); // Adjust the redirect path as needed
  });
};