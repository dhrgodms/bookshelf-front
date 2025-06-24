<template>
  <div
    class="card-container row q-col-gutter-md q-pa-md customframe"
    style="justify-content: center"
  >
    <div v-if="state.shelves.length > 0 && !state.isLoading" class="row justify-center">
      <q-list class="row" style="gap: 0.4em; justify-content: center">
        <q-card
          v-for="item in state.shelves"
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
                    v-if="item.shelfMemo == null"
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
                    좋아요
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
                    class="text-subtitle2 col-5"
                    style="line-height: normal; min-height: 2.5em; font-size: 0.85em"
                  >
                    {{ editLength(item.shelfName, 20) }}
                  </div>
                </q-card-section>
                <div class="col-6 column">
                  <q-card-section style="padding: 0; overflow: hidden">
                    <div
                      class="text-caption col"
                      style="font-size: 0.75em; line-height: 1.5em; min-height: 1.5em"
                    >
                      {{ editLength(item.shelfMemo, 8) }}
                    </div>
                    <div
                      class="text-caption text-grey col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    >
                      {{ item.savedDate }}
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
              </q-card-actions>
            </div>
          </div>
        </q-card>
      </q-list>
    </div>
    <div v-else-if="state.shelves.length == 0">
      <ShelfResultNone />
    </div>
    <div v-else-if="state.isLoading">
      <ResultSkeleton />
    </div>
    <div v-else></div>
  </div>
</template>

<script setup>
import ResultSkeleton from './skeleton/ResultSkeleton.vue'
import { editLength } from './Utils'
import { nextTick, onMounted, reactive, watch } from 'vue'
import ShelfResultNone from './ShelfResultNone.vue'
import { api } from 'src/boot/axios'
import MemberShelfDto from './dto/MemberShelfDto'

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

async function onLikeClick(item) {
  await api.post(
    `${process.env.SPRING_SERVER}/api/memberbook/like-change`,
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
