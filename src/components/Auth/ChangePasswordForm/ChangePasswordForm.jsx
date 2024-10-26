import { Form, Formik } from "formik";
import React, { useContext } from "react";
import InputField from "../input-field/InputField";
import { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import Apis from "../../../Api.json";
import { useTranslation } from "react-i18next";
import logo from "./../../../assets/images/logo-light-slim.png";
import UserContext from "../../../contexts/UserContextProvider";
import Toast_Default from "../../Toasts/Toasts";

const passwordError =
  "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character";

const initialValues = {
  currentpassword: "",
  newpassword: "",
};

const validationSchema = Yup.object({
  currentpassword: Yup.string().required("Old password is required"),
  newpassword: Yup.string()
    .required("New password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
      passwordError
    ),
});

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.auth.changePassword
}`;

export default function ChangePasswordForm({ unique = 1 }) {
  const { User } = useContext(UserContext);
  const [UpdatedSuccess, setUpdatedSuccess] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [APiErrors, setAPiErrors] = useState(null);
  const { t } = useTranslation();

  const onSubmitHandler = (values) => {
    setIsLoading(true);
    setAPiErrors(null);

    axios
      .post(
        ApiUrl,
        {
          currentpassword: values.currentpassword,
          newpassword: values.newpassword,
        },
        { headers: { Authorization: `Bearer ${User.token}` } }
      )
      .then((response) => {
        if (response.status === 200) {
          setUpdatedSuccess(response.data.message);
          document.querySelector("#modal-close")?.click();
        }
      })
      .catch((error) => {
        // console.log(error);
        setAPiErrors(error.response?.data ?? t("errors.apiError"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {UpdatedSuccess && <Toast_Default message={UpdatedSuccess} />}

      <div
        className="modal fade"
        id="changePassword-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="changePassword-modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-1">
            <div className="modal-header">
              <img src={logo} alt="TulaBy Logo" className="pt-2" width={150} />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-close"
              />
            </div>
            <div className="modal-body pb-4 px-5">
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmitHandler}
                validationSchema={validationSchema}
              >
                {(formik) => (
                  <Form className="container d-flex align-items-center min-h-80">
                    <div className="row justify-content-center g-3">
                      <div className="header-title position-relative w-100 mx-auto">
                        <h2 className="h4 text-secondary bg-white mw-fit-content mx-auto px-3 mb-0">
                          {t("security.changePassword")}
                        </h2>
                      </div>

                      {/* Render Api Errors */}
                      {APiErrors != null && APiErrors?.errors == null && (
                        <div className="col-12">
                          <div className="alert alert-danger bg-transparent py-1 mb-0 mt-2 text-capitalize">
                            <p className="mb-0">
                              {APiErrors.status == 404
                                ? "You Are Not Authorized.!"
                                : APiErrors.message}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Render Api Errors */}

                      <div className="col-12">
                        <InputField
                          type="text"
                          placeholder={t(`security.Password`)}
                          name="currentpassword"
                          errors={APiErrors?.errors?.currentpassword}
                          unique={unique}
                        />
                      </div>

                      <div className="col-12">
                        <InputField
                          type="password"
                          placeholder={t(`security.New Password`)}
                          name={"newpassword"}
                          unique={unique}
                          errors={APiErrors?.errors?.newpassword}
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
                            t("security.Change")
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
