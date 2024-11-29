import { Helmet } from "react-helmet";
import Apis from "../../Api.json";
import { InvokeAPI } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import LoadingComponent from "../loading/Loading";
import Error from "../Error/Error";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.auth.notificationSettings
}`;

// Validation schema
const validationSchema = Yup.object({
  smsEnabled: Yup.boolean().required(),
  emailEnabled: Yup.boolean().required(),
  inAppEnabled: Yup.boolean().required(),
});

// Form Component
const NotificationSettingsForm = ({ data, handleSubmit, isSubmitting, t }) => (
  <Formik
    initialValues={data}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
  >
    {(formik) => (
      <Form>
        {/* General Error */}
        {formik.errors.general && (
          <div className="alert alert-danger">{errors.general}</div>
        )}

        {/* SMS Notifications */}
        <div className="form-check form-switch mb-3">
          <Field
            className="form-check-input"
            id="smsEnabled"
            name="smsEnabled"
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="smsEnabled">
            {t("Enable SMS Notifications")}
          </label>
        </div>

        {/* Email Notifications */}
        <div className="form-check form-switch mb-3">
          <Field
            className="form-check-input"
            id="emailEnabled"
            name="emailEnabled"
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="emailEnabled">
            {t("Enable Email Notifications")}
          </label>
        </div>

        {/* In-App Notifications */}
        <div className="form-check form-switch mb-3">
          <Field
            className="form-check-input"
            id="inAppEnabled"
            name="inAppEnabled"
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="inAppEnabled">
            {t("Enable In-App Notifications")}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!(formik.isValid && formik.dirty)}
          onClick={(e) => {}}
        >
          {isSubmitting ? (
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          ) : (
            t("misc.save")
          )}
        </button>
      </Form>
    )}
  </Formik>
);

// Main Component
export default function NotificationSettings({
  User: { token },
  updateUser,
  handleToast,
  t,
}) {
  const navigate = useNavigate();

  // Fetch notification settings
  const { data, isLoading, error, isError, refetch } = useQuery(
    `NotificationSetting:${token}`,
    () => InvokeAPI(ApiUrl, token),
    {
      staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
      retry: 2,
      onError: (err) => handleUnauthorized(err),
    }
  );

  // Refetch settings
  const RefetchSettings = () => refetch();

  // Handle unauthorized errors
  const handleUnauthorized = (err) => {
    if (err.status === 401) {
      updateUser({}, true);
      navigate("/"); // Redirect to home
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(
        ApiUrl,
        {
          Id: data.id,
          userId: data.userId,
          SMSEnabled: values.smsEnabled,
          EmailEnabled: values.emailEnabled,
          InAppEnabled: values.inAppEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleToast({ ...response.data });
      RefetchSettings();
    } catch (err) {
      if (err.response.status === 401) {
        handleUnauthorized(err.response);
      } else {
        handleToast({ ...err.response.data });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="position-relative">
      <Helmet>
        <title>{t("Notification Settings")}</title>
      </Helmet>

      {isLoading ? (
        <div className="p-4">
          <LoadingComponent bgClass="bg-white" />
        </div>
      ) : isError ? (
        <Error {...error} />
      ) : (
        <NotificationSettingsForm
          data={data}
          handleSubmit={handleSubmit}
          t={t}
        />
      )}
    </div>
  );
}
