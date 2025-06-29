<template>
  <div class="book-form">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-img
          :src="book.coverImageUrl || 'https://placeholder.com/150'"
          style="height: 200px; max-width: 150px"
          fit="contain"
          class="rounded-borders"
        />
      </div>

      <div class="col-12 col-md-8">
        <q-input v-model="editedBook.title" label="제목" outlined dense />
        <q-input v-model="editedBook.author" label="저자" outlined dense class="q-mt-sm" />
        <q-input v-model="editedBook.publisher" label="출판사" outlined dense class="q-mt-sm" />
        <q-input v-model="editedBook.isbn" label="ISBN" outlined dense class="q-mt-sm" readonly />
        <q-input v-model="editedBook.publishDate" label="출판일" outlined dense class="q-mt-sm" />

        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-md-6">
            <q-select
              v-model="editedBook.status"
              :options="statusOptions"
              label="상태"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="editedBook.location" label="위치" outlined dense />
          </div>
        </div>
      </div>

      <div class="col-12">
        <q-input v-model="editedBook.description" label="설명" type="textarea" outlined autogrow />
      </div>

      <div class="col-12">
        <q-input v-model="editedBook.purchaseInfo" label="구매 정보" outlined dense />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'BookForm',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },

  emits: ['save'],

  setup(props, { emit }) {
    const editedBook = ref({ ...props.book })

    const statusOptions = ['새 책', '좋음', '보통', '낡음', '파손', '사인본', '밑줄 있음']

    watch(
      () => props.book,
      (newBook) => {
        editedBook.value = { ...newBook }
      },
    )

    const save = () => {
      emit('save', editedBook.value)
    }

    return {
      editedBook,
      statusOptions,
      save,
    }
  },
}
</script>
