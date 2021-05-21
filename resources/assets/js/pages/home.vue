<template>
  <div id="fullpage">

    <div id="header" class="section" style="min-height: 500px;">
      <slide-header @use-cases="scrollToIndustries"/>
    </div>

    <div id="about" class="section">
      <slide-about />
    </div>

    <div id="pages" class="section">
      <slide-pages />
    </div>

    <div id="advantages" class="section">
      <slide-advantages />
    </div>

    <div id="become-an-advisor" class="section">
      <slide-become-an-advisor />
    </div>

    <div id="how_it_works" class="section">
      <slide-HowItWorks />
    </div>

    <div  id="industries" class="section">
      <slide-industries  ref="slideIndustries" />
    </div>

    <div id="experts" class="section">
      <slide-experts />
    </div>

    <div id="people_talk" class="section">
      <slide-testimonials />
    </div>
  </div>
</template>

<script>
import * as constants from '../constants'

export default {
  metaInfo () {
    return {
      title: '!!BRAND!!',
      meta: [{
        name: 'description',
        content: '!!BRAND CONTENT!!'
      }]
    }
  },
  layout: 'landing_page',
  created () {
    // track Facebook Pixel event
    if (constants.FACEBOOK_PIXEL_ENABLE) {
      fbq('track', 'ViewContent');
    }
  },
  mounted() {
    const {section} = this.$route.params || {};
    switch (section) {
      case 'use-cases': {
        this.scrollToIndustries()
        break;
      }
    }
  },

  methods: {
    scrollToIndustries() {
      const el = this.$refs.slideIndustries.$el;
      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
      }
    }
  }
}
</script>
