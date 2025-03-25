<template>
  <div class="bg-blue-grey-6 text-white flex" style="width: 100%; justify-content: center">
    <div style="width: 80%">
      <q-toolbar style="min-height: 40px">
        <q-btn flat round dense icon="home" class="q-mr-xs" to="/" />

        <q-space />
        <q-btn flat round dense icon="search" class="q-mr-xs" to="/book/search" />
        <q-btn flat round dense icon="shelves" to="/member/shelf/1" />
        <q-btn flat round dense icon="assignment_ind" to="/member/home" />
      </q-toolbar>

      <q-toolbar inset style="min-height: 25px">
        <q-breadcrumbs active-color="white" style="font-size: 1em">
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Toolbar" />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </div>
</template>
