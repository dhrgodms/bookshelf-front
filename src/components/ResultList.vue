<template>
  <div class="card-container row customframe" style="justify-content: center">
    <div v-if="state.books.length > 0" class="row justify-center">
      <q-list class="row" style="gap: 0.4em; justify-content: center">
        <q-card
          v-for="item in state.books"
          :key="item.id"
          class="my-card col-12 col-sm-6 col-md-3"
          flat
          bordered
          style="min-width: 11em; max-width: 13.5em; width: 25%"
        >
          <div class="flex column" style="min-height: 5em">
            <div class="flex row" style="min-height: 10em; align-items: flex-start">
              <div class="flex column col-4" style="justify-items: center">
                <div class="flex column">
                  <q-badge
                    v-if="item.like"
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
                  <!-- </div> -->
                  <q-badge
                    v-if="item.have"
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
                <div>
                  <div>
                    <q-img
                      :src="item.cover"
                      width="3.8em"
                      style="margin: 0.5em; object-fit: contain"
                    />
                  </div>
                </div>
              </div>
              <div class="col-1"></div>
              <div class="col-7 column">
                <q-card-section style="padding: 0; overflow: hidden">
                  <div
                    class="text-overline text-orange-9 q-my-sm col-7"
                    style="font-size: 0.6em; line-height: normal; min-height: 2em"
                  >
                    {{ editLength(item.categoryName, 15) }}
                  </div>
                  <div
                    class="text-subtitle2 col-5"
                    style="line-height: normal; min-height: 2.5em; font-size: 0.85em"
                  >
                    {{ editLength(item.title, 20) }}
                  </div>
                </q-card-section>
                <div class="col-6 column">
                  <q-card-section style="padding: 0; overflow: hidden">
                    <div
                      class="text-caption col"
                      style="font-size: 0.75em; line-height: 1.5em; min-height: 1.5em"
                    >
                      {{ editLength(item.author, 8) }}
                    </div>
                    <div class="text-caption col" style="font-size: 0.7em; line-height: 1.5em">
                      {{ editLength(item.publisher, 8) }}
                    </div>
                    <div
                      class="text-caption text-grey col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    >
                      {{ item.pubDate }}
                    </div>
                    <div
                      class="text-caption text-grey col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    >
                      {{ item.isbn13 }}
                    </div>
                  </q-card-section>
                </div>
              </div>
            </div>
            <div>
              <q-card-actions class="flex row" style="justify-content: space-evenly; padding: 0">
                <q-btn
                  class="motion-btn"
                  flat
                  padding="none"
                  :color="item.like ? 'accent' : 'grey'"
                  :icon="item.like ? 'favorite' : 'favorite_border'"
                  @click="() => onLikeClick(item)"
                  size="1.2em"
                />
                <q-toggle
                  v-model="item.have"
                  icon="shelves"
                  size="3.4em"
                  @click="() => onOwnClick(item)"
                />
                <q-btn
                  class="motion-btn"
                  flat
                  padding="0.1em"
                  :color="'grey'"
                  :icon="'info'"
                  :href="item.link"
                  size="1em"
                />
              </q-card-actions>
            </div>
          </div>
        </q-card>
      </q-list>
    </div>
    <div v-else-if="true">
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
import Book from './Book'
import { editLength } from './Utils'
import * as bookApi from '../boot/bookApi'
import { nextTick, onMounted, reactive, watch } from 'vue'
import ResultNone from './ResultNone.vue'

const bookCache = new Map()

const state = reactive({
  books: [],
  loading: true,
  error: null,
})

const makeBook = async () => {
  const newBooks = []

  for (const item of props.results) {
    const cached = bookCache.get(item.isbn13)

    if (cached) {
      newBooks.push(cached)
    } else {
      const newBook = new Book(
        item.title,
        item.author,
        item.publisher,
        item.cover,
        item.pubDate,
        item.isbn13,
        item.seriesInfo?.seriesName,
        item.categoryName,
        item.like,
        item.have,
        item.link,
      )
      bookCache.set(item.isbn13, newBook)
      newBooks.push(newBook)
    }
  }
  state.books = newBooks
  state.loading = false
  return state.books
}

async function onOwnClick(item) {
  await bookApi.own({
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    cover: item.cover,
    pubDate: item.pubDate,
    isbn13: item.isbn13,
    itemPage: item.itemPage,
    seriesName: item.seriesName,
    categoryName: item.categoryName,
    link: item.link,
  })
}

async function onLikeClick(item) {
  await bookApi.like({
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    cover: item.cover,
    pubDate: item.pubDate,
    isbn13: item.isbn13,
    itemPage: item.itemPage,
    seriesName: item.seriesName,
    categoryName: item.categoryName,
    link: item.link,
  })
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

watch(
  () => props.results,
  (newResults) => {
    state.isLoading = true
    if (newResults && newResults.length > 0) {
      makeBook()
    } else {
      state.books = []
      state.isLoading = false
    }
  },
)

onMounted(async () => {
  await nextTick()
  console.log('마운트 후 hasSearched=' + props.hasSearched)

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
