<script setup>
import {computed} from "vue";

const props = defineProps(["top", "left", "right", "bottom", "color", "size", "stroke"]);
const style = computed(() => ({
  top: `${props.top}px`,
  left: `${props.left}px`,
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
  size: `${props.size}px` || "1000px",
  stroke: `${props.stroke}px` || "50px",
  backgroundColor: props.color,
}));
</script>

<template>
  <div class="blur" :style="`top: ${style.top}; left: ${style.left}; right: ${style.right}; bottom: ${style.bottom}; box-shadow: 0 0 ${style.size} ${style.stroke} ${style.backgroundColor};`">

  </div>
</template>

<style scoped>
.blur {
  position: absolute;
  transition: 0.3s;
  z-index: 1;
}
</style>