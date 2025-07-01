<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <!-- ✨ 책장 검색 타이틀 섹션 ✨ -->
    <div class="q-mt-xl q-mb-lg text-h4 text-weight-bold text-center shelf-list-title">책 검색</div>
    <div class="search-container q-pa-md">
      <div class="row items-center q-gutter-md">
        <SearchBar
          v-model="isbnScanned"
          :searchQuery="searchQuery || isbnScanned"
          @update:searchQuery="handleQuery"
          @search-complete="handleSearchResults"
          :searchResults="searchResults"
          :page="page"
          :max-page="maxPage"
          :is-loading="isLoading"
          class="col-grow search-input"
        />
      </div>
    </div>
    <BarcodeScanner v-model="isbnScanned" />
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
import { useRoute, useRouter } from 'vue-router'
import BarcodeScanner from './BarcodeScanner.vue'
const router = useRouter()
const route = useRoute()
const searchResults = ref([])
const searchQuery = ref(route.query.q || '')
console.log(route.query)
const hasSearched = ref(false)
const isLoading = ref(false)
const page = ref(1)
const maxPage = ref(5)
const isbnScanned = ref('')

const handleSearchResults = (results) => {
  isLoading.value = false
  searchResults.value = results
  hasSearched.value = true
  // console.log(searchResults.value)
}

const handleQuery = (query) => {
  searchQuery.value = query
}

const handlePage = (newPage) => {
  page.value = newPage
}

// watch(searchQuery, () => console.log(searchQuery))

watch(isbnScanned, async (newIsbn) => {
  console.log(newIsbn)
})
watch(page, () => router.push({ query: { query: searchQuery.value, page: page.value } }))
</script>

<style lang="scss" scoped>
/* 기존 스타일은 유지하고 바코드 버튼 스타일만 추가 */
.barcode-btn {
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(66, 121, 87, 0.2);
  transition: all 0.3s ease;
  height: 54px;
  white-space: nowrap;
  background-color: #427957;
  margin-bottom: 3em;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(66, 121, 87, 0.3);
  }
}

@media (max-width: 768px) {
  .barcode-btn {
    padding: 8px 16px;
    height: 48px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .barcode-btn {
    padding: 6px 12px;
    height: 42px;
    font-size: 13px;
  }
}

.shelf-list-title {
  color: #424242;
  letter-spacing: -0.5px;
  padding-bottom: 5px;
  border-bottom: 2px solid #897e1e;
  display: inline-block;
}

.search-container {
  width: 90%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.q-field__native) {
  padding: 1em;
}

.add-shelf-btn {
  padding: 10px 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(137, 126, 30, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(137, 126, 30, 0.3);
  }

  .add-shelf-text {
    font-size: 16px;
  }
}

/* 검색 결과가 없을 때 표시할 스타일 */
.no-results {
  text-align: center;
  padding: 40px 0;
  color: #757575;
  font-size: 18px;
}

.separator-line {
  width: 100%; /* 가로 전체를 차지하도록 */
  height: 2px; /* 얇고 부드러운 선 */
  background-color: #e0e0e0; /* 연한 회색으로 은은하게 */
  margin: 30px 0; /* 위아래로 여백을 줘서 시각적으로 구분되게 */
  border-radius: 1px; /* 살짝 둥글게 해서 부드러운 느낌 주기 */
}

/* ✨ 새로 추가된 은은한 박스 스타일 ✨ */
.my-shelves-box {
  width: 100%; /* 부모 너비에 맞추고 */
  max-width: 900px; /* 너무 넓어지지 않게 최대 너비 설정 (4개 카드에 적합) */
  background-color: #fcfcfc; /* 아주 연한 배경색 */
  border: 1px solid #f0f0f0; /* 거의 보이지 않는 연한 테두리 */
  border-radius: 12px; /* 부드러운 모서리 */
  padding: 20px; /* 내부 여백 */
  margin-top: 20px; /* 위쪽 여백 */
  margin-bottom: 20px; /* 아래쪽 여백 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03); /* 아주 은은한 그림자 */
  display: flex; /* 내부 콘텐츠를 유연하게 배치하기 위해 flex 사용 */
  justify-content: center; /* 내부 콘텐츠를 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  transition: all 0.3s ease; /* 크기 변화를 부드럽게 */
}
/* 미디어 쿼리로 반응형 설정 추가 */
@media (max-width: 1200px) {
  .my-shelves-box {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .my-shelves-box {
    max-width: 95%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .my-shelves-box {
    max-width: 98%;
    padding: 10px;
    margin: 15px auto;
  }
}
</style>
