import axios from "axios";
import React, { createContext } from "react";

const AxiosContext = createContext();
const { Provider } = AxiosContext;

/*
For the server port run: ngrok http <port-num> 
and paste forwarding address as the base URL 
to get requests that are not localhost (i.e. from Expo app)
*/
const AxiosProvider = ({ children }) => {
  const publicAxios = axios.create({
    baseURL: "http://localhost:5000",
  });

  return <Provider value={{ publicAxios }}>{children}</Provider>;
};

export { AxiosContext, AxiosProvider };
