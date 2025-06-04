// import React, { useState, useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import './style.css';

// const ChartFromLocalStorage = () => {
//   const [temperatureChartData, setTemperatureChartData] = useState(null);
//   const [humidityChartData, setHumidityChartData] = useState(null);
//   const [uvChartData, setUvChartData] = useState(null);
//   const [selectedYear, setSelectedYear] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [availableYears, setAvailableYears] = useState([]);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [availableDates, setAvailableDates] = useState([]);
//   const temperatureChartRef = useRef(null);
//   const humidityChartRef = useRef(null);
//   const uvChartRef = useRef(null);

// //   useEffect(() => {
// //   const fetchDataFromLocalStorage = () => {
// //     const data = localStorage.getItem("esp32sensordataData");

// //     if (data) {
// //       const jsonData = JSON.parse(data);
// //       let years = new Set();
// //       jsonData.forEach(item => {
// //         const year = item.DATE.split('-')[0];
// //         years.add(year);
// //       });
// //       setAvailableYears(Array.from(years));
// //       const latestYear = Array.from(years).sort((a, b) => b - a)[0];
// //       setSelectedYear(latestYear);
// //     }
// //   };

// //   fetchDataFromLocalStorage();
// // }, []);

// // useEffect(() => {
// //   const fetchDataFromLocalStorage = () => {
// //     const data = localStorage.getItem("esp32sensordataData");

// //     if (data) {
// //       const jsonData = JSON.parse(data);
// //       let months = new Set();
// //       jsonData.forEach(item => {
// //         const year = item.DATE.split('-')[0];
// //         const month = item.DATE.split('-')[1];
// //         if (year === selectedYear) {
// //           months.add(month);
// //         }
// //       });
// //       setAvailableMonths(Array.from(months));
// //       const latestMonth = Array.from(months).sort((a, b) => b - a)[0];
// //       setSelectedMonth(latestMonth);
// //     }
// //   };

// //   fetchDataFromLocalStorage();
// // }, [selectedYear]);

// // useEffect(() => {
// //   const fetchDataFromLocalStorage = () => {
// //     const data = localStorage.getItem("esp32sensordataData");

// //     if (data) {
// //       const jsonData = JSON.parse(data);
// //       let dates = new Set();
// //       jsonData.forEach(item => {
// //         const year = item.DATE.split('-')[0];
// //         const month = item.DATE.split('-')[1];
// //         const date = item.DATE.split('-')[2];
// //         if (year === selectedYear && month === selectedMonth) {
// //           dates.add(date);
// //         }
// //       });
// //       setAvailableDates(Array.from(dates));
// //       const latestDate = Array.from(dates).sort((a, b) => b - a)[0];
// //       setSelectedDate(latestDate);
// //     }
// //   };

// //   fetchDataFromLocalStorage();
// // }, [selectedYear, selectedMonth]);

// //   useEffect(() => {
// //     const fetchDataFromLocalStorage = () => {
// //       const data = localStorage.getItem("esp32sensordataData");

// //       if (data) {
// //         const jsonData = JSON.parse(data);
// //         let dates = new Set();
// //         jsonData.forEach(item => {
// //           const year = item.DATE.split('-')[0];
// //           const month = item.DATE.split('-')[1];
// //           const date = item.DATE.split('-')[2];
// //           if (year === selectedYear && month === selectedMonth) {
// //             dates.add(date);
// //           }
// //         });
// //         setAvailableDates(Array.from(dates));
// //         setSelectedDate(Array.from(dates)[0]);
// //       }
// //     };

// //     fetchDataFromLocalStorage();
// //   }, [selectedYear, selectedMonth]);

// //   useEffect(() => {
// //     const fetchDataFromLocalStorage = () => {
// //       const data = localStorage.getItem("IoTDataData");

// //       if (data) {
// //         const jsonData = JSON.parse(data);
// //         const sortedData = jsonData.sort((a, b) => {
// //           const timeA = a.Time.split(':').map(num => parseInt(num));
// //           const timeB = b.Time.split(':').map(num => parseInt(num));
// //           if (timeA[0] !== timeB[0]) {
// //             return timeA[0] - timeB[0]; // Compare hours
// //           } else if (timeA[1] !== timeB[1]) {
// //             return timeA[1] - timeB[1]; // Compare minutes
// //           } else {
// //             return timeA[2] - timeB[2]; // Compare seconds
// //           }
// //         });
  
// //         let labels = [];
// //         let temperatureData = [];
// //         let humidityData = [];
// //         let uvData = [];
  
