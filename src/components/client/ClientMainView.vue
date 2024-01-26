<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label class="form-label">Дата расхода (с)</label>
          <input
            type="date"
            class="form-control"
            v-model="outgoSearchForm.outgo_date__gte"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label class="form-label">Дата расхода (по)</label>
          <input
            type="date"
            class="form-control"
            v-model="outgoSearchForm.outgo_date__lte"
          />
        </div>
      </div>
    </div>
    <div class="mt-4"></div>
    <div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Подразделение</th>
            <th scope="col">Вид расхода</th>
            <th scope="col">На дату</th>
            <th scope="col">Дата и время создания</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="outgoData in orderedOutgoData"
            :key="outgoData.id"
            @click="updateRoute(outgoData.id)"
            style="cursor: pointer"
          >
            <td>{{ outgoData.subdivision_data.subdivision_name }}</td>
            <td>{{ outgoData.kind_data.kind }}</td>
            <td>{{ outgoData.outgo_date }}</td>
            <td>
              {{ getFormattedDateComponent(outgoData.date_time_created) }}
              {{ getFormattedTimeComponent(outgoData.date_time_created) }}
            </td>
            <td @click.stop="makeClone(outgoData.id)">
              <font-awesome-icon :icon="['far', 'copy']" />
            </td>
            <td @click.stop="">
              <font-awesome-icon :icon="['far', 'trash-can']" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { subdivisionAPI } from "@/api/client/subdivisionAPI"
import { employeeKindAPI } from "@/api/client/employeeKindAPI"
import { sheetItemsAPI } from "@/api/client/sheetItemsAPI"
import { outgoAPI } from "@/api/client/outgoAPI"
import { outgoDataAPI } from "@/api/client/outgoDataAPI"

import Spinner from "@/components/common/Spinner"

import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime,
} from "@/utils"

export default {
  name: "ClientMainView",
  components: { Spinner },
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoList: { results: [] },
      outgoDataList: { results: [] },
      outgoSearchForm: {
        outgo_date__lte: getCurrentFormatDate(),
        outgo_date__gte: getCurrentFormatDate(),
      },
      isLoading: true,
      isError: false,
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

      const outgoResponse = await outgoAPI.getItemsList(this.userToken)
      this.outgoList = await outgoResponse.data

      const outgoDataResponse = await outgoDataAPI.getItemsList(
        this.userToken,
        { ...this.outgoSearchForm, owner: this.userData.id },
      )
      this.outgoDataList = await outgoDataResponse.data
    },
    async updateRoute(idOutgo) {
      await this.$router.push({ name: "update", params: { id: idOutgo } })
    },
    async makeClone(outgoId) {
      this.isLoading = true
      try {
        const copyResponse = await outgoDataAPI.makeItemClone(
          this.userToken,
          outgoId,
        )
        const copiedOutGo = await copyResponse.data
        this.outgoDataList.results.push(copiedOutGo)
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
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
    orderedOutgo() {
      return this.outgoList.results
    },
    orderedOutgoData() {
      return this.outgoDataList.results
    },
    orderedSheetItems() {
      return this.sheetItemsList.results
    },
    orderedEmployeeKinds() {
      return this.employeeKindsList.results
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
