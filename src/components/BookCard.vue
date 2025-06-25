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

    <!-- 책장 선택 다이얼로그 -->
    <q-dialog
      v-model="shelfDialogOpen"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="shelf-selector-card">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-primary">책장 선택</div>
          <div class="text-caption q-mt-sm">
            <q-icon name="info" size="xs" class="q-mr-xs" /> 책을 담을 책장을 선택해주세요
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pb-none">
          <q-input
            v-model="shelfSearchQuery"
            placeholder="책장 검색"
            dense
            outlined
            class="q-mt-md"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section style="max-height: 50vh; overflow-y: auto" class="q-pt-sm">
          <q-list separator>
            <q-item
              v-for="item in filteredShelves"
              :key="item.shelf.id"
              clickable
              v-ripple
              @click="addBookToShelf(book, item.shelf.id)"
              class="shelf-item"
            >
              <q-item-section avatar>
                <q-avatar rounded>
                  <q-icon name="menu_book" color="primary" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.shelf.shelfName }}</q-item-label>
                <q-item-label caption>{{ item.shelf.shelfMemo || '설명 없음' }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="add_circle" color="primary" />
              </q-item-section>
            </q-item>

            <!-- 책장이 없을 때 표시 -->
            <q-item v-if="filteredShelves.length === 0 && !isLoading" class="text-center">
              <q-item-section>
                <div class="text-grey-6 q-py-md">
                  <q-icon name="sentiment_dissatisfied" size="md" class="q-mb-sm" />
                  <div>검색 결과가 없습니다</div>
                </div>
              </q-item-section>
            </q-item>

            <!-- 로딩 표시 -->
            <q-item v-if="isLoading">
              <q-item-section class="flex flex-center">
                <q-spinner color="primary" size="2em" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!-- 새 책장 추가 버튼 -->
        <q-card-section class="q-pt-none">
          <q-separator class="q-my-md" />
          <q-btn
            label="새 책장 만들기"
            color="primary"
            class="full-width"
            outline
            @click="openNewShelfDialog"
          >
            <q-icon name="add" class="q-mr-sm" />
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 새 책장 만들기 다이얼로그 -->
    <q-dialog v-model="newShelfDialogOpen" persistent transition-show="fade" transition-hide="fade">
      <q-card class="new-shelf-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary">새 책장 만들기</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit="createNewShelf" class="q-pa-md">
          <q-card-section class="q-pt-none">
            <q-input
              v-model="newShelf.name"
              label="책장 이름"
              :rules="[(val) => !!val || '책장 이름을 입력해주세요']"
              outlined
              dense
              class="q-mb-md"
            />

            <q-input
              v-model="newShelf.description"
              label="책장 설명"
              type="textarea"
              outlined
              dense
              class="q-mb-md"
            />

            <q-toggle v-model="newShelf.isPublic" label="공개 여부" class="q-mb-md" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="취소" color="grey-7" flat v-close-popup />
            <q-btn label="저장" type="submit" color="primary" :loading="isCreatingShelf" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { editLength } from './Utils'

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
const newShelfDialogOpen = ref(false)
const shelfSearchQuery = ref('')
const myShelves = ref([])
const isLoading = ref(false)
const isCreatingShelf = ref(false)

// 새 책장 정보
const newShelf = ref({
  name: '',
  description: '',
  isPublic: true,
})

// 필터링된 책장 목록
const filteredShelves = computed(() => {
  if (!shelfSearchQuery.value) {
    return myShelves.value
  }

  const query = shelfSearchQuery.value.toLowerCase()
  return myShelves.value.filter(
    (item) =>
      item.shelf.shelfName.toLowerCase().includes(query) ||
      (item.shelf.shelfMemo && item.shelf.shelfMemo.toLowerCase().includes(query)),
  )
})

// 좋아요 클릭 핸들러
function onLikeClick(book) {
  emit('like-click', book)
}

// 소장 클릭 핸들러
// function onOwnClick(book) {
//   emit('own-click', book)
// }

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
      `${process.env.SPRING_SERVER}/api/v1/membershelves/own`,
      { username: 'userA' }, // 현재 테스트 유저 'userA' 사용
      {
        headers: { access: access },
      },
    )
    console.log(response.data.content)

    myShelves.value = response.data?.content || []

    // 책장이 없을 경우 안내 메시지 표시
    if (myShelves.value.length === 0) {
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

// 새 책장 다이얼로그 열기
function openNewShelfDialog() {
  // 기존 다이얼로그는 닫고 새 다이얼로그 열기
  shelfDialogOpen.value = false

  // 폼 초기화
  newShelf.value = {
    name: '',
    description: '',
    isPublic: true,
  }

  // 약간의 딜레이 후 새 다이얼로그 열기 (애니메이션 자연스럽게)
  setTimeout(() => {
    newShelfDialogOpen.value = true
  }, 300)
}

// 새 책장 생성
async function createNewShelf() {
  if (!newShelf.value.name) return

  isCreatingShelf.value = true

  try {
    const access = localStorage.getItem('access')
    const response = await api.post(
      `${process.env.SPRING_SERVER}/api/v1/shelves`,
      {
        shelfDto: {
          shelfName: newShelf.value.name,
          shelfMemo: newShelf.value.description,
          isPublic: newShelf.value.isPublic,
        },
        username: 'userA', // 실제로는 로그인한 사용자 정보를 사용해야 함
      },
      {
        headers: { access: access },
      },
    )

    $q.notify({
      color: 'positive',
      message: '책장이 성공적으로 생성되었습니다!',
      icon: 'check_circle',
    })

    // 새로 생성된 책장에 책 추가
    if (response.data && response.data.id) {
      await addBookToShelf(props.book, response.data.id)
    }

    // 다이얼로그 닫기
    newShelfDialogOpen.value = false
  } catch (error) {
    console.error('책장 생성 실패:', error)
    $q.notify({
      color: 'negative',
      message: '책장 생성에 실패했습니다.',
      icon: 'error',
    })
  } finally {
    isCreatingShelf.value = false
  }
}

// 책을 책장에 추가
async function addBookToShelf(book, shelfId) {
  try {
    const access = localStorage.getItem('access')
    await api.post(
      `${process.env.SPRING_SERVER}/api/v1/shelfbooks`,
      {
        shelfId: shelfId,
        bookDto: book,
      },
      {
        headers: { access: access },
      },
    )

    $q.notify({
      color: 'positive',
      message: '책이 책장에 추가되었습니다!',
      icon: 'check_circle',
    })

    // 책장 선택 다이얼로그 닫기
    shelfDialogOpen.value = false
  } catch (error) {
    console.error('책 추가 실패:', error)
    $q.notify({
      color: 'negative',
      message: '책을 책장에 추가하는데 실패했습니다.',
      icon: 'error',
    })
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

/* 새 책장 다이얼로그 스타일 */
.new-shelf-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
}
</style>
