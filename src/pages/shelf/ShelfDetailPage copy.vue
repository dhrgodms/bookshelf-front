<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <ShelfDetail :results="searchResults" :has-searched="hasSearched" :is-loading="isLoading" />
  </q-page>
</template>

<script setup>
// import axios from 'axios'
import { api } from 'src/boot/axios'

import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ShelfDetail from 'src/components/ShelfDetail.vue'
const router = useRouter()
const shelfShelves = ref([])
const searchResults = ref([])
const hasSearched = ref(false)
const isLoading = ref(true)
const memberId = ref(1)
const page = ref(1)

onMounted(getShelf)

async function getShelf() {
  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  router.push(`/shelf/${1}`)

  try {
    const access = localStorage.getItem('access')
    const response = await api.get(`${process.env.SPRING_SERVER}/api/v1/shelves/${1}`, {
      params: { page: page.value },
      headers: { access: access },
    })

    searchResults.value = response.data?.books || []
    console.log(searchResults.value)
    hasSearched.value = true
    // emit('search-complete', searchResults.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error)
    shelfShelves.value = []
    hasSearched.value = true
    // emit('search-complete', [])
  } finally {
    isLoading.value = false
  }

  return { searchResults, hasSearched, isLoading }
}

// watch(searchQuery, () => console.log(searchQuery))
watch(page, () => router.push(`/${memberId.value}`, { params: { page: page.value } }))
</script>
