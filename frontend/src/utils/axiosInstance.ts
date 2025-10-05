import axios from "axios";

export const PORT = "3000";

export const LAN_IP = "http://10.15.200.216";

export const BACKEND_URL = `${LAN_IP}:${PORT}`

export const serverAPI = axios.create({
  baseURL: `${LAN_IP}:${PORT}/api`
})