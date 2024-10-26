import { Form, Formik } from "formik";
import React from "react";
import InputField from "../input-field/InputField";
import { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import Apis from "../../../Api.json";
import { useTranslation } from "react-i18next";

const passwordError =
  "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character";

const initialValues = {
  code: "",
  new_password: "",
  default_password: "",
};

const validationSchema = Yup.object({
  code: Yup.string().required("Code is required"),
  new_password: Yup.string()
    .matches(/.{6,}$/, passwordError)
    .required("New password is required"),
  default_password: Yup.string().required("Default password is required"),
});

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.auth.forgetPassword
}`;

export default function ForgetPasswordForm({
  unique = 1,
  handleResetPasswordBtn = null,
}) {
  const [IsLoading, setIsLoading] = useState(false);
  const [APiErrors, setAPiErrors] = useState(null);
  const { t } = useTranslation();
  const onSubmitHandler = (values) => {
    setIsLoading(true);
    setAPiErrors(null);
  
    axios
      .post(ApiUrl, {
        code: values.code,
        default_password: values.default_password,
        new_password: values.new_password,
      })
      .then((response) => {
        if (response.status === 200) {
          handleResetPasswordBtn();
        }
      })
      .catch(({ response }) => {
        setAPiErrors(response.data || { message: "An error occurred" });
        console.clear();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form className="container d-flex align-items-center min-h-80">
          <div className="row justify-content-center g-3">
            <div className="header-title position-relative w-100 mx-auto">
              <h2 className="h3 text-secondary bg-white mw-fit-content mx-auto px-3 mb-0">
                {t("security.resetPassword")}
              </h2>
            </div>

            {/* Render Api Errors */}
            <div className="col-12">
              {APiErrors != null && (
                <div className="alert alert-danger bg-transparent py-1 mb-0 mt-2 text-capitalize">
                  <p className="mb-0">
                    {APiErrors.status == 404
                      ? "You Are Not Authorized.!"
                      : APiErrors.message}
                  </p>
                </div>
              )}
            </div>

            {/* Render Api Errors */}

            <div className="col-12">
              <InputField
                type="text"
                placeholder={t(`security.Enter code`)}
                name="code"
                unique={unique}
              />
            </div>
            <div className="col-12">
              <InputField
                type="password"
                placeholder={t(`security.Default Password`)}
                name={"default_password"}
                unique={unique}
              />
            </div>

            <div className="col-12">
              <InputField
                type="password"
                placeholder={t(`security.New Password`)}
                name={"new_password"}
                unique={unique}
              />
            </div>

            <div className="mt-3 col-12 text-center">
              <button
                type="submit"
                disabled={!(formik.dirty && formik.isValid)}
                className="btn btn-primary w-50"
              >
                {IsLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                ) : (
                  t("security.Submit")
                )}
              </button>
            </div>

            <div className="col-12 d-flex align-items-center justify-content-center ">
              <button
                type="button"
                className="btn text-primary d-flex align-items-center p-0 fs-3"
                onClick={handleResetPasswordBtn}
              >
                <span>{t("security.haveAccount")}</span>
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
