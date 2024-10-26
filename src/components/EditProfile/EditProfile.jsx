import { Field, Form, Formik } from "formik";
import Apis from "./../../Api.json";
import InputField from "../Auth/input-field/InputField";
import * as Yup from "yup";
import { useState } from "react";
import SelectCountriesElement from "../SelectCountriesElement/SelectCountriesElement";
import { extractValues } from "../../Helpers/Methods";
import axios from "axios";
import Toast_Default from "../Toasts/Toasts";
import { IconReplace, IconStatusChange } from "@tabler/icons-react";
import ChangePasswordForm from "../Auth/ChangePasswordForm/ChangePasswordForm";
import Error from "../Error/Error";

const EditData = {
  name: "name",
  nameAR: "nameAR",
  email: "email",
  nationalId: "nationalId",
  country: "country",
  phoneNumber: "phoneNumber",
  religion: "religion",
  gender: "gender",
  birthDate: "birthDate",
  biographical: "biographical",
  biographicalAR: "biographicalAR",
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  nameAR: Yup.string()
    .required("Arabic Name is required")
    .min(2, "Arabic Name must be at least 2 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  nationalId: Yup.string()
    .required("National ID is required")
    .matches(/^[0-9]+$/, "National ID must be only digits")
    .min(14, "National ID must be at least 14 digits"),

  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(10, "Phone number must be at least 10 digits"),

  religion: Yup.number().oneOf([0, 1], "Invalid Religion").required(
    "Religion is required"
  ),

  gender: Yup.number().oneOf([0, 1], "Invalid gender").required("Gender is required"),

  birthDate: Yup.date()
    .required("Birthdate is required")
    .max(new Date(), "Birthdate cannot be in the future"),

  biographical: Yup.string()
    .nullable()
    .min(10, "Biographical info must be at least 10 characters"),

  biographicalAR: Yup.string()
    .nullable()
    .min(10, "Arabic biographical info must be at least 10 characters"),
});

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.profile.editProfile
}`;

export default function EditProfile({
  t,
  i18n,
  userData,
  token,
  handleStudentData,
}) {
  const [UserEdit, setUserEdit] = useState({
    isLoading: false,
    updatedSuccess: false,
    errors: {},
  });

  const [fileInputChanged, setFileInputChanged] = useState(false);

  const onSubmitHandler = async (values, { resetForm }) => {
    // console.log("Here");

    setUserEdit((pr) => ({ ...pr, updatedSuccess: false, isLoading: true }));

    // values.religion = new Number(values.religion)
    // values.gender = new Number(values.gender)
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await axios.put(ApiUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
          "Content-Type": "multipart/form-data", // Important when sending files
        },
      });
      // console.log(response);

      if (response?.status === 200) {
        // console.log(response);

        setUserEdit((pr) => ({
          ...pr,
          errors: {},
          updatedSuccess: true,
          isLoading: false,
        }));
        handleStudentData(true);
      }
    } catch (error) {
      // console.log(error);

      if (error.response) {
        const responseData = error.response;
        // console.log(responseData?.data?.errors);

        setUserEdit((pr) => ({
          ...pr,
          isLoading: false,
          errors: responseData?.data ?? {},
        }));
      }
    }
    resetForm({ values });
  };
  // console.log(extractValues(EditData, userData.user));

  // console.log(UserEdit);
  

  return (
    <>
      {UserEdit.updatedSuccess && <Toast_Default message={t("edit-success")} />}
      {UserEdit.errors.statusCode >= 400 && (
        <Toast_Default statusIsSuccess={false} message={t("errors.apiError")} />
      )}

      <div className="card card-profile">
        <div className="card-header mx-4 text-white text-start">
          <h4 className="card-title text-white">{t("profile.Edit Profile")}</h4>
          <p className="card-category mb-0">
            {t("profile.Complete your profile")}
          </p>
        </div>
        <div className="card-body p-3">
          <Formik
            initialValues={{
              ...extractValues(EditData, userData.user),
            }}
            onSubmit={onSubmitHandler}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form
                className="container d-flex justify-content-center py-4"
                encType="multipart/form-data"
              >
                <div className="row g-4">
                  {/* Render Api Errors */}
                  {UserEdit?.errors?.statusCode && (
                    <div className="col-12">
                      <Error {...UserEdit.errors} />
                    </div>
                  )}
                  {/* Render Api Errors */}

                  <div className="col-12 col-md-6">
                    <InputField
                      type="text"
                      label={t(`profile.form.${EditData.name}`)}
                      placeholder={t(`profile.form.${EditData.name}`)}
                      name={EditData.name}
                      errors={UserEdit.errors.errors?.[`$.${EditData.name}`]}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      type="text"
                      placeholder={t(`profile.form.${EditData.nameAR}`)}
                      name={EditData.nameAR}
                      errors={UserEdit.errors.errors?.[`$.${EditData.nameAR}`]}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      type="text"
                      placeholder={t(`profile.form.${EditData.nationalId}`)}
                      name={EditData.nationalId}
                      errors={
                        UserEdit.errors.errors?.[`$.${EditData.nationalId}`]
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <InputField
                      type="tel"
                      placeholder={t(`profile.form.${EditData.phoneNumber}`)}
                      name={EditData.phoneNumber}
                      errors={
                        UserEdit.errors.errors?.[`$.${EditData.phoneNumber}`]
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <SelectCountriesElement name={EditData.country} />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      type="email"
                      placeholder={t(`profile.form.${EditData.email}`)}
                      name={EditData.email}
                      errors={UserEdit.errors.errors?.[`$.${EditData.email}`]}
                    />
                  </div>
                  
                  <div className="col-sm-6 col-lg-4">
                    <div className="form-floating">
                      <Field
                        as="select"
                        id={EditData.gender}
                        name={EditData.gender}
                        className="form-select"
                        aria-label="Select Gender"
                      >
                        <option value={0}>
                          {i18n.language == "en" ? "Male" : "ذكر"}
                        </option>
                        <option value={1}>
                          {i18n.language == "en" ? "Female" : "أنثي"}
                        </option>
                      </Field>
                      <label
                        className="text-ellipsis"
                        htmlFor={EditData.gender}
                      >
                        {t(`profile.form.${EditData.gender}`)}
                      </label>
                    </div>

                    {UserEdit.errors.errors?.[`$.gender`]?.length > 0 &&
                      UserEdit.errors.errors?.[`$.gender`]?.map((x, i) => (
                        <p
                          key={i}
                          className="text-danger text-start ps-2 mb-1 fs-3"
                        >
                          {x}
                        </p>
                      ))}
                  </div>

                  <div className="col-sm-6 col-lg-4">
                    <InputField
                      type="date"
                      placeholder={t(`profile.form.${EditData.birthDate}`)}
                      name={EditData.birthDate}
                      errors={
                        UserEdit.errors.errors?.[`$.${EditData.birthDate}`]
                      }
                      id={EditData.birthDate}
                    />
                  </div>

                  <div className="col-sm-6 col-lg-4">
                    <div className="form-floating overflow-hidden">
                      <Field
                        as="select"
                        id={EditData.religion}
                        name={EditData.religion}
                        className="form-select"
                        aria-label="Select Religion"
                      >
                        <option value={0}>
                          {i18n.language == "en" ? "Muslim" : "مُسلم"}
                        </option>
                        <option value={1}>
                          {i18n.language == "en" ? "Christian" : "مسيحي"}
                        </option>
                      </Field>
                      <label
                        className="text-ellipsis"
                        htmlFor={EditData.religion}
                      >
                        {t(`profile.form.${EditData.religion}`)}
                      </label>

                      {UserEdit.errors.errors?.[`$.religion`]?.length > 0 &&
                        UserEdit.errors.errors?.[`$.religion`].map((x, i) => (
                          <p
                            key={i}
                            className="text-danger text-start ps-2 mb-1 fs-3"
                          >
                            {x}
                          </p>
                        ))}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      type="textarea"
                      placeholder={t(`profile.form.${EditData.biographical}`)}
                      name={EditData.biographical}
                      errors={
                        UserEdit.errors.errors?.[`$.${EditData.biographical}`]
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      type="textarea"
                      placeholder={t(`profile.form.${EditData.biographicalAR}`)}
                      name={EditData.biographicalAR}
                      errors={
                        UserEdit.errors.errors?.[`$.${EditData.biographicalAR}`]
                      }
                    />
                  </div>

                  <div className="mt-4 col-12">
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        type="submit"
                        disabled={
                          !(
                            formik.isValid &&
                            (formik.dirty || fileInputChanged)
                          )
                        }
                        className="btn btn-primary w-25"
                      >
                        {UserEdit.isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          t("misc.save")
                        )}
                      </button>

                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#changePassword-modal"
                        className="btn btn-outline-dark"
                      >
                        <span className="me-2">
                          {t("security.changePassword")}
                        </span>
                        <IconReplace size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ChangePasswordForm />
    </>
  );
}
