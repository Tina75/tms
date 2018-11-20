import Toast from './toast'

let modalInstance

function getModalInstance (options) {
  modalInstance = modalInstance || Toast.newInstance(options)

  return modalInstance
}
/**
 *
 * @param {object} props
 */
function preset (props) {
  if (!('showIcon' in props)) {
    props.showIcon = true
  }
  if (!('showCancel' in props)) {
    props.showCancel = false
  }
}

function confirm (options) {
  if (!options.showIcon) {
    options.icon = ''
  }
  let { onOk, onCancel, ...rest } = options
  // const render = ('render' in options) ? options.render : undefined
  let instance = getModalInstance(rest)

  options.onRemove = function () {
    modalInstance = null
  }

  instance.show(options)
}

Toast.info = function (props = {}) {
  preset(props)
  props.icon = 'info'
  return confirm(props)
}

Toast.success = function (props = {}) {
  preset(props)
  props.icon = 'success'
  return confirm(props)
}

Toast.warning = function (props = {}) {
  preset(props)
  props.icon = 'warning'
  return confirm(props)
}

Toast.error = function (props = {}) {
  preset(props)
  props.icon = 'error'
  return confirm(props)
}

Toast.confirm = function (props = {}) {
  preset(props)
  props.showCancel = true
  props.icon = 'confirm'
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
