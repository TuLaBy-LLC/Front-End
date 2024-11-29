import axios from "axios";

export const InvokeAPI = async (api, token) => {
    try {
        const response = await axios.get(api, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log(response);

        return response.data;
    } catch ({ response }) {
        throw response;
    }
};