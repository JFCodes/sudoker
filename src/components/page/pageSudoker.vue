<template>
  <div class="sudoker">
    <box-inputs :inputs="inputs" />
    <box-file />
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
      inputs: Solver.getInputs()
    }
  },
  created () {
    // Test solution
  },
  components: {
    boxInputs,
    boxFile,
    menuSolver
  }
}
</script>
<style ></style>
