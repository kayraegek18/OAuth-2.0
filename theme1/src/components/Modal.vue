<script setup lang="ts">
import {computed} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps(['visible', 'title', 'onClose', 'onSubmit', 'loading']);
const title = computed(() => { return props.title; });
const visible = computed(() => { return props.visible; });
const loading = computed(() => { return props.loading; });

const close = () => {
  props.onClose();
}

const submit = () => {
  props.onSubmit();
}

</script>

<template>
<div :class="`modal-wrapper ${visible ? 'show' : ''}`">
  <div :class="`modal`">
    <div class="modal-header">
      <p>{{ title }}</p>
    </div>
    <div class="modal-content">
      <slot />
    </div>
    <div class="modal-buttons">
      <button @click="close" v-if="!loading">Close</button>
      <button @click="submit" class="filled" v-if="!loading">Submit</button>
      <button class="filled" v-if="loading">
        <Icon icon="eos-icons:three-dots-loading" />
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s;

  visibility: hidden;
  opacity: 0;

  z-index: 12;

  &.show {
    visibility: visible;
    opacity: 1;
  }

  .modal {
    display: flex;
    flex-direction: column;
    width: 400px;
    background-color: var(--color-background);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-bottom: 1px solid var(--color-primary);
      background-color: var(--color-background);

      p {
        font-size: 1.5rem;
        font-weight: 500;
      }
    }

    .modal-content {
      padding: 20px;
    }

    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      padding: 20px;

      button {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 10px 20px;
        margin-left: 10px;
        border: 1px solid var(--color-primary);
        border-radius: 4px;
        background-color: var(--color-background);
        color: var(--color-text);
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: var(--color-primary);
          color: var(--color-background);
        }

        &.filled {
          background-color: var(--color-primary);
          color: var(--color-background);
        }

        svg {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>