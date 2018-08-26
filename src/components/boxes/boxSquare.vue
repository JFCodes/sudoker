<template>
  <div class="sudoker__square">
    <input type="text"
           maxlength="1"
           v-for="(input, key) in square"
           :class="{'userInput': input.userInput}"
           :key="key"
           :value="input.value"
           @input="insertUserInput($event.target, key)"
    />
  </div>
</template>

<script>
import Solver from '../../utils/solver'

export default {
  name: 'box-square',
  props: {
    squareKey: {
      type: String,
      required: true
    },
    square: {
      type: Object,
      required: true
    }
  },
  methods: {
    insertUserInput (element, inputKey) {
      let newValue = Number(element.value) || null
      element.value = newValue || ''
      console.log(this.squareKey)
      console.log(inputKey)
      console.log(newValue)
      Solver.insertUserInput({
        squareKey: this.squareKey,
        inputKey: inputKey,
        value: newValue
      })
    }
  }
}
</script>
<style ></style>
