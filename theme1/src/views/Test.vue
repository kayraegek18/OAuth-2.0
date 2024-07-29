<script setup lang="ts">
import {onMounted} from "vue";

onMounted(() => {
  const popup = window.open('http://localhost:5173/oauth2/authorize?response_type=code&redirect_uri=https://mineala.com/auth/callback&scope=identify,email&client_id=1198979339665031289', 'popup', 'popup=true,width=600,height=800');
  const checkPopup = setInterval(() => {
    if (popup) {
      popup.window.localStorage.setItem("token", "31321");
    }
    if (!popup || !popup.closed) return;
    clearInterval(checkPopup);
  }, 500);
});
</script>

<template>

</template>

<style scoped>

</style>