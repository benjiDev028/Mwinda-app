const url = "http://192.168.2.13:8001";


const Register = async (firstname, lastname, email, password,date_birth) => {
  try {
    const response = await fetch(url + '/identity/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "first_name": firstname,
        "last_name": lastname,
        "email": email,
        "password": password,
        "date_birth": date_birth
       
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User created successfully:", data);
      return { success: true, data };
    } else {
      const errorData = await response.json();
      console.error("Error creating user:", errorData.detail);
      throw new Error(errorData.detail || 'Erreur lors de l\'inscription');
    }
  } catch (error) {
    console.error("Error during registration:", error.message);
    return { success: false, error: error.message };
  }
};


const updateUser = async (userId, updatedData, authToken) => {
  try {
    const response = await fetch(`${url}/identity/update_user_by_id/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      // Répondre avec un message ou les données mises à jour
      console.log("Success", "Profile updated successfully!")
      return data;
    } else {
      const error = await response.json();
      console.log("Error", error.message || "Failed to update profile.")
    }
  } catch (error) {
    console.log('Error updating user:', error);
  }
};

        
  
const GetUsers = async ()=>{
  try{
    const response = await fetch(`${url}/identity/get_all_users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
        });
        if (response.ok) {
          const data = await response.json();
          return data;
          } else {
            const error = await response.json();
            console.log('Error fetching users:', error);
            }
    } catch (error) {
              console.log('Error fetching users:', error);

  }
}


export default {Register,updateUser,GetUsers};

