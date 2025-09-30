import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    </div>
  );
};

export default App;
