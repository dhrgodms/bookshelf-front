<template>
  <q-page class="flex column items-center q-pa-md">
    <!-- 책장 상세 정보 헤더 -->
    <q-card class="shelf-header q-pa-md q-my-md" flat bordered>
      <div class="text-h4 text-weight-bold q-mb-sm">
        {{ shelfInfo?.bookshelf?.bookshelfName || '책장 이름' }}
      </div>
      <div class="text-subtitle1 text-grey-8 q-mb-md">
        {{ shelfInfo?.bookshelf?.notes || '책장 설명' }}
      </div>
      <div class="row items-center q-gutter-sm">
        <q-badge
          :color="shelfInfo.isPublic ? 'positive' : 'negative'"
          outline
          class="q-pa-sm rounded-borders"
        >
          <q-icon :name="shelfInfo.isPublic ? 'visibility' : 'visibility_off'" class="q-mr-xs" />
          {{ shelfInfo.isPublic ? '공개' : '비공개' }}
        </q-badge>
        <q-badge color="secondary" outline class="q-pa-sm rounded-borders">
          <q-icon name="book" class="q-mr-xs" /> {{ shelfInfo?.memberbooks?.length || 0 }}권
        </q-badge>
        <q-badge color="accent" outline class="q-pa-sm rounded-borders">
          <q-icon name="favorite" class="q-mr-xs" /> {{ shelfInfo?.memberShelves?.length || 0 }}
        </q-badge>
      </div>
    </q-card>

    <!-- 책 담기 버튼 -->
    <q-btn
      color="primary"
      icon="add_circle"
      label="책 담기"
      class="q-my-lg q-px-lg q-py-sm rounded-borders shadow-3"
      @click="openBookSearch"
      unelevated
    />

    <!-- 책 목록 -->
    <q-card class="book-list-card q-pa-md" flat bordered>
      <div v-if="isLoading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="3em" :thickness="5" />
      </div>

      <div v-else-if="searchResults.length === 0" class="text-center q-pa-xl text-grey-6">
        <q-icon name="menu_book" size="xl" class="q-mb-md" />
        <div class="text-h6">책장에 책이 없습니다.</div>
        <div class="q-mt-md">위의 '책 담기' 버튼을 눌러 책을 추가해보세요!</div>
      </div>

      <div v-else>
        <!-- 선반별로 그룹화 -->
        <div v-for="(books, shelfName) in groupedBooks" :key="shelfName" class="q-mb-lg">
          <div class="text-subtitle1 q-mb-md text-grey-9" style="font-weight: bold">
            {{ shelfName }}
          </div>

          <!-- 책 그리드 레이아웃으로 변경 (더 작은 사이즈) -->
          <div class="row q-col-gutter-sm">
            <div v-for="item in books" :key="item.book.id" class="q-mb-sm q-mx-xs">
              <div class="book-item">
                <q-img
                  :src="item.book.cover || 'https://placehold.co/120x180?text=No+Cover'"
                  width="100%"
                  height="120px"
                  fit="contain"
                  class="book-cover shadow-1"
                />

                <div class="book-info q-pt-xs">
                  <div class="book-title ellipsis">{{ item.book.title }}</div>
                  <div class="book-author ellipsis">{{ item.book.author }}</div>
                </div>

                <q-btn
                  class="delete-btn"
                  color="negative"
                  flat
                  round
                  dense
                  size="xs"
                  icon="delete"
                  @click="removeBookFromShelf(item)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- 책 검색 다이얼로그 -->
    <q-dialog
      v-model="searchDialogOpen"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="book-search-dialog" style="width: 700px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary">책 검색</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="bookSearchQuery"
            label="책 제목, 저자, ISBN 등으로 검색"
            outlined
            dense
            @keyup.enter="searchBooks"
            color="primary"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer" @click="searchBooks" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh; overflow-y: auto">
          <div v-if="isSearching" class="flex flex-center q-pa-md">
            <q-spinner color="primary" size="3em" :thickness="5" />
          </div>

          <div
            v-else-if="bookSearchResults.length === 0 && hasSearchedBooks"
            class="text-center q-pa-md text-grey-6"
          >
            <q-icon name="sentiment_dissatisfied" size="lg" class="q-mb-sm" />
            <div>검색 결과가 없습니다.</div>
          </div>

          <div v-else>
            <q-list separator>
              <q-item
                v-for="book in bookSearchResults"
                :key="book.id"
                class="q-py-md book-search-item"
              >
                <q-item-section avatar>
                  <q-img
                    :src="book.cover || 'https://placehold.co/80x120?text=No+Cover'"
                    width="80px"
                    height="120px"
                    fit="contain"
                    class="rounded-borders shadow-1"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-body1 text-grey-9">{{
                    book.title
                  }}</q-item-label>
                  <q-item-label caption class="text-grey-7">저자: {{ book.author }}</q-item-label>
                  <q-item-label caption class="text-grey-7"
                    >출판사: {{ book.publisher }}</q-item-label
                  >
                  <q-item-label caption v-if="book.isbn" class="text-grey-7"
                    >ISBN: {{ book.isbn }}</q-item-label
                  >
                </q-item-section>

                <q-item-section side>
                  <q-btn color="primary" flat label="추가" @click="addBookToShelf(book)" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const shelfId = ref(route.params.id)

