import React, { useEffect, useState } from 'react';
import { Button, Paper,  IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Spinner from '../utils/Spinner'
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [onLoad , setOnLoad] = useState(true)
  const [emptyInventory,setEmptyInventory] = useState(true);
  const [amount,setAmount] = useState(0);
  
  const userid = localStorage.getItem('userid')
  const navigate = useNavigate()

  const deleteProduct = (index) => {
    const newInventory = [...inventory];
    fetch(`http://localhost:1111/deletefromcart/${inventory[index].id}`,{
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({userid})
      })
      .then(res => {
        if(res.status === 200){
            console.log("Success!")
        }
      })
      newInventory.splice(index, 1);
      setAmount(newInventory.reduce((sum, item) => sum + item.price, 0))
      setInventory(newInventory);
      setEmptyInventory(newInventory.length === 0);
  }

  useEffect(() => {
    setOnLoad(true)
    const encodedUserId = encodeURIComponent(userid);
    fetch(`http://localhost:1111/getstore?userid=${encodedUserId}`)
    .then(res =>
        { 
            if(res.status === 404) {
              return []
            }
            if(!res.ok){
                throw new Error(res.statusText)
            }
            return res.json()
        })
    .then(data => {
      const inventoryData = Array.isArray(data.items) ? data.items : [];
      setInventory(inventoryData);
      setEmptyInventory(inventoryData.length === 0);
      setAmount(data.items.reduce((sum, item) => sum + item.price, 0))
      setOnLoad(false);
    })
    .catch((err) => setOnLoad(false))
  },[])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && emptyInventory) {
        navigate('/checkout')
      }
    }
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); 

  return (
    <>
        <section className='flex flex-col items-center mt-8 h-screen'>
          <div className='flex justify-evenly w-full'>
            <p className="text-3xl mb-6">Inventory Management</p>
            <Button variant="contained" color="primary">
              Proceed Checkout ₹{amount}
            </Button>
          </div>
            { onLoad ? (
                <Spinner />
            ) : (
                emptyInventory ? (
                  <section className='bg-slate-50 flex-1 w-full justify-center items-center flex'>
                    <div>Oops! Your inventory is Empty</div>
                  </section>
                ) : (
                    <div className="grid md:grid-cols-2 w-full p-4 gap-4">
                        {inventory?.map((product, index) => (
                            <div key={index} className="w-full">
                                <Paper className="flex justify-between items-center p-4">
                                    <div>
                                        <Typography variant="h6">{product.brand+" "+product.name}</Typography>
                                        <Typography variant="body1">Rs.{product.price}</Typography>
                                    </div>
                                    <IconButton edge="end" color="secondary" onClick={() => deleteProduct(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Paper>
                            </div>
                        ))}
                    </div>
                )
            )}

        </section>
    </>
  );
};

export default Inventory;
