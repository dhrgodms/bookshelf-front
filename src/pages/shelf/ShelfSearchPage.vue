<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <!-- ✨ 책장 검색 타이틀 섹션 ✨ -->
    <div class="q-mt-xl q-mb-lg text-h4 text-weight-bold text-center shelf-list-title">
      책장 검색
    </div>

    <!-- 검색 입력 필드 -->
    <div class="search-container q-mb-lg">
      <q-input
        v-model="searchKeyword"
        outlined
        rounded
        placeholder="책장 이름, 설명 등으로 검색해보세요"
        class="search-input"
        bg-color="white"
      >
        <template v-slot:append>
          <q-btn round flat icon="search" @click="searchShelves" />
        </template>
      </q-input>
    </div>
    <!-- 검색 결과 표시 -->
    <SearchedShelfView
      :results="searchResults"
      :has-searched="hasSearched"
      :isLoading="isLoading"
    />

    <!-- 새 책장 만들기 버튼 -->
    <q-btn to="/shelf/add" color="primary" class="add-shelf-btn q-mb-lg" unelevated rounded>
      <div class="row items-center no-wrap">
        <q-icon name="add_circle" size="24px" class="q-mr-sm" />
        <div class="add-shelf-text">새 책장 만들기</div>
      </div>
    </q-btn>

    <div class="separator-line"></div>

    <div class="my-shelves-box">
      <!-- 검색 결과 표시 -->
      <MemberShelfView
        :results="searchResultsMyShelves"
        :has-searched="hasSearchedMyShelves"
        :isLoading="isLoadingMyShelves"
      />
    </div>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import MemberShelfView from 'src/components/MemberShelfView.vue'
import SearchedShelfView from 'src/components/SearchedShelfView.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const shelfShelves = ref([])
const searchResults = ref([])
const searchResultsMyShelves = ref([])

const hasSearched = ref(false)
const hasSearchedMyShelves = ref(false)
const isLoading = ref(true)
const isLoadingMyShelves = ref(true)
// const memberId = ref(1)
const page = ref(1)
const searchKeyword = ref('')

// URL에서 검색어와 페이지 정보 가져오기
onMounted(() => {
  const queryPage = parseInt(route.query.page) || 1
  const queryKeyword = route.query.q || ''

  page.value = queryPage
  searchKeyword.value = queryKeyword

  // 검색어가 있으면 바로 검색 실행
  if (searchKeyword.value) {
    searchShelves()
  } else {
    // 검색어가 없으면 기본 책장 목록 가져오기
  }
  getShelf()
})

// 기본 책장 목록 가져오기
async function getShelf() {
  updateUrlParams()
  isLoadingMyShelves.value = true

  try {
    const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/bookshelves/member`, {
      params: { page: page.value },
    })
    shelfShelves.value = response.data || []
    searchResultsMyShelves.value = shelfShelves.value.content
    hasSearchedMyShelves.value = true
  } catch (error) {
    console.error('책장 목록 가져오기 중 오류 발생:', error)
    shelfShelves.value = []
    searchResultsMyShelves.value = []
    hasSearchedMyShelves.value = true
  } finally {
    isLoadingMyShelves.value = false
  }
}

// 키워드로 책장 검색하기
async function searchShelves() {
  updateUrlParams()
  isLoading.value = true

  try {
    const access = localStorage.getItem('access')
    const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/shelves/search`, {
      params: {
        q: searchKeyword.value,
        // page: page.value,
      },
      headers: { access: access },
    })
    searchResults.value = response.data?.content || []
    hasSearched.value = true
  } catch (error) {
    console.error('책장 검색 중 오류 발생:', error)
    searchResults.value = []
    hasSearched.value = true
  } finally {
    isLoading.value = false
  }
}

// URL 파라미터 업데이트
function updateUrlParams() {
  const query = {}
  if (searchKeyword.value) {
    query.q = searchKeyword.value
  }
  router.push({ path: '/search/shelf', query })
}

// 페이지 변경 시 URL 업데이트
watch(page, updateUrlParams)
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
