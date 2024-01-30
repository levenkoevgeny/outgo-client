<template>
  <Navbar :userData="this.userData" />
  <div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Navbar } from "@/components/common"
export default {
  components: { Navbar },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
}
</script>
<style></style>
