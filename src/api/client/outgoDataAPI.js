import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo-data"

export const outgoDataAPI = {
  async getItemsList(
    token,
    searchForm = { owner: "", outgo_date__lte: "", outgo_date__gte: "" },
  ) {
    let { owner, outgo_date__lte, outgo_date__gte } = { ...searchForm }
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?owner=${owner}&outgo_date__lte=${outgo_date__lte}&outgo_date__gte=${outgo_date__gte}`,
      authHeaders(token),
    )
  },
  async getItemData(token, itemId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}`,
      authHeaders(token),
    )
  },
  async addItemFull(token, itemData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/save_full_outgo/`,
      itemData,
      authHeaders(token),
    )
  },
}