// //         sortedData.forEach(item => {
// //           const date = item.DATE.split('-')[2];
// //           if (date === selectedDate && item.DATE.split('-')[1] === selectedMonth && item.DATE.split('-')[0] === selectedYear) {
// //             const time = item.Time;
// //             const temperature = parseFloat(item.temperature);
// //             const humidity = parseFloat(item.humidity);
// //             const uv = parseFloat(item.UV);
// //             if (time && temperature && humidity && uv) {
// //               labels.push(time);
// //               temperatureData.push(temperature);
// //               humidityData.push(humidity);
// //               uvData.push(uv);
// //             }
// //           }
// //         });

// //         const temperatureChartConfig = {
// //           type: 'line',
// //           data: {
// //             labels: labels,
// //             datasets: [
// //               {
// //                 label: 'Temperature',
// //                 data: temperatureData,
// //                 borderColor: (context) => {
// //                   return context.raw > 27 ? 'red' : 'rgba(255, 206, 86, 1)';
// //                 },
// //                 backgroundColor: 'rgba(255, 206, 86, 0.2)',
// //                 borderWidth: 2
// //               }
// //             ]
// //           },
// //           options: {
// //             scales: {
// //               x: {
// //                 type: 'category',
// //                 title: {
// //                   display: true,
// //                   text: 'Time',
// //                   color: 'black'
// //                 }
// //               },
// //               y: {
// //                 title: {
// //                   display: true,
// //                   text: 'Temperature',
// //                   color: 'black'
// //                 },
// //                 ticks: {
// //                   callback: function(value, index, values) {
// //                     if (parseFloat(value) > 27 && window.innerWidth > 606) {
// //                       return value.toFixed(2) + ' (High)';
// //                     } else {
// //                       return value.toFixed(2);
// //                     }
// //                   },
// //                   color: function(context) {
// //                     return context.tick.value > 27 ? 'red' : 'black';
// //                   }
// //                 }
// //               }
// //             },
// //             responsive: true
// //           }
// //         };

// //         const humidityChartConfig = {
// //           type: 'line',
// //           data: {
// //             labels: labels,
// //             datasets: [
// //               {
// //                 label: 'Humidity',
// //                 data: humidityData,
// //                 borderColor: (context) => {
// //                   return context.raw < 59 ? 'blue' : 'rgba(68, 95, 169, 1)' && context.raw > 62 ? 'red' : 'rgba(75, 192, 192, 1)';
// //                 },
// //                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
// //                 borderWidth: 2 // กำหนดความหนาของเส้น
// //               }
// //             ]
// //           },
// //           options: {
// //             scales: {
// //               x: {
// //                 type: 'category',
// //                 title: {
// //                   display: true,
// //                   text: 'Time',
// //                   color: 'black'
// //                 }
// //               },
// //               y: {
// //                 title: {
// //                   display: true,
// //                   text: 'Humidity',
// //                   color: 'black'
// //                 },
// //                 ticks: {
// //                   callback: function(value, index, values) {
// //                     if (parseFloat(value) < 59 && window.innerWidth > 606) {
// //                       return value.toFixed(2) + ' (Low)';
// //                     }else if (parseFloat(value) > 62 && window.innerWidth > 606) {
// //                       return value.toFixed(2) + ' (High)';
// //                     } else {
// //                       return value.toFixed(2);
// //                     }
// //                   },
// //                   color: function(context) {
// //                     return context.tick.value < 59 ? 'blue' : 'black' && context.tick.value > 62 ? 'red' : 'black';
// //                   }
// //                 }
// //               }
// //             },
// //             responsive: true
// //           }
// //         };
        

// //         const uvChartConfig = {
// //           type: 'line',
// //           data: {
// //             labels: labels,
// //             datasets: [
// //               {
// //                 label: 'UV',
// //                 data: uvData,
// //                 borderColor: (context) => {
// //                   return context.raw > 11 ? 'red' : 'rgba(192, 75, 192, 1)';
// //                 },
// //                 // backgroundColor: (context) => {
// //                 //   return context.raw > 12 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(192, 75, 192, 0.2)';
// //                 // },
// //                 backgroundColor: 'rgba(192, 75, 192, 0.2)',
// //                 borderWidth: 2
// //               }
// //             ]
// //           },
// //           options: {
// //             scales: {
// //               x: {
// //                 type: 'category',
// //                 title: {
// //                   display: true,
// //                   text: 'Time',
// //                   color: 'black'
// //                 }
// //               },
// //               y: {
// //                 title: {
// //                   display: true,
// //                   text: 'UV',
// //                   color: 'black'
// //                 },
// //                 ticks: {
// //                   callback: function(value, index, values) {
// //                     if (parseFloat(value) > 11 && window.innerWidth > 606) {
// //                       return value.toFixed(2) + ' (Dangerous)';
// //                     } else {
// //                       return value.toFixed(2);
// //                     }
// //                   },
// //                   color: function(context) {
// //                     return context.tick.value > 11 ? 'red' : 'black';
// //                   }
// //                 }
// //               }
// //             },
// //             responsive: true
// //           }
// //         };

