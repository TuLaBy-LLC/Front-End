import {
  IconAdjustmentsHorizontal,
  IconCirclesRelation,
  IconSortAscending,
} from "@tabler/icons-react";
import { useState } from "react";
import { Form, Formik, Field } from "formik";
import SortObject from "../SortObject/SortObject";
import SearchField from "./SearchField/SearchField";

const initialSortObj = {
  property: "id",
  ascending: true,
  priority: 1,
};

function objectToQueryString(obj, parentKey = "") {
  const queryStringParts = [];

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      // Recursively handle nested objects
      queryStringParts.push(objectToQueryString(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          // Handle objects in arrays
          queryStringParts.push(
            objectToQueryString(item, `${fullKey}[${index}]`)
          );
        } else {
          // Handle primitive values in arrays
          queryStringParts.push(
            `${encodeURIComponent(
              fullKey.replace(/\[\d+\]$/, "")
            )}%5B${index}%5D=${encodeURIComponent(item)}`
          );
        }
      });
    } else if (value !== undefined && value !== null && value !== "") {
      // Handle primitive values
      queryStringParts.push(
        `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`
      );
    }
  });

  return queryStringParts.filter(Boolean).join("&");
}
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const queryStringToObject = (query, originalProperties) => {
  const Properties = deepCopy(originalProperties);
  // Function to reset all values in an object to an empty string
  const resetProperties = (structure) => {
    const resetObject = {};
    for (const key in structure) {
      if (typeof structure[key] === "object" && structure[key] !== null) {
        // Recursively reset nested objects
        resetObject[key] = Array.isArray(structure[key])
          ? []
          : resetProperties(structure[key]);
      } else {
        // Set all values to an empty string
        resetObject[key] = "";
      }
    }
    return resetObject;
  };

  // Reinitialize Properties dynamically with all values set to ""
  Properties.navigations = resetProperties(Properties.navigations);
  Properties.search = resetProperties(Properties.search);
  Properties.sort = resetProperties(Properties.sort);
  Properties.pagination = resetProperties(Properties.pagination);

  const params = new URLSearchParams(query);

  for (const [key, value] of params.entries()) {
    const [mainKey, subKey] = key.split(".").map((k) => k.toLowerCase());
    // console.log([mainKey, subKey]);

    if (mainKey === "navigations") {
      Properties.navigations[subKey] = value === "true"; // Convert to boolean
    } else if (mainKey === "search") {
      Properties.search[subKey] = value;
    } else if (mainKey.startsWith("sort")) {
      // Handle array notation for Sort.sorts
      const match = key.match(/sort.sorts\[(\d+)\]\.(.*)/i);
      // console.log(match);
      if (match) {
        const index = parseInt(match[1]);
        const prop = match[2].toLowerCase();

        if (!Properties.sort.sorts[index]) {
          Properties.sort.sorts[index] = {};
        }

        if (prop === "ascending") {
          Properties.sort.sorts[index][prop] = value === "true"; // Convert to boolean
        } else {
          Properties.sort.sorts[index][prop] = value;
        }
      }
    } else if (mainKey === "pagination") {
      Properties.pagination[subKey] = value;
    }
  }
  // console.log(Properties);

  return Properties;
};

const reArrange = (obj) => {
  const entries = Object.entries(obj);

  const nonCheckboxEntries = entries.filter(([key, value]) => value !== "checkbox");
  const checkboxEntries = entries.filter(([key, value]) => value === "checkbox");

  // Combine non-checkbox entries first, followed by checkbox entries
  return ([...nonCheckboxEntries, ...checkboxEntries]);
};

