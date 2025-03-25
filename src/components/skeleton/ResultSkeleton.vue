<template>
  <div class="row justify-center">
    <q-list>
      <div
        v-for="(row, rowIndex) in 6"
        :key="rowIndex"
        class="row q-gutter-xs no-wrap"
        style="height: 400px"
      >
        <q-card
          v-for="item in 4"
          :key="item.id"
          class="my-card q-my-sm q-pa-md col-3 column"
          flat
          bordered
          style="min-width: 190px"
        >
          <div class="col column">
            <div class="col-6" style="display: grid; justify-items: center">
              <q-skeleton rect width="80%" />
            </div>

            <div class="flex col-6 q-pa-md">
              <q-card-section class="col-2" style="padding: 0">
                <q-skeleton type="rect" />
                <q-skeleton type="text" />
                <div class="flex row col-4">
                  <div>
                    <q-skeleton type="text" width="100px" />
                    <q-skeleton type="text" />
                    <q-skeleton type="text" />
                    <q-skeleton type="text" />
                  </div>

                  <div class="col flex">
                    <q-card-actions class="content-end" style="justify-content: flex-end">
                      <!-- <q-btn flat round color="grey" icon="bookmark_border" /> -->
                      <q-skeleton type="circle" />
                      <q-skeleton type="circle" />
                      <q-space />
                    </q-card-actions>
                  </div>
                </div>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </div>
    </q-list>
  </div>
</template>

<script>
export default {
  // props: {
  //   isLoading: {
  //     type: Boolean,
  //     default: true,
  //   },
  // },
}
</script>
