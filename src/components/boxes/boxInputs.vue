<template>
  <div class="sudoker__inputs">
    <div class="sudoker__inputs-box">
      <loading :active="loading" :is-full-page="false"/>
        <box-square v-for="(square, key) in inputs"
                    :key="key"
                    :square="square"
                    :squareKey="key"/>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import boxSquare from './boxSquare'

export default {
  name: 'box-inputs',
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    inputs: {
      type: Object,
      required: true
    }
  },
  components: {
    boxSquare,
    Loading
  }
}
</script>
<style ></style>
