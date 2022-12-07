import axiosInstance from '../axios';

export const fetchUser = async () => {
  const response = await axiosInstance.get('/user');
  return response.data;
};
