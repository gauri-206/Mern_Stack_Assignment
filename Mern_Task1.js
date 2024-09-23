import React, { useEffect, useState } from 'react';  
import { Bar } from 'react-chartjs-2';  
import axios from 'axios';  

const FuelChart = () => {  
    const [chartData, setChartData] = useState({});  
    const [fuelFillEvents, setFuelFillEvents] = useState([]);  
    const [totalFuelConsumed, setTotalFuelConsumed] = useState(0);  
    const [loading, setLoading] = useState(true);  

    useEffect(() => {  
        const fetchData = async () => {  
            try {  
                // Fetch data from response.json  
                const response = await axios.get('/path/to/your/response.json');  
                const fuelEntries = response.data;  

                const fillEvents = [];  
                let totalConsumed = 0;  

                let previousEntry = null;  

                // Process the data  
                fuelEntries.forEach(entry => {  
                    if (previousEntry) {  
                        // Calculate fuel fill events  
                        if (entry.fuel_level > previousEntry.fuel_level) {  
                            fillEvents.push({  
                                time: new Date(entry.timestamp).toLocaleTimeString(),  
                                fuelFilled: entry.fuel_level - previousEntry.fuel_level,  
                            });  
                        }  
                        // Calculate total fuel consumed  
                        if (entry.fuel_level < previousEntry.fuel_level) {  
                            totalConsumed += previousEntry.fuel_level - entry.fuel_level;  
                        }  
                    }  
                    previousEntry = entry;  
                });  

                setFuelFillEvents(fillEvents);  
                setTotalFuelConsumed(totalConsumed);  

                // Prepare data for chart  
                setChartData({  
                    labels: fillEvents.map(event => event.time),  
                    datasets: [  
                        {  
                            label: 'Fuel Filled',  
                            data: fillEvents.map(event => event.fuelFilled),  
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',  
                        },  
                    ],  
                });  
            } catch (error) {  
                console.error('Error fetching fuel data:', error);  
            } finally {  
                setLoading(false);  
            }  
        };  

        fetchData();  
    }, []);  

    if (loading) {  
        return <div>Loading...</div>;  
    }  

    return (  
        <div>  
            <h2>Fuel Fill Events</h2>  
            <Bar data={chartData} />  
            <div>Total Fuel Consumed: {totalFuelConsumed} liters</div>  
        </div>  
    );  
};  

export default FuelChart;