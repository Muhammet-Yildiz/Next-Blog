import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL + '/api',
});


axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;


export const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);