// 책장 정보
const shelfInfo = ref({})
const searchResults = ref([])
const hasSearched = ref(false)
const isLoading = ref(true)

// 책 검색 관련 상태
const searchDialogOpen = ref(false)
const bookSearchQuery = ref('')
const bookSearchResults = ref([])
const isSearching = ref(false)
const hasSearchedBooks = ref(false)

onMounted(() => {
  getShelf()
})

watch(
  () => route.params.id,
  (newId) => {
    shelfId.value = newId
    getShelf()
  },
)

const emit = defineEmits(['removeBook'])

// const removeBookFromShelf = (shelfBookId) => {
//   emit('removeBook', shelfBookId)
// }

// 선반별로 책 그룹화하는 computed 속성
const groupedBooks = computed(() => {
  const grouped = {}

  shelfInfo.value.memberbooks.forEach((item) => {
    // 여기서 book 객체에 shelfName이나 선반 정보가 있어야 함
    // 만약 없다면 적절한 필드로 대체해야 함
    console.log(item)
    const shelfName = item?.shelfNew?.shelfCustomName
      ? item.shelfNew.shelfCustomName
      : `${item.shelfNew.shelfPosition}번째 선반`

    if (!grouped[shelfName]) {
      grouped[shelfName] = []
    }

    grouped[shelfName].push(item)
  })

  return grouped
})

