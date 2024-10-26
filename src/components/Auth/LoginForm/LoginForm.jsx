import { Form, Formik } from "formik";
import React from "react";
import InputField from "../input-field/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import UserContext from "../../../contexts/UserContextProvider";
import axios from "axios";
import * as Yup from "yup";
import Apis from "../../../Api.json";
import { useTranslation } from "react-i18next";
import { IconRestore } from "@tabler/icons-react";

const passwordError =
  "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character";

const initialValues = {
  code: "",
  password: "",
  rememberMe: false,
};

const validationSchema = Yup.object({
  code: Yup.string().required(),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password must have 1 Uppercase, 1 Lowercase, 1 number, 1 non-alphanumeric character, and at least 8 characters."
    )
    .required("Password is required"),

  rememberMe: Yup.boolean(),
});

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.auth.login
}`;

export default function LoginForm({
  unique = 1,
  handleResetPasswordBtn = null,
}) {
  const { updateUser } = useContext(UserContext);
  const [IsLoading, setIsLoading] = useState(false);
  const [APiErrors, setAPiErrors] = useState(null);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const onSubmitHandler = async (values) => {
    setIsLoading(true);

    const response = await axios
      .post(ApiUrl, { text: values.code, password: values.password, signInType: 1 })
      .catch(({ response }) => {
        setIsLoading(false);
        setAPiErrors(response.data);
        // console.clear();
        console.log(response);
      });

    // console.log(response);
    if (response?.status === 200) {
      sessionStorage.setItem("user", JSON.stringify({ ...response.data }));
      updateUser(response.data);
      setIsLoading(false);
      // console.log(response);

      document.querySelector("#modal-close")?.click();
      navigate("/");
    }
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
              <h2 className="text-secondary bg-white mw-fit-content mx-auto px-3 mb-0">
                {t("security.Login")}
              </h2>
            </div>

            {/* Render Api Errors */}
            <div className="col-12">
              {APiErrors != null && (
                <div className="alert alert-danger bg-transparent py-1 mb-0 mt-2 text-capitalize">
                  <div className="fs-35">
                    {APiErrors.status == 404
                      ? "You Are Not Authorized.!"
                      : APiErrors.errors?.length > 0
                      ? APiErrors.errors.map((er) => (
                          <p
                            key={er}
                            className="m-0 fs-35 d-flex align-items-center gap-2"
                          >
                            <span
                              className="bg-danger d-block rounded-circle"
                              style={{
                                padding: "3px",
                              }}
                            ></span>

                            <span>{er}</span>
                          </p>
                        ))
                      : APiErrors.message}
                  </div>
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
                placeholder={t(`security.Password`)}
                name={"password"}
                unique={unique}
              />
            </div>

            <div className="col-12 d-flex align-items-center justify-content-between ">
              <button
                type="button"
                className="btn text-primary d-flex align-items-center p-0 fs-3"
                onClick={handleResetPasswordBtn}
              >
                <span>{t("security.forgetPassword")}</span>
              </button>
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
                  t("security.Login")
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
