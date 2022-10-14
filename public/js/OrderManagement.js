


async function packOrder(orderId){
        try{
         
            const response = await axios({
                method:"post",
                url:`/admin/packOrder/${orderId}`
            })
            if(response.status==201){
             
                $("#mydiv").load(location.href + " #mydiv");
                 toastr.success("the is working")
            }
        }catch(err){
            console.log(err);
        }
    }

async function shipOrder(orderId){
    try{
       
        const response = await axios({
            method:"post",
            url:`/admin/shipOrder/${orderId}`
        })
        if(response.status == 201){
            console.log(" Running ship Order")
            $("#mydiv").load(location.href + " #mydiv");

        }
    }catch(err){
        console.log(err);
    }
}

async function outForDelivery(orderId){
    try{
        const response = await axios({
            method:"post",
            url:`/admin/outForDelivery/${orderId}`
        })
        if(response.status == 201){
            $("#mydiv").load(location.href + " #mydiv");

        }

    }catch(err){
        console.log(err);
    }
    
}

async function deliverPackage(orderId){
    try{
        console.log("delivery package is running")
        const response = await axios({
            method:"post",
            url:`/admin/deliverPackage/${orderId}`
        })
        if(response.status == 201){
            $("#mydiv").load(location.href + " #mydiv");
        }
    }catch(err){
        console.log(err);        }
}

async function cancelOrder(orderId){
    try{
      
     
            console.log("Cancel is working")
            const response = await axios({
                method:"post",
                url:`/admin/cancelOrder/${orderId}`
            })
            if(response.status == 201){
                $("#mydiv").load(location.href + " #mydiv");
            }
        
    }catch(err){

    }
}