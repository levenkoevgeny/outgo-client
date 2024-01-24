<template>
  <br />
  <br />
  <br />
  <h3>Новый расход</h3>
  {{ getFullOutgo }}
  <div>
    <form @submit="submitForm" method="POST">
      <div class="border border-2 mb-3 px-4 py-2">
        <div class="row">
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Подразделение</label>
              <select
                class="form-select"
                required
                name="subdivision"
                v-model="newData.subdivision"
              >
                <option value="">----</option>
                <option
                  v-for="subdivision in orderedSubdivisions"
                  :key="subdivision.id"
                  :value="subdivision.id"
                >
                  {{ subdivision.subdivision_name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">На дату</label>
              <input
                type="date"
                class="form-control"
                name="outgo_date"
                required
                v-model="newData.outgo_date"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="mb-3">
              <label class="form-label">Вид расхода</label>
              <select
                class="form-select"
                name="kind"
                required
                v-model="newData.kind"
              >
                <option value="">----</option>
                <option
                  v-for="outgoKind in orderedOutgoKinds"
                  :key="outgoKind.id"
                  :value="outgoKind.id"
                >
                  {{ outgoKind.kind }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          v-for="sheetItem in orderedSheetItems"
          class="border border-2 mb-3 px-4 py-2"
        >
          <div>
            <h5>{{ sheetItem.item_name }}</h5>
            <div class="d-flex flex-wrap justify-content-start">
              <div
                v-for="employeeKind in orderedEmployeeKinds"
                class="me-3 border-start ps-3"
                style="width: 25rem"
              >
                <div class="mb-3">
                  <label class="form-label">{{ employeeKind.kind }}</label>
                  <input
                    type="number"
                    class="form-control"
                    min="0"
                    v-model="
                      newData[
                        'item_' +
                          sheetItem.id +
                          '_kind_' +
                          employeeKind.id +
                          '_count'
                      ]
                    "
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">По фамильно</label>
                  <textarea
                    rows="2"
                    class="form-control"
                    v-model="
                      newData[
                        'item_' +
                          sheetItem.id +
                          '_kind_' +
                          employeeKind.id +
                          '_description'
                      ]
                    "
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <button type="submit" class="btn btn-primary">Сохранить</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { subdivisionAPI } from "@/api/client/subdivisionAPI"
import { employeeKindAPI } from "@/api/client/employeeKindAPI"
import { sheetItemsAPI } from "@/api/client/sheetItemsAPI"
import { outgoKindAPI } from "@/api/client/outgoKindAPI"

import Spinner from "@/components/common/Spinner"
import { outgoDataAPI } from "@/api/client/outgoDataAPI"

export default {
  name: "NewOutgoView",
  components: { Spinner },
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoKindList: { results: [] },
      outgoList: { results: [] },
      newData: {
        kind: "",
        subdivision: "",
        outgo_date: "",
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

      const outgoKindResponse = await outgoKindAPI.getItemsList(this.userToken)
      this.outgoKindList = await outgoKindResponse.data
    },
    async submitForm(e) {
      this.isLoading = true
      e.preventDefault()
      try {
        await outgoDataAPI.addItemFull(this.userToken, {
          ...this.newData,
          owner: this.userData.id,
        })
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
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
    getFullOutgo() {
      let outgoCount = 0
      this.orderedSheetItems.map((shItem) => {
        this.orderedEmployeeKinds.map((emplKind) => {
          let key = "item_" + shItem.id + "_kind_" + emplKind.id + "_count"
          if (this.newData.hasOwnProperty(key)) {
            outgoCount = outgoCount + parseInt(this.newData[key]) * shItem.sign
          }
        })
      })
      return outgoCount
    },
  },
}
</script>

<style scoped></style>
