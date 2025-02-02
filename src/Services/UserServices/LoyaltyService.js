const url = "http://192.168.2.13:8002";




const postEarnPoint = async (code_barre,montant,reference,id_admin) => {
    try{
        const response =await fetch(`${url}/loyalty/earn_points`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code_barre: code_barre,
                montant: montant,
                service: "",
                reference: reference,
                id_admin: id_admin
            })
        });

        if(response){
            const data = await response.json();
            console.log(data);
            return data;
        }
        else{
            console.log(response);
            return response.json();

        }
    }catch(error){
        console.log(error);
    }
}
    
const getLoyaltyPoint = async (id) => {
    try{
        const response =await fetch(`${url}/loyalty/loyalty_points/${id}`,{
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
            },
            });
        if(response){
            const data = await response.json();
            console.log(data);
            return data;
        }
        else{
            console.log(response);
            return response.json();
           
        }
    }catch(error){
        console.log(error);
    }
}

export default {postEarnPoint,getLoyaltyPoint};