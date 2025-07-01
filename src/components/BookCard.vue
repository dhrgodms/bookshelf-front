<template>
  <div class="book-card flex column" style="min-height: 5em">
    <div class="flex row" style="min-height: 10em; align-items: flex-start">
      <!-- 왼쪽: 책 커버 영역 -->
      <div class="book-cover-section">
        <div class="badge-container">
          <q-badge
            v-if="book.like"
            color="accent"
            style="
              top: 1.5em;
              z-index: 1;
              left: -10px;
              font-size: 0.75em;
              font-weight: bold;
              width: fit-content;
            "
            floating
          >
            읽고싶은
          </q-badge>
          <q-badge
            v-if="book.have || haveBook"
            color="primary"
            style="
              left: -10px;
              font-size: 0.75em;
              font-weight: bold;
              width: fit-content;
              z-index: 1;
            "
            floating
          >
            소장중
          </q-badge>
        </div>
        <div class="book-cover-container">
          <q-img :src="book.cover" width="3.8em" style="margin: 0.5em; object-fit: contain" />
        </div>
      </div>
      <!-- 오른쪽: 책 정보 영역 -->
      <div class="book-info-section">
        <div
          class="text-overline text-orange-9 q-my-sm"
          style="font-size: 0.6em; line-height: normal; min-height: 2em"
        >
          {{ editLength(book.categoryName, 15) }}
        </div>
        <div
          class="text-subtitle2 book-title"
          style="line-height: normal; min-height: 2.5em; font-size: 0.85em"
        >
          {{ editLength(book.title, 20) }}
        </div>
        <div class="text-caption" style="font-size: 0.75em; line-height: 1.5em; min-height: 1.5em">
          {{ editLength(book.author, 8) }}
        </div>
        <div class="text-caption" style="font-size: 0.7em; line-height: 1.5em">
          {{ editLength(book.publisher, 8) }}
        </div>
        <div class="text-caption text-grey" style="font-size: 0.7em; line-height: 1.5em">
          {{ book.pubdate }}
        </div>
        <div class="text-caption text-grey" style="font-size: 0.7em; line-height: 1.5em">
          {{ book.isbn13 }}
        </div>
      </div>
    </div>

    <!-- 액션 버튼 영역 -->
    <div>
      <q-card-actions
        class="flex row action-buttons"
        style="justify-content: space-evenly; padding: 0"
      >
        <q-btn
          class="motion-btn"
          flat
          padding="none"
          :color="book.like ? 'accent' : 'grey'"
          :icon="book.like ? 'favorite' : 'favorite_border'"
          @click="onLikeClick(book)"
          size="1.2em"
        />
        <q-btn
          class="motion-btn shelf-btn"
          flat
          padding="none"
          color="primary"
          icon="shelves"
          @click="openShelfSelector"
          size="1.2em"
        />
        <q-btn
          class="motion-btn"
          flat
          padding="0.1em"
          :color="'grey'"
          :icon="'info'"
          :href="book.link"
          size="1em"
        />
      </q-card-actions>
    </div>

    <BookSaveModal
      :book="book"
      :my-shelves="myShelves"
      :show="shelfDialogOpen"
      @update:show="(val) => (shelfDialogOpen = val)"
      @library-added="fetchMyShelves"
    />
    <!-- 책장 선택 다이얼로그 -->
    <ShelfCreateDialog
      :new-shelf="newShelf"
      :new-shelf-dialog-open="newShelfDialogOpen"
      :book="book"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { editLength } from './Utils'
import BookSaveModal from './BookSaveModal.vue'
import ShelfCreateDialog from './ShelfCreateDialog.vue'

// Props 정의
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

// Emits 정의
const emit = defineEmits(['like-click', 'own-click'])

const $q = useQuasar()
const haveBook = ref(props.book.have || false)

// 책장 선택 관련 상태
const shelfDialogOpen = ref(false)
// const shelfSearchQuery = ref('')
const myShelves = ref([])
const isLoading = ref(false)
const newShelf = ref(null)
const newShelfDialogOpen = ref(false)

// 좋아요 클릭 핸들러
function onLikeClick(book) {
  emit('like-click', book)
}

// 책장 선택 다이얼로그 열기
async function openShelfSelector() {
  shelfDialogOpen.value = true
  await fetchMyShelves() // 여기서 책장 목록을 가져옴
}

// 내 책장 목록 가져오기
// 내 책장 목록 가져오기 함수 수정
async function fetchMyShelves() {
  isLoading.value = true

  try {
    const access = localStorage.getItem('access')
    // 여기서 'userA'의 책장 목록을 가져오는 API 호출
    const response = await api.post(
      `${process.env.SPRING_SERVER}/api/v1/bookshelves/member`,
      { username: 'userA' }, // 현재 테스트 유저 'userA' 사용
      {
        headers: { access: access },
      },
    )
    console.log(response.data)

    myShelves.value = response.data

    // 책장이 없을 경우 안내 메시지 표시
    if (myShelves.value?.length === 0) {
      $q.notify({
        color: 'warning',
        message: '책장이 없습니다. 새 책장을 만들어보세요!',
        icon: 'info',
        timeout: 2000,
      })
    }
  } catch (error) {
    console.error('책장 목록 가져오기 실패:', error)
    $q.notify({
      color: 'negative',
      message: '책장 목록을 불러오는데 실패했습니다.',
      icon: 'error',
    })
    myShelves.value = [] // 오류 시 빈 배열로 초기화
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.book-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  padding: 0.5em;
  background-color: white;
  width: 12em;
}

.book-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.book-cover-section {
  width: 4.8em;
  position: relative;
}

.book-cover-container {
  transition: transform 0.2s ease;
}

.book-cover-container:hover {
  transform: scale(1.05);
}

.book-info-section {
  flex: 1;
  padding-left: 0.7em; /* 여기 간격을 더 넓게 조정 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.book-title {
  font-weight: 500;
  transition: color 0.2s ease;
}

.book-card:hover .book-title {
  color: #1976d2;
}

.action-buttons .q-btn {
  transition: transform 0.2s ease;
}

.action-buttons .q-btn:hover {
  transform: scale(1.15);
}

/* 책장 선택 다이얼로그 스타일 */
.shelf-selector-card {
  border-radius: 12px;
  max-width: 500px;
  width: 90vw;
}

.shelf-item {
  transition: background-color 0.2s ease;
}

.shelf-item:hover {
  background-color: #f0f7ff;
}
</style>
