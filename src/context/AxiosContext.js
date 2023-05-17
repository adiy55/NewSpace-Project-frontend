import axios from "axios";
import React, { createContext } from "react";

const AxiosContext = createContext();
const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
  const publicAxios = axios.create({
    baseURL: "http://localhost:5000",
  });

  return <Provider value={{ publicAxios }}>{children}</Provider>;
};

export { AxiosContext, AxiosProvider };
