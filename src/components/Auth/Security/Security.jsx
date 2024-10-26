import React, { useCallback, useState } from "react";
import LoginForm from "../LoginForm/LoginForm";
import ForgetPasswordForm from "../ForgetPasswordForm/ForgetPasswordForm";

export default function Security({unique = 1}) {
  const [isLogining, setisLogining] = useState(true);

  const handleResetPasswordBtn = useCallback(() => {
    setisLogining((prev) => !prev);
  }, []);

  return (
    <div className="container overflow-hidden px-0">
      <div className="row justify-content-center">
        <div className="position-relative d-flex align-items-center px-0">
          <div className={`form-container ${!isLogining ? "hidden" : ""}`}>
            <LoginForm
              unique={`login-${unique}`}
              handleResetPasswordBtn={handleResetPasswordBtn}
            />
          </div>
          <div className={`form-container ${isLogining ? "hidden" : ""}`}>
            <ForgetPasswordForm
              unique={`forget-password-${unique}`}
              handleResetPasswordBtn={handleResetPasswordBtn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
