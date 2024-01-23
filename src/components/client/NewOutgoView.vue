<template>
  <br />
  <br />
  <br />
  <h3>Новый расход</h3>
  <div>
    <form>
      <div class="border border-2 mb-3 px-4 py-2">
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label"
                >Подразделение</label
              >
              <select class="form-select">
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
          <div class="col-md-6">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">На дату</label>
              <input type="date" class="form-control" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          v-for="sheetItem in orderedSheetItems"
          class="border border-2 mb-3 px-4 py-2"
        >
          <NewOutgoItem
            :sheetItem="sheetItem"
            :employeeKinds="orderedEmployeeKinds"
          />
        </div>
        <!--        <div-->
        <!--          v-for="sheetItem in orderedSheetItems"-->
        <!--          class="border border-2 mb-3 px-4 py-2"-->
        <!--        >-->
        <!--          <h5>{{ sheetItem.item_name }}</h5>-->
        <!--          <div class="d-flex flex-wrap justify-content-start">-->
        <!--            <div-->
        <!--              v-for="employeeKind in orderedEmployeeKinds"-->
        <!--              class="me-3 border-start ps-3"-->
        <!--              style="width: 25rem"-->
        <!--            >-->
        <!--              <div class="mb-3">-->
        <!--                <label class="form-label">{{ employeeKind.kind }}</label>-->
        <!--                <input-->
        <!--                  type="text"-->
        <!--                  class="form-control"-->
        <!--                  id="exampleInputEmail1"-->
        <!--                  aria-describedby="emailHelp"-->
        <!--                />-->
        <!--              </div>-->
        <!--              <div class="mb-3">-->
        <!--                <label class="form-label">Description</label>-->
        <!--                <textarea-->
        <!--                  name=""-->
        <!--                  id=""-->
        <!--                  rows="2"-->
        <!--                  class="form-control"-->
        <!--                ></textarea>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <br />
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
import { outgoAPI } from "@/api/client/outgoAPI"

import Spinner from "@/components/common/Spinner"
import NewOutgoItem from "@/components/client/NewOutgoItem"

export default {
  name: "NewOutgoView",
  components: { NewOutgoItem, Spinner },
  data() {
    return {
      subdivisionsList: { results: [] },
      employeeKindsList: { results: [] },
      sheetItemsList: { results: [] },
      outgoList: { results: [] },
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
    orderedSheetItems() {
      return this.sheetItemsList.results
    },
    orderedEmployeeKinds() {
      return this.employeeKindsList.results
    },
  },
}
</script>

<style scoped></style>
