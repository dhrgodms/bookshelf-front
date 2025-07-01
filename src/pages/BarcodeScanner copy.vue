<template>
  <div>
    <button @click="startScanner" v-if="!scanning">Start Scanner</button>
    <button @click="stopScanner" v-else>Stop Scanner</button>
    <div id="interactive" class="viewport" v-show="scanning"></div>
    <div v-if="scannedISBN">
      <p>Scanned ISBN: {{ scannedISBN }}</p>
    </div>
  </div>
</template>

<script>
import Quagga from 'quagga'

export default {
  data() {
    return {
      scanning: false,
      scannedISBN: null,
    }
  },
  methods: {
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
        }
      })
    },
    stopScanner() {
      this.scanning = false
      Quagga.stop()
    },
  },
  beforeUnmount() {
    this.stopScanner() // Ensure scanner is stopped when component is destroyed
  },
}
</script>

<style scoped>
.viewport {
  width: 100%;
  height: 300px; /* Adjust as needed */
  background-color: black;
}
</style>
