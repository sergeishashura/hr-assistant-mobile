import axios from "axios";

import { HOST_URL } from "../constans/api";

export const apiClient = axios.create({
  baseURL: HOST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
