  let address
  let billtype
  async function  payment(total){
     let amount=total 
     console.log(amount)
     
     address = $('input[type="radio"][name="address"]:checked').val()
     billtype = $('input[type="radio"][name="paymentMethod"]:checked').val()
    try{
      if(billtype=="COD"){
        createOrder()
      }else{
        razorpay(amount,orderId)
       
      }
       
        
    }
    catch(err){
        console.log(err);
    }
}
async function createOrder(){
    const response= await axios.post('/payment',{address,billtype})
        if(response.status == 200){
          console.log("Running return response");
             Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your Order is placed',
                showConfirmButton: false,
                timer: 1600
              })
              setTimeout(()=>{
                location.href="/myOrders"
              },1600)
          
        }
}

function razorpay(Total,orderId){
  

  let options = {
      "key": "rzp_test_Q5KRrDSdZ6aJVe", // Enter the Key ID generated from the Dashboard
      "name": "Fashion",
      "amount": Total,
      "order_id":orderId, // For one time payment
      "retry": false,
      "theme": {
          "color": "#273952"
      },
      // This handler function will handle the success payment
      "handler": async function (response) {
          // alert(response.razorpay_payment_id);
          try {
              const verification = await axios({
                  method: "post",
                  url: `/payment/verify/${orderId}`,
                  data: {
                      response:response,
                  }
              })
              console.log(verification)
              if (verification.data.signatureIsValid) {
                  const paymentId = response.razorpay_payment_id

                  //appending order Id and payment id to data to update on database
                //   data.append("orderId", orderId)
                //   data.append("paymentId", paymentId)
                           
                  //calling checkout after payment verification
                
                  createOrder()

              } else {
                  await Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Payment Failed!',
                      confirmButtonColor: '#273952',
                      width: "25em",
                      timer: 2000,
                  })
                  window.location = "/user/checkout"
              }
          } catch (err) {
              console.log(err)
              // window.location = "/user/myOrders"
          }

      },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  rzp1.on('payment.failed', async function (response) {
      await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Payment Failed!',
          confirmButtonColor: '#273952',
          width: "25em",
          timer: 2000,
      })
      window.location = "/user/checkout"
  });

}


