<template>
  <div
    class="card-container row q-col-gutter-md q-pa-md customframe"
    style="justify-content: center"
  >
    <div v-if="state.books.length > 0 && !state.isLoading" class="row justify-center">
      <q-list class="row" style="gap: 0.4em; justify-content: center">
        <q-card
          v-for="book in state.books"
          :key="book.id"
          class="my-card col-12 col-sm-6 col-md-3"
          flat
          bordered
          style="min-width: 11em; max-width: 13.5em; width: 25%"
        >
          <BookCard :book="book" @like="onLikeClick" @have="onOwnClick" />
        </q-card>
      </q-list>
    </div>
    <div v-else-if="state.books.length == 0">
      <ShelfResultNone />
    </div>
    <div v-else-if="state.isLoading">
      <ResultSkeleton />
    </div>
    <div v-else></div>
  </div>
</template>

<!-- TODO memberbook에 알맞게 수정하기 -->
<script setup>
import { nextTick, onMounted, reactive, watch } from 'vue'
import ShelfResultNone from './BookResultNone.vue'
import MemberBookNew from './dto/MemberBookNew'
import ResultSkeleton from './skeleton/ResultSkeleton.vue'
// import { api } from 'src/boot/axios'
import { api } from 'src/boot/axios'
import BookCard from './BookCard.vue'

const bookCache = new Map()

const state = reactive({
  books: [],
  loading: true,
  error: null,
})

const makeBook = async () => {
  const newBooks = []

  for (const item of props.results) {
    console.log(item)
    const cached = bookCache.get(item.book.isbn)

    if (cached) {
      newBooks.push(cached)
    } else {
      const newBook = new MemberBookNew(
        item.id,
        item.book.title,
        item.book.author,
        item.book.publisher,
        item.book.cover,
        item.book.pubdate,
        item.book.isbn,
        item.book.seriesInfo?.seriesName,
        item.book.categoryName,
        item.book.aladinUrl,
        item.member,
        item.book.id,
        item.bookshelfId,
        item.shelfId,
      )
      bookCache.set(item.book.isbn, newBook)
      newBooks.push(newBook)
    }
  }
  state.books = newBooks
  state.loading = false
  return state.books
}

async function onOwnClick(item) {
  await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/memberbook/own-change`,
    {
      memberbookId: item.memberbookId,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
  )
}

async function onLikeClick(item) {
  await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/memberbook/like-change`,
    {
      memberbookId: item.memberbookId,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
  )
  item.like = !item.like
}

const props = defineProps({
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

onMounted(async () => {
  await nextTick()
  console.log(props.results)
  console.log(state.books)

  const waitUntilReady = () => {
    if (props.results && props.results.length > 0) {
      makeBook()
    } else {
      setTimeout(waitUntilReady, 100)
    }
  }

  waitUntilReady()
})

watch(
  () => props.results,
  (newResults) => {
    console.log(props.results)
    if (newResults && newResults.length > 0) {
      makeBook()
    }
  },
)
</script>

<style lang="scss" scoped>
.grow {
  flex-basis: 0;
}
@keyframes scale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.motion-btn:active {
  animation: scale 0.2s ease-in-out;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
.slide-enter {
  transform: translateY(10px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.left-badge {
  right: 0px;
  left: 5px;
}
</style>
