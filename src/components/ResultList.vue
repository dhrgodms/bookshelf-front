<template>
  <div class="card-container row customframe" style="justify-content: center">
    <div v-if="state.books.length > 0" class="row justify-center">
      <q-list class="row" style="gap: 0.4em; justify-content: center">
        <q-card
          v-for="book in state.books"
          :key="book.id"
          class="my-card col-12 col-sm-6 col-md-3"
          flat
          bordered
          style="min-width: 11em; max-width: 13.5em; width: 12em"
        >
          <BookCard :book="book" @like="onLikeClick" @have="onOwnClick" />
        </q-card>
      </q-list>
    </div>
    <div v-else-if="state.loading">
      <ResultSkeleton />
    </div>
    <div v-else-if="props.hasSearched && state.books.length == 0">
      <ResultNone />
    </div>
    <div v-else-if="!props.hasSearched"><BeforeSearch /></div>
  </div>
</template>

<script setup>
import ResultSkeleton from './skeleton/ResultSkeleton.vue'
import BeforeSearch from './BeforeSearch.vue'
import Book from './dto/Book'
import * as bookApi from '../boot/bookApi'
import { nextTick, onMounted, reactive, watch } from 'vue'
import ResultNone from './ResultNone.vue'
import { useRoute } from 'vue-router'
import BookCard from './BookCard.vue'

const bookCache = new Map()
const route = useRoute()

const state = reactive({
  books: [],
  loading: false,
  error: null,
})

const makeBook = async () => {
  state.loading = true
  const newBooks = []

  for (const item of props.results) {
    // const cached = bookCache.get(item.isbn13)

    // if (cached) {
    //   newBooks.push(cached)
    // } else {
    const newBook = new Book(
      item.title,
      item.author,
      item.publisher,
      item.cover,
      item.pubdate,
      item.isbn,
      item.seriesName,
      item.categoryName,
      item.link,
    )
    bookCache.set(item.isbn13, newBook)
    newBooks.push(newBook)
    // }
  }
  state.books = newBooks
  state.loading = false
  return state.books
}

async function onOwnClick(item) {
  await bookApi.own(
    {
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      cover: item.cover,
      pubdate: item.pubdate,
      isbn: item.isbn,
      seriesName: item.seriesName,
      categoryName: item.categoryName,
      link: item.link,
    },
    'userA',
  )
}

async function onLikeClick(item) {
  await bookApi.like(
    {
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      cover: item.cover,
      pubdate: item.pubdate,
      isbn: item.isbn,
      seriesName: item.seriesName,
      categoryName: item.categoryName,
      link: item.link,
    },
    'userA',
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
})

watch(
  () => props.results,
  (newResults) => {
    state.loading = true
    if (newResults && newResults.length > 0) {
      // console.log(newResults)
      makeBook()
    } else {
      state.books = []
      state.loading = false
    }
  },
)

onMounted(async () => {
  await nextTick()
  if (!route.query.query) state.loading = false
  // else state.loading = true

  const waitUntilReady = () => {
    if (props.results && props.results.length > 0) {
      makeBook()
    } else {
      setTimeout(waitUntilReady, 100)
    }
  }

  waitUntilReady()
})
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

.customframe {
  max-width: 800px;
  min-width: 380px;
  width: 100%;
}
</style>
