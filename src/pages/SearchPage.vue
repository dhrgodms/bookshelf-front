<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <!-- ✨ 통합 검색 타이틀 섹션 ✨ -->
    <div class="q-mt-xl q-mb-lg text-h4 text-weight-bold text-center shelf-list-title">
      통합 검색
    </div>

    <!-- 검색 입력 필드 -->
    <SearchBar
      :searchQuery="searchQuery"
      @update:searchQuery="(q) => (searchQuery = q)"
      @search-complete="triggerSearch"
    />

    <!-- 검색 결과가 없을 때 -->
    <div v-if="hasSearched && !isLoading && !hasAnyResults" class="no-results q-my-xl">
      <q-icon name="search_off" size="48px" color="grey-6" />
      <div class="text-h6 q-mt-md text-grey-6">검색 결과가 없습니다.</div>
      <div class="text-body2 text-grey-6">다른 키워드로 검색해보세요.</div>
    </div>

    <!-- 검색 결과 섹션 -->
    <div v-if="hasSearched && !isLoading && hasAnyResults" class="search-results-container">
      <!-- 책 검색 결과 섹션 -->

      <div v-if="hasBookResults" class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">책</div>
          <q-btn
            flat
            color="primary"
            label="더보기"
            :to="{ path: '/search/book', query: { q: searchQuery || '' } }"
          />
        </div>

        <div class="books-grid">
          <!-- 여기에 책 검색 결과 컴포넌트 -->
          <ResultList :results="bookResults" :isLoading="isLoadingBooks" />
        </div>
      </div>
      <div v-else class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">책</div>
        </div>
        <p>검색 결과가 없습니다.</p>
      </div>

      <!-- 책장 검색 결과 섹션 -->
      <div v-if="hasShelfResults" class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">책장</div>
          <q-btn flat color="primary" label="더보기" to="/search/shelf" />
        </div>

        <div class="shelves-list">
          <!-- 여기에 책장 검색 결과 컴포넌트 -->
          <SearchedShelfView :results="searchResults" :isLoading="isLoading" />
        </div>
      </div>
      <div v-else class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">책장</div>
          <q-btn flat color="primary" label="더보기" to="/search/shelf" />
        </div>
        <p>검색 결과가 없습니다.</p>
      </div>

      <!-- 내 책장 섹션 -->
      <div v-if="hasMyShelves" class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">내 책장</div>
        </div>

        <div class="my-shelves-list">
          <MemberShelfView :results="searchResultsMyShelves" :isLoading="isLoadingMyShelves" />
        </div>
      </div>
      <div v-else class="result-section q-mb-xl">
        <div class="section-header">
          <div class="text-h5 text-weight-medium">내 책장</div>
        </div>
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>

    <!-- 새 책장 만들기 버튼 -->
    <q-btn to="/shelf/add" color="primary" class="add-shelf-btn q-mb-xl" unelevated rounded>
      <div class="row items-center no-wrap">
        <q-icon name="add_circle" size="24px" class="q-mr-sm" />
        <div class="add-shelf-text">새 책장 만들기</div>
      </div>
    </q-btn>
  </q-page>
</template>

<script setup>
import { debounce } from 'quasar'
import { api } from 'src/boot/axios'
import MemberShelfView from 'src/components/MemberShelfView.vue'
import ResultList from 'src/components/ResultList.vue'
import SearchBar from 'src/components/SearchBar.vue'
import SearchedShelfView from 'src/components/SearchedShelfView.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const searchResults = ref([])
const searchResultsMyShelves = ref([])

const hasSearched = ref(false)
const isLoading = ref(true)
const isLoadingMyShelves = ref(true)
// const memberId = ref(1)
const page = ref(1)
const searchQuery = ref('')

// 검색어 및 상태 관리
const isLoadingBooks = ref(false)

// 검색 결과 데이터 (실제로는 API 호출 결과로 채워질 예정)
const bookResults = ref([])

// 검색 결과 유무 계산
const hasBookResults = computed(() => bookResults.value && bookResults.value?.length > 0)
const hasShelfResults = computed(() => searchResults.value && searchResults.value?.length > 0)
const hasMyShelves = computed(
  () => searchResultsMyShelves.value && searchResultsMyShelves.value?.length > 0,
)
const hasAnyResults = computed(
  () => hasBookResults.value || hasShelfResults.value || hasMyShelves.value,
)

// URL에서 검색어와 페이지 정보 가져오기
onMounted(() => {
  const queryPage = parseInt(route.query.page) || 1
  const queryKeyword = route.query.q || ''

  page.value = queryPage
  searchQuery.value = queryKeyword

  // 검색어가 있으면 바로 검색 실행
  if (queryKeyword && queryKeyword.trim()) {
    searchQuery.value = queryKeyword
    debouncedSearch(queryKeyword)
  }
})

// URL 파라미터 업데이트
function updateUrlParams() {
  const query = {}
  if (searchQuery.value) {
    query.q = searchQuery.value
  }
  router.push({ path: '/search', query })
}

// 페이지 변경 시 URL 업데이트
watch(page, updateUrlParams)
const debouncedSearch = debounce(async (keyword) => {
  if (!keyword || !keyword.trim()) return

  hasSearched.value = true
  isLoading.value = true
  isLoadingBooks.value = true
  isLoadingMyShelves.value = true

  try {
    const [bookRes] = await Promise.all([
      api.get('/api/v1/aladin/search/limit', {
        params: { query: keyword, page: page.value, limit: 4 },
      }),
      api.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/shelves/search`, {
        params: { q: keyword },
      }),
      api.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/bookshelves/member`, {
        params: { page: page.value },
      }),
    ])

    bookResults.value = bookRes.data
    // searchResults.value = shelfRes.data.content
    // searchResultsMyShelves.value = myShelvesRes.data.content
  } catch (err) {
    console.error('검색 실패:', err)
  } finally {
    isLoading.value = false
    isLoadingBooks.value = false
    isLoadingMyShelves.value = false
  }
}, 500)

function triggerSearch() {
  debouncedSearch(searchQuery.value)
}
</script>

<style lang="scss" scoped>
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
  background-color: #686868; /* 연한 회색으로 은은하게 */
  margin: 30px 0; /* 위아래로 여백을 줘서 시각적으로 구분되게 */
  border-radius: 1px; /* 살짝 둥글게 해서 부드러운 느낌 주기 */
}

/* ✨ 새로 추가된 은은한 박스 스타일 ✨ */
.my-shelves-box {
  width: 100%; /* 부모 너비에 맞추고 */
  max-width: 900px; /* 너무 넓어지지 않게 최대 너비 설정 (4개 카드에 적합) */
  background-color: #e6e6e6; /* 아주 연한 배경색 */
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
/* 전체 페이지 스타일 */
.q-page {
  padding-bottom: 60px;
}

/* 타이틀 스타일 */
.search-title {
  color: #427957;
  margin-top: 40px;
}

/* 검색 컨테이너 스타일 */
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* 검색 입력 필드 스타일 */
.search-input {
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.search-input :deep(.q-field__control) {
  height: 54px;
}

/* 검색 결과 컨테이너 스타일 */
.search-results-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* 결과 섹션 스타일 */
.result-section {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

/* 섹션 헤더 스타일 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #c6c6c6;
}

/* 새 책장 만들기 버튼 스타일 */
.add-shelf-btn {
  background-color: #427957;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
}

.add-shelf-text {
  font-weight: 500;
  font-size: 16px;
}

/* 검색 결과 없음 스타일 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #9e9e9e;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .shelves-list,
  .my-shelves-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .result-section {
    padding: 16px;
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