// //         setTemperatureChartData(temperatureChartConfig);
// //         setHumidityChartData(humidityChartConfig);
// //         setUvChartData(uvChartConfig);
// //       }
// //     };

// //     fetchDataFromLocalStorage();
// //   }, [selectedYear, selectedMonth, selectedDate]);

// // ✅ ปลอดภัยสำหรับ esp32sensordataData ที่อาจมีข้อมูลไม่ครบ

//   useEffect(() => {
//     const data = localStorage.getItem("esp32sensordataData");
//     if (!data) return;

//     const jsonData = JSON.parse(data);
//     let years = new Set();

//     jsonData.forEach(item => {
//       if (!item?.DATE) return;
//       const [year] = item.DATE.split("-");
//       if (year) years.add(year);
//     });

//     const yearArray = Array.from(years);
//     setAvailableYears(yearArray);

//     if (yearArray.length > 0) {
//       const latestYear = yearArray.sort((a, b) => b - a)[0];
//       setSelectedYear(latestYear);
//     }
//   }, []);

//   useEffect(() => {
//     const data = localStorage.getItem("esp32sensordataData");
//     if (!data) return;

//     const jsonData = JSON.parse(data);
//     let months = new Set();

//     jsonData.forEach(item => {
//       if (!item?.DATE) return;
//       const [year, month] = item.DATE.split("-");
//       if (year === selectedYear) months.add(month);
//     });

//     const monthArray = Array.from(months);
//     setAvailableMonths(monthArray);

//     if (monthArray.length > 0) {
//       const latestMonth = monthArray.sort((a, b) => b - a)[0];
//       setSelectedMonth(latestMonth);
//     }
//   }, [selectedYear]);

//   useEffect(() => {
//     const data = localStorage.getItem("esp32sensordataData");
//     if (!data) return;

//     const jsonData = JSON.parse(data);
//     let dates = new Set();

//     jsonData.forEach(item => {
//       if (!item?.DATE) return;
//       const [year, month, date] = item.DATE.split("-");
//       if (year === selectedYear && month === selectedMonth) dates.add(date);
//     });

//     const dateArray = Array.from(dates);
//     setAvailableDates(dateArray);

//     if (dateArray.length > 0) {
//       const latestDate = dateArray.sort((a, b) => b - a)[0];
//       setSelectedDate(latestDate);
//     }
//   }, [selectedYear, selectedMonth]);

//   useEffect(() => {
//     const fetchDataFromLocalStorage = () => {
//       const data = localStorage.getItem("esp32sensordataData");

//       if (!data) return;

//       const jsonData = JSON.parse(data);
//       const sortedData = jsonData.filter(item => item?.Time).sort((a, b) => {
//         const timeA = a.Time.split(":").map(Number);
//         const timeB = b.Time.split(":").map(Number);
//         if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
//         if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
//         return timeA[2] - timeB[2];
//       });

//       let labels = [];
//       let temperatureData = [];
//       let humidityData = [];
//       let uvData = [];

//       sortedData.forEach(item => {
//         if (!item?.DATE || !item?.Time) return;
//         const [year, month, date] = item.DATE.split("-");
//         if (year === selectedYear && month === selectedMonth && date === selectedDate) {
//           const temperature = parseFloat(item.temperature);
//           const humidity = parseFloat(item.humidity);
//           const uv = parseFloat(item.UV);
//           if (!isNaN(temperature) && !isNaN(humidity) && !isNaN(uv)) {
//             labels.push(item.Time);
//             temperatureData.push(temperature);
//             humidityData.push(humidity);
//             uvData.push(uv);
//           }
//         }
//       });

//       // (config chart code remains the same as before)
      
//     };

//     fetchDataFromLocalStorage();
//   }, [selectedYear, selectedMonth, selectedDate]);


// ////////////////////////////////

//   useEffect(() => {
//     if (temperatureChartData) {
//       if (temperatureChartRef.current) {
//         temperatureChartRef.current.destroy();
//       }

