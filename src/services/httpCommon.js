import axios from "axios";

export default axios.create({
  baseURL: "http://142.132.229.249:3000",
  headers: {
    "Content-type": "application/json"
  }
});