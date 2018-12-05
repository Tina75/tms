<script>
/**
 * hack下select组件
 * 始终让最后一个新增司机和新增车辆的option存在，不被过滤
 * 在自派车的组件当中使用
 */
import { Select } from 'iview'
export default {
  extends: Select,
  computed: {
    /**
     * 因为始终要保留最后一个选项，所以判断条件要从1开始
     */
    showNotFoundLabel () {
      const { loading, remote, selectOptions } = this
      return selectOptions && selectOptions.length === 1 && (!remote || (remote && !loading))
    }
  },
  methods: {
    validateOption ({ children, elm, propsData }) {
      if (this.queryStringMatchesSelectedOption || propsData.value === 'extra') return true
      const value = propsData.value
      const label = propsData.label || ''
      const textContent = (elm && elm.textContent) || (children || []).reduce((str, node) => {
        const nodeText = node.elm ? node.elm.textContent : node.text
        return `${str} ${nodeText}`
      }, '') || ''
      const stringValues = JSON.stringify([value, label, textContent])
      const query = this.query.toLowerCase().trim()
      return stringValues.toLowerCase().includes(query)
    }
  }
}
</script>
