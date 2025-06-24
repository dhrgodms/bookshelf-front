<template>
  <div
    class="card-container row q-col-gutter-md q-pa-md customframe"
    style="justify-content: center"
  >
    <div v-if="state.shelves.length > 0 && !state.isLoading" class="row justify-center">
      <q-list class="row" style="gap: 1em; justify-content: center">
        <q-card
          v-for="item in state.shelves"
          :key="item.id"
          class="folder-card col-12 col-sm-6 col-md-3"
          flat
          @click="() => goToShelfDetail(item.id)"
          style="min-width: 11em; max-width: 13.5em; width: 25%; cursor: pointer"
        >
          <!-- 폴더 상단 부분 -->
          <div class="folder-tab"></div>

          <!-- 폴더 메인 부분 -->
          <div class="folder-main">
            <div class="flex column" style="min-height: 3em; position: relative">
              <!-- 뱃지 위치 조정 -->
              <div class="folder-badge-container">
                <q-badge v-if="item.shelfMemo == null" color="primary" class="folder-badge">
                  좋아요
                </q-badge>
              </div>

              <div class="flex" style="min-height: 5em; align-items: flex-start">
                <div class="col-1"></div>
                <div class="col-7 column">
                  <q-card-section style="padding: 0; overflow: hidden">
                    <div class="text-subtitle2 col-5 folder-title">
                      {{ editLength(item.shelfName, 20) }}
                    </div>
                  </q-card-section>
                  <div class="col-6 column">
                    <q-card-section style="padding: 0; overflow: hidden">
                      <div
                        class="text-caption col"
                        style="font-size: 0.75em; line-height: 1.5em; min-height: 1.5em"
                      >
                        {{ editLength(item.shelfMemo, 20) }}
                      </div>
                      <div
                        class="text-caption text-grey col"
                        style="font-size: 0.7em; line-height: 1.5em"
                      >
                        {{ editDate(item.savedDate, 10) }}
                      </div>
                    </q-card-section>
                  </div>
                </div>
              </div>

              <!-- 버튼 영역은 클릭 이벤트 전파 방지 -->
              <div @click.stop>
                <q-card-actions class="flex row folder-actions">
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
                    :icon="item.have ? 'visibility' : 'visibility_off'"
                    size="3.4em"
                    @click="() => onOwnClick(item)"
                  />
                </q-card-actions>
              </div>
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
import { editDate, editLength } from './Utils'
import { nextTick, onMounted, reactive, watch } from 'vue'
import ShelfResultNone from './ShelfResultNone.vue'
import { api } from 'src/boot/axios'
import MemberShelfDto from './dto/MemberShelfDto'
import { useRouter } from 'vue-router'

const shelfCache = new Map()
const router = useRouter()

const state = reactive({
  shelves: [],
  loading: true,
  error: null,
})

// 책장 상세로 이동하는 메서드 추가
function goToShelfDetail(shelfId) {
  // 라우터를 사용하여 상세 페이지로 이동
  router.push(`/shelf/${shelfId}`)
}

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
