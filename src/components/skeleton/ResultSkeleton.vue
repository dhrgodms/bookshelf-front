<template>
  <div class="card-container row customframe" style="justify-content: center">
    <div class="row justify-center">
      <q-list class="row" style="gap: 0.4em; justify-content: center">
        <q-card
          v-for="item in 40"
          :key="item.id"
          class="my-card col-12 col-sm-6 col-md-3"
          flat
          bordered
          style="min-width: 11em; max-width: 13.5em; width: 25%"
        >
          <div class="flex column" style="min-height: 5em; margin: 0.5em">
            <div class="flex row" style="min-height: 10em; align-items: flex-start">
              <div class="flex column col-4" style="justify-items: center">
                <q-skeleton
                  type="rect"
                  class="flex column col-4"
                  style="justify-items: center; min-height: 5em"
                  width="3.8em"
                >
                </q-skeleton>
              </div>
              <div class="col-1"></div>
              <div class="col-7 column">
                <q-card-section style="padding: 0; overflow: hidden">
                  <q-skeleton
                    class="text-overline text-orange-9 q-my-sm col-7"
                    style="font-size: 0.6em; line-height: normal; min-height: 2em"
                  ></q-skeleton>
                  <q-skeleton
                    class="text-subtitle2 col-5"
                    style="line-height: normal; min-height: 2.5em; font-size: 0.85em"
                  ></q-skeleton>
                </q-card-section>
                <div class="col-6 column">
                  <q-card-section style="padding: 0; overflow: hidden">
                    <q-skeleton
                      type="text"
                      class="text-caption col"
                      style="font-size: 0.75em; line-height: 1.5em; min-height: 1.5em"
                    ></q-skeleton>
                    <q-skeleton
                      type="text"
                      class="text-caption col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    ></q-skeleton>
                    <q-skeleton
                      type="text"
                      class="text-caption text-grey col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    ></q-skeleton>
                    <q-skeleton
                      type="text"
                      class="text-caption text-grey col"
                      style="font-size: 0.7em; line-height: 1.5em"
                    ></q-skeleton>
                  </q-card-section>
                </div>
              </div>
            </div>
          </div>
          <div>
            <q-card-actions class="flex row" style="justify-content: space-evenly; padding: 0">
              <q-skeleton type="Qbtn" class="motion-btn" flat padding="none" size="1.2em" />
              <q-skeleton type="QToggle" icon="shelves" width="3.4em" height="2em" />
              <q-skeleton
                type="Qbtn"
                class="motion-btn"
                flat
                padding="0.1em"
                :color="'grey'"
                :icon="'info'"
                size="1em"
              />
            </q-card-actions>
          </div>
        </q-card>
      </q-list>
    </div>
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
