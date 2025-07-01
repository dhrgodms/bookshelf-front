<template>
  <q-dialog
    :model-value="show"
    @update:model-value="(val) => emit('update:show', val)"
    persistent
    maximized
  >
    <q-card style="min-width: 600px; max-width: 800px; max-height: 90vh">
      <q-card-section class="text-h6">
        책장에 책 보관하기
        <q-btn flat round dense icon="close" @click="close" class="float-right" />
      </q-card-section>

      <q-separator />

      <!-- 선택된 책 정보 -->
      <q-card-section class="bg-grey-2 q-pa-md" style="border-radius: 6px">
        <div><strong>선택된 책</strong></div>
        <div>제목: {{ book.title }}</div>
        <div>저자: {{ book.author }}</div>
        <div>카테고리: {{ book.categoryName }}</div>
        <div>ISBN: {{ book.isbn }}</div>
      </q-card-section>

      <q-card-section
        class="row q-gutter-md"
        style="min-height: 300px; justify-content: space-evenly"
      >
        <!-- 책 분류 (책장 선택) -->
        <div class="col-5">
          <div class="text-subtitle2 q-mb-sm">책장 선택</div>
          <q-list bordered padding>
            <q-item
              v-for="category in myShelves"
              :key="category.id"
              clickable
              @click="toggleCategory(category.id)"
              :active="selectedCategories.includes(category.id)"
            >
              <q-item-section>{{ category.bookshelfName }}</q-item-section>
              <q-item-section side>
                <q-badge
                  :style="{ backgroundColor: category.bookshelfColor }"
                  align="top"
                  transparent
                  >{{ category.shelves?.length || 0 }}권</q-badge
                >
              </q-item-section>
            </q-item>
            <q-item clickable @click="addLibraryDialog = true" class="text-grey">
              <q-item-section class="text-center">+ 새 책장 만들기</q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- 물리적 위치 선택 부분 수정 -->
        <div class="col-5">
          <div class="text-subtitle2 q-mb-sm">물리적 위치 선택</div>

          <!-- 선택된 책장이 없을 때 -->
          <div v-if="selectedCategories.length === 0" class="text-center q-pa-md text-grey">
            왼쪽에서 책장을 선택해주세요
          </div>

          <!-- 선택된 책장의 선반만 표시 -->
          <div
            v-for="bookshelf in selectedBookshelves"
            :key="bookshelf.id"
            class="q-mb-md border-radius-md bg-grey-1 q-pa-sm"
          >
            <div class="row items-center justify-between q-mb-xs">
              <div class="text-weight-medium">{{ bookshelf.bookshelfName }}</div>
              <q-btn
                dense
                flat
                color="brown"
                label="+ 선반"
                @click="addShelf(bookshelf.id, bookshelf.shelves.length + 1)"
              />
            </div>
            <q-list bordered padding>
              <q-item
                v-for="(shelf, sidx) in bookshelf.shelves"
                :key="shelf.id"
                clickable
                @click="selectShelf(bookshelf.id, shelf.id)"
                :active="isShelfSelected(bookshelf.id, shelf.id)"
              >
                <q-item-section>
                  {{ shelf.shelfCustomName || `${sidx + 1}번째 선반` }}
                </q-item-section>
                <q-item-section side>
                  <q-badge :style="{ backgroundColor: bookshelf.bookshelfColor }" transparent>
                    {{ shelf.count || 0 }}권
                  </q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="취소" color="grey" @click="close" />
        <q-btn :disable="!canSave" label="책 저장하기" color="primary" @click="saveBook" />
      </q-card-actions>

      <!-- 새 카테고리 추가 다이얼로그 -->
      <q-dialog v-model="addLibraryDialog">
        <q-card style="min-width: 300px">
          <q-card-section>
            <div class="text-h6">새 라이브러리 만들기</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="newLibraryName" label="책장 이름" />
            <q-input v-model="newLibraryMemo" label="책장 설명" />
            <q-color v-model="newLibraryColor" label="색상 선택" format-model="hex" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="취소" color="grey" @click="addLibraryDialog = false" />
            <q-btn :disable="!newLibraryName" label="추가" color="primary" @click="addLibrary" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  book: Object,
  myShelves: Array,
})

// const show = ref(true)

// selectedShelves를 ref([])로 선언
const selectedShelves = ref([])

// 카테고리(책장) 데이터 예시
const categories = reactive([])
const selectedCategories = ref([])

// 책장(물리적 위치) 데이터 예시
const bookshelves = reactive([])
const $q = useQuasar()

// 선택 토글 함수 (불변성 유지)
function selectShelf(bookshelfId, shelfId) {
  const key = `${bookshelfId}-${shelfId}`
  if (selectedShelves.value.includes(key)) {
    selectedShelves.value = selectedShelves.value.filter((k) => k !== key)
  } else {
    selectedShelves.value = [...selectedShelves.value, key]
  }
}

