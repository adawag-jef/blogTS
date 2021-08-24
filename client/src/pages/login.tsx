import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPass from "../components/auth/LoginPass";

const Login = () => {
  const [sms, setSms] = useState(false);
  return (
    <div className="auth_page">
      <div className="auth_box">
        <h3 className="text-uppercase text-center mb-4">Login</h3>
        <LoginPass />
        <small className="row my-2 text-primary" style={{ cursor: "pointer" }}>
          <span className="col-6">
            <Link to="/forgot-password" className="col-6">
              Forgot password?
            </Link>
          </span>
          <span className="col-6" onClick={() => setSms(!sms)}>
            {sms ? "Sign in with Password" : "Sign in with SMS"}
          </span>
        </small>
      </div>
    </div>
  );
};

export default Login;
