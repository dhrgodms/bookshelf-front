<template>
  <q-page class="flex column items-center q-pa-md">
    <!-- ✨ 새 책장 추가 타이틀 섹션 ✨ -->
    <div class="q-mt-xl q-mb-lg text-h4 text-weight-bold text-center add-shelf-title">
      새 책장 만들기
    </div>

    <!-- 책장 추가 폼을 담을 카드 -->
    <q-card class="shelf-form-card q-pa-lg q-mt-md">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          v-model="shelfName"
          label="책장 이름"
          :rules="[(val) => !!val || '책장 이름을 입력해주세요']"
          outlined
          dense
          color="primary"
        />

        <q-input
          v-model="shelfMemo"
          label="책장 설명"
          type="textarea"
          outlined
          rows="3"
          color="primary"
        />

        <q-toggle v-model="isPublic" label="공개 여부" class="q-mt-md" color="primary" />

        <q-card-actions align="right" class="q-pt-md">
          <q-btn label="취소" type="reset" color="grey-7" flat @click="goBack" />
          <q-btn label="저장" type="submit" color="primary" :loading="submitting" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 폼 데이터
const shelfName = ref('')
const shelfMemo = ref('')
const isPublic = ref(true)
const submitting = ref(false)

// 폼 제출 처리
async function onSubmit() {
  submitting.value = true

  try {
    const response = await api.post(`${process.env.SPRING_SERVER}/api/v1/shelves`, {
      shelfDto: {
        shelfName: shelfName.value,
        shelfMemo: shelfMemo.value,
        isPublic: isPublic.value,
      },
    })
    console.log(response.data)

    $q.notify({
      color: 'positive',
      message: '책장이 성공적으로 추가되었습니다!',
      icon: 'check_circle',
    })

    // 책장 목록 페이지로 이동
    router.push('/member/shelf')
  } catch (error) {
    console.error('책장 추가 중 오류 발생:', error)
    $q.notify({
      color: 'negative',
      message: '책장 추가에 실패했습니다. 다시 시도해주세요.',
      icon: 'error',
    })
  } finally {
    submitting.value = false
  }
}

// 뒤로가기 함수
function goBack() {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.add-shelf-title {
  color: #424242;
  letter-spacing: -0.5px;
  padding-bottom: 5px;
  border-bottom: 2px solid #897e1e; // 기존 타이틀 밑줄 색상 유지
  display: inline-block;
  margin-bottom: 40px; // 타이틀과 폼 사이 간격 좀 더 확보
}

.shelf-form-card {
  width: 100%;
  max-width: 550px; // 폼 너비 살짝 조정해서 안정감 있게
  border-radius: 12px; // 모서리를 더 둥글게!
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); // 그림자를 더 부드럽고 은은하게
  background-color: #ffffff;
}
</style>
