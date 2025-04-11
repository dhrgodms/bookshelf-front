<template>
  <div class="q-py-md" style="width: 90%">
    <div class="q-gutter-y-md column" style="margin-top: 0">
      <q-toolbar class="text-white rounded-borders search_bar">
        <q-space />

        <q-input
          dark
          dense
          standout
          v-model="searchQuery"
          @input="updateSearchQuery(searchQuery)"
          input-class="text-right"
          class="q-ml-md"
          @keyup.enter="search"
          style="width: 100%"
        >
          <template v-slot:append>
            <q-icon v-if="searchQuery === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
          </template>
        </q-input>
      </q-toolbar>
    </div>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  page: Number,
})

const emit = defineEmits(['search-complete'])

const searchResults = ref([])
const hasSearched = ref(false)
const isLoading = ref(true)
const route = useRoute()
const router = useRouter()
const searchQuery = ref(route.query.query)
const page = ref(props.page)

watch(
  () => props.page,
  (newPage) => {
    console.log(newPage, '로 이동 및 검색')
    page.value = newPage
    search()
  },
)

watch(
  () => route.query.query,
  () => {
    search()
  },
)

const search = async () => {
  if (!searchQuery.value.trim()) return

  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  router.push(`/book/search?query=${encodeURIComponent(searchQuery.value)}&page=${page.value}`)

  try {
    const response = await api.get('/api/aladin/search', {
      params: { query: searchQuery.value, page: page.value },
    })
    searchResults.value = response.data || []
    hasSearched.value = true
    emit('search-complete', searchResults.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error)
    searchResults.value = []
    hasSearched.value = true
    emit('search-complete', [])
  } finally {
    isLoading.value = false
  }
  return { searchResults, hasSearched, searchQuery, props, search, isLoading }
}

onMounted(() => {
  if (route.query.query) {
    search()
  }
})
</script>
<style>
.search_bar {
  background-color: #a1a196;
}
</style>
