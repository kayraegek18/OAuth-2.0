<script setup lang="ts">
import {onMounted} from "vue";

onMounted(async () => {
  const query = new URLSearchParams(window.location.search);
  const code = query.get("code");

  if (!code) {
    window.location.href = "/";
  }

  const response = await fetch("http://localhost:3000/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      client_id: "523584844853149697",
      client_secret: "993dbbba907b0d9f",
      redirect_uri: "http://localhost:5173/auth/callback",
      grant_type: "authorization_code",
    }),
  });
  const data = await response.json();
  if (data.error) {
    window.location.href = "/";
  }
  console.log(data);
  const userResponse = await fetch("http://localhost:3000/user/@me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${data.access_token}`,
    },
  });
  const userData = await userResponse.json();
  console.log(userData);
  window.localStorage.setItem("accessToken", data.access_token);
  window.localStorage.setItem("user", JSON.stringify(userData));

  window.location.href = "/";
})
</script>

<template>

</template>

<style scoped>

</style>