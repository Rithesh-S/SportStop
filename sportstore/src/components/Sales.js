import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import LineChart from './Linechart';
import PieChart from './PieChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Sales = () => {

  const [salesData,setSalesData] = useState([])

  
  useEffect(() => {
      const fetchSalesData = async () => {
          try {
            const response = await fetch('http://localhost:1111/getsales');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setSalesData(result.data); 
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };
    fetchSalesData();
}, []);

const productNames = salesData.map(item => item.name);
const productCounts = salesData.map(item => item.count);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: 'Product Sales',
        data: productCounts, 
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Data by Product',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
        <section className='h-[90dvh] grid grid-cols-2 '>
        {salesData.length > 0 ? (
            <>  
                <div className='row-span-2'>
                    <PieChart salesData={salesData}/>
                </div>
                    <div>
                        <Bar data={data} options={options} />
                    </div>
                    <div>
                        <LineChart salesData={salesData}/>
                    </div>
            </>
            ) : (
                <div className='col-span-2 flex justify-center items-center'>
                    <p className='text-2xl'>Loading sales data...</p>
                </div>
            )}
        </section>
    </>
  )
};

export default Sales;
