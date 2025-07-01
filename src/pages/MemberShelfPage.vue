<template>
  <q-page class="flex column" style="align-items: center; align-content: center">
    <!-- ✨ 나의 책장들 타이틀 섹션 ✨ -->
    <div class="q-mt-xl q-mb-lg text-h4 text-weight-bold text-center shelf-list-title">
      나의 책장들
    </div>
    <q-btn to="/shelf/add" color="primary" class="add-shelf-btn q-mb-lg" unelevated rounded>
      <div class="row items-center no-wrap">
        <q-icon name="add_circle" size="24px" class="q-mr-sm" />
        <div class="add-shelf-text">새 책장 만들기</div>
      </div>
    </q-btn>
    <MemberShelfView :results="searchResults" :has-searched="hasSearched" :isLoading="isLoading" />
    <PaginationBar :page="page" @update:page="handlePage" />
  </q-page>
</template>

<script setup>
// import axios from 'axios'
import { api } from 'src/boot/axios'
import PaginationBar from 'src/components/PaginationBar.vue'

import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MemberShelfView from 'src/components/MemberShelfView.vue'
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
  router.push(`/member/shelf?page=${page.value}`)

  try {
    const access = localStorage.getItem('access')
    const response = await api.post(
      `${process.env.SPRING_SERVER}/api/v1/bookshelves/member`,
      { username: 'userA' },
      {
        params: { page: page.value },
        headers: { access: access },
      },
    )
    console.log(response.data)
    searchResults.value = response.data || []
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

const handlePage = (newPage) => {
  page.value = newPage
}

// watch(searchQuery, () => console.log(searchQuery))
watch(page, () => router.push(`/${memberId.value}`, { params: { page: page.value } }))
</script>

<style lang="scss" scoped>
.shelf-list-title {
  color: #424242; /* 깔끔한 다크 그레이로 가독성 UP! */
  letter-spacing: -0.5px; /* 글자 간격 살짝 조절해서 더 예쁘게 */
  padding-bottom: 5px; /* 아래쪽 여백 살짝 추가 */
  border-bottom: 2px solid #897e1e; /* 폴더 색깔이랑 맞춰서 밑줄 쫙! */
  display: inline-block; /* 밑줄이 글자 너비만큼만 가도록 */
}

.add-shelf-btn {
  padding: 10px 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(137, 126, 30, 0.2); /* 책장 색상과 맞춘 그림자 */
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(137, 126, 30, 0.3);
  }

  .add-shelf-text {
    font-size: 16px;
  }
}
</style>
