import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPages from "../components/Auth/AuthPages";
import Todo from "../components/Pages/Todo";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
