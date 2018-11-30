const ImageManager = {
  renderStyle ($el) {
    function render (prop, value) {
      $el.style[prop] = value
      return render
    }
    return render
  },

  triggerListener ($el) {
    function trigger (type, events, fns) {
      if (type === 'add') {
        events.forEach((event, index) => {
          $el.addEventListener(event, fns[index])
        })
      } else {
        events.forEach((event, index) => {
          $el.removeEventListener(event, fns[index])
        })
      }
      return trigger
    }
    return trigger
  },

  // 文件转base64
  file2DataUrl (file) {
    return new Promise((resolve, reject) => {
      let fd = new FileReader()
      fd.onload = (e) => {
        fd = file = null
        resolve && resolve(e.target.result)
      }
      fd.onerror =
      fd.onabort =
        () => {
          fd = file = null
          reject && reject(new Error('图片处理失败-file2DataUrl'))
        }
      fd.readAsDataURL(file)
    })
  },

  // 裁切图片
  cropImage (image, start, size) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = canvas.height = size
    if (image.width > image.height) ctx.drawImage(image, start, 0, size, size, 0, 0, size, size)
    else ctx.drawImage(image, 0, start, size, size, 0, 0, size, size)
    return canvas.toDataURL('image/jpeg', 0.5)
  },

  // base64转blob
  base64Url2Blob (dataUrl) {
    const temp = dataUrl.split(',')
    const bytes = window.atob(temp[1])
    let ia = new Uint8Array(bytes.length)
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i)
    }
    return new Blob([ia], { type: 'image/png' })
  }
}

export default ImageManager
