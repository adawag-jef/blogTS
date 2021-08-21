import React from "react";

const Footer = () => {
  return (
    <div className="text-center bg-light py-4">
      <h6>Welcome to BlogTS</h6>
      <a
        href="http:/localhost:3000"
        target="_blank"
        rel="noreferrer"
        className="mb-2 d-block text-info"
      >
        http:/localhost:3000
      </a>
      <p>Copyright &copy; 2021</p>
    </div>
  );
};

export default Footer;
