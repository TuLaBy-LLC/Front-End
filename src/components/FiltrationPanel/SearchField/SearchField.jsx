import { Field } from "formik";

export default function SearchField({
  FieldFor,
  label,
  type,
  className = "form-control",
}) {
  if (type == "checkbox")
    return (
      <div className="col-6">
        <label className="me-2" htmlFor={FieldFor}>
          {label}
        </label>
        <Field
          name={FieldFor}
          id={FieldFor}
          type="checkbox"
          className="form-check-input"
        />
      </div>
    );

  return (
    <div className="col-6 form-floating">
      <Field
        name={FieldFor}
        id={FieldFor}
        type={type}
        className={className}
        placeholder=" "
      />
      <label htmlFor={FieldFor}>{label}</label>
    </div>
  );
}
