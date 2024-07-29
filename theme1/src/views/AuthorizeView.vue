<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {onBeforeMount, ref} from "vue";
import Blur from "@/components/Blur.vue";
import moment from "moment";

const application = ref({});
const user = ref({});

const responseType = ref();
const redirectUri = ref();
const clientId = ref();
const scope = ref();
const scopes = ref();

const validScopes = ["identify", "email", "applications"];

const loading = ref(true);
const buttonLoading = ref(false);
const hasError = ref(false);
const error = ref("Invalid scope");

const colors = {
  green: "#00C896",
  red: "#CC7766",
}

onBeforeMount(async () => {
  window.document.title = "Mineala - Authorize Application";


  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("response_type") || !searchParams.has("redirect_uri") || !searchParams.has("client_id") || !searchParams.has("scope")) {
    hasError.value = true;
    error.value = "Invalid parameters";
    loading.value = false;
    return;
  }
  responseType.value = searchParams.get("response_type");
  redirectUri.value = searchParams.get("redirect_uri");
  clientId.value = searchParams.get("client_id");
  scope.value = searchParams.get("scope");

  application.value = await getApplicationData();
  if (!application.value) {
    hasError.value = true;
    error.value = "Invalid application";
    loading.value = false;
    return;
  }

  user.value = await getUserData();
  if (!user.value) {
    hasError.value = true;
    error.value = "Invalid user";
    loading.value = false;
    return;
  }

  if (!application.value.redirect_urls || application.value.redirect_urls.length <= 0) {
    hasError.value = true;
    error.value = "Invalid redirect uri";
    loading.value = false;
    return;
  }
  const redirects = application.value.redirect_urls.map((url: object) => {
    return url.redirect_uri;
  });
  if (!redirects.includes(redirectUri.value)) {
    hasError.value = true;
    error.value = "Invalid redirect uri";
    loading.value = false;
    return;
  }

  const scopeList = scope.value.split(",");
  if (scopeList.some((sc: string) => !validScopes.includes(sc))) {
    hasError.value = true;
    error.value = "Invalid scope";
    loading.value = false;
    return;
  }
  scopes.value = scopeList.map((sc: string) => {
    switch (sc) {
      case "identify":
        return "View your profile information";
      case "email":
        return "View your email address";
      case "applications":
        return "View your applications";
      default:
        return "Unknown scope";
    }
  });

  setTimeout(() => {
    loading.value = false;
  }, 1000);

  console.log(responseType.value, redirectUri.value, clientId.value, scope.value);
});

async function getUserData() {
  const response = await fetch(`http://localhost:3000/user/523584844853149696`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Token": "171b2bf96f561580fc3bd8972854a0440d1f66c56670645a935062e0d4965310"
    }
  });
  if (response.status != 200) {
    hasError.value = true;
    error.value = "Invalid user data";
    return;
  }
  const data = await response.json();
  if (data.error) {
    hasError.value = true;
    error.value = data.error;
    loading.value = false;
    return;
  }
  return data;
}

