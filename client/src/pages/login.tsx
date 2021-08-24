import React from "react";
import LoginPass from "../components/auth/LoginPass";

const Login = () => {
  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Login</h3>
        <LoginPass />
      </div>
    </div>
  );
};

export default Login;