// 선택 여부 확인 함수
function isShelfSelected(bookshelfId, shelfId) {
  const key = `${bookshelfId}-${shelfId}`
  return selectedShelves.value.includes(key)
}

function toggleCategory(id) {
  if (selectedCategories.value.includes(id)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== id)
  } else {
    selectedCategories.value = [...selectedCategories.value, id]
  }
}
// 새 카테고리 추가 다이얼로그
const addLibraryDialog = ref(false)
const newLibraryName = ref('')
const newLibraryMemo = ref('')
const newLibraryColor = ref('brown')

// 새 카테고리 추가
async function addLibrary() {
  try {
    const access = localStorage.getItem('access')

    const response = await api.post(
      `${process.env.SPRING_SERVER}/api/v1/bookshelves`,
      {
        username: 'userA', // 실제로는 로그인한 사용자 정보를 사용해야 함
        bookshelfName: newLibraryName.value,
        bookshelfColor: newLibraryColor.value,
        notes: newLibraryMemo.value,
      },
      {
        headers: { access: access },
      },
    )

    console.log(response.data)

    categories.push({
      id: categories.length + 1,
      name: newLibraryName.value,
      color: newLibraryColor.value,
      count: 0,
    })

    addLibraryDialog.value = false

    emit('library-added', {
      shelfName: newLibraryName.value,
      shelfColor: newLibraryColor.value,
      shelfMemo: newLibraryMemo.value,
    })
  } catch (error) {
    console.error(error)
  } finally {
    console.log(newLibraryColor.value)
    newLibraryName.value = ''
    newLibraryMemo.value = ''
    newLibraryColor.value = 'brown'
    addLibraryDialog.value = false
  }
}

const selectedBookshelves = computed(() => {
  // 선택된 책장 ID에 해당하는 책장만 필터링해서 반환
  return props.myShelves?.filter((shelf) => selectedCategories.value.includes(shelf.id))
})

// 새 선반 추가
async function addShelf(bookshelfId, shelfPosition) {
  const access = localStorage.getItem('access')

  const response = await api.post(
    `${process.env.SPRING_SERVER}/api/v1/shelvesnew`,
    {
      bookshelfId: bookshelfId,
      shelfPosition: shelfPosition,
      username: 'userA',
    },
    {
      headers: { access: access },
    },
  )

  console.log(response.data)

  categories.push({
    id: categories.length + 1,
    name: newLibraryName.value,
    color: newLibraryColor.value,
    count: 0,
  })

  addLibraryDialog.value = false

  emit('library-added', {
    shelfName: newLibraryName.value,
    shelfColor: newLibraryColor.value,
    shelfMemo: newLibraryMemo.value,
  })

  const shelfList = bookshelves.find((b) => b.id === bookshelfId)?.shelves
  if (shelfList) {
    shelfList.push({ id: shelfList.length + 1, count: 0 })
  }
}

// 새 책장 추가
// function addBookshelf() {
//   bookshelves.push({
//     id: bookshelves.length + 1,
//     shelves: [{ id: 1, count: 0 }],
//   })
// }

// 저장 가능 여부 (책장 하나 이상, 선반 하나 이상 선택되어야 저장 가능)
const canSave = computed(
  () => selectedCategories.value.length > 0 && selectedShelves.value.length > 0,
)

async function saveBook() {
  if (!canSave.value) return

  try {
    const access = localStorage.getItem('access')

    const response = await api.post(
      `${process.env.SPRING_SERVER}/api/v1/memberbooksnew`,
      {
        username: 'userA',
        bookDto: props.book,
        location: selectedShelves.value,
      },
      {
        headers: { access: access },
      },
    )

    console.log(response.data)

    addLibraryDialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    console.log(newLibraryColor.value)
    newLibraryName.value = ''
    newLibraryMemo.value = ''
    newLibraryColor.value = 'brown'
    addLibraryDialog.value = false
  }

  $q.notify(
    `책 "${props.book.title}"을(를) ${selectedCategories.value.length}개 책장과 ${selectedShelves.value.length}개 선반에 저장했어!`,
  )
  close()
}

const emit = defineEmits(['update:modelValue', 'library-added'])

function close() {
  // show.value = false
  emit('update:show', false)
}
</script>

<style scoped>
.border-radius-md {
  border-radius: 6px;
}
.q-item--active {
  background-color: rgba(66, 121, 87, 0.1); /* primary 색상의 연한 버전 */
  border-left: 3px solid #427957; /* primary 색상의 왼쪽 테두리 */
  font-weight: bold; /* 볼드 처리 */
  color: #1d1d1d; /* 글씨 색상 */
}
</style>
