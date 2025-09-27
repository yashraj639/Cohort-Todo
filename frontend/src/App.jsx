import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  return (
    <div>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
