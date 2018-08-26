<template>
  <div class="sudoker__file">
    <dropzone id="foo" ref="el"
              :options="dropzoneOptions"
              :destroyDropzone="true"
              @vdropzone-file-added="processImage"/>
    <div class="sudoker__file-canvasGrid" v-if="showImagePortions">
      <template v-for="line in [1, 2, 3, 4, 5, 6, 7, 8, 9]">
        <template v-for="column in [1, 2, 3, 4, 5, 6, 7, 8, 9]">
          <canvas :key="line + '-' + column" :ref="line + '-' + column"></canvas>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import {Tesseract} from 'tesseract.ts'
import Solver from '../../utils/solver'
import Dropzone from 'nuxt-dropzone'

export default {
  name: 'box-file',
  data () {
    return {
      showImagePortions: false,
      dropzoneOptions: {
        url: 'http://localhost:8080/#/',
        dictDefaultMessage: 'You can upload a sudoku game from a image file'
      }
    }
  },
  methods: {
    processImage (file) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      let img = new Image()
      img.onload = async () => {
        context.drawImage(img, 0, 0)
        let portionWidth = Math.floor(img.width / 9)
        let portionHeight = Math.floor(img.height / 9)
        console.log(portionWidth, portionHeight)
        for (let line = 1; line <= 9; line++) {
          for (let column = 1; column <= 9; column++) {
            let xPosition = (column - 1) * portionWidth
            let yPosition = (line - 1) * portionHeight
            // For better image crop
            let removeSlice = 10
            let newWidth = portionWidth - removeSlice // crop a inner border
            let newHeight = portionWidth - removeSlice // crop a inner border
            let newXPoristion = xPosition + (removeSlice / 2)
            let newYPoristion = yPosition + (removeSlice / 2)

            let cropedImageBlob = await this.getImagePortion(img, newWidth, newHeight, newXPoristion, newYPoristion)
            let cropedImageFile = new File([cropedImageBlob], 'cropedImageFile')
            let canvasElement = this.$refs[line + '-' + column]
            if (this.showImagePortions) await this.drawPortion(canvasElement, cropedImageFile)
            await this.getNumberFromImage(cropedImageBlob, line, column)
          }
        }
      }
      console.log(file)
      img.src = URL.createObjectURL(file)
    },
    async drawPortion (canvas, file) {
      let context = canvas[0].getContext('2d')
      let img = new Image()
      img.onload = async () => {
        await context.drawImage(img, 0, 0)
      }
      img.src = URL.createObjectURL(file)
    },
    async getImagePortion (imgObj, newWidth, newHeight, startX, startY) {
      /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
      // set up canvas for thumbnail
      const tnCanvas = document.createElement('canvas')
      const tnCanvasContext = tnCanvas.getContext('2d')
      tnCanvas.width = newWidth
      tnCanvas.height = newHeight

      /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
      let bufferCanvas = document.createElement('canvas')
      let bufferContext = bufferCanvas.getContext('2d')
      bufferCanvas.width = imgObj.width
      bufferCanvas.height = imgObj.height
      bufferContext.drawImage(imgObj, 0, 0)

      /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
      tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth, newHeight, 0, 0, newWidth, newHeight)
      return this.getCanvasBlob(tnCanvas)
    },
    async getCanvasBlob (canvas) {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob))
      })
    },
    async getNumberFromImage (image, line, column) {
      let squareLine = Math.ceil(line / 3)
      let squareColumn = Math.ceil(column / 3)
      let inputLine = line % 3 === 0 ? 3 : line % 3
      let inputColumn = column % 3 === 0 ? 3 : column % 3

      Tesseract.recognize(image, {
        lang: 'spa',
        tessedit_char_whitelist: ':/-0123456789'
      }).then(result => {
        let number = Number(result.text.replace(/(\r\n\t|\n|\r\t)/gm, ''))
        console.log(result.text)
        Solver.insertUserInput({
          squareKey: `${squareLine}-${squareColumn}`,
          inputKey: `${inputLine}-${inputColumn}`,
          value: number === 0 ? '' : number
        })
      })
    }
  },
  components: {
    Dropzone
  }
}
</script>
<style ></style>
