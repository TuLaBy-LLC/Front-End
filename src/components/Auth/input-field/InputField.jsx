import { ErrorMessage, Field } from "formik";
const InputField = ({ type, placeholder, unique = "", name, errors }) => {
  return (
    <div className="form-floating">
      <Field
        className="form-control rounded-1"
        type={type}
        placeholder={placeholder}
        name={name}
        id={`${name + unique}-field`}
      />

      <label htmlFor={`${name + unique}-field`} className="fs-3">
        {placeholder}
      </label>

      <ErrorMessage
        className="text-danger text-start ps-2 mb-1 fs-3"
        component="div"
        name={name}
        id={`${name + unique}-field`}
      />

      {errors?.length > 0 &&
        errors.map((x, i) => (
          <p key={i} className="text-danger text-start ps-2 mb-1 fs-3">
            {x}
          </p>
        ))}
    </div>
  );
};

export default InputField;