async function getApplicationData() {
  const response = await fetch(`http://localhost:3000/application/${clientId.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  if (response.status != 200) {
    hasError.value = true;
    error.value = "Invalid application data";
    return;
  }
  const data = await response.json();
  if (data.error) {
    hasError.value = true;
    error.value = data.error;
    loading.value = false;
    return;
  }
  return data;
}

function cancel() {
  window.location.href = "/";
}

async function authorize() {
  buttonLoading.value = true;
  const response = await fetch("http://localhost:3000/oauth2/authorize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: "523584844853149696",
      client_id: clientId.value,
      scope: scope.value,
      redirect_uri: redirectUri.value,
    }),
  });
  if (response.status != 200) {
    hasError.value = true;
    error.value = "Server Error! Please try again later.";
    buttonLoading.value = false;
    return;
  }
  const data = await response.json();
  if (data.error) {
    hasError.value = true;
    error.value = data.error;
    buttonLoading.value = false;
    return;
  }
  window.location.href = `${redirectUri.value}?code=${data.code}`;
}
</script>

<template>
  <div class="container">
    <Blur top="0" left="0" :color="`${hasError ? colors.red : colors.green}`" size="500" stroke="80" id="blur" style="" />
    <div class="card" v-if="!hasError && !loading">
      <div class="card-body">
        <div class="user-info">
          <img :src="`${application?.avatar}`" alt="Application Image">
          <Icon icon="mdi:dots-horizontal" />
          <img :src="`${user?.avatar}`" alt="User Image">
        </div>
        <div class="app-info">
          <p>An community application</p>
          <h1>{{application?.name}}</h1>
          <p>wants to access your Mineala account</p>
          <p class="small">Signed in as <strong>{{user?.name}}</strong></p>
        </div>
        <hr>
        <div class="app-auth">
          <ul class="scopes">
            <li class="access" v-for="scope in scopes">
              <Icon icon="mdi:check-circle" />
              {{scope}}
            </li>
            <!-- <li>
              <Icon icon="mdi:cross-circle" />
              Bake cookies
            </li> -->
          </ul>
        </div>
        <hr>
        <div class="main-info">
          <ul class="info">
            <li>
              <Icon icon="mdi:link-variant" />
              You will be redirected outside of Mineala to:
              {{redirectUri}}
            </li>
            <li>
              <Icon icon="mdi:lock" />
              <p>
                The developer of this application <a href="https://mineala.com/privacy-policy" target="_blank">privacy policy</a> and <a href="https://mineala.com/terms-of-service" target="_blank">terms of service</a> apply to this application
              </p>
            </li>
            <li>
              <Icon icon="mdi:clock" />
              Active since {{moment(application.createdat).format("MMM Do YYYY")}}
            </li>
            <li>
              <Icon icon="mdi:shield-lock" />
              This application cannot access your private data
            </li>
          </ul>
        </div>
      </div>
      <div class="card-footer">
        <button @click="cancel">Cancel</button>
        <button class="filled" @click="authorize" v-if="!buttonLoading">Authorize</button>
        <button disabled v-if="buttonLoading"><Icon icon="eos-icons:three-dots-loading" style="font-size: 16px" /></button>
      </div>
    </div>
    <div class="card" v-if="hasError && !loading">
      <div class="card-body">
        <Icon icon="mdi:cross-circle-outline" style="font-size: 36px; margin-bottom: 10px" />
        <h2>{{error}}</h2>
      </div>
    </div>
    <div class="card" v-if="loading" style="min-height: 300px">
      <div class="card-body">
        <Icon icon="eos-icons:three-dots-loading" style="font-size: 64px" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100dvh;

  color: var(--color-text);
  background-color: var(--color-background);

  .card {
    width: 450px;
    border-radius: 16px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    background-color: var(--color-surface-2);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-top: 50px;
    margin-bottom: 50px;

    .card-body {
      width: 100%;
      height: 100%;
      padding: 20px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 60%;

        margin-top: 40px;
        margin-bottom: 40px;

        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }

        svg {
          font-size: 36px;
        }
      }

      .app-info {
        text-align: center;
        margin-bottom: 20px;

        p {
          margin: 0;
        }

        h1 {
          margin: 0;
        }

        .small {
          font-size: 12px;

          strong {
            color: var(--color-primary);
          }
        }
      }

      hr {
        width: 100%;
        border: 0;
        border-top: 1px solid var(--color-surface);
      }

      .app-auth {
        width: 100%;
        padding: 20px 5px;

        .scopes {
          list-style: none;
          padding: 0;

          li {
            display: flex;
            align-items: center;

            svg {
              font-size: 24px;
              margin-right: 10px;
            }

            &:not(:last-child) {
              margin-bottom: 10px;
            }

            &.access {
              color: var(--color-success);
            }

            color: var(--color-danger);
          }
        }
      }

      .main-info {
        width: 100%;
        margin-top: 20px;

        .info {
          list-style: none;
          padding: 0;

          li {
            display: flex;
            align-items: center;

            font-size: 12px;

            svg {
              font-size: 20px;
              min-width: 24px;
              margin-right: 10px;
            }

            &:not(:last-child) {
              margin-bottom: 10px;
            }

            a {
              color: var(--color-primary);
            }
          }
        }
      }
    }

    .card-footer {
      width: 100%;
      padding: 20px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px 20px;
        border: 0;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;

        min-width: 120px;

        transition: all 0.3s;

        &:first-child {
          background-color: var(--color-surface);
          color: var(--color-text);
        }

        &:last-child {
          background-color: var(--color-primary);
          color: var(--color-surface);
        }

        &.filled {
          background-color: var(--color-primary);
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
}
</style>