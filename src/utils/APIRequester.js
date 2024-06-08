import axios from "axios";
import Swal from "sweetalert2";

export const handleResource = async ({
  method,
  endpoint,
  data,
  id,
  isMultipart,
  popupMessage,
  popupText,
}) => {
  try {
    const getURL = `${process.env.REACT_APP_GET_API}`;
    const postURL = `${process.env.REACT_APP_BASE_API}`;
    
    
    let url = method === "post" ? postURL + endpoint : getURL + endpoint;

    if (id) {
      url += `/${id}`;
    }

    const headers = {
      Accept: "application/json",
    };

    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios.request({
      method,
      url,
      data: data,
      headers,
    });

    if (response && popupMessage) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: popupText,
        timer: 1500,
      });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message,
        timer: 3000,
      });
    }
  }
};
