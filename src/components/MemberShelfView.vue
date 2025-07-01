<template>
  <div class="card-container row q-col-gutter-md q-pa-md" style="justify-content: center">
    <div v-if="props.results.length > 0 && !state.isLoading" class="row justify-center">
      <q-list class="row" style="gap: 1em; justify-content: flex-start">
        <q-card v-for="item in props.results" :key="item.id">
          <BookshelfCard :results="props.results" :bookshelf="item" />
        </q-card>
      </q-list>
    </div>
    <div v-else-if="state.shelves.length == 0">
      <ShelfResultNone />
    </div>
    <div v-else-if="state.isLoading">
      <ResultSkeleton />
    </div>
  </div>
</template>

<script setup>
import ResultSkeleton from './skeleton/ResultSkeleton.vue'
import { nextTick, onMounted, reactive, watch } from 'vue'
import ShelfResultNone from './BookResultNone.vue'
import MemberShelfDto from './dto/MemberShelfDto'
import BookshelfCard from './BookshelfCard.vue'

const shelfCache = new Map()

const state = reactive({
  shelves: [],
  loading: true,
  error: null,
})

const makeShelf = async () => {
  const newShelves = []

  for (const item of props.results) {
    const cached = shelfCache.get(item.id)

    if (cached) {
      newShelves.push(cached)
    } else {
      const newShelf = new MemberShelfDto(item.id, item.member, item.shelf, item.savedDate)
      shelfCache.set(item.id, newShelf)
      newShelves.push(newShelf)
    }
  }
  state.shelves = newShelves
  state.loading = false
  return state.shelves
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
  // console.log(props.results)
  // console.log(state.books)

  const waitUntilReady = () => {
    if (props.results && props.results.length > 0) {
      makeShelf()
    } else {
      setTimeout(waitUntilReady, 100)
    }
  }

  waitUntilReady()
})

watch(
  () => props.results,
  (newResults) => {
    if (newResults && newResults.length > 0) {
      makeShelf()
    }
  },
)
</script>

<style lang="scss" scoped>
// 기존 스타일
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

// 새로운 폴더 스타일
.folder-card {
  position: relative;
  transition: all 0.3s ease;
  border: none !important;
  height: auto;
}

.folder-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.folder-tab {
  height: 10px;
  background-color: #d2b223;
  border-radius: 5px 5px 0 0;
  position: relative;
  z-index: 1;
}

.folder-main {
  background-color: #fff89b;
  border-radius: 0 5px 5px 5px;
  padding: 10px;
  min-height: 120px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1) !important;
}

.folder-title {
  line-height: normal;
  min-height: 2.5em;
  font-size: 0.9em;
  font-weight: bold;
  color: #5d4037;
}

.folder-badge {
  font-size: 0.75em;
  font-weight: bold;
  width: fit-content;
  position: absolute;
  top: -5px;
  left: -5px;
  z-index: 2;
}

.folder-badge-container {
  position: relative;
  height: 15px;
}

.folder-actions {
  justify-content: space-evenly;
  padding: 0;
  margin-top: 5px;
  border-top: 1px dashed #bdbdbd;
  padding-top: 5px;
}
</style>
