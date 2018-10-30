import Vue from 'vue'
import { Button, Modal, Icon } from 'iview'
const Toast = {}
const prefix = 'ivu-modal'
Toast.newInstance = properties => {
  const _data = Object.assign({}, {
    visible: false,
    width: 416,
    title: '提示',
    content: '',
    // iconType: '', // 不同颜色的icon
    // iconName: '', // icon名称
    okText: '确定',
    cancelText: '取消',
    showCancel: false,
    loading: false,
    footerHide: false,
    buttonLoading: false,
    scrollable: false,
    closable: true,
    maskClosable: false
  }, properties || {})
  const Instance = new Vue({
    data: _data,
    methods: {
      iconRender (h) {
        if (!this.icon) {
          return ''
        }
        switch (this.icon) {
          case 'info':
            return h(Icon, {
              props: {
                type: 'ios-information-circle',
                color: '#26B2FA',
                size: 28
              }
            })
          case 'success':
            return h(Icon, {
              props: {
                type: 'ios-checkmark-circle',
                color: '#00C185',
                size: 28
              }
            })
          case 'warning':
            return h(Icon, {
              props: {
                type: 'ios-alert',
                color: '#FF9502',
                size: 28
              }
            })
          case 'error':
            return h(Icon, {
              props: {
                type: 'ios-close-circle',
                color: '#F75B5C',
                size: 28
              }
            })
          case 'confirm':
            return h(Icon, {
              props: {
                type: 'ios-help-circle',
                color: '#FF9502',
                size: 28
              }
            })
        }
      },
      cancel () {
        this.$children[0].visible = false
        this.buttonLoading = false
        this.onCancel()
        this.remove()
      },
      ok () {
        if (this.loading) {
          this.buttonLoading = true
        } else {
          this.$children[0].visible = false
          this.remove()
        }
        this.onOk()
      },
      remove () {
        setTimeout(() => {
          this.destroy()
        }, 300)
      },
      destroy () {
        this.$destroy()
        document.body.removeChild(this.$el)
        this.onRemove()
      },
      onOk () {},
      onCancel () {},
      onRemove () {}
    },
    render (h) {
      let footerNodes = []
      // 追加确定按钮
      footerNodes.push(h(Button, {
        props: {
          type: 'primary',
          size: 'large',
          loading: this.buttonLoading
        },
        on: {
          click: this.ok
        }
      }, this.okText))
      // 追加取消按钮
      if (this.showCancel) {
        footerNodes.push(h(Button, {
          props: {
            type: 'default',
            size: 'large'
          },
          on: {
            click: this.cancel
          }
        }, this.cancelText))
      }
      let bodyNodes
      let icon = this.iconRender(h)
      if (this.render) {
        bodyNodes = h('div', {
          attrs: {
            class: 'ivu-modal-confirm-head'
          }
        }, [
          h('div', {
            attrs: {
              class: 'ivu-modal-confirm-head-icon'
            }
          }, [icon]),
          h('div', {
            attrs: {
              class: 'ivu-modal-confirm-head-title'
            },
            style: {
              fontSize: '14px',
              color: '#000000',
              fontWeight: 'normal'
            }
          }, this.render(h))
        ])
      } else {
        bodyNodes = h('div', {
          attrs: {
            class: `${prefix}-body-inner`
          }
        }, [
          h('div', {
            attrs: {
              class: 'ivu-modal-confirm-head'
            }
          },
          [
            h('div', {
              attrs: {
                class: 'ivu-modal-confirm-head-icon'
              }
            }, [icon]),
            h('div', {
              attrs: {
                class: 'ivu-modal-confirm-head-title'
              },
              style: {
                fontSize: '14px',
                color: '#000000',
                fontWeight: 'normal'
              },
              domProps: {
                innerHTML: this.content
              }
            })
          ])

        ])
      }

      return h(Modal, {
        props: { ..._data },
        domProps: {
          value: this.visible
        },
        on: {
          input: (status) => {
            this.visible = status
          }
        }
      }, [
        h('div', {
          attrs: {
            class: `${prefix}-header-inner`
          },
          style: {
            textAlign: 'center'
          },
          slot: 'header'
        }, this.title),
        h('div', {
          attrs: {
            class: `${prefix}-footer-inner`
          },
          slot: 'footer'
        }, footerNodes),
        h('div', {
          attrs: {
            class: 'ivu-modal-confirm'
          }
        }, [bodyNodes])
      ])
    }
  })
  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const toast = Instance.$children[0]
  return {
    show (props) {
      toast.$parent.showCancel = props.showCancel
      toast.$parent.onRemove = props.onRemove

      if ('onCancel' in props) {
        toast.$parent.onCancel = props.onCancel
      }

      if ('onOk' in props) {
        toast.$parent.onOk = props.onOk
      }
      toast.visible = true
    },
    remove () {
      toast.visible = false
      toast.$parent.buttonLoading = false
      toast.$parent.remove()
    },
    component: toast
  }
}

export default Toast
