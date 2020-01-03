import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { BASE_URL } from '../constants/api-endpoint';

// Create an Axios Client with defaults
const client = axios.create({
  baseURL: BASE_URL,
});

// Request Wrapper with default success/error actions
export default async (configs: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse<any>) => response.data;

  const onError = (error: any) =>
    Promise.reject(error.response || error.message);

  try {
    const response = await client(configs);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
