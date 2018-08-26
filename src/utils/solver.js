class Solver {
  constructor () {
    this.inputs = this._generateInputs()
    this.matrix = {}
    this.isSolved = false
    this.invalid = false
  }

  _generateInputs () {
    let inputs = {}
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        let square = {}

        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            square[`${inputLine}-${inputColumn}`] = {
              value: null,
              userInput: false
            }
          }
        }

        inputs[`${squareLine}-${squareColumn}`] = square
      }
    }
    return inputs
  }
  _generateMatrix () {
    this.matrix = {}
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        let square = {}

        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            square[`${inputLine}-${inputColumn}`] = {
              1: true,
              2: true,
              3: true,
              4: true,
              5: true,
              6: true,
              7: true,
              8: true,
              9: true
            }
          }
        }

        this.matrix[`${squareLine}-${squareColumn}`] = square
      }
    }
  }
  _syncInputsWithMatrix () {
    let markAValue = (matrix, value) => {
      Object.keys(matrix).map(key => {
        matrix[key] = Number(key) === value
      })
    }

    // For each user input, mark matrix
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        let squareKey = `${squareLine}-${squareColumn}`

        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            let inputKey = `${inputLine}-${inputColumn}`

            // If the user has inputed a number, mark in the matrix as solved
            let inputValue = this.inputs[squareKey][inputKey].value
            if (inputValue) {
              markAValue(this.matrix[squareKey][inputKey], inputValue)
            }
          }
        }
      }
    }
  }
  _propagateSyncedInputs () {
    let getSolution = (matrix) => {
      let solution = null
      let foundOne = false
      for (let i = 1; i <= 9; i++) {
        if (matrix[i]) {
          solution = i
          if (foundOne) return false
          foundOne = true
        }
      }
      return solution || false
    }

    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        let squareKey = `${squareLine}-${squareColumn}`

        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            let inputKey = `${inputLine}-${inputColumn}`
            let solution = getSolution(this.matrix[squareKey][inputKey])
            if (solution) {
              this._propagateMarker({
                squareLine: squareLine,
                squareColumn: squareColumn,
                inputLine: inputLine,
                inputColumn: inputColumn,
                value: solution
              })
            }
          }
        }
      }
    }
  }
  _propagateMarker ({squareLine, squareColumn, inputLine, inputColumn, value}) {
    // Propagate for all markers inside the same square quareLine-squareColumn
    // Expect its on input square
    for (let iLine = 1; iLine <= 3; iLine++) {
      for (let iColumn = 1; iColumn <= 3; iColumn++) {
        if (iLine !== inputLine || iColumn !== inputColumn) {
          this.matrix[`${squareLine}-${squareColumn}`][`${iLine}-${iColumn}`][value] = false
        }
      }
    }
    // Propagate horizontally on the same line
    for (let sColumn = 1; sColumn <= 3; sColumn++) {
      for (let iColumn = 1; iColumn <= 3; iColumn++) {
        if (sColumn !== squareColumn || iColumn !== inputColumn) {
          this.matrix[`${squareLine}-${sColumn}`][`${inputLine}-${iColumn}`][value] = false
        }
      }
    }
    // Propagate vertically on the same column
    for (let sLine = 1; sLine <= 3; sLine++) {
      for (let iLine = 1; iLine <= 3; iLine++) {
        if (sLine !== squareLine || iLine !== inputLine) {
          this.matrix[`${sLine}-${squareColumn}`][`${iLine}-${inputColumn}`][value] = false
        }
      }
    }
  }

  getInputs () {
    return this.inputs
  }
  insertUserInput ({squareKey, inputKey, value}) {
    console.log({squareKey, inputKey, value})
    this.inputs[squareKey][inputKey].value = value
    this.inputs[squareKey][inputKey].userInput = true
  }
  insertSolverInput ({squareKey, inputKey, value}) {
    this.inputs[squareKey][inputKey].value = value
  }

  // Solve functions
  solve () {
    // Generate solver matrix
    this._generateMatrix()

    let iterate = () => {
      this._syncInputsWithMatrix()
      this._propagateSyncedInputs()
      let atLeastOnSolutionFound = false
      // Every time a solution is found, propagate markers with this._propagateMarker()
      // Solve for all squares
      atLeastOnSolutionFound = this.solveSquares()
      // Solve for all lines
      atLeastOnSolutionFound = this.solveLines() || atLeastOnSolutionFound
      // Solve for all columns
      atLeastOnSolutionFound = this.solveColumns() || atLeastOnSolutionFound

      if (atLeastOnSolutionFound) iterate()
    }
    iterate()
  }
  solveSquares () {
    let foundOne = false
    // return true if at least one solution was found
    // Find one or more positions in a square in which only one number is a valid solution
    // For each solution found, propagate its markers
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        let possibleSolutionsFor = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
        // Iterate input squares
        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            // Iterate values and push solutions
            for (let value = 1; value <= 9; value++) {
              if (this.matrix[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`][value]) {
                possibleSolutionsFor[value].push({
                  square: `${squareLine}-${squareColumn}`,
                  input: `${inputLine}-${inputColumn}`
                })
              }
            }
          }
        }
        // Ignore already solved solutions
        let foundASolution = this.findSolutions(possibleSolutionsFor)
        if (foundASolution) foundOne = true
      }
    }
    return foundOne
  }
  solveLines () {
    let foundOne = false
    for (let line = 1; line <= 9; line++) {
      let possibleSolutionsFor = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
      for (let column = 1; column <= 9; column++) {
        // translate lines 1-9 and column 1-9 to the correspondent square and input coordinates
        let squareLine = Math.ceil(line / 3)
        let squareColumn = Math.ceil(column / 3)
        let inputLine = line % 3 === 0 ? 3 : line % 3
        let inputColumn = column % 3 === 0 ? 3 : column % 3
        for (let value = 1; value <= 9; value++) {
          if (this.matrix[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`][value]) {
            possibleSolutionsFor[value].push({
              square: `${squareLine}-${squareColumn}`,
              input: `${inputLine}-${inputColumn}`
            })
          }
        }
      }
      let foundASolution = this.findSolutions(possibleSolutionsFor)
      if (foundASolution) foundOne = true
    }
    // return true if at least one solution was found
    // Find one or more positions in a line in which only one number is a valid solution
    // For each solution found, propagate its markers
    return foundOne
  }
  solveColumns () {
    let foundOne = false
    // return true if at least one solution was found
    // Find one or more positions in a column in which only one number is a valid solution
    // For each solution found, propagate its markers
    for (let column = 1; column <= 9; column++) {
      let possibleSolutionsFor = {1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []}
      for (let line = 1; line <= 9; line++) {
        // translate lines 1-9 and column 1-9 to the correspondent square and input coordinates
        let squareLine = Math.ceil(line / 3)
        let squareColumn = Math.ceil(column / 3)
        let inputLine = line % 3 === 0 ? 3 : line % 3
        let inputColumn = column % 3 === 0 ? 3 : column % 3
        for (let value = 1; value <= 9; value++) {
          if (this.matrix[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`][value]) {
            possibleSolutionsFor[value].push({
              square: `${squareLine}-${squareColumn}`,
              input: `${inputLine}-${inputColumn}`
            })
          }
        }
      }
      let foundASolution = this.findSolutions(possibleSolutionsFor)
      if (foundASolution) foundOne = true
    }
    return foundOne
  }
  findSolutions (possibleSolutions) {
    let foundOne = false
    for (let value = 1; value <= 9; value++) {
      if (possibleSolutions[value].length === 1) {
        let solution = possibleSolutions[value][0]
        if (!this.inputs[solution.square][solution.input].value) {
          foundOne = true
          this.insertSolverInput({squareKey: solution.square, inputKey: solution.input, value})
          let squareLine = solution.square.split('-')[0]
          let squareColumn = solution.square.split('-')[1]
          let inputLine = solution.input.split('-')[0]
          let inputColumn = solution.input.split('-')[1]
          this._propagateMarker({squareLine, squareColumn, inputLine, inputColumn, value})
        }
      }
    }
    return foundOne
  }

  // Clear solver inputs
  clearSolver () {
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            if (!this.inputs[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`].userInput) {
              this.inputs[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`].value = null
            }
          }
        }
      }
    }
  }
  clearAll () {
    for (let squareLine = 1; squareLine <= 3; squareLine++) {
      for (let squareColumn = 1; squareColumn <= 3; squareColumn++) {
        for (let inputLine = 1; inputLine <= 3; inputLine++) {
          for (let inputColumn = 1; inputColumn <= 3; inputColumn++) {
            this.inputs[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`].value = null
            this.inputs[`${squareLine}-${squareColumn}`][`${inputLine}-${inputColumn}`].userInput = false
          }
        }
      }
    }
  }
}

export default new Solver()
