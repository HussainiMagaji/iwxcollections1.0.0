let router = require('express').Router( );
let Cart = require('../models/cart.js');

router.get('*', (req, res, next) => {
  if(!req.session.cart) {
    req.session.user = { };
    req.session.user.orders = [ ];
    req.session.cart = new Cart( );
    console.log(`\nNew Client connected.\nID: ${req.sessionID}\n`);
  }
  next( );
});

module.exports = router;