export default function FiltrationPanel({
  t,
  setSpecs,
  initialValues,
  SortProperties,
  NavigationProperties,
  SearchProperties,
}) {
  const [filtrationTabs, setFiltrationTabs] = useState(0);
  const [sortTouched, setsortTouched] = useState(false);
  const [sorts, setSorts] = useState(
    initialValues?.sort?.sorts ?? [initialSortObj]
  );
  // console.log(initialValues);

  const handleSubmit = (values) => {
    document.querySelector("#modal-close-filterModal")?.click();

    values.sort = { sorts };
    // console.log(sorts);

    // console.log(values);
    setsortTouched(false);
    let query = objectToQueryString(values);
    // console.log(query);

    setSpecs(query);
  };

  const handleSort = () => {
    // Get the currently selected properties in sorts
    const existingProperties = sorts.map((sort) => sort.Property);
    let availableProp = null;

    // Find all available properties
    const availableProperties = Object.keys(SortProperties);
    // console.log(availableProperties, existingProperties);

    // Check if there are any properties left to add
    const canAddNewSort = availableProperties.some((prop) => {
      if (!existingProperties.includes(prop)) availableProp = prop;
      return !existingProperties.includes(prop);
    });

    if (canAddNewSort) {
      setSorts((prev) => [
        ...prev,
        { ...initialSortObj, Property: availableProp },
      ]);
      setsortTouched(true);
    }
    // else {
    //   // Handle the case where no new properties can be added (optional)
    //   console.log("All properties are already used for sorting.");
    // }
  };

  const removeSort = (index) => {
    setSorts((prev) => {
      const updatedSorts = [...prev]; // Create a copy of the array
      updatedSorts.splice(index, 1); // Modify the copy
      return updatedSorts; // Return the modified copy
    });
    setsortTouched((prev) => true);
  };

  const handleSortChange = (index, propertyName, value) => {
    const existingProperties = sorts.map((sort) => sort.Property);

    // Check if there are any properties left to add
    const canChangeToProperty = existingProperties.some((prop) => {
      // console.log({ prop, propertyName }, prop == propertyName);

      return prop == value;
    });
    // console.log(existingProperties , propertyName,canChangeToProperty);

    if (canChangeToProperty) return;
    setSorts((prev) => {
      const newSorts = [...prev]; // Create a shallow copy of the sorts array
      newSorts[index] = { ...newSorts[index], [propertyName]: value }; // Update the specific sort object immutably
      return newSorts; // Return the new state
    });
    setsortTouched((prev) => true);
  };

  // console.log(Object.entries(NavigationProperties));

  return (
    <>
      <div
        className="modal fade"
        id="panel-modal"
        tabIndex={-1}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="panel-modalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-1">
            <div className="modal-header">
              <h2 className="h4 text-secondary">
                {t("filtrationPanel.filtration")}
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-close-filterModal"
              />
            </div>
            <div className="modal-body">
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {(formik) => (
                  <Form className="container d-flex align-items-center">
                    <div className="row justify-content-center g-3 w-100">
                      <div className="py-2">
                        {/* Tabs BTNs */}
                        <ul className="nav nav-pills rounded nav-fill shadow-sm px-1 py-2 mb-4">
                          <li className="nav-item">
                            <button
                              data-toggle="pill"
                              type="button"
                              onClick={(_) => setFiltrationTabs(0)}
                              className={`nav-link d-flex align-items-center gap-2 ${
                                filtrationTabs == 0 && "active"
                              }`}
                            >
                              <IconAdjustmentsHorizontal size={20} />
                              Search
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              data-toggle="pill"
                              type="button"
                              onClick={(_) => setFiltrationTabs(1)}
                              className={`nav-link d-flex align-items-center gap-2 ${
                                filtrationTabs == 1 && "active"
                              }`}
                            >
                              <IconCirclesRelation size={20} />
                              Extra Data
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              data-toggle="pill"
                              type="button"
                              onClick={(_) => setFiltrationTabs(2)}
                              className={`nav-link d-flex align-items-center gap-2 ${
                                filtrationTabs == 2 && "active"
                              }`}
                            >
                              <IconSortAscending size={20} />
                              Sort By
                            </button>
                          </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content">
                          {/* Search Form */}
                          <div
                            className={`row fs-3 g-3 ${
                              filtrationTabs !== 0 && "d-none"
                            }`}
                          >
                            {reArrange(SearchProperties)?.map(
                              ([key, type]) => (
                                <SearchField
                                  key={`search.${key}`}
                                  FieldFor={`search.${key}`}
                                  type={type}
                                  label={t(`filtrationPanel.${key}`)}
                                />
                              )
                            )}

                            <div className="mt-3 col-12 text-center">
                              <button
                                type="submit"
                                disabled={!(formik.dirty && formik.isValid)}
                                className="btn btn-primary w-50"
                              >
                                {t("filtrationPanel.filter")}
                              </button>
                            </div>
                          </div>

                          {/* Navigation Form */}
                          <div
                            className={`row fs-3 g-3 ${
                              filtrationTabs !== 1 && "d-none"
                            }`}
                          >
                            {Object.entries(NavigationProperties)?.map(
                              ([key, type]) => (
                                <SearchField
                                  key={`navigations.${key}`}
                                  FieldFor={`navigations.${key}`}
                                  type={"checkbox"}
                                  className="form-check-input"
                                  label={t(`filtrationPanel.${key}`)}
                                />
                              )
                            )}

                            <div className="mt-3 col-12 text-center">
                              <button
                                type="submit"
                                disabled={!(formik.dirty && formik.isValid)}
                                className="btn btn-primary w-50"
                              >
                                {t("filtrationPanel.filter")}
                              </button>
                            </div>
                          </div>

                          {/* Sort Form */}
                          <div
                            className={`row fs-3 g-3 ${
                              filtrationTabs !== 2 && "d-none"
                            }`}
                          >
                            <div className="col-12">
                              <div className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark mb-3"
                                  onClick={handleSort}
                                >
                                  Add Sort
                                </button>

                                <div className="d-flex flex-column gap-3">
                                  {sorts.map((sort, index) => (
                                    <SortObject
                                      key={sort.property}
                                      {...sort}
                                      SortProperties={SortProperties}
                                      index={index}
                                      handleChange={handleSortChange}
                                      removeSort={removeSort}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 col-12 text-center">
                              <button
                                type="submit"
                                disabled={!sortTouched}
                                className="btn btn-primary w-50"
                              >
                                {t("filtrationPanel.filter")}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* End */}
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
