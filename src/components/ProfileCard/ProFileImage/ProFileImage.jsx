import React, { useState } from "react";
import Apis from "./../../../Api.json";
import axios from "axios";
import Toast_Default from "../../Toasts/Toasts";

const ApiUrl = `${import.meta.env.VITE_REACT_APP_BASE_URL_API_KEY}${
  Apis.profile.updateImage
}`;

const updateImage = async (api, token, data) => {
  try {
    const response = await axios.put(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch ({ response: { data } }) {
    throw data;
  }
};

export default function ProFileImage({ User: { User, updateUser }, t }) {
  // State to hold the selected file and image preview
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState({ status: false, message: "" });
  const [imagePreview, setImagePreview] = useState(User?.imageName || ""); // Assuming `User.image` holds the current profile image URL

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a URL for the image preview
    }
  };

  // Handle image upload (placeholder for future implementation)
  const handleUpload = () => {
    if (selectedImage) {
      // Create FormData object and append the selected image
      setIsLoading({ status: true, message: "" });
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Call the function to update the image by passing the form data
      updateImage(ApiUrl, User.token, formData)
        .then((res) => {
          console.log(res);

          if (res && res.imageName) {
            // Assuming res contains imageName (the uploaded image URL)
            updateUser({ ...User, imageName: res.imageName });
          } else {
            console.log("Error:", res.message || "Failed to upload image.");
          }
          setIsLoading({ status: false, message: res.message });
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          setIsLoading({ status: false, message: err.message });
        });
    }
  };

  return (
    <>
      {isLoading.message != "" && <Toast_Default message={isLoading.message} />}

      <button
        type="button"
        className="btn btn-outline-dark fs-3 p-2"
        data-bs-toggle="modal"
        data-bs-target="#UpdateImage"
      >
        {t("profile.updateImage")}
      </button>

      <div
        className="modal fade"
        id="UpdateImage"
        tabIndex="-1"
        aria-labelledby="UpdateImageLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="UpdateImageLabel">
                {t("profile.updateImage")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Image preview */}
              <div className="mb-3 text-center">
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="image-preview"
                    />
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <span className="text-muted">{t("profile.noImage")}</span>
                  </div>
                )}
              </div>

              {/* Styled file input as button */}
              <div className="text-center">
                <label
                  htmlFor="profileImage"
                  className="btn btn-outline-primary fs-4"
                >
                  {t("profile.chooseImage")}
                </label>
                <input
                  className="form-control d-none"
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("misc.close")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
              >
                {isLoading.status ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                ) : (
                  t("misc.ok")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
