<template>
  <div class="q-pa-md items-start q-gutter-md">
    <div v-if="groupedItems.length > 0" class="row justify-center">
      <q-list>
        <div
          v-for="(row, rowIndex) in groupedItems"
          :key="rowIndex"
          class="row q-gutter-xs no-wrap"
          style="height: 28em"
        >
          <q-card
            v-for="item in row"
            :key="item.id"
            class="my-card q-my-sm q-pa-md col-3 column"
            flat
            bordered
            style="min-width: 13.5em"
          >
            <div class="flex column" style="min-height: 27.5em">
              <div class="col-6" style="display: grid; justify-items: center">
                <div class="flex column">
                  <!-- <div v-if="item.like"> -->
                  <q-badge v-if="item.like" color="pink-8" style="top: 1.5em; z-index: 1" floating>
                    읽고싶은
                  </q-badge>
                  <!-- </div> -->
                  <q-badge v-if="item.have" color="primary" floating> 소장중 </q-badge>
                </div>
                <q-img :src="item.cover" width="80%" />
              </div>

              <div class="col-6">
                <q-card-section class="column" style="padding: 0; overflow: hidden">
                  <div
                    class="text-overline text-orange-9 q-my-sm col-6"
                    style="font-size: x-small; line-height: normal; min-height: 2.5em"
                  >
                    {{ item.categoryName }}
                  </div>
                  <div class="text-subtitle2 col-6" style="line-height: normal; min-height: 2.5em">
                    {{ editLength(item.title, 27) }}
                  </div>
                </q-card-section>
                <div class="col-3 row">
                  <q-card-section class="col-8" style="padding: 0; overflow: hidden">
                    <div class="text-caption">
                      {{ editLength(item.author, 8) }}
                    </div>
                    <div class="text-caption">{{ editLength(item.publisher, 8) }}</div>
                    <div class="text-caption text-grey">{{ item.pubDate }}</div>
                    <div class="text-caption text-grey">{{ item.isbn13 }}</div>
                  </q-card-section>
                  <q-card-actions vertical class="col-4" style="padding: 0">
                    <!-- <q-btn flat round color="grey" icon="bookmark_border" /> -->
                    <q-btn
                      class="motion-btn"
                      flat
                      padding="none"
                      :color="item.like ? 'accent' : 'grey'"
                      :icon="item.like ? 'favorite' : 'favorite_border'"
                      @click="() => onLikeClick(item)"
                      size="1.4em"
                    />
                    <q-toggle
                      v-model="item.have"
                      icon="shelves"
                      size="lg"
                      @click="() => onOwnClick(item)"
                    />
                  </q-card-actions>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </q-list>
    </div>
    <div v-else-if="props.hasSearched">
      <q-card class="my-card q-my-sm" flat bordered>
        <q-card-section horizontal class="items-center justify-between">
          <div class="text-subtitle1">검색 결과가 없습니다.</div>
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <ResultSkeleton />
    </div>
  </div>
</template>

<script setup>
import ResultSkeleton from './skeleton/ResultSkeleton.vue'
import { computed, reactive } from 'vue'
import axios from 'axios'
import { editLength } from './Utils'
import MemberBook from './MemberBook'

const makeBook = (untidied) => {
  console.log(untidied)
  return untidied.map((item) => {
    return new MemberBook(
      item.title,
      item.author,
      item.publisher,
      item.cover,
      item.pubDate,
      item.isbn,
      item.seriesInfo?.seriesName,
      item.categoryName,
      item.like,
      item.have,
      item.bookId,
      item.memberbookId,
      item.memberId,
    )
  })
}

const groupedItems = computed(() => {
  return reactive(
    makeBook(props.results).reduce((acc, item, index) => {
      const rowIndex = Math.floor(index / 4)
      if (!acc[rowIndex]) acc[rowIndex] = []
      acc[rowIndex].push(item)
      return acc
    }, []),
  )
})

async function onOwnClick(item) {
  console.log(item)
  const response = await axios.post(
    `${process.env.LOCAL_SPRING_SERVER}/api/memberbook/own-change`,
    {
      memberbookId: item.memberbookId,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
  )
  console.log(response)
}

async function onLikeClick(item) {
  const response = await axios.post(
    `${process.env.LOCAL_SPRING_SERVER}/api/memberbook/like-change`,
    {
      memberbookId: item.memberbookId,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
  )
  console.log(response)
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
