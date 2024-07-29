<script setup lang="ts">

import {Icon} from "@iconify/vue";
</script>

<template>
  <nav class="navbar">
    <div class="navbar-info">
      <div class="info-wrapper">
        <h1>Applications</h1>
        <p>Manage your applications</p>
      </div>
      <label for="miss-area">
        <Icon icon="mdi:menu" width="24" height="24" />
      </label>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;

  width: 100%;
  height: 70px;

  background-color: var(--color-sidebar);

  .navbar-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    width: 100%;

    padding: 0 20px;

    h1 {
      font-size: 1.25rem;
      font-weight: 500;
    }

    p {
      font-size: 0.75rem;
      font-weight: 400;
    }

    label {
      opacity: 0;
      visibility: hidden;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-left: auto;

      cursor: pointer;

      transition: 0.2s all;
    }
  }
}

@media screen and (max-width: 780px) {
  .navbar {
    .navbar-info {
      label {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}
</style>