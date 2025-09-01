<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <ShelfSearchBar
      :searchQuery="searchQuery"
      @update:searchQuery="handleQuery"
      @search-complete="handleSearchResults"
      :searchResults="searchResults"
      :page="page"
      :max-page="maxPage"
      :is-loading="isLoading"
    />
    <MemberBookView :results="searchResults" :has-searched="hasSearched" :isLoading="isLoading" />
  </q-page>
</template>

<script setup>
// import axios from 'axios'
import { api } from 'src/boot/axios'
import ShelfSearchBar from 'src/components/ShelfSearchBar.vue'

import MemberBookView from 'src/components/MemberBookView.vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const shelfBooks = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const hasSearched = ref(false)
const isLoading = ref(true)
const memberId = ref(1)
const page = ref(1)

onMounted(getShelf)

async function getShelf() {
  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  router.push(`/member/book?page=${page.value}`)

  try {
    const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/memberbooksnew/member`, {
      params: { page: page.value },
    })
    console.log(response.data)
    shelfBooks.value = response.data || []
    searchResults.value = shelfBooks.value?.content
    console.log(searchResults.value)
    hasSearched.value = true
    // emit('search-complete', searchResults.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error)
    shelfBooks.value = []
    hasSearched.value = true
    // emit('search-complete', [])
  } finally {
    isLoading.value = false
  }

  return { searchResults, hasSearched, isLoading }
}

const handleSearchResults = (results) => {
  isLoading.value = false
  console.log(shelfBooks.value[0])
  searchResults.value = results
  hasSearched.value = true
}

// watch(searchQuery, () => console.log(searchQuery))
watch(page, () => router.push(`/${memberId.value}`, { params: { page: page.value } }))
</script>
