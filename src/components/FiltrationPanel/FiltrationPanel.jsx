import {
  IconAdjustmentsHorizontal,
  IconCirclesRelation,
  IconFilter,
  IconSortAscending,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Form, Formik, Field } from "formik";
import SortObject from "../SortObject/SortObject";
import { useLocation } from "react-router-dom";

const __initialValues = {
  navigations: {
    enablepublisher: "",
    enableimages: "",
  },
  search: {
    id: "",
    title: "",
    content: "",
    publicationdate: "",
    language: "",
    category: "",
    source: "",
    tags: "",
    views: "",
    likes: "",
    lastupdated: "",
    publisherid: "",
    publishername: "",
    publishernamear: "",
  },
  sort: {
    sorts: [],
  },
  pagination: {
    pageindex: "",
    pagesize: "",
  },
};
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
export const queryStringToObject = (query) => {
  const params = new URLSearchParams(query);
  const result = { navigations: {
    enablepublisher: "",
    enableimages: "",
  },
  search: {
    id: "",
    title: "",
    content: "",
    publicationdate: "",
    language: "",
    category: "",
    source: "",
    tags: "",
    views: "",
    likes: "",
    lastupdated: "",
    publisherid: "",
    publishername: "",
    publishernamear: "",
  },
  sort: {
    sorts: [],
  },
  pagination: {
    pageindex: "",
    pagesize: "",
  },
  };
  // console.log(query);

  for (const [key, value] of params.entries()) {
    const [mainKey, subKey] = key.split(".").map((k) => k.toLowerCase());
    // console.log([mainKey, subKey]);

    if (mainKey === "navigations") {
      result.navigations[subKey] = value === "true"; // Convert to boolean
    } else if (mainKey === "search") {
      result.search[subKey] = value;
    } else if (mainKey.startsWith("sort")) {
      // Handle array notation for Sort.sorts
      const match = key.match(/sort.sorts\[(\d+)\]\.(.*)/i);
      // console.log(match);
      if (match) {
        const index = parseInt(match[1]);
        const prop = match[2].toLowerCase();

        if (!result.sort.sorts[index]) {
          result.sort.sorts[index] = {};
        }

        if (prop === "ascending") {
          result.sort.sorts[index][prop] = value === "true"; // Convert to boolean
        } else {
          result.sort.sorts[index][prop] = value;
        }
      }
    } else if (mainKey === "pagination") {
      result.pagination[subKey] = value;
    }
  }
  // console.log(result);

  return result;
};

export const AvailableSearchPropertiesToSortWith = {
  id: "id",
  title: "title",
  content: "content",
  publicationdate: "publication date",
  views: "views",
  likes: "likes",
  lastupdated: "last updated",
};
export default function FiltrationPanel({ t, setSpecs, initialValues }) {
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
    const availableProperties = Object.keys(
      AvailableSearchPropertiesToSortWith
    );
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
                            <div className="col-6 form-floating">
                              <Field
                                name="search.id"
                                id="search.id"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.id">
                                {t("filtrationPanel.ID")}
                              </label>
                            </div>
                            <div className="col-6 form-floating">
                              <Field
                                name="search.title"
                                id="search.title"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.title">
                                {t("filtrationPanel.Title")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.content"
                                id="search.content"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.content">
                                {t("filtrationPanel.Content")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.publicationdate"
                                id="search.publicationdate"
                                type="date"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.publicationdate">
                                {t("filtrationPanel.PublicationDate")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.publisherid"
                                id="search.publisherid"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.publisherid">
                                {t("filtrationPanel.PublisherID")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.publishername"
                                id="search.publishername"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.publishername">
                                {t("filtrationPanel.PublisherName")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.publishernamear"
                                id="search.publishernamear"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.publishernamear">
                                {t("filtrationPanel.PublisherNameAR")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                as="select"
                                name="search.language"
                                id="search.language"
                                className="form-select"
                                placeholder=" "
                              >
                                <option value="Arabic">
                                  {t("filtrationPanel.Arabic")}
                                </option>
                                <option value="English">
                                  {t("filtrationPanel.English")}
                                </option>
                              </Field>
                              <label htmlFor="search.language">
                                {t("filtrationPanel.Language")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.category"
                                id="search.category"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.category">
                                {t("filtrationPanel.Category")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.source"
                                id="search.source"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.source">
                                {t("filtrationPanel.Source")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.tags"
                                id="search.tags"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.tags">
                                {t("filtrationPanel.Tags")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.views"
                                id="search.views"
                                className="form-control"
                                type="number"
                                placeholder=" "
                              />
                              <label htmlFor="search.views">
                                {t("filtrationPanel.Views")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.likes"
                                id="search.likes"
                                type="number"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.likes">
                                {t("filtrationPanel.Likes")}
                              </label>
                            </div>

                            <div className="col-6 form-floating">
                              <Field
                                name="search.lastupdated"
                                id="search.lastupdated"
                                type="date"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="search.lastupdated">
                                {t("filtrationPanel.LastUpdated")}
                              </label>
                            </div>

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
                            <div className="col-6">
                              <label
                                className="me-2"
                                htmlFor="navigations.enablepublisher"
                              >
                                {t("filtrationPanel.EnablePublisher")}
                              </label>
                              <Field
                                name="navigations.enablepublisher"
                                id="navigations.enablepublisher"
                                type="checkbox"
                                className="form-check-input"
                              />
                            </div>

                            <div className="col-6">
                              <label
                                className="me-2"
                                htmlFor="navigations.enableimages"
                              >
                                {t("filtrationPanel.EnableImages")}
                              </label>
                              <Field
                                name="navigations.enableimages"
                                id="navigations.enableimages"
                                type="checkbox"
                                className="form-check-input"
                              />
                            </div>

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

                                <div className="row g-3">
                                  {sorts.map((sort, index) => (
                                    <SortObject
                                      key={sort.property}
                                      {...sort}
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
