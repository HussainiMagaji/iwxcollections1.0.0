let validateEmail = require('../lib/email/validate.js');

module.exports = function(app) {

  app.get('/login', (req, res) => {
    let user = req.session.user;
    if(user.email) {
      res.redirect('/account');
     return;
    }
    res.render('login.ejs');
  });
                                
  app.get('/account', (req, res) => {
    let user = req.session.user,
	orders = req.session.user.orders;
    res.render('account.ejs', {
      email: user.email,
      orders: orders
    });
  });

  app.post('/login', (req, res) => {
    //validate email
    if(!validateEmail(req.body.email)) {
      res.redirect('/login');
      return;
    }
    let user = req.session.user;
    //verify existence and authentify password
    Object.assign(user, req.body);
    res.redirect('/');
  });

  app.post('/signup', (req, res) => {
    //validate email
    if(!validateEmail(req.body.email)) {
      res.redirect('/login');
      return;
    }
    //verify email uniqueness
    if(req.body.pswd !== req.body.cpswd) {
      res.redirect('/login');
      return;
    }
    //add user to db
    let user = req.session.user;

    Object.assign(user, req.body);
    res.redirect('/');
  });

};
