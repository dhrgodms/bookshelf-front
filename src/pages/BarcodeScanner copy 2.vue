<template>
  <q-btn color="primary" class="barcode-btn" :disable="isLoading" @click="openScannerModal">
    <q-icon name="qr_code_scanner" left size="sm" />
    바코드 검색
  </q-btn>

  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 350px; max-width: 70vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">바코드 스캐너</div>
        <q-space />
        <div>
          <div id="interactive" class="viewport" v-show="scanning"></div>
          <div v-if="scannedISBN">
            <p>Scanned ISBN: {{ scannedISBN }}</p>
          </div>
        </div>
      </q-card-section>
      <q-card-section> 책 뒤에 있는 바코드를 화면의 80% 크기로 비춰 주세요. </q-card-section>

      <q-card-actions align="right">
        <q-btn v-if="!scanning" label="스캔 시작" color="primary" @click="startScanner" />
        <q-btn v-else label="스캔 중지" color="negative" @click="stopScanner" />
        <q-btn
          v-if="scannedISBN"
          label="확인"
          color="positive"
          v-close-popup
          @click="confirmScan"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import Quagga from 'quagga'
import { api } from 'src/boot/axios'

export default {
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showModal: false,
      scanning: false,
      scannedISBN: null,
    }
  },
  methods: {
    async fetchBookInfo(isbn) {
      if (!isbn) return

      this.loading = true
      this.bookInfo = null

      try {
        const response = await api.get('/api/v1/aladin/search/book', {
          params: { isbn: isbn },
        })

        this.bookInfo = response.data
        console.log('책 정보 가져옴:', this.bookInfo)
      } catch (error) {
        console.error('책 정보 가져오기 실패:', error)
        // 에러 처리 (예: 토스트 메시지 표시)
      } finally {
        this.loading = false
      }
    },
    openScannerModal() {
      this.showModal = true
      this.scannedISBN = null
    },
    startScanner() {
      this.scanning = true
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#interactive'), // Target element for the video stream
            constraints: {
              facingMode: 'environment', // Use the back camera
            },
          },
          decoder: {
            readers: ['ean_reader'], // Specify EAN reader for ISBNs
          },
        },
        (err) => {
          if (err) {
            console.error(err)
            return
          }
          Quagga.start()
        },
      )

      Quagga.onDetected((data) => {
        if (data && data.codeResult) {
          this.scannedISBN = data.codeResult.code
          this.stopScanner() // Stop scanning after a successful detection
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
    confirmScan() {
      // 스캔된 ISBN으로 할 작업 (예: 부모 컴포넌트에 이벤트 전달)
      this.$emit('isbn-scanned', this.scannedISBN)
      this.showModal = false
    },
  },
  beforeUnmount() {
    this.stopScanner() // Ensure scanner is stopped when component is destroyed
  },
}
</script>

<style scoped>
/* .viewport {
  width: 100%;
  height: 300px;
  background-color: black;
} */
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
</style>
