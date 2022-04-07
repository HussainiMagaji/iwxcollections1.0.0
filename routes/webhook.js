let Cart = require('../models/cart.js');

module.exports = function(app) {
  
  app.get('/webhook', (req, res) => {

    let cart = req.session.cart,
    orders = req.session.user.orders;
      
    console.log(`\nReferer: ${req.headers['referer']}`);
    console.log(req.session);

    orders.forEach(order => { //check for duplicate order
      if(order.id == req.query.orderID) {
        res.redirect('/login');
        return;                                        
      }

    });

    orders.push({
      id: req.query.orderID,
      rrr: req.query.RRR,
      date: new Date( ).toString( ).slice(0, 33)
    });                                           

    //send cart and orders to db for management
    Cart.clear(cart); //empty cart
    res.redirect('/account');

  });

};
