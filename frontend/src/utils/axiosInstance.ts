import axios from "axios";

const PORT = "3000";
const LAN_IP = "http://10.239.64.13";


export const serverAPI = axios.create({
  baseURL: `${LAN_IP}:${PORT}/api`
})