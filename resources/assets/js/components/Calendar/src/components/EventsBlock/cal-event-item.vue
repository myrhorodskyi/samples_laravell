<template>
  <div class="d-inline-block w-50"/>
</template>
<script>
export default {
  name: 'booking-slot',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showModal: false
    }
  },
  methods: {
    openModal () {
      this.showModal = true
      document.body.classList.add('open-modal')
    },
    closeModal () {
      this.showModal = false
      document.body.classList.add('open-modal')
    }
  }
}
</script>
