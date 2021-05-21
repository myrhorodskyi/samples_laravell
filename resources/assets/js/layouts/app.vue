<template>
  <div class="wrapper" :class="showHeaderBg ? 'show-header-bg' : ''">
    <primary-header/>
    <div class="content-wrap">
      <child/>
    </div>
    <primary-footer class="footer" />
  </div>
</template>

<script>
export default {
  computed: {
    showHeaderBg() {
      return this.$route.name === 'landing';
    }
  }
}
</script>
