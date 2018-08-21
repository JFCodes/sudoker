<template>
  <div class="menu menu__solver">
    <button @click="solve">Solve</button>
    <button @click="clearSolver">Clear solver</button>
    <button @click="clearAll">Clear all</button>
  </div>
</template>

<script>
import Solver from '../../utils/solver'

export default {
  name: 'menu-solver',
  methods: {
    solve () {
      Solver.solve()
    },
    clearSolver () {
      Solver.clearSolver()
    },
    clearAll () {
      Solver.clearAll()
    }
  }
}
</script>
<style ></style>
