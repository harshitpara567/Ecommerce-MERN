// utils/auth.js

const fetchUserDetails = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user-details', {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json();  // This might be causing the issue
      console.log('Fetched user data:', data);
  
      if (data.success) {
        // If user is logged in, return user data
        return data.user;
      } else {
        return null;  // Handle the case when user is not logged in
      }
    } catch (error) {
      console.error("Error fetching user details", error);
      return null;  // Return null if there was an error
    }
  };
  
  export default fetchUserDetails;
  