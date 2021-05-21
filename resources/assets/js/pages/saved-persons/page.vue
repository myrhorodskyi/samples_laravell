<template>
  <div class="l_saved_persons layout">
    <section class="page_header">
      <div class="container p-0">
        <div class="row m-0">
          <div class="col-md-12 p-0">
            Saved persons
          </div>
        </div>
      </div>
    </section>
    <div class="container content">
      <div class="row m-0">
        <div class="card card-wrap">
          <div class="card-block"  v-if="savedPersons.length > 0">
            <person-preview
              class="saved_person_preview"
              :user="user"
              :key="user.id"
              v-for="(user, index) in savedPersons"
              v-bind:data-index="index"
              @removeFromSaved="handleRemoveFromSaved(index)"
            >
            </person-preview>
          </div>
          <div class="card-block" v-else>
            <div class="row">
              <div class="sub-title col-md-12 text-center">You have no saved persons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import truncate from 'vue-truncate-collapsed'

export default {
  components: {
    'truncate':truncate
  },
  created() {
    this.fetchSavedPersons();
  },
  methods: {
    ...mapActions(['fetchSavedPersons', 'removePerson']),

    handleRemoveFromSaved(index) {
      this.removePerson(this.savedPersons[index].id).then(()=>{
        this.savedPersons.splice(index, 1);
      });
    },
  },
  computed: {
    ...mapGetters({
      savedPersons: 'savedPersons'
    }),
  },

}
</script>
