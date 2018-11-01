import Toast from './toast'

let modalInstance

function getModalInstance (options) {
  modalInstance = modalInstance || Toast.newInstance(options)

  return modalInstance
}

function confirm (options) {
  if (!options.showIcon) {
    options.icon = ''
  }
  // const render = ('render' in options) ? options.render : undefined
  let instance = getModalInstance(options)

  options.onRemove = function () {
    modalInstance = null
  }

  instance.show(options)
}

Toast.info = function (props = {}) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  props.icon = 'info'
  props.showCancel = false
  return confirm(props)
}

Toast.success = function (props = {}) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  props.icon = 'success'
  props.showCancel = false
  return confirm(props)
}

Toast.warning = function (props = {}) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  props.icon = 'warning'
  props.showCancel = false
  return confirm(props)
}

Toast.error = function (props = {}) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  props.icon = 'error'
  props.showCancel = false
  return confirm(props)
}

Toast.confirm = function (props = {}) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  props.icon = 'confirm'
  props.showCancel = true
  return confirm(props)
}

Toast.remove = function () {
  if (!modalInstance) {
    return false
  }

  const instance = getModalInstance()

  instance.remove()
}

export default Toast
