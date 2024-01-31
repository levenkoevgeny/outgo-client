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
              <div class="border border-2 rounded rounded-1 mb-3 px-4 py-2">
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
                  class="border border-2 rounded rounded-1 mb-3 px-4 py-2"
                >
                  <div>
                    <h5>{{ sheetItem.item_name }}</h5>
                    <div
                      class="d-flex flex-row flex-wrap justify-content-start"
                    >
                      <div
                        v-for="employeeKind in orderedEmployeeKinds"
                        class="me-3"
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
              <div class="border border-2 rounded rounded-1 mb-3 px-4 py-2">
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
                  class="border border-2 rounded rounded-1 mb-3 px-4 py-2"
                >
                  <div>
                    <h5>{{ sheetItem.item_name }}</h5>
                    <div
                      class="d-flex flex-row flex-wrap justify-content-start"
                    >
                      <div
                        v-for="employeeKind in orderedEmployeeKinds"
                        class="me-3"
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

  <!--  update modal-->
  <div class="container">
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 90vh"
    >
      <Spinner />
    </div>
    <div v-else>
      <h3 class="my-3">Форма поиска</h3>
      <div class="shadow-lg p-3 mb-5 bg-body rounded">
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label"
                ><font-awesome-icon :icon="['far', 'calendar-days']" /> Дата
                расхода (с)</label
              >
              <input
                type="date"
                class="form-control"
                v-model="outgoSearchForm.outgo_date__gte"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label"
                ><font-awesome-icon :icon="['far', 'calendar-days']" /> Дата
                расхода (по)</label
              >
              <input
                type="date"
                class="form-control"
                v-model="outgoSearchForm.outgo_date__lte"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label"
                ><font-awesome-icon :icon="['fas', 'user-group']" />
                Подразделение</label
              >
              <select v-model="outgoSearchForm.subdivision" class="form-select">
                <option value="">-----</option>
                <option
                  v-for="subdivision in orderedSubdivisions"
                  :value="subdivision.id"
                >
                  {{ subdivision.subdivision_name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label"
                ><font-awesome-icon :icon="['fas', 'check']" /> Вид
                расхода</label
              >
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

      <div class="mt-4"></div>
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-light"
          data-bs-toggle="modal"
          data-bs-target="#addOutgoDataModal"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          Добавить
        </button>
      </div>

      <div v-if="orderedOutgoData.length">
        <table class="table table-hover bg-body table-sm mt-4">
          <thead class="table-primary">
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
              @click="selectOutgoForUpdate(outgoData.id)"
              style="cursor: pointer"
            >
              <td>{{ outgoData.subdivision_data.subdivision_name }}</td>
              <td>{{ outgoData.kind_data.kind }}</td>
              <td class="fw-bold">
                {{
                  new Date(outgoData.outgo_date).toLocaleDateString("default", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }}
              </td>
              <td>
                {{ getFormattedDateComponent(outgoData.date_time_created) }}
                {{ getFormattedTimeComponent(outgoData.date_time_created) }}
              </td>
              <td @click.stop="makeClone(outgoData.id)" title="Сделать копию">
                <font-awesome-icon :icon="['far', 'copy']" />
              </td>
              <td @click.stop="deleteOutgoData(outgoData.id)" title="Удалить">
                <font-awesome-icon :icon="['far', 'trash-can']" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <h5>
          Ничего не найдено. Измените параметры поиска либо
          <span
            ><button
              type="button"
              class="btn btn-link m-0 px-0 pb-3 fs-5"
              data-bs-toggle="modal"
              data-bs-target="#addOutgoDataModal"
            >
              создайте новый расход
            </button></span
          >
        </h5>
      </div>
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
import { outgoKindAPI } from "@/api/client/outgoKindAPI"

import Spinner from "@/components/common/Spinner"
import { Navbar } from "@/components/common"
import debounce from "lodash.debounce"

import {
  getCurrentFormatDate,
  getFormattedDate,
  getFormattedTime,
} from "@/utils"

export default {
  name: "ClientMainView",
  components: { Spinner, Navbar },
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoList: { results: [] },
      outgoDataList: { results: [] },
      outgoKindList: { results: [] },
      outgoSearchForm: {
        outgo_date__lte: getCurrentFormatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 10,
          ),
        ),
        outgo_date__gte: getCurrentFormatDate(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - 10,
          ),
        ),
        kind: "",
        subdivision: "",
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
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  async created() {
    this.isLoading = true
    this.isError = false
    try {
      await this.loadData()
    } catch (e) {
      this.isError = true
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async loadData() {
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

      const outgoResponse = await outgoAPI.getItemsList(this.userToken)
      this.outgoList = await outgoResponse.data

      const outgoDataResponse = await outgoDataAPI.getItemsList(
        this.userToken,
        { ...this.outgoSearchForm, subdivision__user: this.userData.id },
      )
      this.outgoDataList = await outgoDataResponse.data

      const outgoKindResponse = await outgoKindAPI.getItemsList(this.userToken)
      this.outgoKindList = await outgoKindResponse.data

      this.fillOutgoArray()
    },
    async selectOutgoForUpdate(idOutgo) {
      const updateResponse = await outgoDataAPI.getItemData(
        this.userToken,
        idOutgo,
      )
      this.currenOutGoForUpdate = await updateResponse.data

      const updatedOutgoResponse = await outgoAPI.getItemsList(this.userToken, {
        outgo: idOutgo,
      })
      this.outgoList = await updatedOutgoResponse.data

      this.orderedSheetItems.map((shItem) => {
        this.orderedEmployeeKinds.map((emplKind) => {
          let item = this.orderedOutgo.find(
            (item) =>
              item.sheet_item === shItem.id &&
              item.employee_kind === emplKind.id,
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

      // await this.$router.push({ name: "update", params: { id: idOutgo } })
    },
    async makeClone(outgoId) {
      this.isLoading = true
      this.isError = false
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
    async deleteOutgoData(outgoId) {
      this.isLoading = true
      this.isError = false
      try {
        const response = await outgoDataAPI.deleteItem(this.userToken, outgoId)
        const deletedItem = await response.data
        this.outgoDataList.results = this.outgoDataList.results.filter(
          (item) => item.id !== deletedItem.id,
        )
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewOutgoData(e) {
      this.isLoading = true
      e.preventDefault()
      try {
        const newOutGoDataResponse = await outgoDataAPI.addItemFull(
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
        await outgoDataAPI.updateItemFull(this.userToken, {
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
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
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
    orderedOutgoKinds() {
      return this.outgoKindList.results
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
