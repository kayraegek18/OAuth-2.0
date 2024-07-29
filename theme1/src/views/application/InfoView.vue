<script setup lang="ts">
import {Icon} from "@iconify/vue";
import Sidebar from "@/components/application/Sidebar.vue";
import Navbar from "@/components/application/Navbar.vue";
import {useAuth} from "@/stores/auth";
import {useApplication} from "@/stores/application";
import {onBeforeMount, ref, watch} from "vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";

const auth = useAuth();
const application = useApplication();
const route = useRoute();

const loading = ref(true);
const redirectsChanged = ref(false);
const redirectUrls = ref<object[]>([]);

watch(() => redirectUrls.value, (value) => {
  if (!value)
    return;
  if (!application.application) {
    return;
  }

  redirectsChanged.value = false;

  const applicationRedirects = application.application.redirect_uris;
  const newRedirects = value.map((redirectUrl) => redirectUrl.url);

  if (applicationRedirects.length !== newRedirects.length) {
    redirectsChanged.value = true;
    return;
  }

  for (let i = 0; newRedirects.length > i; i++) {
    if (applicationRedirects.includes(newRedirects[i])) {
      continue;
    }

    redirectsChanged.value = true;
  }

}, {deep: true});

onBeforeMount(async () => {
  loading.value = true;
  await auth.setUser();
  const appId: any = route.params.id;
  await application.getApplication(appId);
  if (!application.application)
    return;
  redirectUrls.value = application.application.redirect_uris.map((redirectUrl: string) => {
    return {
      url: redirectUrl,
      index: Math.floor(Math.random() * 999999999)
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  loading.value = false;
});

onBeforeRouteLeave(async (to, from, next) => {
  if (redirectsChanged.value) {
    next(false);
    return;
  }
  next();
});

const save = async () => {
  if (!application.application) {
    return;
  }
  const applicationRedirects = application.application.redirect_uris;
  let newRedirects = redirectUrls.value.map((redirectUrl) => redirectUrl.url);

  for (let i = 0; newRedirects.length > i; i++) {
    let url = newRedirects[i];
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // remove element
      newRedirects.splice(i, 1);
      i--;
      continue;
    }
    url = url.trim();
    url = url.replace(/\/$/, "");
    newRedirects[i] = url;
  }

  for (let i = 0; applicationRedirects.length > i; i++) {
    if (newRedirects.includes(applicationRedirects[i])) {
      continue;
    }

    await application.removeRedirectUri(applicationRedirects[i]);
  }

  for (let i = 0; newRedirects.length > i; i++) {
    if (applicationRedirects.includes(newRedirects[i])) {
      continue;
    }

    await application.addRedirectUri(newRedirects[i]);
  }

  const appId: any = route.params.id;
  await application.getApplication(appId);

  redirectUrls.value = application.application.redirect_uris.map((redirectUrl: string) => {
    return {
      url: redirectUrl,
      index: Math.floor(Math.random() * 999999999)
    };
  });

  redirectsChanged.value = false;
};

const cancel = () => {
  redirectUrls.value = application.application.redirect_uris.map((redirectUrl: string) => {
    return {
      url: redirectUrl,
      index: Math.floor(Math.random() * 999999999)
    };
  });
  redirectsChanged.value = false;
};

const resetSecret = () => {
  if (!application.application) {
    return;
  }
  application.resetSecret();
}

const copySecret = () => {
  if (!application.application) {
    return;
  }
  navigator.clipboard.writeText(application.application.app_secret);
}

const copyId = () => {
  if (!application.application) {
    return;
  }
  navigator.clipboard.writeText(application.application.app_id);
}

const addRedirect = () => {
  const randomIndex = Math.floor(Math.random() * 999999999);
  redirectUrls.value.push({
    url: "",
    index: randomIndex
  });
  console.log(redirectUrls.value);
};

const removeRedirect = (index: number) => {
  console.log(index)
  redirectUrls.value = redirectUrls.value.filter((redirectUrl) => redirectUrl.index !== index);
};
</script>

<template>
  <div class="container">
    <input type="checkbox" id="miss-area" hidden>
    <Sidebar />
    <label class="miss-area" for="miss-area"></label>
    <div class="navbar-wrapper">
      <Navbar />

      <div :class="`loading-wrapper ${loading ? 'show': ''}`">
        <Icon icon="eos-icons:three-dots-loading" />
      </div>
      <div :class="`wrapper ${loading ? '': 'show'}`">
        <div class="main-info">
          <div class="header">
            <p>Application information</p>
          </div>
          <div class="content">
            <div class="info-wrapper">
              <div class="info">
                <p>Client Id</p>
                <p class="small">
                  {{ application.application.app_id }}
                </p>
                <div class="buttons">
                  <button @click="copyId"><Icon icon="mdi:content-copy" /></button>
                </div>
              </div>
              <div class="info">
                <p>Client Secret</p>
                <p class="small hide">
                  {{ application.application.app_secret }}
                </p>
                <div class="buttons">
                  <button @click="copySecret"><Icon icon="mdi:content-copy" /></button>
                  <button @click="resetSecret"><Icon icon="mdi:reload" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="redirects">
          <div class="header">
            <p>Redirects</p>
            <p class="small">You must specify at least one URI for authentication to work. If you pass a URI in an OAuth request, it must exactly match one of the URIs you enter here.</p>
          </div>
          <div class="content">
            <div class="input-wrapper">
              <div class="alert info" v-if="redirectUrls.length <= 0">
                <Icon icon="mdi:information" width="24" height="24" />
                <p>There are no redirect url registered yet.</p>
              </div>
              <div class="input" v-for="redirectUrl in redirectUrls">
                <input type="text" v-model="redirectUrl.url">
                <button class="remove" @click="() => removeRedirect(redirectUrl.index)">
                  <Icon icon="basil:cross-outline" />
                </button>
              </div>
            </div>
            <button class="add" @click="addRedirect">Add</button>
          </div>
        </div>

        <div class="save-dialog-wrapper">
          <div :class="`save-dialog ${redirectsChanged == true ? 'show' : ''}`">
            <p>
              <Icon icon="mdi:information" width="24" height="24" />
              <span>You have unsaved changes. Do you want to save them?</span>
            </p>
            <div class="buttons">
              <button class="cancel" @click="cancel">Cancel</button>
              <button class="save filled" @click="save">Save</button>
            </div>
          </div>
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

  .navbar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;

    width: 100%;
    max-height: 100dvh;

    z-index: 9;
  }

  .loading-wrapper {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow-y: auto;

    width: 100%;
    min-height: 90dvh;
    max-height: 100dvh;

    padding: 40px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary);
      border-radius: 4px;
    }

    svg {
      font-size: 5rem;
    }

    &.show {
      display: flex;
    }
  }

  .wrapper {
    display: none;
    flex-direction: column;
    align-items: start;
    justify-content: start;

    position: relative;

    overflow-y: auto;

    width: 100%;
    min-height: 90dvh;
    max-height: 100dvh;

    padding: 40px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary);
      border-radius: 4px;
    }

    &.show {
      display: flex;
    }

    .main-info {
      width: 100%;
      min-height: 200px;

      border-radius: 8px;

      background-color: var(--color-sidebar);

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        padding: 20px;

        p {
          font-size: 1.5rem;
          font-weight: 500;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;

        width: 100%;
        padding: 20px;

        .info-wrapper {
          display: flex;
          flex-direction: row;
          align-items: start;
          justify-content: start;

          gap: 20px;

          .info {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;

            min-width: 200px;
            max-width: 200px;

            p {
              display: flex;
              flex-direction: column;
              align-items: start;
              justify-content: start;
              gap: 10px;

              text-transform: uppercase;
              font-size: 0.95rem;
              font-weight: 400;

              &.small {
                font-family: 'Space Mono', 'Monospace', sans-serif;
                font-size: 0.9rem;
                font-weight: 500;
              }

              &.hide {
                filter: blur(5px);
                pointer-events: none;
                user-select: none;
              }
            }

            .buttons {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;

              margin-top: 10px;

              gap: 10px;
            }

            button {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;

              width: 30px;
              height: 30px;

              background-color: var(--color-primary);
              border-radius: 8px;
              border: none;
              outline: none;

              transition: all 0.3s;
              cursor: pointer;

              &:hover {
                background-color: rgb(from var(--color-primary) r g b / 0.7);
              }

              svg {
                color: var(--color-text);
                font-size: 1.2rem;
              }

            }
          }
        }
      }
    }

    .redirects {
      width: 100%;

      margin-top: 50px;
      border-radius: 8px;

      background-color: var(--color-sidebar);

      .header {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;

        width: 100%;
        padding: 20px;

        p {
          font-size: 1.5rem;
          font-weight: 500;

          &.small {
            font-size: 1rem;
            font-weight: 400;
          }
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;

        width: 100%;
        padding: 20px;

        .input-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;

          width: 100%;
          gap: 20px;

          .input {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;

            width: 100%;
            gap: 10px;

            input {
              width: 100%;
              padding: 10px;

              border: 1px solid var(--color-primary);
              border-radius: 8px;

              background-color: var(--color-background);
              color: var(--color-text);

              outline: none;

              font-size: 1rem;
              font-weight: 400;
            }

            .remove {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;

              padding: 5px;

              background-color: var(--color-danger);
              border-radius: 8px;
              border: none;
              outline: none;

              transition: all 0.3s;

              &:hover {
                background-color: rgb(from var(--color-danger) r g b / 0.7);
              }

              svg {
                color: var(--color-text);
                font-size: 1.5rem;
              }
            }
          }
        }

        .add {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          width: 100px;
          padding: 10px;

          margin-top: 20px;

          background-color: var(--color-primary);
          border-radius: 8px;
          border: none;

          color: var(--color-text);
          outline: none;
          cursor: pointer;

          font-size: 1rem;
          font-weight: 500;

          transition: all 0.3s;

          &:hover {
            background-color: rgb(from var(--color-primary) r g b / 0.7);
          }
        }
      }
    }

    .save-dialog-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;

      padding-right: 20px;
      padding-left: 20px;
    }

    .save-dialog {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      opacity: 0;
      visibility: hidden;

      width: 100%;
      gap: 10px;

      padding: 20px;

      background-color: var(--color-alert-info);
      border-radius: 8px;

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);

        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      }

      p {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;

        margin-right: 50px;

        font-size: 1rem;
        font-weight: 400;

        svg {
          margin-right: 10px;
        }
      }

      &.show {
        opacity: 1;
        visibility: visible;
      }

      .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;

        gap: 10px;
      }

      button {
        padding: 10px;

        border-radius: 8px;
        border: none;
        outline: none;

        background-color: var(--color-alert-info);
        color: var(--color-text);

        font-size: 1rem;
        font-weight: 500;

        transition: all 0.3s;

        cursor: pointer;

        &.filled {
          background-color: var(--color-primary);

          &:hover {
            background-color: rgb(from var(--color-primary) r g b / 0.7);
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

    .wrapper {
      .main-info {
        .content {
         .info-wrapper {
           flex-direction: column;
         }
        }
      }

      .save-dialog {
        flex-direction: column;

        p {
          svg {
            width: 36px;
            height: 36px;
          }
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