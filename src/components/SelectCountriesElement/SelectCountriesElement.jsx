import { useTranslation } from "react-i18next";
import countries from "./../../assets/countries.json";
import { Field } from "formik";

export default function SelectCountriesElement({ name }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="form-floating">
      <Field
        as="select"
        id={name}
        name={name}
        className="form-select"
        aria-label="Select Country"
      >
        {countries?.map((country) => (
          <option
            value={country.en}
            key={country.en}
            className="d-flex align-items-center"
          >
            {/* <img src={country.flag} alt={`${country[i18n.language]} Flag`} /> */}
            {country[i18n.language]}
          </option>
        ))}
      </Field>

      <label htmlFor={name}>{t(`profile.form.${name}`)}</label>
    </div>
  );
}
