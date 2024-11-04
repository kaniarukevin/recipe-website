import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recipe = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/recipes');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
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
            <h1></h1>
            <ul>
                {data.map(item => (
                    <li key={item.recipename}>{item.recipeName}</li> // Adjust according to your data structure
                ))}
            </ul>
        </div>
    );
};

export default Recipe;
