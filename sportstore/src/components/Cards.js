import React from 'react'

const Cards = ({ name, price, brand, quantity, image_url, index, addtocart}) => {
  return (
    <div className='bg-gray-50 w-60 grid shadow-lg mx-px'>
        <img src={image_url} alt={name} className='h-60'></img>
        <div className='grid p-4'>
             <div className='flex justify-between'>
                <p className='text-sm text-slate-400 font-semibold'>{brand}</p>
                <p className='text-xs'>Available: <span className='text-green-600'>{quantity}</span></p>
             </div>
                <p className='text-lg'>{name}</p>
             <div className='flex justify-between items-baseline'>
                <p className='text-lg'>₹{price}</p>
                <span className="material-symbols-outlined text-[18px] rounded-md px-6 text-[#fcfcfc] p-2 bg-green-500" onClick={() => addtocart(index)}>add_shopping_cart</span>
             </div>
        </div>
    </div>
  )
}

export default Cards