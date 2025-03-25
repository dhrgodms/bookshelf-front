<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination
        v-model="page"
        @update:model-value="emit('update:page', $event)"
        max="10"
        direction-links
        flat
        color="grey"
        active-color="primary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['update:page'])
const page = ref(1)
watch(page, (newPage) => {
  page.value = newPage
  emit('update:page', newPage)
})
</script>
