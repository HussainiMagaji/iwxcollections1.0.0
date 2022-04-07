let {generateRRR,
     initiatePayment} = require('../lib/remita/remita.js');

module.exports = function(app) {

  app.post('/order', async (req, res) => {
    let user = req.session.user;
    Object.assign(user, req.body);

    let response = await generateRRR(user);
    switch(response.statuscode) {
      case '025': {
        user.RRR = response.RRR;
	response = await initiatePayment(user);
      } break;
      default: {
	console.log(response);
      }
    }
    res.send(response);
  });

};
