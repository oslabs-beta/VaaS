import axiosInstance from '../axios/axiosConfig';

export const loginUser = async (payload: {
  username: string;
  password: string;
}) => {
  const response = await axiosInstance.put('/auth', payload);
  return response;
};