async function getShelf() {
  // 페이지 업데이트 (쿼리 파라미터로 페이지 정보 추가)
  // router.push(`/shelf/${shelfId.value}`) // 이 부분은 실제 라우팅 로직에 따라 조절
  if (!shelfId.value) return

  try {
    const access = localStorage.getItem('access')
    isLoading.value = true

    // 책장 정보 가져오기 (예: 이름, 설명, 공개 여부, 좋아요 수)
    // 실제 API 응답 구조에 따라 shelfInfo.value에 할당
    const shelfResponse = await api.get(
      `${process.env.SPRING_SERVER}/api/v1/bookshelves/${shelfId.value}`,
      {
        headers: { access: access },
      },
    )
    shelfInfo.value = shelfResponse?.data || {}
    searchResults.value = shelfResponse.data.memberbooks.map((item) => item?.book) || [] // API 응답 구조에 맞게 수정
    console.log(searchResults.value)
    hasSearched.value = true
  } catch (error) {
    console.error('책장 정보 가져오기 중 오류 발생:', error)
    searchResults.value = []
    hasSearched.value = true

    $q.notify({
      color: 'negative',
      message: '책장 정보를 불러오는데 실패했습니다.',
      icon: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

// 책 검색 다이얼로그 열기
function openBookSearch() {
  searchDialogOpen.value = true
  bookSearchQuery.value = ''
  bookSearchResults.value = []
  hasSearchedBooks.value = false
}

// 책 검색 실행
async function searchBooks() {
  if (!bookSearchQuery.value.trim()) {
    $q.notify({
      color: 'warning',
      message: '검색어를 입력해주세요.',
      icon: 'warning',
    })
    return
  }

  isSearching.value = true
  hasSearchedBooks.value = false

  try {
    const access = localStorage.getItem('access')
    // 실제 책 검색 API 엔드포인트와 파라미터에 맞게 수정
    const response = await api.get(`${process.env.SPRING_SERVER}/api/v1/aladin/search`, {
      params: { query: bookSearchQuery.value, page: 1 },
      headers: { access: access },
    })
    console.log(bookSearchQuery.value)

    bookSearchResults.value = response.data || []
    hasSearchedBooks.value = true
  } catch (error) {
    console.error('책 검색 중 오류 발생:', error)
    bookSearchResults.value = []
    hasSearchedBooks.value = true

    $q.notify({
      color: 'negative',
      message: '책 검색 중 오류가 발생했습니다.',
      icon: 'error',
    })
  } finally {
    isSearching.value = false
  }
}

// 책장에 책 추가
async function addBookToShelf(book) {
  try {
    // 실제 책장-책 추가 API 엔드포인트와 요청 바디에 맞게 수정
    await api.post(`${process.env.SPRING_SERVER}/api/v1/memberbooksnew`, {
      bookDto: book,
      location: ['1-1'], // TODO 여기해야됨 연결
    })

    $q.notify({
      color: 'positive',
      message: '책이 책장에 추가되었습니다!',
      icon: 'check_circle',
    })

    // 책장 목록 새로고침
    getShelf()

    // 다이얼로그 닫기
    searchDialogOpen.value = false
  } catch (error) {
    console.error('책 추가 중 오류 발생:', error)
    $q.notify({
      color: 'negative',
      message: '책을 추가하는데 실패했습니다.',
      icon: 'error',
    })
  }
}

// 책장에서 책 제거
async function removeBookFromShelf(memberbook) {
  console.log(memberbook)
  try {
    $q.dialog({
      title: '책 제거',
      message: '정말로 이 책을 책장에서 제거하시겠습니까?',
      cancel: true,
      persistent: true,
      color: 'primary',
    }).onOk(async () => {
      const access = localStorage.getItem('access')
      // 실제 책장-책 제거 API 엔드포인트에 맞게 수정
      await api.delete(`${process.env.SPRING_SERVER}/api/v1/memberbooksnew/${memberbook.id}`, {
        headers: { access: access },
      })

      $q.notify({
        color: 'positive',
        message: '책이 책장에서 제거되었습니다.',
        icon: 'check_circle',
      })

      emit('removeBook', memberbook)
      // 책장 목록 새로고침
      getShelf()
    })
  } catch (error) {
    console.error('책 제거 중 오류 발생:', error)
    $q.notify({
      color: 'negative',
      message: '책을 제거하는데 실패했습니다.',
      icon: 'error',
    })
  }
}
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #f5f5f5; // 페이지 배경색을 살짝 밝게
}

.shelf-header,
.book-list-card {
  width: 100%;
  max-width: 900px;
  border-radius: 12px; // 더 부드러운 모서리
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); // 은은하고 부드러운 그림자
  background-color: #ffffff;
  transition: all 0.3s ease-in-out; // 부드러운 전환 효과
}

.shelf-header {
  .text-h4 {
    color: #333; // 제목 색상 좀 더 진하게
  }
  .text-subtitle1 {
    color: #555; // 설명 색상
  }
  .q-badge {
    font-weight: 500;
  }
}

.q-btn.rounded-borders {
  border-radius: 10px; // 버튼을 더 둥글게
}

.book-list-card {
  .text-h5 {
    border-bottom: 2px solid #eee; // 목록 제목 아래 얇은 구분선
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
}
.book-item {
  position: relative;
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 6em;
  gap: 0.7em;
}

.book-item:hover {
  transform: translateY(-3px);
}

.book-cover {
  border-radius: 4px;
  width: 100%;
  max-width: 100px;
}

.book-info {
  width: 100%;
  text-align: center;
  padding: 0 2px;
}

.book-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: #424242;
}

.book-author {
  font-size: 0.7rem;
  color: #757575;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.book-item:hover .delete-btn {
  opacity: 1;
}
</style>
