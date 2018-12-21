/**
 * 读取重量配置，切换表格中重量吨和公斤的显示
 */

export default {
  data () {
    return {
    }
  },

  methods: {
    /**
     * @param {Array} tableColumns 需要操作的表格列数组
     * @param {Object} weightOptionCol 需要插入的吨或公斤对象
     * @param {Number} index 需要插入的表格列位置
     */
    triggerWeightColumn (tableColumns, weightOptionCol, index) {
      tableColumns.splice(index, 0, weightOptionCol)
    }
  }
}
