<template>
  <div class="signature-bar" :style="{ backgroundColor: props.bookshelf.bookshelfColor }"></div>
  <q-card
    class="my-card"
    bordered
    @click="goToShelfDetail(props.bookshelf)"
    style="cursor: pointer"
  >
    <div class="info-row">
      <q-icon
        v-if="props.bookshelf?.isPublic == true || true"
        name="lock_open"
        size="20px"
        class="icon-lock"
      />
      <q-icon v-if="props.bookshelf?.isPublic == false" name="lock" size="20px" class="icon-lock" />
      <div class="info-row">
        <q-icon name="favorite" size="16px" class="icon-heart" />
        <span>128</span>
      </div>
    </div>
    <q-card-section>
      <div class="title">{{ props.bookshelf.bookshelfName }}</div>
    </q-card-section>

    <q-card-section class="book-info">
      <small>최근 추가한 책: </small>
      <q-img
        :src="
          props.bookshelf.recentBookCover ||
          'https://image.aladin.co.kr/product/30769/24/cover200/8937473402_1.jpg'
        "
        alt="The Psychology of Money"
        style="width: 8em; height: 11em; border-radius: 4px"
      />
      <div class="recently-added"></div>
    </q-card-section>

    <q-card-actions class="footer-info">
      <div>Total Books: {{ props.bookshelf.bookshelfBookCount || 0 }}</div>
      <div>Created: {{ editDate(props.bookshelf.createdDate, 10) }}</div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { editDate } from './Utils'

const router = useRouter()
const props = defineProps({
  bookshelf: {
    type: Array,
    default: () => [],
    requird: true,
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

// 책장 상세로 이동하는 메서드 추가
function goToShelfDetail(item) {
  const shelfId = item.id
  // 라우터를 사용하여 상세 페이지로 이동
  router.push(`/shelf/${shelfId}`)
}
</script>

<style scoped lang="scss">
.my-card {
  width: 200px;
  border-radius: 12px;
  padding: 8px;
}

.signature-bar {
  height: 6px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  margin-bottom: 8px;
}

.title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  color: #888;
  font-size: 0.8rem;
}

.book-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 0px;
}

.recently-added small {
  color: #999;
  font-size: 0.75rem;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #aaa;
}

.icon-lock {
  color: $light-dark;
}
</style>
