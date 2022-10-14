const Razorpay = require('razorpay')
var instance = new Razorpay({ key_id: 'rzp_test_Q5KRrDSdZ6aJVe', key_secret: 'HL0JWf3AdAWNQWGLW3rQL3RP' })
module.exports ={
    
  generateOrder: (req, res) => {
    console.log(req.body,"this is body value of generateOrder")
    const options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order1001"
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            console.log(err)
        } else {
            res.send({ orderId: order.id})
        }
    });
},verifyPayment: (req, res) => {
    console.log("veri-fy--------------------------------");
  const orderId = req.params.orderId
  let body = orderId + "|" + req.body.response.razorpay_payment_id;

  const crypto = require("crypto");
  const expectedSignature = crypto.createHmac('sha256', 'HL0JWf3AdAWNQWGLW3rQL3RP')
      .update(body.toString())
      .digest('hex');
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  let response = { "signatureIsValid": false }
  if (expectedSignature === req.body.response.razorpay_signature) {
      response = { "signatureIsValid": true }
  }
  res.send(response);

console.log(response,"veri-fy--------------------------------");
},

refund: async (req, res) => {
  try {
      const paymentId = req.params.id
      await instance.payments.refund(paymentId, {
          "amount": req.body.amount,
          "speed": "optimum",
      })
      res.status(201).json({ message: "refund success" })
  } catch (err) {
      res.status(500).json({ err })
  }
},
}

  
