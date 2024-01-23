<template>
  <div>
    <h5>{{ sheetItem.item_name }}</h5>
    <div class="d-flex flex-wrap justify-content-start">
      <div
        v-for="employeeKind in employeeKinds"
        class="me-3 border-start ps-3"
        style="width: 25rem"
      >
        <div class="mb-3">
          <label class="form-label">{{ employeeKind.kind }}</label>
          <input type="number" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea name="" rows="2" class="form-control"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewOutgoItem",
  props: {
    sheetItem: { type: Object, required: true },
    employeeKinds: { type: Array, required: true },
  },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
