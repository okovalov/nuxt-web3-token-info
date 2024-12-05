<template>
  <div class="items-center relative">
    <div
      class="text-gray-500 text-xs absolute -right-8 -top-6 align-middle min-w-28"
      v-if="showNextModelLabel"
    >
      Change to {{ nextMode }}
    </div>
    <button
      @click="toggleMode"
      @mouseenter="showNextModelLabel = true"
      @mouseleave="showNextModelLabel = false"
      class="hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 text-gray-500 text-4xl md:text-base"
    >
      {{ nextModeIcon }}
    </button>
  </div>
</template>

<script setup>
const showNextModelLabel = ref(false);
const colorMode = useColorMode();

const modes = ["system", "light", "dark"];

const nextModeIcons = {
  system: "🌓",
  light: "🌕",
  dark: "🌑",
};

const nextMode = computed(() => {
  const currentModeIndex = modes.indexOf(colorMode.preference);
  let nextModeIndex = null;

  if (currentModeIndex + 1 === modes.length) {
    nextModeIndex = 0;
  } else {
    nextModeIndex = currentModeIndex + 1;
  }

  return modes[nextModeIndex];
});

const nextModeIcon = computed(() => nextModeIcons[nextMode.value]);

const toggleMode = () => (colorMode.preference = nextMode.value);
</script>
