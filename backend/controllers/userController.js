exports.currentUser = (req, res) => {
    res.send(req.user);
  };
  
  exports.dashboard = (req, res) => {
    if (req.isAuthenticated()) {
      res.send(
        "<h1>Welcome to the Dashboard</h1><p>You are logged in as " +
          req.user.displayName +
          "</p>"
      );
    } else {
      res.redirect("/");
    }
  };