import React ,{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from './Spinner';

function MiddleWare()  {

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
    
        fetch('http://localhost:1111/auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          if(!res.ok) {
             throw new Error(res.statusText)
          }
          return res.json()
        })
        .then( data => {
            navigate('/home', { state: { message: true } });
        })
        .catch(error => {
          console.error('Access Denied', error);
          navigate('/login');
        });
      }, [navigate]);

  return (
    <Spinner/>
  )
}

export default MiddleWare
