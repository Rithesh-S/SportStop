import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utils/Spinner';
import { Paper, Typography } from '@mui/material';

function Checkout() {
  const [inventory, setInventory] = useState([]);
  const [onLoad, setOnLoad] = useState(true);
  const [amount, setAmount] = useState(0);
  const [overlay ,showOverlay] = useState(false)
  const [buyLoad,setBuyLoad] = useState(false)

  const navigate = useNavigate();
  const userid = localStorage.getItem('userid');

  useEffect(() => {
    setOnLoad(true);
    const encodedUserId = encodeURIComponent(userid);
    fetch(`http://localhost:1111/getstore?userid=${encodedUserId}`)
      .then(res => {
        if (res.status === 404) {
          return [];
        }
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        const inventoryData = Array.isArray(data.items) ? data.items : [];
        const updatedInventory = inventoryData.map(product => ({
          ...product,
          quantity: 1, 
        }));
        setInventory(updatedInventory);
        setAmount(updatedInventory.reduce((sum, item) => sum + item.price, 0));
        setOnLoad(false);
      })
      .catch(err => setOnLoad(false));
  }, []);

  const buyProduct = async () => {
    showOverlay(prev => !prev);
    setBuyLoad(true); 
  
    try {
      await updateStore(inventory);
      await addSales(inventory);    
  
      showOverlay(true);          
    } catch (error) {
      console.error('Error while processing the buy action:', error);
    } finally {
      setBuyLoad(false);          
    }
  };
  
  const updateStore = async (inventory) => {
    try {
      const updateRequests = inventory.map(async (product) => {
        const response = await fetch(`http://localhost:1111/updatestore/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: product.quantity })
        });
  
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
  
        return response.json();
      });
  
      await Promise.all(updateRequests);
    } catch (error) {
      console.error('Error while updating the store:', error);
      throw error; 
    }
  };
  
  const addSales = async (inventory) => {
    try {
      const salesRequests = inventory.map(async (product) => {
        const response = await fetch('http://localhost:1111/addsales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: product.id,
            brand: product.brand,
            name: product.name,
            quantity: product.quantity
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to add sales product');
        }
  
        return response.json();
      });
  
      await Promise.all(salesRequests);
    } catch (error) {
      console.error('Error while adding sales:', error);
      throw error; 
    }
  };  

  const incrementQuantity = (index) => {
    const newInventory = [...inventory];
    newInventory[index].quantity += 1;
    setInventory(newInventory);
    updateTotalAmount(newInventory);
  };

  const decrementQuantity = (index) => {
    const newInventory = [...inventory];
    if (newInventory[index].quantity > 1) {
      newInventory[index].quantity -= 1;
      setInventory(newInventory);
      updateTotalAmount(newInventory);
    }
  };

  const updateTotalAmount = (inventory) => {
    const total = inventory.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setAmount(total);
  };

  return (
    <>
      <section className='min-h-screen flex flex-col bg-slate-50 relative scrollbar-hide'>
        { overlay && (
          buyLoad ? 
          <Spinner/>
          :
          (
            <section className='absolute z-10 h-screen w-full flex flex-col items-center bg-[#645d5d79] p-8'>
              <p className='text-3xl text-green-700 font-semibold bg-[#f2ffed] px-2 p-2 rounded-md'>Purchased Successfully</p>
              <Paper className='m-4 rounded-md flex flex-1 bg-[#f2ffed] w-1/2'>
                <div className='p-4 flex-col bg-[#f6fcf3] flex flex-1 text-green-700 '>
                  <Typography variant="h4" className="mb-4">Bill</Typography>
                  <div className='flex-1 py-4 overflow-y-scroll scrollbar-hide'>
                    <div>
                      {inventory.map((product, index) => (
                        <div key={index} className="flex text-black justify-between mb-2">
                          <Typography variant="body1">{`${product.brand} - ${product.name} (x${product.quantity})`}</Typography>
                          <Typography variant="body1">Rs.{(product.price * product.quantity).toFixed(2)}</Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 border-t pt-2">
                    <Typography variant="h6">Total Amount:</Typography>
                    <Typography variant="h6">Rs.{amount.toFixed(2)}</Typography>
                  </div>
                </div>
              </Paper>
              <button className='px-8 p-2 bg-blue-600 text-white rounded-md' onClick={() => showOverlay(prev => !prev)}>Close</button>
            </section>
          )
        )
        }
        <header className='h-20 bg-white shadow-md flex items-center px-4 justify-between scrollbar-hide'>
          <div className='flex space-x-10 items-center'>
            <span className="material-symbols-outlined" onClick={() => navigate('/home/inventory', { state: { message: true } })}>arrow_back</span>
            <h1 className='text-3xl'>Checkout</h1>
          </div>
          <button className='px-8 p-2 bg-green-600 text-white rounded-md' onClick={buyProduct}>Buy</button>
        </header>
        <div className={`flex-1 grid scrollbar-hide ${!onLoad && "grid-cols-2"}`}>
          <div className='w-full overflow-y-scroll scrollbar-hide'>
            {onLoad ? (
              <Spinner />
            ) : (
              <div className="grid w-full p-4 gap-4">
                {inventory.map((product, index) => (
                  <div key={index} className="w-full">
                    <Paper className="flex justify-between items-center p-4">
                      <div>
                        <Typography variant="h6">{product.brand + " - " + product.name}</Typography>
                        <Typography variant="body1">Rs.{product.price}</Typography>
                      </div>
                      <div className='flex items-center text-3xl border shadow-md'>
                        <button className="p-2 px-4 border-r bg-slate-100" onClick={() => incrementQuantity(index)}>+</button>
                        <p className='p-2 px-4 text-xl'>{product.quantity}</p>
                        <button className="p-2 px-4 border-l bg-slate-100" onClick={() => decrementQuantity(index)}>-</button>
                      </div>
                    </Paper>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Paper className='m-4 rounded-md flex bg-white'>
            <div className='p-4 flex-col flex flex-1'>
              <Typography variant="h4" className="mb-4">Bill</Typography>
              <div className='flex-1 py-4 overflow-y-scroll scrollbar-hide'>
                <div>
                  {inventory.map((product, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <Typography variant="body1">{`${product.brand} - ${product.name} (x${product.quantity})`}</Typography>
                      <Typography variant="body1">Rs.{(product.price * product.quantity).toFixed(2)}</Typography>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-4 border-t pt-2">
                <Typography variant="h6">Total Amount:</Typography>
                <Typography variant="h6">Rs.{amount.toFixed(2)}</Typography>
              </div>
            </div>
          </Paper>
        </div>
      </section>
    </>
  );
}

export default Checkout;
