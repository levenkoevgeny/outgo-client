<template>
  <Navbar :is_staff="this.userData.is_staff" />
  <div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Navbar } from "@/components/common"
export default {
  components: { Navbar },
  data() {
    return { is_staff: false }
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
  },
}
</script>
<style></style>
