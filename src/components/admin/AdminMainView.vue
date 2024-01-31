<template>
  <Navbar :userData="this.userData" />
  <!--  add modal-->
  <div
    class="modal fade"
    id="addOutgoDataModal"
    tabindex="-1"
    aria-labelledby="addOutgoDataModal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Новый расход</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <form @submit="addNewOutgoData" method="POST">
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
                    <div
                      class="d-flex flex-row flex-wrap justify-content-start"
                    >
                      <div
                        v-for="employeeKind in orderedEmployeeKinds"
                        class="me-3 border-start ps-3"
                        style="width: 45%"
                      >
                        <div class="mb-3">
                          <label class="form-label">{{
                            employeeKind.kind
                          }}</label>
                          <input
                            type="number"
                            required
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
                            :required="sheetItem.is_required"
                          />
                        </div>
                        <div class="mb-3">
                          <label class="form-label">По фамильно</label>
                          <textarea
                            rows="5"
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
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="addNewOutgoDataModalCloseButton"
                >
                  Закрыть
                </button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  add modal-->

  <!--  update modal-->
  <div
    class="modal fade"
    id="updateOutgoDataModal"
    tabindex="-1"
    aria-labelledby="updateOutgoDataModal"
    aria-hidden="true"
    ref="outgoUpdate"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Редактирование расхода
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <form @submit="updateOutgoData" method="PUT">
              <div class="border border-2 mb-3 px-4 py-2">
                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Подразделение</label>
                      <select
                        class="form-select"
                        required
                        name="subdivision"
                        v-model="currenOutGoForUpdate.subdivision"
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
                        v-model="currenOutGoForUpdate.outgo_date"
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
                        v-model="currenOutGoForUpdate.kind"
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
                    <div
                      class="d-flex flex-row flex-wrap justify-content-start"
                    >
                      <div
                        v-for="employeeKind in orderedEmployeeKinds"
                        class="me-3 border-start ps-3"
                        style="width: 45%"
                      >
                        <div class="mb-3">
                          <label class="form-label">{{
                            employeeKind.kind
                          }}</label>
                          <input
                            type="number"
                            required
                            class="form-control"
                            min="0"
                            v-model="
                              currenOutGoForUpdate[
                                'item_' +
                                  sheetItem.id +
                                  '_kind_' +
                                  employeeKind.id +
                                  '_count'
                              ]
                            "
                            :required="sheetItem.is_required"
                          />
                        </div>
                        <div class="mb-3">
                          <label class="form-label">По фамильно</label>
                          <textarea
                            rows="5"
                            class="form-control"
                            v-model="
                              currenOutGoForUpdate[
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
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="updateOutgoDataModalCloseButton"
                >
                  Закрыть
                </button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isLoading"
    class="d-flex justify-content-center align-items-center"
    style="height: 90vh"
  >
    <Spinner />
  </div>
  <div v-else>
    <div class="container-fluid">
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#addOutgoDataModal"
      >
        Добавить
      </button>
      <div class="container my-3">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Дата строевой записки</label>
              <input
                type="date"
                class="form-control"
                v-model="outgoSearchForm.outgo_date"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Вид сроевой записки</label>
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

      <table class="table table-hover mt-3">
        <thead class="table-primary">
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
            <th class="table-success" :colspan="orderedEmployeeKinds.length">
              На лицо
            </th>
          </tr>
          <tr>
            <template v-for="shItem in orderedSheetItems" :key="shItem.id">
              <th v-for="emplKind in orderedEmployeeKinds">
                {{ emplKind.kind }}
              </th>
            </template>
            <th v-for="emplKind in orderedEmployeeKinds" class="table-success">
              {{ emplKind.kind }}
            </th>
          </tr>
        </thead>
        <tbody
          v-if="
            Object.keys(normalizedData).length === 0 &&
            normalizedData.constructor === Object
          "
        ></tbody>
        <tbody v-else>
          <template
            v-for="subdivision in orderedSubdivisions"
            :key="subdivision.id"
          >
            <template
              v-for="item in this.normalizedData[subdivision.id]"
              :key="item"
              v-if="this.normalizedData[subdivision.id].length"
            >
              <tr
                :class="{
                  'table-danger':
                    this.normalizedData[subdivision.id].length > 1,
                }"
                @click="selectOutgoForUpdate(item.id)"
                style="cursor: pointer"
              >
                <td>
                  {{ subdivision.subdivision_name }}
                </td>
                <template v-for="shItem in orderedSheetItems" :key="shItem.id">
                  <template v-for="emplKind in orderedEmployeeKinds">
                    <td>
                      {{
                        item["results"][
                          "item_" +
                            shItem.id +
                            "_kind_" +
                            emplKind.id +
                            "_count"
                        ]
                      }}
                    </td>
                  </template>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr class="table-warning">
                <td>
                  {{ subdivision.subdivision_name }}
                </td>
                <template v-for="shItem in orderedSheetItems" :key="shItem.id">
                  <template v-for="emplKind in orderedEmployeeKinds">
                    <td></td>
                  </template>
                </template>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
      <h3 class="mt-4">Сводная таблица за Академию</h3>
      <table class="table table-hover mt-3">
        <thead>
          <tr>
            <th
              scope="col"
              v-for="shItem in orderedSheetItems"
              :key="shItem.id"
              :colspan="orderedEmployeeKinds.length"
            >
              {{ shItem.item_name }}
            </th>
            <th></th>
          </tr>
          <tr>
            <template v-for="shItem in orderedSheetItems" :key="shItem.id">
              <th v-for="emplKind in orderedEmployeeKinds">
                {{ emplKind.kind }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import { subdivisionAPI } from "@/api/admin/subdivisionAPI"
import { employeeKindAPI } from "@/api/client/employeeKindAPI"
import { sheetItemsAPI } from "@/api/client/sheetItemsAPI"
import { outgoKindAPI } from "@/api/client/outgoKindAPI"
import { outgoAPI } from "@/api/admin/outgoAPI"
import { outgoAPI as clientOutgoAPI } from "@/api/client/outgoAPI"
import { outgoDataAPI } from "@/api/admin/outgoDataAPI"
import { outgoDataAPI as clientOutgoDataAPI } from "@/api/client/outgoDataAPI"
import { Navbar, Spinner } from "@/components/common"

import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime,
} from "@/utils"

