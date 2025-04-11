<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <SearchBar
      :searchQuery="searchQuery"
      @update:searchQuery="handleQuery"
      @search-complete="handleSearchResults"
      :searchResults="searchResults"
      :page="page"
      :max-page="maxPage"
    />
    <ResultList :results="searchResults" :has-searched="hasSearched" :is-loading="isLoading" />
    <PaginationBar
      :page="page"
      @update:page="handlePage"
      :max-page="maxPage"
      :has-searched="hasSearched"
    />
  </q-page>
</template>

<script setup>
import PaginationBar from 'src/components/PaginationBar.vue'
import ResultList from 'src/components/ResultList.vue'
import SearchBar from 'src/components/SearchBar.vue'

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const searchResults = ref([])
const searchQuery = ref('')
const hasSearched = ref(false)
const isLoading = ref(true)
const page = ref(1)
const maxPage = ref(5)

const handleSearchResults = (results) => {
  isLoading.value = false
  searchResults.value = results
  hasSearched.value = true
}

const handleQuery = (query) => {
  searchQuery.value = query
}

const handlePage = (newPage) => {
  page.value = newPage
}
// watch(searchQuery, () => console.log(searchQuery))
watch(page, () => router.push({ query: { query: searchQuery.value, page: page.value } }))
</script>
