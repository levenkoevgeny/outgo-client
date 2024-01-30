import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "outgo-data"

export const outgoDataAPI = {
  async getItemsList(
    token,
    searchForm = {
      outgo_date__lte: "",
      outgo_date__gte: "",
      kind: "",
      subdivision: "",
    },
  ) {
    let { outgo_date__lte, outgo_date__gte, kind, subdivision } = {
      ...searchForm,
    }
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?outgo_date__lte=${outgo_date__lte}&outgo_date__gte=${outgo_date__gte}&kind=${kind}&subdivision=${subdivision}`,
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
  async updateItemFull(token, itemData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemData.id}/update_full_outgo/`,
      itemData,
      authHeaders(token),
    )
  },
  async makeItemClone(token, itemId) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}/make_full_clone/`,
      "",
      authHeaders(token),
    )
  },
  async deleteItem(token, itemId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}/`,
      authHeaders(token),
    )
  },
}
