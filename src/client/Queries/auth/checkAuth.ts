import axiosInstance from '../axios';

export const checkAuth = async () => {
  const response = await axiosInstance.get('/auth');
  return response.data;
};