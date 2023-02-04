import axiosInstance from '../axios';

export const checkAuth = async () => {
  const response = await axiosInstance.get('/auth');
  console.log('auth', response);
  return response.data;
};
