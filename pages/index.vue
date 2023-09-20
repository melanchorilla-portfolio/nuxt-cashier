<template>
  <v-row>
    <v-col cols="8" class="frame-content">
      <Product />
    </v-col>
    <v-col cols="4" class="frame-content white">
      <Order />
    </v-col>
  </v-row>
</template>

<script>
export default({
  middleware: ['authenticated'],
  head: {
    title: 'App'
  }
})
</script>