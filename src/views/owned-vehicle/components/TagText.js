const TagText = {
  functional: true,
  props: {
    name: {
      type: String
    },
    // 背景色
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    // 字体颜色
    color: {
      type: String,
      default: '#000'
    }
  },
  render (h, context) {
    return h('div', {
      class: 'ivu-tag',
      style: {
        color: context.props.color,
        backgroundColor: context.props.backgroundColor
      }
    }, context.children)
  }
}
export default TagText
