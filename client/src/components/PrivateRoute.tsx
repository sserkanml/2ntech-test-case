import  { ReactElement } from "react";
import {  Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component,}: { element: ReactElement }) => {
    const token = localStorage.getItem("token");
  
    if (!token) {   
      // Token yoksa login sayfasına yönlendir
      return <Navigate to="/login" />;
    }
  
    // Token varsa, Component'i render et
    return Component;
  };

export default PrivateRoute;
