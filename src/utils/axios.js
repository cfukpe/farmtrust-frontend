import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' });

axiosInstance.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${window.localStorage.getItem('accessToken')}`;
  return req;
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
  // (error) => Promise.reject((error))
);

export const APIErrorHandler = response => {
  return response.message ? response.message : error
  if (error.status == 402) {

  }


}

export default axiosInstance;
