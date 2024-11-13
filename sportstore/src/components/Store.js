import React, { useEffect, useState } from 'react'
import Cards from './Cards'
import Spinner from '../utils/Spinner'
import { Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Store() {

  const [items,getItems] = useState([])
  const [loading,setLoading] = useState(true)
  const [category,getCategory] = useState('')
  const [addedToCart,setAddedToCart] = useState(false)

  const handleChange = (event) => {
    getCategory(event.target.value);
  };

  const userid = localStorage.getItem('userid')

  useEffect(() => {
    setLoading(true)
    let url = "http://localhost:1111/getstore";
    if (category && category !== '') {
      url += `/${category}`;
    }
    fetch(url)
    .then(res => {
      if(!res.ok) {
        throw new Error(res.statusText)
      }
      return res.json()
    })
    .then(data => {
      getItems(data.items)
      setLoading(false)
    })
  },[category])

  const addtocart = (id) => {
      setAddedToCart(true)
      setTimeout(() => {
        setAddedToCart(false)
      },1000)
      fetch(`http://localhost:1111/addtocart/${items[id].id}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userid: userid})
      })
      .then(res => {
        if(!res.ok) {
          throw new Error(res.statusText)
        }
      })
  }

  return (
    <>
        {
          addedToCart && 
          <div className='z-50 h-16 m-4 px-4 absolute right-0 text-white bg-green-500 flex justify-center items-center '>
            <span className="material-symbols-outlined">check</span>
            <p className='pl-2'>Added To Cart Successfully!</p>
          </div>
        }
      <section className='h-screen flex flex-col items-end relative'>
        <div className='flex justify-between w-full items-center'>
          <p className='text-4xl px-10 pt-8'>{category ? category : "All"}</p>
          <div className='w-72 p-4 pb-0 flex items-center'>
            <FormControl variant='standard' fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChange}
                >
                <MenuItem value={"Apparel"}>Apparel</MenuItem>
                <MenuItem value={"Equipment"}>Equipment</MenuItem>
                <MenuItem value={"Accessories"}>Accessories</MenuItem>
                <MenuItem value={"Safety Gear"}>Safety Gear</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={() => getCategory('')}>Clear</Button>
          </div>
        </div>
        <div className='p-8 flex flex-wrap space-y-4 w-full'>
          {loading ? (
            <div className='w-full'>
              <Spinner />
            </div>
            ) : (
            items?.map((item, i) => (
              <Cards 
              key={i} 
              name={item.name} 
                image_url={item.image_url} 
                quantity={item.quantity} 
                price={item.price} 
                brand={item.brand} 
                addtocart={addtocart} 
                index={i}
              />
            ))
          )}
        </div>
      </section>
    </>
  )
}

export default Store