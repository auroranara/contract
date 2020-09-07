<template>
  <keep-alive :include="cachedViews">
    <RouterView :key="key" />
  </keep-alive>
</template>

<script>
  export default {
    name: 'parent',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.path
      }
    },
  }
</script>
