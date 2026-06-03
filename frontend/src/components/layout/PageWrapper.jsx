import React from "react";

const PageWrapper = ({ title, children }) => {
  return (
    <>
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      <div className="page-body">
        {children}
      </div>
    </>
  );
};

export default PageWrapper;
