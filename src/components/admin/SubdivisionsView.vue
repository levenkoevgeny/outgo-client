<template>
  <!--  add modal-->
  <div
    class="modal fade"
    id="addSubdivisionDataModal"
    tabindex="-1"
    aria-labelledby="addSubdivisionDataModal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Новое подразделение
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
            <form @submit="addNewSubdivision" method="POST">
              <div class="mb-3">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Название подразделения</label>
                      <input
                        type="text"
                        class="form-control"
                        name="outgo_date"
                        required
                        v-model="newSubdivisionForm.subdivision_name"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Название подразделения (короткое)</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        name="outgo_date"
                        required
                        v-model="newSubdivisionForm.subdivision_short_name"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Закрепленный пользователь</label
                      >
                      <select
                        v-model="newSubdivisionForm.user"
                        class="form-select"
                      >
                        <option value="">-----</option>
                        <option v-for="user in orderedUsers" :value="user.id">
                          {{ user.username }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="addNewSubdivisionModalCloseButton"
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
    id="updateSubdivisionModal"
    tabindex="-1"
    aria-labelledby="updateSubdivisionModal"
    aria-hidden="true"
    ref="subdivisionUpdate"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Редактирование подразделения
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
            <form @submit="updateSubdivision" method="POST">
              <div class="mb-3">
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Название подразделения</label>
                      <input
                        type="text"
                        class="form-control"
                        name="outgo_date"
                        required
                        v-model="currentSubdivisionForUpdate.subdivision_name"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Название подразделения (короткое)</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        name="outgo_date"
                        required
                        v-model="
                          currentSubdivisionForUpdate.subdivision_short_name
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label"
                        >Закрепленный пользователь</label
                      >
                      <select
                        v-model="currentSubdivisionForUpdate.user"
                        class="form-select"
                      >
                        <option value="">-----</option>
                        <option v-for="user in orderedUsers" :value="user.id">
                          {{ user.username }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="updateSubdivisionModalCloseButton"
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

  <Navbar :userData="this.userData" />
  <div class="container">
    <h3 class="my-3">Форма поиска</h3>
    <div class="shadow-lg p-3 mb-5 bg-body rounded">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Название подразделения</label>
            <input
              type="text"
              class="form-control"
              v-model="subdivisionSearchForm.subdivision_name"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <div class="mb-3">
              <label class="form-label">Закрепленный пользователь</label>
              <select v-model="subdivisionSearchForm.user" class="form-select">
                <option value="">-----</option>
                <option v-for="user in orderedUsers" :value="user.id">
                  {{ user.username }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <button
        type="button"
        class="btn btn-danger me-3"
        :class="{ 'd-none': !selectedUsersCount }"
        @click="deleteCheckedUsersHandler"
      >
        <font-awesome-icon :icon="['far', 'trash-can']" />
        Удалить -
        {{ selectedUsersCount }}
      </button>
      <button
        type="button"
        class="btn btn-light"
        data-bs-toggle="modal"
        data-bs-target="#addSubdivisionDataModal"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        Добавить
      </button>
    </div>
    <div
      v-if="isLoading"
      style="height: 90vh"
      class="d-flex justify-content-center align-items-center"
    >
      <Spinner />
    </div>
    <div v-else>
      <table class="table table-hover bg-body table-sm mt-4">
        <thead class="table-primary">
          <tr>
            <th>
              <input
                type="checkbox"
                class="form-check-input"
                @click="checkAllHandler($event)"
              />
            </th>
            <th scope="col">Название подразделения</th>
            <th scope="col">Название подразделения (короткое)</th>
            <th scope="col">Пользователь</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subdivision in orderedSubdivisions"
            :key="subdivision.id"
            @click="selectSubdivisionForUpdate(subdivision.id)"
            style="cursor: pointer"
          >
            <td @click.stop>
              <input
                type="checkbox"
                class="form-check-input"
                v-model="subdivision.checked_val"
              />
            </td>
            <td>{{ subdivision.subdivision_name }}</td>
            <td>{{ subdivision.subdivision_short_name }}</td>
            <td v-if="subdivision.user">
              {{ subdivision.user_data.username }}
            </td>
            <td v-else></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { Navbar, Spinner } from "@/components/common"
import { subdivisionAPI } from "@/api/admin/subdivisionAPI"
import { usersAPI } from "@/api/admin/usersAPI"
import debounce from "lodash.debounce"

export default {
  name: "SubdivisionsView",
  components: { Navbar, Spinner },
  data() {
    return {
      subdivisionsList: { results: [] },
      usersList: { results: [] },
      isLoading: true,
      isError: false,
      newSubdivisionForm: {
        subdivision_name: "",
        subdivision_short_name: "",
        user: null,
      },
      currentSubdivisionForUpdate: {
        subdivision_name: "",
        subdivision_short_name: "",
        user: "",
      },
      subdivisionSearchForm: {
        subdivision_name: "",
        user: "",
      },
    }
  },
  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const subdivisionsResponse = await subdivisionAPI.getItemsList(
          this.userToken,
          this.subdivisionSearchForm,
        )
        this.subdivisionsList = await subdivisionsResponse.data

        const usersResponse = await usersAPI.getItemsList(this.userToken)
        this.usersList = await usersResponse.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewSubdivision(e) {
      try {
        this.isLoading = true
        e.preventDefault()
        await subdivisionAPI.addItem(this.userToken, this.newSubdivisionForm)
      } catch (e) {
        this.isError = true
      } finally {
        this.$refs.addNewSubdivisionModalCloseButton.click()
        this.newSubdivisionForm = {
          subdivision_name: "",
          subdivision_short_name: "",
          user: "",
        }
        await this.loadData()
        this.isLoading = false
      }
    },
    async updateSubdivision(e) {
      try {
        this.isLoading = true
        e.preventDefault()
        await subdivisionAPI.updateItem(
          this.userToken,
          this.currentSubdivisionForUpdate,
        )
      } catch (e) {
        this.isError = true
      } finally {
        this.$refs.updateSubdivisionModalCloseButton.click()
        await this.loadData()
        this.isLoading = false
      }
    },
    checkAllHandler(e) {
      if (e.target.checked) {
        this.subdivisionsList.results = this.subdivisionsList.results.map(
          (subdivision) => ({
            ...subdivision,
            checked_val: true,
          }),
        )
      } else {
        this.subdivisionsList.results = this.subdivisionsList.results.map(
          (subdivision) => ({
            ...subdivision,
            checked_val: false,
          }),
        )
      }
    },
    async deleteCheckedUsersHandler() {
      this.isLoading = true
      this.isError = false
      let requestIds = []
      this.subdivisionsList.results.map((subdivision) => {
        if (subdivision.checked_val) {
          requestIds.push(subdivision.id)
        }
      })
      let requests = requestIds.map((id) =>
        subdivisionAPI.deleteItem(this.userToken, id),
      )
      Promise.all(requests)
        .then(async () => {
          await this.loadData()
        })
        .catch(() => (this.isError = true))
        .finally(() => {
          this.isLoading = false
        })
    },
    async selectSubdivisionForUpdate(idSubdivision) {
      const updateResponse = await subdivisionAPI.getItemData(
        this.userToken,
        idSubdivision,
      )
      this.currentSubdivisionForUpdate = await updateResponse.data

      let updateModal = this.$refs.subdivisionUpdate
      let myModal = new bootstrap.Modal(updateModal, {
        keyboard: false,
      })
      myModal.show()
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
  },
  async created() {
    await this.loadData()
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    orderedSubdivisions() {
      return this.subdivisionsList.results
    },
    orderedUsers() {
      return this.usersList.results
    },
    selectedUsersCount() {
      let counter = 0
      this.subdivisionsList.results.map((subdivision) => {
        if (subdivision.checked_val) {
          counter++
        }
      })
      return counter
    },
  },
  watch: {
    subdivisionSearchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
