<template>
  <div class="sudoker__file">
    <dropzone id="foo" ref="el"
              :options="dropzoneOptions"
              :destroyDropzone="true"
              @vdropzone-file-added="processImage"/>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'

export default {
  name: 'box-file',
  data () {
    return {
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
        console.log(img.width)
        console.log(img.height)
        let portionWidth = Math.floor(img.width / 9)
        let portionHeight = Math.floor(img.height / 9)
        for (let iterate = 0; iterate < 9; iterate++) {
          let xPosition = iterate * portionWidth
          let yPosition = iterate * portionHeight
          let cropedImageBlob = await this.getImagePortion(img, portionWidth, portionHeight, xPosition, yPosition)
          let cropedImageFile = new File([cropedImageBlob], 'cropedImageFile')
          console.log(cropedImageFile)
        }
      }
      console.log(file)
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
    }
  },
  components: {
    Dropzone
  }
}
</script>
<style ></style>
