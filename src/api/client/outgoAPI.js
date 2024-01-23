import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo"

export const outgoAPI = {
  async getItemsList(token) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}`,
      authHeaders(token),
    )
  },
  async getItemData(token, itemId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}`,
      authHeaders(token),
    )
  },
}
