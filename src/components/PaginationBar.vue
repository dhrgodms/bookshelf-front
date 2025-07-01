<template>
  <div class="q-pa-lg" v-if="props.hasSearched">
    <div class="q-gutter-md">
      <q-pagination
        v-model="page"
        @update:model-value="emit('update:page', $event)"
        :max="props.maxPage"
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

const props = defineProps({
  maxPage: {
    type: Number,
    default: () => 5,
  },
  hasSearched: {
    type: Boolean,
    default: () => false,
  },
})

watch(page, (newPage) => {
  page.value = newPage
  emit('update:page', newPage)
})
</script>
