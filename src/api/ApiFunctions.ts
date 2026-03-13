import axios from 'axios';

// GET request to fetch data from an API
export async function fetchData(url: string) {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}




