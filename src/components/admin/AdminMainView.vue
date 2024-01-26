<template>
  <div class="container-fluid">
    {{ getOutGoDataIds() }}
    <div class="container my-3">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Дата расхода</label>
            <input
              type="date"
              class="form-control"
              v-model="outgoSearchForm.outgo_date"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Вид расхода</label>
            <select v-model="outgoSearchForm.kind" class="form-select">
              <option value="">-----</option>
              <option v-for="kind in orderedOutgoKinds" :value="kind.id">
                {{ kind.kind }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <table class="table mt-3">
      <thead>
        <tr>
          <th scope="col" rowspan="2">Подразделение</th>
          <th
            scope="col"
            v-for="shItem in orderedSheetItems"
            :key="shItem.id"
            :colspan="orderedEmployeeKinds.length"
          >
            {{ shItem.item_name }}
          </th>
        </tr>
        <tr>
          <template v-for="shItem in orderedSheetItems" :key="shItem.id">
            <th v-for="emplKind in orderedEmployeeKinds">
              {{ emplKind.kind }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="subdivision in orderedSubdivisions" :key="subdivision.id">
          <td>{{ subdivision.subdivision_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import { subdivisionAPI } from "@/api/admin/subdivisionAPI"
import { employeeKindAPI } from "@/api/client/employeeKindAPI"
import { sheetItemsAPI } from "@/api/client/sheetItemsAPI"
import { outgoKindAPI } from "@/api/client/outgoKindAPI"
import { outgoAPI } from "@/api/admin/outgoAPI"
import { outgoDataAPI } from "@/api/admin/outgoDataAPI"

import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime,
} from "@/utils"

import Spinner from "@/components/common/Spinner"
export default {
  name: "AdminMainView",
  components: { Spinner },
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoKindList: { results: [] },
      outgoList: { results: [] },
      outgoDataList: { results: [] },
      outgoSearchForm: {
        outgo_date: getCurrentFormatDate(),
        kind: "",
      },
      isLoading: true,
      isError: false,
      normalizedData: {},
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const subdivisionResponse = await subdivisionAPI.getItemsList(
        this.userToken,
        { user: this.userData.id },
      )
      this.subdivisionsList = await subdivisionResponse.data

      const employeeKindsResponse = await employeeKindAPI.getItemsList(
        this.userToken,
      )
      this.employeeKindsList = await employeeKindsResponse.data

      const sheetItemsResponse = await sheetItemsAPI.getItemsList(
        this.userToken,
      )
      this.sheetItemsList = await sheetItemsResponse.data

      const outgoKindResponse = await outgoKindAPI.getItemsList(this.userToken)
      this.outgoKindList = await outgoKindResponse.data

      const outGoDataResponse = await outgoDataAPI.getItemsList(
        this.userToken,
        { ...this.outgoSearchForm },
      )
      this.outgoDataList = await outGoDataResponse.data
      const outGoResponse = await outgoAPI.getItemsList(this.userToken, {
        outgo__in: this.getOutGoDataIds().join(","),
      })
      this.outgoList = await outGoResponse.data

      this.normalizeOutgoData()
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
    getOutGoDataIds() {
      let ids = []
      this.outgoDataList.results.map((item) => ids.push(item.id))
      return ids
    },
    normalizeOutgoData() {
      this.orderedOutgoData.map((outgoData) => {
        this.normalizedData[outgoData.id] = ""
      })
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    orderedSubdivisions() {
      return this.subdivisionsList.results
    },
    orderedSheetItems() {
      return this.sheetItemsList.results
    },
    orderedEmployeeKinds() {
      return this.employeeKindsList.results
    },
    orderedOutgoKinds() {
      return this.outgoKindList.results
    },
    orderedOutgo() {
      return this.outgoList.results
    },
    orderedOutgoData() {
      return this.outgoDataList.results
    },
  },
  watch: {
    outgoSearchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
