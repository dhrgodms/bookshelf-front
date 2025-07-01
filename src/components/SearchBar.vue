<template>
  <!-- 검색 입력 필드 -->
  <div class="search-container q-mb-lg">
    <q-input
      v-model="searchQuery"
      outlined
      rounded
      placeholder="책 제목, 저자, 키워드로 검색해보세요"
      class="search-input"
      bg-color="white"
      @keyup.enter="search"
    >
      <template v-slot:append>
        <q-btn round flat icon="search" @click="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  page: Number,
  isLoading: Boolean,
})

const emit = defineEmits(['search-complete'])

const searchResults = ref([])
const hasSearched = ref(false)
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
  if (!searchQuery.value?.trim()) return

  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  router.push(`/search/book?query=${encodeURIComponent(searchQuery.value)}&page=${page.value}`)

  try {
    const access = localStorage.getItem('access')
    const response = await api.get('/api/v1/aladin/search', {
      params: { query: searchQuery.value, page: page.value },
      headers: { access: access },
    })
    searchResults.value = response.data || []
    hasSearched.value = true
    emit('search-complete', searchResults.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error)
    searchResults.value = []
    hasSearched.value = true
    emit('search-complete', [])
  }
  return { searchResults, hasSearched, searchQuery, props, search }
}

onMounted(() => {
  if (route.query.query) {
    search()
  }
})
</script>

<style>
/* 검색창 컨테이너 스타일 */
.search-container {
  width: 100%;
  max-width: 600px; /* 검색창 최대 너비 제한 */
  margin: 0 auto; /* 가운데 정렬 */
}

/* 검색창 래퍼 스타일 */
.search-wrapper {
  background-color: white;
  border-radius: 24px; /* 둥근 모서리 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); /* 부드러운 그림자 */
  padding: 4px 8px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.search-wrapper:hover,
.search-wrapper:focus-within {
  box-shadow: 0 4px 15px rgba(66, 121, 87, 0.15); /* 하퍼의 메인 컬러로 그림자 */
  border-color: rgba(66, 121, 87, 0.3); /* 하퍼의 메인 컬러로 테두리 */
}

/* 검색 입력창 스타일 */
.custom-search-input {
  font-size: 16px;
}

.custom-search-input .q-field__control {
  height: 48px; /* 적당한 높이 */
}

/* 검색 아이콘 스타일 */
.search-icon {
  color: #427957; /* 하퍼의 메인 컬러 */
  font-size: 20px;
  padding-left: 8px;
}

/* 클리어 아이콘 스타일 */
.clear-icon {
  color: #9e9e9e;
  font-size: 18px;
  padding-right: 8px;
}

.clear-icon:hover {
  color: #427957; /* 하퍼의 메인 컬러 */
}

/* 입력창 텍스트 스타일 */
.custom-search-input input {
  color: #36454f; /* 부드러운 다크 컬러 */
  font-weight: 400;
}

/* 플레이스홀더 스타일 */
.custom-search-input input::placeholder {
  color: #9e9e9e;
  font-weight: 300;
}
.search-input {
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.search-container {
  width: 90%;
  max-width: 600px;
  margin: 2em;
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
</style>
