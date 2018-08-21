<template>
  <div class="sudoker__inputs">
    <div class="sudoker__inputs-box">
        <box-square v-for="(square, key) in inputs"
                    :key="key"
                    :square="square"
                    :squareKey="key"/>
    </div>
  </div>
</template>

<script>
import boxSquare from './boxSquare'

export default {
  name: 'box-inputs',
  props: {
    inputs: {
      type: Object,
      required: true
    }
  },
  components: {
    boxSquare
  }
}
</script>
<style ></style>
