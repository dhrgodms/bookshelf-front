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
    <ShelfView :results="searchResults" :has-searched="hasSearched" :isLoading="isLoading" />
    <PaginationBar :page="page" @update:page="handlePage" />
  </q-page>
</template>

<script setup>
// import axios from 'axios'
import { api } from 'src/boot/axios'
import PaginationBar from 'src/components/PaginationBar.vue'
import ShelfSearchBar from 'src/components/ShelfSearchBar.vue'
import ShelfView from 'src/components/ShelfView.vue'

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
  router.push(`/member/shelf?page=${page.value}`)

  try {
    const access = localStorage.getItem('access')
    const response = await api.get(`${process.env.SPRING_SERVER}/api/member/shelf`, {
      params: { page: page.value },
      headers: { access: access },
    })
    shelfBooks.value = response.data || []
    searchResults.value = shelfBooks.value
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

const handlePage = (newPage) => {
  page.value = newPage
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
