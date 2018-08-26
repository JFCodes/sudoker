<template>
  <div class="sudoker">
    <box-inputs :inputs="inputs" :loading="loadingFromFile !== 0"/>
    <box-file @setLoadingState="setLoadingState"/>
    <menu-solver />
  </div>
</template>

<script>
import boxInputs from '../boxes/boxInputs'
import boxFile from '../boxes/boxFile'
import menuSolver from '../menus/menuSolver'
import Solver from '../../utils/solver'

export default {
  name: 'page-sudoker',
  data () {
    return {
      loadingFromFile: 0,
      inputs: Solver.getInputs()
    }
  },
  created () {
    // Test solution
  },
  methods: {
    setLoadingState (value) {
      this.loadingFromFile += value
    }
  },
  components: {
    boxInputs,
    boxFile,
    menuSolver
  }
}
</script>
<style ></style>
