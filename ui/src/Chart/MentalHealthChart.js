import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import './MentalHealthChart.css'
import SideMenu from '../SideMenu/SideMenu';

const MoodData = () => {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


  const moodCategories = ['Alone', 'Depression','Stress','Happy','Motivation','Anger','Sad','others']; // Add more categories as needed

  const moodCategoryCounts = Array(moodCategories.length).fill(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/get-mood', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setMoodData(response.data.moods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mood data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  moodData.forEach((entry) => {
    const categoryIndex = moodCategories.indexOf(entry.intent);
    if (categoryIndex !== -1) {
      moodCategoryCounts[categoryIndex]++;
    }
  });

  const data = {
    labels: moodCategories, // Initialize empty labels array
    datasets: [
      {
        label: 'Mood Graph of Past One Weak',
        data: moodCategoryCounts, // Initialize empty data array
        borderColor: 'aqua',
        backgroundColor: 'rgba(44, 174, 239, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
  };

 

  var timestamps = moodData.map((entry) => {
    const date = new Date(entry.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
//  data.labels = timestamps;


  return (
    <div>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
          <SideMenu/>
          </div>
          <div className='col-md-9'>
          <h2>Mood Data</h2>
       {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='container'>
          <div className='chart-container'>
            <Bar data={data} options={options} />
          </div>
        </div>
      )}
          </div>
        </div>
        
      </div>
     
     
    </div>
  );
};

export default MoodData;
