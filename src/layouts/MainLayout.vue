<template>
  <q-layout view="lHh Lpr lFf" class="container">
    <HeaderVue />
    <!-- <q-btn to="/start/pick-quasar-flavour" label="To Docs index" outline color="purple" />
    <q-btn
      to="/start/pick-quasar-flavour"
      label="To Docs index in 2s"
      @click="linkClick"
      glossy
      color="purple"
    /> -->

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer> -->

    <q-page-container class="component">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import HeaderVue from 'src/components/HeaderVue.vue'
</script>

<style>
.container {
  display: grid;
  place-items: center;
}
.component {
  width: 100%;
  min-width: 320px;
  max-width: 800px;
}
</style>
