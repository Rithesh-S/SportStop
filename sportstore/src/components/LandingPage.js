import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Container,
    Paper,
  } from '@mui/material';
  
  function LandingPage() {

    const navigate = useNavigate();

    return(
        <>
            <section className='h-full'>
            <div className="hero-section bg-blue-300">
        <Container className='flex flex-col space-y-4 justify-center items-center p-20'>
          <p className='text-6xl text-white'>Welcome to SportStop</p>
          <p className='text-2xl text-blue-900 pb-4'>Manage your sports activities efficiently</p>
          <Button variant="contained" color='info' className="w-[30%] hover:bg-blue-800 mt-12" onClick={() => navigate('/home/store', { state: { message: true } })}>
            Get Started
          </Button>
        </Container>
      </div>
      <div className=''>
      <Container className="py-20 flex flex-col space-y-10">
        <p className="text-center text-5xl ">
          Our Features
        </p>
        <div className='flex justify-around gap-6'>
          <div className='transition-all ease-in-out duration-200 hover:scale-105'>
            <Paper className="p-6 text-center ">
              <p className="text-xl font-semibold pb-4">Inventory Management</p>
              <p>Manage your inventory efficiently with real-time stock updates.</p>
              <p className="mt-2">Keep track of all products, monitor stock levels, and receive low-stock alerts to ensure you're always prepared.</p>
            </Paper>
          </div>

          <div className='transition-all ease-in-out duration-200 hover:scale-105'>
            <Paper className="p-6 text-center">
              <p className="text-xl font-semibold pb-4 mb-6 mt-2">Sales Tracking</p>
              <p>Track your sales and revenue in real-time.</p>
              <p className="mt-2 mb-5">Access detailed sales reports and analyze trends to make informed decisions for your store.</p>
            </Paper>
          </div>

          <div className='transition-all ease-in-out duration-200 hover:scale-105'>
            <Paper className="p-6 text-center">
              <p className="text-xl font-semibold pb-4">Customer Management</p>
              <p>Manage customer information and purchase history.</p>
              <p className="mt-2">Build strong relationships with your customers by understanding their preferences and shopping patterns.</p>
            </Paper>
          </div>

          <div className='transition-all ease-in-out duration-200 hover:scale-105'>
            <Paper className="p-6 text-center">
              <p className="text-xl font-semibold pb-4">Analytics & Reporting</p>
              <p>Gain insights with detailed analytics and reports.</p>
              <p className="mt-2">Analyze sales data, customer behavior, and inventory trends to optimize your store's performance.</p>
            </Paper>
          </div>
        </div>
      </Container>
      <div className="testimonials-section bg-gray-100 py-16">
      <Container className='flex flex-col space-y-6'>
          <div className='p-4'>
            <p className="text-center text-5xl">
              What Our Clients Say
            </p>
          </div>
          <div className='flex flex-wrap justify-around gap-4'>
            <Paper className="p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <p className="font-bold mb-2">Alice Johnson</p>
              <Typography>"SportStore has made managing our inventory and sales so much easier. The analytics feature is a game-changer!"</Typography>
            </Paper>
            <Paper className="p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <p className="font-bold mb-2">Mark Thompson</p>
              <Typography>"We’ve seen a significant improvement in customer satisfaction since using this platform. It’s intuitive and efficient."</Typography>
            </Paper>
            <Paper className="p-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <p className="font-bold mb-2">Lisa Wong</p>
              <Typography>"Managing our sports equipment inventory has never been easier. I highly recommend this tool for any sports store."</Typography>
            </Paper>
          </div>
        </Container>
      </div>
      <footer className="bg-sky-600 text-white py-4 text-center">
        <Container>
          <Typography>&copy; {new Date().getFullYear()} SportStop. All rights reserved.</Typography>
        </Container>
      </footer>
      </div>
            </section>
        </>
    )
  }

  export default LandingPage