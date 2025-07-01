<template>
  <q-btn color="primary" class="barcode-btn" :disable="isLoading" @click="openScannerModal">
    <q-icon name="qr_code_scanner" left size="sm" />
    바코드 검색
  </q-btn>

  <!-- 스캐너 모달 -->
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 350px; max-width: 70vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">바코드 스캐너</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="stopScanner" />
      </q-card-section>

      <q-card-section>
        <div id="interactive" class="viewport" v-show="scanning"></div>
        <div v-if="scannedISBN" class="text-center q-mt-md">
          <p>스캔된 ISBN: {{ scannedISBN }}</p>
        </div>
        <div v-if="!scanning && !scannedISBN" class="text-center q-my-md">
          책 뒤에 있는 바코드를 화면의 80% 크기로 비춰 주세요.
        </div>

        <!-- 검색 결과 로딩 중 표시 -->
        <div v-if="isLoading" class="text-center q-my-md">
          <q-spinner color="primary" size="3em" />
          <p class="q-mt-sm">책 정보를 검색하는 중...</p>
        </div>

        <!-- 검색 결과 표시 -->
        <div v-if="bookInfo && !isLoading" class="q-mt-md flex flex-center">
          <BookCard :book="bookInfo[0]" @like="onLikeClick" @have="onOwnClick" />
        </div>

        <div
          v-if="scannedISBN && !bookInfo && !isLoading && !scanning && searchAttempted"
          class="text-center q-my-md text-negative"
        >
          <p>앗, 스캔된 ISBN으로 책을 찾을 수 없어요. ㅠㅠ</p>
          <p>다른 바코드를 스캔하거나 직접 검색해 보세요!</p>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-if="!scanning && !scannedISBN"
          label="스캔 시작"
          color="primary"
          @click="startScanner"
        />
        <q-btn v-if="scanning" label="스캔 중지" color="negative" @click="stopScanner" />
        <q-btn
          v-if="scannedISBN && !isLoading && !bookInfo"
          label="검색"
          color="secondary"
          @click="searchBook"
        />
        <q-btn v-if="bookInfo" label="확인" color="positive" v-close-popup @click="confirmSearch" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Quagga from 'quagga'
import { api } from 'src/boot/axios'
import BookCard from 'src/components/BookCard.vue'

export default {
  components: {
    BookCard,
  },
  props: {
    modelValue: String,
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'book-selected'],
  data() {
    return {
      showModal: false,
      scanning: false,
      scannedISBN: null,
      bookInfo: null,
    }
  },
  watch: {
    // modelValue가 변경되면 scannedISBN도 업데이트
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.scannedISBN = newValue
        }
      },
    },
  },
  methods: {
    openScannerModal() {
      this.showModal = true
      this.scannedISBN = null
      this.bookInfo = null
    },
    startScanner() {
      this.scanning = true
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#interactive'),
            constraints: {
              facingMode: 'environment', // 후면 카메라 사용
              width: { min: 640 },
              height: { min: 480 },
            },
          },
          locator: {
            patchSize: 'medium',
            halfSample: true,
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: ['ean_reader'], // ISBN용 EAN 리더
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error('스캐너 초기화 오류:', err)
            this.scanning = false
            return
          }
          Quagga.start()
        },
      )

      Quagga.onDetected((data) => {
        if (data && data.codeResult) {
          this.scannedISBN = data.codeResult.code
          this.stopScanner() // 성공적으로 스캔 후 자동으로 스캐너 중지
          this.$emit('update:modelValue', this.scannedISBN)
        }
      })
    },
    stopScanner() {
      if (this.scanning) {
        this.scanning = false
        Quagga.stop()
      }
    },
    async searchBook() {
      if (!this.scannedISBN) return

      this.bookInfo = null

      try {
        // ISBN으로 책 정보 검색 API 호출
        const response = await api.get('/api/v1/aladin/search/isbn', {
          params: { isbn: this.scannedISBN },
        })

        if (response.data) {
          this.bookInfo = response.data
          console.log('책 정보 가져옴:', this.bookInfo)
        } else {
          // 검색 결과가 없을 경우
          console.warn('검색 결과가 없습니다')
          // 여기에 검색 결과 없음 알림 추가 가능
        }
      } catch (error) {
        console.error('책 정보 가져오기 실패:', error)
        // 에러 처리 (예: 토스트 메시지 표시)
      }
    },
    confirmSearch() {
      // 선택한 책 정보를 부모 컴포넌트로 전달
      if (this.bookInfo) {
        this.$emit('book-selected', this.bookInfo)
      }
      this.showModal = false
    },
  },
  beforeUnmount() {
    this.stopScanner() // 컴포넌트 제거 시 스캐너 중지
  },
}
</script>

<style scoped>
.viewport {
  width: 100%;
  height: 300px;
  background-color: black;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

/* 스캔 라인 애니메이션 (선택사항) */
.viewport::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #ff0000;
  top: 50%;
  left: 0;
  box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.5);
  animation: scan 2s infinite linear;
}

@keyframes scan {
  0% {
    top: 20%;
  }
  50% {
    top: 80%;
  }
  100% {
    top: 20%;
  }
}

.barcode-btn {
  padding: 10px 20px;
  border-radius: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(66, 121, 87, 0.2);
  transition: all 0.3s ease;
  height: 54px;
  white-space: nowrap;
  background-color: #427957;
  margin-bottom: 3em;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(66, 121, 87, 0.3);
  }
}

/* BookCard 스타일링 */
.book-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(66, 121, 87, 0.2);
}

/* 로딩 애니메이션 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
