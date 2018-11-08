import Vue from 'vue'
import { Button, Modal, Icon } from 'iview'
const Toast = {}
const prefix = 'ivu-modal'
Toast.newInstance = properties => {
  const _data = Object.assign({}, {
    visible: false,
    width: 416,
    title: '提示', // 头部标题
    content: '', // 紧靠icon的标题内容
    description: '', // 更多内容
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
                size: 28,
                verticalAlign: 'top'
              }
            })
          case 'confirm':
            return h(Icon, {
              props: {
                type: 'ios-help-circle',
                color: '#FF9502',
                size: 28,
                verticalAlign: 'top'
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
      // 动态根据icon设置宽度比例
      let colspan = ['2', '22']
      if (!icon) {
        colspan[0] = '0'
        colspan[1] = '24'
      }

      const contentBody = [
        h('div', {
          class: 'ivu-modal-confirm-head',
          style: {
            textAlign: 'center'
          }
        }, [
          icon ? h('div', {
            class: 'ivu-modal-confirm-head-icon'
          }, [icon]) : '',
          h('div', {
            class: 'ivu-modal-confirm-head-title',
            style: {
              fontSize: '14px',
              color: '#000000',
              fontWeight: 'normal',
              marginLeft: '0px',
              paddingLeft: '10px'
            },
            domProps: {
              innerHTML: this.content
            }
          })
        ])
      ]
      if (this.render) {
        bodyNodes = h('div', {
          class: `${prefix}-body-inner`
        }, contentBody.concat([
          h('div', {
            class: 'ivu-modal-confirm-body',
            style: {
              textAlign: 'center'
            }
          }, [this.render(h)])
        ]))
      } else {
        bodyNodes = h('div', {
          attrs: {
            class: `${prefix}-body-inner`
          }
        }, this.description ? contentBody.concat([
          h('div', {
            class: 'ivu-modal-confirm-body',
            style: {
              textAlign: 'center'
            },
            domProps: {
              innerHTML: this.description
            }
          })
        ]) : contentBody
        )
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
      // 防止缓存
      if ('content' in props) {
        toast.$parent.content = props.content
      }

      if ('description' in props) {
        toast.$parent.description = props.description
      }
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
