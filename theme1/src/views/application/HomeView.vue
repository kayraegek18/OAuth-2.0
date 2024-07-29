<script setup lang="ts">
import {Icon} from "@iconify/vue";
import Sidebar from "@/components/application/Sidebar.vue";
import Navbar from "@/components/application/Navbar.vue";

</script>

<template>
  <div class="container">
    <input type="checkbox" id="miss-area" hidden>
    <Sidebar />
    <label class="miss-area" for="miss-area"></label>
    <div class="navbar-wrapper">
      <Navbar />
      <div class="wrapper">
        <div class="cards">
          <div class="card primary">
            <div class="card-header">
              <h1>Registered Applications</h1>
            </div>
            <div class="card-body">
              <h1>0</h1>
            </div>
          </div>
          <div class="card danger">
            <div class="card-header">
              <h1>Registered Applications</h1>
            </div>
            <div class="card-body">
              <h1>0</h1>
            </div>
          </div>
          <div class="card warning">
            <div class="card-header">
              <h1>Registered Applications</h1>
            </div>
            <div class="card-body">
              <h1>0</h1>
            </div>
          </div>
        </div>

        <div class="alert info" style="margin-top: 40px;">
          <Icon icon="mdi:information" width="24" height="24" />
          <p>There are no applications registered yet.</p>
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

    .cards {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: auto;
      grid-gap: 1rem;

      gap: 20px;

      .card {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;

        width: 100%;
        height: 120px;

        padding: 20px;

        background-color: var(--color-surface);
        border-radius: 8px;

        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);

          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        }

        .card-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;

          width: 100%;

          h1 {
            font-size: 1.25rem;
            font-weight: 500;
          }
        }

        .card-body {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: start;

          width: 100%;

          p {
            font-size: 1rem;
            font-weight: 400;
          }
        }

        &.primary {
          background-color: rgb(from var(--color-primary) r g b / 0.7);
          color: var(--color-text);
        }

        &.danger {
          background-color: rgb(from var(--color-danger) r g b / 0.7);
          color: var(--color-text);
        }

        &.warning {
          background-color: rgb(from var(--color-warning) r g b / 0.7);
          color: var(--color-text);
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