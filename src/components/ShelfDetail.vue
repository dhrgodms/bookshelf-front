<template>
  <q-page class="q-pa-md shelf-detail-page">
    <div class="q-gutter-md">
      <!-- 📚 Shelf 설명 섹션 -->
      <q-card flat bordered class="shelf-description-card">
        <q-card-section>
          <div class="text-h5 text-weight-bold q-mb-sm shelf-name">
            {{ shelf.shelfName || '책장 이름' }}
          </div>
          <div class="text-subtitle2 text-grey-8 q-mb-md shelf-memo">
            {{ shelf.shelfMemo || '책장에 대한 설명이 여기에 들어갑니다.' }}
          </div>

          <q-separator class="q-my-md" />

          <div class="row items-center q-col-gutter-md">
            <div class="col-auto">
              <q-icon name="person" size="1.2em" color="grey-7" />
              <span class="q-ml-sm text-body2 text-grey-7">
                {{ shelf.creator || '작성자' }}
              </span>
            </div>
            <div class="col-auto">
              <q-icon name="event" size="1.2em" color="grey-7" />
              <span class="q-ml-sm text-body2 text-grey-7">
                {{ shelf.savedDate || 'YYYY.MM.DD' }}
              </span>
            </div>
            <div class="col-auto">
              <q-icon name="favorite" size="1.2em" color="accent" />
              <span class="q-ml-sm text-body2 text-accent text-weight-bold">
                {{ shelf.likeCount !== undefined ? shelf.likeCount : 0 }}
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- 📖 담긴 책들 섹션 -->
      <q-card flat bordered class="books-list-card">
        <q-card-section>
          <div v-if="state.books.length > 0 && !state.isLoading" class="books-container">
            <!-- CSS Grid로 변경 -->
            <div class="books-grid">
              <div v-for="book in state.books" :key="book.id" class="book-card-wrapper">
                <BookCard :book="book" @like="onLikeClick" @have="onOwnClick" />
              </div>
            </div>
          </div>
          <div v-else class="text-grey-6 q-pa-md">아직 이 책장에 담긴 책이 없어요. 🥲</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Book from './dto/Book'
import BookCard from './BookCard.vue'

// props 정의
const props = defineProps({
  shelfId: {
    type: [String, Number],
    default: null,
  },
  results: {
    type: Array,
    default: () => [],
  },
  hasSearched: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: true,
  },
})

const state = reactive({
  books: [],
  loading: true,
  error: null,
})

const bookCache = new Map()

// 상태 정의 - 기본 데이터와 API 데이터를 합칠 준비
const shelf = ref({
  shelfName: '나만의 개발 서적 모음',
  shelfMemo:
    '백엔드 개발자가 되기 위한 필독서들을 모아놓은 책장입니다. Spring, DevOps, 클린 코드 등 다양한 주제의 책들이 있어요.',
  creator: '하퍼',
  savedDate: '2024.07.25',
  likeCount: 123,
  books: [], // 여기는 비워두고 나중에 채울거야
})

// 책 데이터 처리 함수
const makeBook = async () => {
  try {
    if (!props.results) {
      console.log('props.results가 없습니다')
      return []
    }

    const newBooks = []

    for (const item of props.results) {
      console.log(item)
      if (!item) {
        console.log('잘못된 item 데이터:', item)
        continue
      }

      const cached = bookCache.get(item.isbn)

      if (cached) {
        newBooks.push(cached)
      } else {
        const newBook = new Book(
          item.title,
          item.author,
          item.publisher,
          item.cover,
          item.pubdate,
          item.isbn,
          item.seriesInfo?.seriesName,
          item.categoryName,
          item.aladinUrl,
        )
        bookCache.set(item.isbn, newBook)
        newBooks.push(newBook)
      }
    }

    state.books = newBooks
    state.loading = false
    return newBooks
  } catch (error) {
    console.error('책 데이터 처리 중 오류 발생:', error)
    state.error = error
    state.loading = false
    return []
  }
}

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  console.log('컴포넌트 마운트됨')
  console.log('props.results:', props.results)

  // shelfId가 있으면 API에서 데이터 가져오기
  if (props.shelfId) {
    console.log(`Shelf ID: ${props.shelfId} 에 대한 상세 정보를 불러옵니다.`)
    // fetchShelfDetail(props.shelfId)
  }

  // results가 있으면 책 데이터 처리
  console.log(props.results)
  if (props.results && props.results.length > 0) {
    await makeBook()
  }
})

// props.results 변경 감지
watch(
  () => props.results,
  async (newResults) => {
    console.log('props.results 변경됨:', newResults)
    if (newResults && newResults.length > 0) {
      await makeBook()
    }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.shelf-detail-page {
  width: 100%;
  margin: 0 auto;
}

.shelf-description-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.shelf-name {
  color: #2c3e50;
}

.shelf-memo {
  color: #443c3c;
}

.books-list-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  background-color: #e6e6e6;
}

/* 책 컨테이너 스타일 */
.books-container {
  width: 100%;
  padding: 0.5em;
}

/* 책 그리드 레이아웃 - CSS Grid 사용 */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12em, 1fr));
  gap: 1em; /* 카드 사이 간격 */
  justify-content: start; /* 왼쪽 정렬 */
}

/* BookCard를 감싸는 wrapper 스타일 */
.book-card-wrapper {
  width: 12em;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  }
}

/* 기존 스타일 유지 */
.book-placeholder-card {
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  }
}
</style>
