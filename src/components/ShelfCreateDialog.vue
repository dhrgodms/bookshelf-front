<!-- 새 책장 만들기 다이얼로그 -->

<template>
  <q-dialog v-model="newShelfDialogOpen" persistent transition-show="fade" transition-hide="fade">
    <q-card class="new-shelf-dialog" v-model="newShelf">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-primary">새 책장 만들기</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-form @submit="createNewShelf" class="q-pa-md">
        <q-card-section class="q-pt-none">
          <q-input
            v-model="newShelf.name"
            label="책장 이름"
            :rules="[(val) => !!val || '책장 이름을 입력해주세요']"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model="newShelf.description"
            label="책장 설명"
            type="textarea"
            outlined
            dense
            class="q-mb-md"
          />

          <q-toggle v-model="newShelf.isPublic" label="공개 여부" class="q-mb-md" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="취소" color="grey-7" flat v-close-popup />
          <q-btn label="저장" type="submit" color="primary" :loading="isCreatingShelf" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

const newShelfDialogOpen = ref(false)
const isCreatingShelf = ref(false)
const shelfDialogOpen = ref(false)
// 새 책장 정보
const newShelf = ref({
  name: '',
  description: '',
  isPublic: true,
})
const $q = useQuasar()

// Props 정의
const props = defineProps({
  book: {
    type: Object,
    required: true,
  },
})

// 새 책장 생성
async function createNewShelf() {
  if (!newShelf.value.name) return

  isCreatingShelf.value = true

  try {
    const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/shelves`, {
      shelfDto: {
        shelfName: newShelf.value.name,
        shelfMemo: newShelf.value.description,
        isPublic: newShelf.value.isPublic,
      },
    })

    $q.notify({
      color: 'positive',
      message: '책장이 성공적으로 생성되었습니다!',
      icon: 'check_circle',
    })

    // 새로 생성된 책장에 책 추가
    if (response.data && response.data.id) {
      await addBookToShelf(props.book, response.data.id)
    }

    // 다이얼로그 닫기
    newShelfDialogOpen.value = false
  } catch (error) {
    console.error('책장 생성 실패:', error)
    $q.notify({
      color: 'negative',
      message: '책장 생성에 실패했습니다.',
      icon: 'error',
    })
  } finally {
    isCreatingShelf.value = false
  }
}
// 책을 책장에 추가
async function addBookToShelf(book, shelfId) {
  try {
    const access = localStorage.getItem('access')
    await api.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/shelfbooks`,
      {
        shelfId: shelfId,
        bookDto: book,
      },
      {
        headers: { access: access },
      },
    )

    $q.notify({
      color: 'positive',
      message: '책이 책장에 추가되었습니다!',
      icon: 'check_circle',
    })

    // 책장 선택 다이얼로그 닫기
    shelfDialogOpen.value = false
  } catch (error) {
    console.error('책 추가 실패:', error)
    $q.notify({
      color: 'negative',
      message: '책을 책장에 추가하는데 실패했습니다.',
      icon: 'error',
    })
  }
}
</script>
<style>
/* 새 책장 다이얼로그 스타일 */
.new-shelf-dialog {
  border-radius: 12px;
  max-width: 400px;
  width: 90vw;
}
</style>
