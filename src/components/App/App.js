import React, { useEffect } from 'react';
// ...existing code...

function App() {
  // Add token validation on app load
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found on app load');
        return;
      }
      
      console.log('Token found on app load, validating...');
      
      try {
        const response = await fetch('/api/debug/auth-test', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          console.log('Token validation successful:', data.user.username);
        } else {
          console.warn('Token validation failed:', data.error);
          // Don't remove token here, AuthContext will handle that
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    };
    
    validateToken();
  }, []);
  
  // ...existing code...
}

export default App;