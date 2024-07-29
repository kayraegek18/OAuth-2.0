<script setup lang="ts">

import {Icon} from "@iconify/vue";
import Blur from "@/components/Blur.vue";
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <img src="../../assets/logo.svg" alt="Logo">
        <Blur color="#00C896" size="100" stroke="20" id="blur" />
      </div>
      <h1>Mineala Developer</h1>
    </div>
    <div class="sidebar-body">
      <ul>
        <li>
          <router-link to="/applications" active-class="active">
            <Icon icon="mdi:view-grid" width="24" height="24" />
            <p>Ana Sayfa</p>
          </router-link>
        </li>
        <li>
          <div class="divider">
            <p>Developer</p>
          </div>
        </li>
        <li>
          <router-link to="/applications/list" active-class="active">
            <Icon icon="mdi:server-network" width="24" height="24" />
            <p>Applications</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="sidebar-footer">
      <button>
        <Icon icon="mdi:user" width="24" height="24" />
        Profile
      </button>
      <button class="filled">
        <Icon icon="mdi:logout" width="24" height="24" />
        Logout
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

  z-index: 11;

  min-width: 300px;

  min-height: 100dvh;
  max-height: 100dvh;

  background-color: var(--color-sidebar);
  color: var(--color-text);

  .sidebar-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
    min-height: 110px;

    .logo-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      margin-top: 20px;

      img {
        height: 40px;
      }

      .blur {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    h1 {
      font-size: 1.1rem;
      font-weight: 500;
      margin-top: 10px;
    }
  }

  .sidebar-body {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;

    margin-top: 40px;

    width: 100%;
    min-height: 100%;
    max-height: 100%;

    margin-bottom: auto;

    overflow-y: auto;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      width: 100%;

      li {
        display: flex;
        align-items: center;
        justify-content: start;

        width: 100%;
        height: 50px;

        a, .sidebar-button {
          display: flex;
          align-items: center;
          justify-content: start;

          gap: 10px;

          width: 100%;
          height: 100%;

          padding: 0 20px;

          color: var(--color-text);
          text-decoration: none;
          transition: all 0.3s;

          &:hover {
            color: var(--color-primary);
          }

          &.active {
            color: var(--color-primary);
          }

          p {
            width: 100%;
          }
        }

        .divider {
          display: flex;
          align-items: center;
          justify-content: start;

          width: 100%;
          height: 50px;

          padding: 0 15px;

          p {
            font-size: 0.8rem;
            font-weight: 400;
          }
        }
      }
    }

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary);
      border-radius: 4px;
    }
  }

  .sidebar-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 60px;

    padding: 10px;

    button {
      display: flex;
      align-items: center;
      justify-content: center;

      gap: 5px;

      padding: 5px 10px;
      border: 0;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;

      min-width: 100px;

      transition: all 0.3s;

      &:first-child {
        background-color: var(--color-surface);
        color: var(--color-text);
      }

      &.filled {
        background-color: var(--color-danger);
        color: var(--color-surface);
      }

      &:hover {
        filter: brightness(0.9);
      }

      &:disabled {
        cursor: not-allowed;
        background-color: var(--color-surface);
        color: var(--color-text);
      }
    }
  }
}
</style>