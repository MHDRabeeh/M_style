

async function addToWishlist(id,productName)
try {
    const response = await axios({
        method : "post",
        url : `/addtowishlist/${id}`,
        data : {
            name : productName
        }
        
    })
    console.log(response)
} catch (error) {
    console.error(error);
    
}
async function removeFromWishlist(name,id){
    
    try{
        console.log("remove wishlist in Running")
        const response= await axios({
            method:"post",
            url:`/delete-wishlist/${id}`,
        
        })
    }catch(err){
        console.log(err);
    }
}

 
 
 
//  function wishlist(id,productName){
  
//  addToWishlist(id,productName)   
 
// }