import axiosInstance from '../axios';

export const fetchUser = async () => {
  const response = await axiosInstance.get('/user');
  return response.data;
};

export const editUser = async (body: {
  username: string;
  firstName?: string;
  lastName?: string;
  darkMode?: boolean;
}) => {
  const response = await axiosInstance.put('/user', body);
  return response.data;
};

export const changeDarkMode = async (body: { darkMode: boolean }) => {
  const response = await axiosInstance.put('/user', body);
  return response.data;
};
export const changeRefreshRate = async (body: { refreshRate: number }) => {
  const response = await axiosInstance.put('/user', body);
  return response.data;
};

export const deleteUser = async (body: {
  username: string;
  password: string;
}) => {
  const response = await axiosInstance.delete('/user', body);
  return response.data;
};
