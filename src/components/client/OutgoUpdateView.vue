<template>
  <div class="container">
    <h3 class="my-4">
      Редактирование расхода личного состава на
      <span class="text-decoration-underline">{{
        updatedOutGo.outgo_date
      }}</span>
    </h3>
    <div>
      <form @submit="submitUpdateForm" method="POST">
        <div class="border border-2 mb-3 px-4 py-2">
          <div class="row">
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Подразделение</label>
                <select
                  class="form-select"
                  required
                  name="subdivision"
                  v-model="updatedOutGo.subdivision"
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
                  v-model="updatedOutGo.outgo_date"
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
                  v-model="updatedOutGo.kind"
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
                      required
                      class="form-control"
                      min="0"
                      v-model="
                        updatedOutGo[
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
                        updatedOutGo[
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
        <button type="submit" class="btn btn-primary">Сохранить</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { subdivisionAPI } from "@/api/client/subdivisionAPI"
import { employeeKindAPI } from "@/api/client/employeeKindAPI"
import { sheetItemsAPI } from "@/api/client/sheetItemsAPI"
import { outgoKindAPI } from "@/api/client/outgoKindAPI"
import { outgoDataAPI } from "@/api/client/outgoDataAPI"
import { outgoAPI } from "@/api/client/outgoAPI"

export default {
  name: "OutgoUpdateView",
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoKindList: { results: [] },
      outgoList: { results: [] },
      updatedOutGo: {},
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  async created() {
    await this.loadData()
    try {
      const updatedOutgoDataResponse = await outgoDataAPI.getItemData(
        this.userToken,
        this.$route.params.id,
      )
      const updatedOutgoData = await updatedOutgoDataResponse.data
      this.updatedOutGo["id"] = updatedOutgoData.id
      this.updatedOutGo["kind"] = updatedOutgoData.kind
      this.updatedOutGo["subdivision"] = updatedOutgoData.subdivision
      this.updatedOutGo["outgo_date"] = updatedOutgoData.outgo_date
      this.updatedOutGo["owner"] = updatedOutgoData.owner

      const updatedOutgoResponse = await outgoAPI.getItemsList(this.userToken, {
        outgo: this.$route.params.id,
      })
      this.outgoList = await updatedOutgoResponse.data

      this.orderedSheetItems.map((shItem) => {
        this.orderedEmployeeKinds.map((emplKind) => {
          let item = this.orderedOutgo.find(
            (item) =>
              item.sheet_item == shItem.id && item.employee_kind == emplKind.id,
          )
          this.updatedOutGo[
            "item_" + shItem.id + "_kind_" + emplKind.id + "_count"
          ] = item.count

          this.updatedOutGo[
            "item_" + shItem.id + "_kind_" + emplKind.id + "_description"
          ] = item.description
        })
      })
    } catch (e) {
      this.isError = true
    } finally {
    }
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
    async submitUpdateForm(e) {
      this.isLoading = true
      e.preventDefault()
      try {
        await outgoDataAPI.updateItemFull(this.userToken, {
          ...this.updatedOutGo,
          owner: this.userData.id,
        })
        // await this.$router.replace({ name: "client-main" })
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
    orderedOutgo() {
      return this.outgoList.results
    },
    // getFullOutgo() {
    //   let outgoCount = 0
    //   this.orderedSheetItems.map((shItem) => {
    //     this.orderedEmployeeKinds.map((emplKind) => {
    //       let key = "item_" + shItem.id + "_kind_" + emplKind.id + "_count"
    //       if (this.newData.hasOwnProperty(key)) {
    //         outgoCount = outgoCount + parseInt(this.newData[key]) * shItem.sign
    //       }
    //     })
    //   })
    //   return outgoCount
    // },
  },
}
</script>

<style scoped></style>
