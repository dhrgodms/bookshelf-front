<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <ShelfView :results="shelfBooks" :has-searched="hasSearched" :isLoading="isLoading" />
    <PaginationBar :page="page" @update:page="handlePage" />
  </q-page>
</template>

<script setup>
import axios from 'axios'
import PaginationBar from 'src/components/PaginationBar.vue'
import ShelfView from 'src/components/ShelfView.vue'

import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const shelfBooks = ref([])
const hasSearched = ref(false)
const isLoading = ref(true)
const memberId = ref(1)
const page = ref(1)

onMounted(getShelf)

async function getShelf() {
  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  router.push(`/member/shelf?page=${page.value}`)

  try {
    const response = await axios.get(`${process.env.SPRING_SERVER}/api/member/shelf`, {
      params: { page: page.value },
    })
    console.log(response)
    shelfBooks.value = response.data || []
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

  return { searchResults: shelfBooks, hasSearched, isLoading }
}

const handlePage = (newPage) => {
  page.value = newPage
}
// watch(searchQuery, () => console.log(searchQuery))
watch(page, () => router.push(`/${memberId.value}`, { params: { page: page.value } }))
</script>
