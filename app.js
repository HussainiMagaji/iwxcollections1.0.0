let cookieParser = require('cookie-parser');
let createError = require('http-errors');
let session = require('express-session');
let express = require('express');
let logger = require('morgan');
let path = require('path');
let ExcelJS = require('exceljs');

//=========================================================
let products;
async function getProductsCSV(path) {
    const wb = new ExcelJS.Workbook( );
    const ws = await wb.csv.readFile(path);

    let id = ws.getColumn(1).values.splice(2);
    let url = ws.getColumn(2).values.splice(2);
    let name = ws.getColumn(5).values.splice(2);
    let price = ws.getColumn(6).values.splice(2);

    let items = [ ];
    for(let i = 0; i < url.length; ++i) {
        items.push({id: id[i], url: url[i], name: name[i], price: price[i]});
    }

    return items;
}
(async ( ) => {
    products = await getProductsCSV('./public/data/products.csv');
})( );

let idx = 0;

//=======================================================

let Cart = require('./models/cart.js');

let app = express();
let sessionRoute = require('./routes/session.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable(`X-Powered-By`);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret: '/^+([-]?+)*@+([-]?)*({2,3})+$/secretus-x-o-x',
   resave: false,
   saveUninitialized: true,
   unset: 'destroy',
   name: 'iwxcollections-cookie'
}));

/*
 * ROUTES ---
 */

app.use('*', sessionRoute);
require('./routes/index.js')(app); /* /, /home */
require('./routes/login.js')(app); /* /login /account */
require('./routes/cart.js')(app);  /* /cart */
require('./routes/checkout.js')(app); /* /checkout */
require('./routes/order.js')(app); /* POST: /oreder */
require('./routes/webhook.js')(app); /* /webhook */

app.get('/shop', (req, res) => {
  res.render('shop.ejs', { products: products });
});
app.get('/products/:idx', (req, res) => {
  res.send(products.slice(req.params.idx));
});
app.get('/cart/:id', (req, res) => {

  let cart = req.session.cart, //TODO
      id = req.params.id, 
      quantityValue = 1;

  if(Cart.getItem(cart, id)) { //Product in cart?
     quantityValue = Cart.getItem(cart, id).quantity;
     Cart.remove(cart, id); //remove from cart
  }

  res.render('cart.ejs', {
     cart: cart.items,
     product: products[id - 1],
     quantityValue: quantityValue
  });
});


app.post('/cart', (req, res) => {
  let cart = req.session.cart, //TODO
      id = req.body.id,
      quantity = req.body.quantity,
      product = products[id - 1];

  product.quantity = quantity;
  let status = Cart.append(cart, product);
  res.end(String(status)); //return status
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

