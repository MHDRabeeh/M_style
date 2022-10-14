$(document).ready(async ()=>{
    try{
        const response = await axios.get("/cartItemCount")
        const itemCount = response.data.itemCount ? response.data.itemCount : 0 
        $(".cart-item-count").html(itemCount)
    }catch (err){
        console.error(err);
    }
})

async function deleteItem(productId, cartCount) {
    try {
        const response = await axios({
            method: "delete",
            url: `/deleteCartItem/${productId}`,
            data: {
                cartCount: parseInt(cartCount)
            }
        })
        let itemCount = Number ($(".cart-item-count").html())
        console.log(cartCount);
        itemCount -= cartCount
        if(itemCount != 0 ){
            document.getElementById(`cartItem-${productId}`).remove()
            $(".cart-item-count").html(itemCount)
          

        }else {
          

        }  toastr.error('cart item deleted')
            // $(`#cartItem-${productId}`).load(location.href + ` #cartItem-${productId}>*`, "");
            window.location.reload()
   
    } catch (error) {

        console.error(error)
    }
}

async function addToCart(productId,productName,price,quantity,offerPrice){
    console.log(productId+"id" , productName+"name",price+"price",quantity+"quantity",offerPrice+"offerPrice")
   console.log("Running add to cart ON Axios")
   let itemQty = document.getElementById(`itemQty-${productId}`)?.value
    if(quantity == -1 && itemQty == 1 ){
        deleteItem(productId,1);

    }
    else{
        try{
            const response = await axios({
                method : "post",
                url:`/addtocart/${productId}`,
                data:{
                    name : productName,
                    price :Number.parseFloat(price),
                    quantity:Number.parseInt(quantity),
                    offerPrice:Number.parseFloat(offerPrice),
                }
            })
            console.log(response)
            if(response.status == 200 ){
                toastr.options = {"positionClass" : "toast-bottom-right"}
                toastr.error ('thid product is out of stock')
            }else{
                if (quantity == -1 ){
    
                }
                let itemCount = Number($(".cart-item-count").html())
                itemCount += Number.parseInt(quantity)
                $(".cart-item-count").html(itemCount)
             
              
            }
            window.location.reload()
            // toastr.success('cart item quantity updated')
            
        }catch(err){
             window.location = '/login'
          console.log(err);
        }
    }
}
 function cart(id, name, price, offerPrice){

        let quantity = 1;
        addToCart(id, name, price, quantity, offerPrice)
        
  
   
}