//       const temperatureCanvas = document.getElementById('temperatureChart');
//       const temperatureCtx = temperatureCanvas.getContext('2d');
//       temperatureChartRef.current = new Chart(temperatureCtx, temperatureChartData);
//     }
//   }, [temperatureChartData]);

//   useEffect(() => {
//     if (humidityChartData) {
//       if (humidityChartRef.current) {
//         humidityChartRef.current.destroy();
//       }

//       const humidityCanvas = document.getElementById('humidityChart');
//       const humidityCtx = humidityCanvas.getContext('2d');
//       humidityChartRef.current = new Chart(humidityCtx, humidityChartData);
//     }
//   }, [humidityChartData]);

//   useEffect(() => {
//     if (uvChartData) {
//       if (uvChartRef.current) {
//         uvChartRef.current.destroy();
//       }

//       const uvCanvas = document.getElementById('uvChart');
//       const uvCtx = uvCanvas.getContext('2d');
//       uvChartRef.current = new Chart(uvCtx, uvChartData);
//     }
//   }, [uvChartData]);

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//   };

//   const handleMonthChange = (e) => {
//     setSelectedMonth(e.target.value);
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//   };

//   return (
// <>
// <div className='body'>
//       <div className='topbar'>
//         <label htmlFor="year" >Select Year: </label>
//         <select id="year" name="year" onChange={handleYearChange} value={selectedYear}>
//           {availableYears.map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>
//         <label htmlFor="month">Month: </label>
//         <select id="month" name="month" onChange={handleMonthChange} value={selectedMonth}>
//           {availableMonths.map(month => (
//             <option key={month} value={month}>{month}</option>
//           ))}
//         </select>
//         <label htmlFor="date">Date: </label>
//         <select id="date" name="date" onChange={handleDateChange} value={selectedDate}>
//           {availableDates.map(date => (
//             <option key={date} value={date}>{date}</option>
//           ))}
//         </select>
//       </div>
//       <h1>Date: {selectedYear}-{selectedMonth}-{selectedDate}</h1>
//       <div className='graph'>
//         <h1  className='graphname' style={{ marginTop: '20px', marginBottom: '7px' }}>Temperature Chart</h1>
//         <canvas id="temperatureChart"></canvas>
//       </div>
//       <div className='graph'>
//         <h1 className='graphname' style={{ marginTop: '20px', marginBottom: '7px' }}>Humidity Chart</h1>
//         <canvas id="humidityChart"></canvas>
//       </div>
//       <div className='graph'>
//         <h1 className='graphname' style={{ marginTop: '20px', marginBottom: '7px' }}>UV Chart</h1>
//         <canvas id="uvChart"></canvas>
//       </div>
//     </div>
// </>
    
//   );
// };

// export default ChartFromLocalStorage;

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './style.css';

