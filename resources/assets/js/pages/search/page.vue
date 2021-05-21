<template>
  <div class="l_search_page">
    <section class="page_header">
      <div class="container">
        <div class="row align-items-start">
          <search-panel
            @loading="handleLoading"
            show-preload="showPreload"/>
        </div>
      </div>
    </section>
    <div class="container">
      <preload v-if="showPreload"></preload>
      <search-result/>
    </div>

    <div class="pre-footer">
      <div class="text-center">
        <button
          v-if="currentPageAdvisors.length > 6"
          class="btn out-btn-primary" type="button"
          @click="emitSearch">Load More Advisors
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../app'
import { mapGetters } from 'vuex'

export default {
  name: 'search-page',
  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters(['currentPageAdvisors']),
    showPreload () {
      return this.loading
    }
  },
  methods: {
    emitSearch () {
      EventBus.$emit('searchEvent')
    },
    handleLoading (val) {
      this.loading = val
    }
  }
}
</script>
