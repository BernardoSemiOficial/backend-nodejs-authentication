import axios from "axios";

export const http = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
