<script setup lang="ts">
import {Icon} from "@iconify/vue";
import Sidebar from "@/components/application/Sidebar.vue";
import Navbar from "@/components/application/Navbar.vue";
import {useAuth} from "@/stores/auth";
import {onBeforeMount, ref} from "vue";
import Modal from "@/components/Modal.vue";
import {useApplication} from "@/stores/application";

const auth = useAuth();
const application = useApplication();

const buttonLoading = ref(false);
const applicationName = ref("");
const modalVisibility = ref(false);

onBeforeMount(async () => {
  await auth.setUser();
})

const createApplication = async () => {
  buttonLoading.value = true;
  if (applicationName.value === "") {
    buttonLoading.value = false;
    return;
  }

  if (applicationName.value.length < 3) {
    buttonLoading.value = false;
    return;
  }

  if (applicationName.value.length > 20) {
    buttonLoading.value = false;
    return;
  }

  await application.createApplication(applicationName.value);
  await auth.setUser();

  await new Promise(resolve => setTimeout(resolve, 1000));

  closeModal();
  applicationName.value = "";
  buttonLoading.value = false;
}

const openModal = () => {
  modalVisibility.value = true;
}

const closeModal = () => {
  modalVisibility.value = false;
}
</script>

<template>
  <div class="container">
    <Modal title="Create Application" :visible="modalVisibility" :on-submit="createApplication" :on-close="closeModal" :loading="buttonLoading">
      <input class="modal-input" type="text" placeholder="Application Name" v-model="applicationName" maxlength="20">
    </Modal>

    <input type="checkbox" id="miss-area" hidden>
    <Sidebar />
    <label class="miss-area" for="miss-area"></label>
    <div class="navbar-wrapper">
      <Navbar />
      <div class="wrapper">
        <div class="alert info" style="display: none">
          <Icon icon="mdi:information" width="24" height="24" />
          <p>There are no applications registered yet.</p>
        </div>

        <div class="header">
          <p>Applications</p>
          <button @click="openModal">Create</button>
        </div>

        <div class="applications">
          <router-link :to="`/applications/${application.app_id}`" class="application" v-for="application in (auth.user ? auth.user.applications : [])">
            <div class="application-header">
              <img :src="`${application.app_avatar}`" alt="Logo">
            </div>
            <div class="application-content">
              <p>{{ application.app_name }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: start;

  width: 100%;
  min-height: 100dvh;

  color: var(--color-text);
  background-color: var(--color-background);

  .modal-input {
    width: 100%;
    padding: 10px;

    background-color: var(--color-sidebar);
    border: 1px solid var(--color-sidebar);
    border-radius: 8px;

    color: var(--color-text);
    font-size: 1rem;
    font-weight: 500;

    transition: all 0.3s;

    outline: none;

    &::placeholder {
      color: var(--color-text);
    }

    &:focus {
      border: 1px solid var(--color-primary);
    }
  }

  .navbar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;

    width: 100%;
    max-height: 100dvh;

    z-index: 9;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;

    overflow-y: auto;

    width: 100%;
    max-height: 100dvh;

    padding: 40px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary);
      border-radius: 4px;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      width: 100%;
      margin-bottom: 20px;

      p {
        font-size: 1.5rem;
        font-weight: 600;
      }

      button {
        padding: 10px 20px;

        background-color: var(--color-primary);
        border: none;
        border-radius: 8px;

        color: var(--color-text);
        font-size: 1rem;
        font-weight: 500;

        transition: all 0.3s;

        cursor: pointer;
        text-decoration: none;

        outline: none;

        &:hover {
          background-color: rgb(from var(--color-primary) r g b / 0.7);
        }
      }
    }

    .applications {
      display: grid;
      grid-template-columns: repeat(8, 0.2fr);
      grid-auto-rows: auto;
      grid-gap: 1rem;

      width: 100%;

      .application {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;

        min-width: 160px;
        max-width: 150px;

        padding: 10px;

        background-color: var(--color-sidebar);
        border-radius: 8px;

        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        transition: all 0.3s;

        text-decoration: none;
        color: var(--color-text);

        &:hover {
          transform: translateY(-5px);

          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        }

        .application-header {
          display: flex;
          align-items: center;
          justify-content: center;

          margin-top: 5px;

          width: 100%;

          img {
            max-height: 128px;
            border-radius: 8px;
          }
        }

        .application-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          margin-top: 10px;

          p {
            width: 100%;

            text-align: center;

            font-family: 'Space Mono', 'Monospace', sans-serif;
            font-size: 0.8rem;
            font-weight: 500;
          }
        }
      }
    }

    .alert {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;

      gap: 10px;

      width: 100%;
      padding: 20px;

      background-color: var(--color-alert-info);
      border-radius: 8px;

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);

        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      }

      svg {
        color: var(--color-text);
      }

      p {
        font-size: 1rem;
        font-weight: 400;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .container {
    .navbar-wrapper {
      .wrapper {
        .cards {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

@media screen and (max-width: 780px) {
  .container {
    .sidebar {
      position: absolute;
      transition: 0.3s all;
    }

    input:not(:checked) + .sidebar {
      transform: translateX(-1000px);
    }

    input:not(:checked) ~ .miss-area {
      transform: translateX(-1000px);
    }

    .miss-area {
      position: absolute;
      width: 100%;
      height: 100%;

      z-index: 10;
    }

    .navbar {
      .navbar-info {
        label {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .navbar-wrapper {
      .wrapper {
        .cards {
          grid-template-columns: 1fr;
        }
      }
    }

    .navbar-wrapper {
      .wrapper {
        .cards {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .container {
    .navbar-wrapper {
      .wrapper {
        .cards {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>