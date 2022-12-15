import axiosInstance from '../axios/axiosConfig';

export const registerUser = async (payload: {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}) => {
  const response = await axiosInstance.post('/auth', payload);
  return response;
};
