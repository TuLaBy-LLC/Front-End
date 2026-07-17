import axios from "axios";

/**
 * Sends an HTTP request to the specified API endpoint.
 *
 * @param {"get"|"post"|"put"|"delete"} actionType
 * @param {string} url
 * @param {string} token
 * @param {object} [data={}]
 * @param {object} [customConfig={}]
 *
 * @returns {Promise<any>}
 */
export const invokeAsync = async (
  actionType,
  url,
  token,
  data = {},
  customConfig = {}
) => {
  try {
    const config = {
      ...customConfig,
      headers: {
        Authorization: token
          ? `Bearer ${token}`
          : undefined,
        ...(customConfig.headers || {})
      },
    };

    let response;

    switch (actionType.toLowerCase()) {
      case "get":
        response = await axios.get(url, config);
        break;

      case "post":
        response = await axios.post(
          url,
          data,
          config
        );
        break;

      case "put":
        response = await axios.put(
          url,
          data,
          config
        );
        break;

      case "delete":
        response = await axios.delete(url, {
          ...config,
          data
        });
        break;

      default:
        throw {
          message: `Unsupported action type: ${actionType}`
        };
    }

    // console.log(response);

    return response.data ?? response;

  } catch (error) {

    console.log(error);
    
    if (axios.isAxiosError(error)) {

      if (error.response.status === 401) {

        sessionStorage.removeItem("user");
        localStorage.removeItem("user");

        window.location.href = "/";
        return;
      }

      if (error.response) {
        throw error.response.data;
      }

      if (error.request) {
        throw {
          message:
            "No response received from the server."
        };
      }
    }

    throw {
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
    };
  }
};