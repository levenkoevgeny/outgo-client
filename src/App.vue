<template>
  <div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Navbar } from "@/components/common"
export default {
  components: { Navbar },
}
</script>
<style></style>