const ChartFromLocalStorage = () => {
  const [temperatureChartData, setTemperatureChartData] = useState(null);
  const [humidityChartData, setHumidityChartData] = useState(null);
  const [uvChartData, setUvChartData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const temperatureChartRef = useRef(null);
  const humidityChartRef = useRef(null);
  const uvChartRef = useRef(null);

  useEffect(() => {
    const data = localStorage.getItem("esp32sensordataData");
    if (!data) return;

    const jsonData = JSON.parse(data);
    let years = new Set();

    jsonData.forEach(item => {
      if (!item?.DATE) return;
      const [year] = item.DATE.split("-");
      if (year) years.add(year);
    });

    const yearArray = Array.from(years);
    setAvailableYears(yearArray);

    if (yearArray.length > 0) {
      const latestYear = yearArray.sort((a, b) => b - a)[0];
      setSelectedYear(latestYear);
    }
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("esp32sensordataData");
    if (!data) return;

    const jsonData = JSON.parse(data);
    let months = new Set();

    jsonData.forEach(item => {
      if (!item?.DATE) return;
      const [year, month] = item.DATE.split("-");
      if (year === selectedYear) months.add(month);
    });

    const monthArray = Array.from(months);
    setAvailableMonths(monthArray);

    if (monthArray.length > 0) {
      const latestMonth = monthArray.sort((a, b) => b - a)[0];
      setSelectedMonth(latestMonth);
    }
  }, [selectedYear]);

  useEffect(() => {
    const data = localStorage.getItem("esp32sensordataData");
    if (!data) return;

    const jsonData = JSON.parse(data);
    let dates = new Set();

    jsonData.forEach(item => {
      if (!item?.DATE) return;
      const [year, month, date] = item.DATE.split("-");
      if (year === selectedYear && month === selectedMonth) dates.add(date);
    });

    const dateArray = Array.from(dates);
    setAvailableDates(dateArray);

    if (dateArray.length > 0) {
      const latestDate = dateArray.sort((a, b) => b - a)[0];
      setSelectedDate(latestDate);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const data = localStorage.getItem("esp32sensordataData");
    if (!data) return;

    const jsonData = JSON.parse(data);
    const sortedData = jsonData.filter(item => item?.Time).sort((a, b) => {
      const timeA = a.Time.split(":" ).map(Number);
      const timeB = b.Time.split(":" ).map(Number);
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
      return timeA[2] - timeB[2];
    });

    let labels = [];
    let temperatureData = [];
    let humidityData = [];
    let uvData = [];

    sortedData.forEach(item => {
      if (!item?.DATE || !item?.Time) return;
      const [year, month, date] = item.DATE.split("-");
      if (year === selectedYear && month === selectedMonth && date === selectedDate) {
        const temperature = parseFloat(item.temperature);
        const humidity = parseFloat(item.humidity);
        const uv = parseFloat(item.UV);
        if (!isNaN(temperature) && !isNaN(humidity) && !isNaN(uv)) {
          labels.push(item.Time);
          temperatureData.push(temperature);
          humidityData.push(humidity);
          uvData.push(uv);
        }
      }
    });

    const temperatureChartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature',
            data: temperatureData,
            borderColor: (ctx) => ctx.raw > 27 ? 'red' : 'orange',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: 'Time', color: 'black' },
          },
          y: {
            title: { display: true, text: 'Temperature (°C)', color: 'black' },
          },
        },
        responsive: true,
      },
    };

    const humidityChartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Humidity',
            data: humidityData,
            borderColor: (ctx) => ctx.raw < 59 ? 'blue' : ctx.raw > 62 ? 'red' : 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: 'Time', color: 'black' },
          },
          y: {
            title: { display: true, text: 'Humidity (%)', color: 'black' },
          },
        },
        responsive: true,
      },
    };

    const uvChartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'UV Index',
            data: uvData,
            borderColor: (ctx) => ctx.raw > 11 ? 'red' : 'purple',
            backgroundColor: 'rgba(128, 0, 128, 0.2)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: 'Time', color: 'black' },
          },
          y: {
            title: { display: true, text: 'UV Index', color: 'black' },
          },
        },
        responsive: true,
      },
    };

    setTemperatureChartData(temperatureChartConfig);
    setHumidityChartData(humidityChartConfig);
    setUvChartData(uvChartConfig);
  }, [selectedYear, selectedMonth, selectedDate]);

  useEffect(() => {
    if (temperatureChartData) {
      if (temperatureChartRef.current) temperatureChartRef.current.destroy();
      const ctx = document.getElementById('temperatureChart').getContext('2d');
      temperatureChartRef.current = new Chart(ctx, temperatureChartData);
    }
  }, [temperatureChartData]);

  useEffect(() => {
    if (humidityChartData) {
      if (humidityChartRef.current) humidityChartRef.current.destroy();
      const ctx = document.getElementById('humidityChart').getContext('2d');
      humidityChartRef.current = new Chart(ctx, humidityChartData);
    }
  }, [humidityChartData]);

  useEffect(() => {
    if (uvChartData) {
      if (uvChartRef.current) uvChartRef.current.destroy();
      const ctx = document.getElementById('uvChart').getContext('2d');
      uvChartRef.current = new Chart(ctx, uvChartData);
    }
  }, [uvChartData]);

  return (
    <div className='body'>
      <div className='topbar'>
        <label htmlFor="year">Select Year:</label>
        <select id="year" onChange={e => setSelectedYear(e.target.value)} value={selectedYear}>
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <label htmlFor="month">Month:</label>
        <select id="month" onChange={e => setSelectedMonth(e.target.value)} value={selectedMonth}>
          {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label htmlFor="date">Date:</label>
        <select id="date" onChange={e => setSelectedDate(e.target.value)} value={selectedDate}>
          {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <h1>Date: {selectedYear}-{selectedMonth}-{selectedDate}</h1>
      <div className='graph'><h2>Temperature Chart</h2><canvas id='temperatureChart'></canvas></div>
      <div className='graph'><h2>Humidity Chart</h2><canvas id='humidityChart'></canvas></div>
      <div className='graph'><h2>UV Chart</h2><canvas id='uvChart'></canvas></div>
    </div>
  );
};

export default ChartFromLocalStorage;
