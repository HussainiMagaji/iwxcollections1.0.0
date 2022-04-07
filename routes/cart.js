let Cart = require('../models/cart.js'); 

module.exports = function(app) {

  app.get('/cart', (req, res) => {
    let cart = req.session.cart;
    res.render('cart.ejs', {
      cart: cart.items,
      product: null,
      quantityValue: null
    });
  });


  app.delete("/cart/:id", (req, res) => {
    let cart = req.session.cart;
    Cart.remove(cart, req.params.id)
      res.json({status: "deleted"});
  });

};