export default {
  name: "AdminMainView",
  components: { Spinner, Navbar },
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
      newData: {
        kind: "",
        subdivision: "",
        outgo_date: "",
      },
      currenOutGoForUpdate: {
        kind: "",
        subdivision: "",
        outgo_date: "",
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
      try {
        this.isLoading = true
        const subdivisionResponse = await subdivisionAPI.getItemsList(
          this.userToken,
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

        const outgoKindResponse = await outgoKindAPI.getItemsList(
          this.userToken,
        )
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
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
      this.fillOutgoArray()
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),

    async selectOutgoForUpdate(idOutgo) {
      const updateResponse = await outgoDataAPI.getItemData(
        this.userToken,
        idOutgo,
      )
      const outgoFotUpdate = await updateResponse.data
      this.currenOutGoForUpdate = outgoFotUpdate

      const updatedOutgoResponse = await clientOutgoAPI.getItemsList(
        this.userToken,
        {
          outgo: idOutgo,
        },
      )
      this.outgoList = await updatedOutgoResponse.data

      this.orderedSheetItems.map((shItem) => {
        this.orderedEmployeeKinds.map((emplKind) => {
          let item = this.orderedOutgo.find(
            (item) =>
              item.sheet_item == shItem.id && item.employee_kind == emplKind.id,
          )
          this.currenOutGoForUpdate[
            "item_" + shItem.id + "_kind_" + emplKind.id + "_count"
          ] = item.count

          this.currenOutGoForUpdate[
            "item_" + shItem.id + "_kind_" + emplKind.id + "_description"
          ] = item.description
        })
      })

      let updateModal = this.$refs.outgoUpdate
      let myModal = new bootstrap.Modal(updateModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async addNewOutgoData(e) {
      this.isLoading = true
      e.preventDefault()
      try {
        const newOutGoDataResponse = await clientOutgoDataAPI.addItemFull(
          this.userToken,
          {
            ...this.newData,
            owner: this.userData.id,
          },
        )
        const newOutgoDate = await newOutGoDataResponse.data
        this.outgoDataList.results.push(newOutgoDate)
      } catch (e) {
        this.isError = true
      } finally {
        this.$refs.addNewOutgoDataModalCloseButton.click()
        this.newData = {
          kind: "",
          subdivision: "",
          outgo_date: "",
        }
        await this.loadData()
        this.isLoading = false
      }
    },
    async updateOutgoData(e) {
      this.isLoading = true
      e.preventDefault()
      try {
        await clientOutgoDataAPI.updateItemFull(this.userToken, {
          ...this.currenOutGoForUpdate,
          owner: this.userData.id,
        })
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
        this.$refs.updateOutgoDataModalCloseButton.click()
        this.currenOutGoForUpdate = {
          kind: "",
          subdivision: "",
          outgo_date: "",
        }
        await this.loadData()
        this.isLoading = false
      }
    },
    fillOutgoArray() {
      this.orderedSheetItems.map((shItem) => {
        this.orderedEmployeeKinds.map((emplKind) => {
          this.newData[
            "item_" + shItem.id + "_kind_" + emplKind.id + "_count"
          ] = 0
        })
      })
    },
    getOutGoDataIds() {
      let ids = []
      this.outgoDataList.results.map((item) => ids.push(item.id))
      return ids
    },
    normalizeOutgoData() {
      this.orderedSubdivisions.map((subdivision) => {
        this.normalizedData[subdivision.id] = []
        this.normalizedData[subdivision.id] = this.orderedOutgoData.filter(
          (outgoData) => outgoData.subdivision == subdivision.id,
        )

        this.normalizedData[subdivision.id].map((outgoData) => {
          outgoData.results = {}
          this.orderedSheetItems.map((sheetItem) => {
            this.orderedEmployeeKinds.map((employeeKind) => {
              let outgo = this.orderedOutgo.find(
                (item) =>
                  item.sheet_item == sheetItem.id &&
                  item.employee_kind == employeeKind.id &&
                  item.outgo == outgoData.id,
              )
              if (outgo) {
                outgoData.results[
                  "item_" + sheetItem.id + "_kind_" + employeeKind.id + "_count"
                ] = outgo.count
                outgoData.results[
                  "item_" +
                    sheetItem.id +
                    "_kind_" +
                    employeeKind.id +
                    "_description"
                ] = outgo.description
              } else {
                outgoData.results[
                  "item_" + sheetItem.id + "_kind_" + employeeKind.id + "_count"
                ] = 0
                outgoData.results[
                  "item_" +
                    sheetItem.id +
                    "_kind_" +
                    employeeKind.id +
                    "_description"
                ] = ""
              }
            })
          })
        })
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
