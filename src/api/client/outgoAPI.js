import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo"

export const outgoAPI = {
  async getItemsList(token, searchForm = { outgo: "" }) {
    let { outgo } = { ...searchForm }
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?outgo=${outgo}&limit=10000`,
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
