<template>
  <div>
    <div class="title">修改前货物:</div>
    <Table :columns="oldCargoColumns" :data="oldCargoList"></Table>
    <div class="title">修改后货物:</div>
    <Table :columns="newCargoColumns" :data="newCargoList"></Table>
  </div>
</template>
<script>
import { isNumber, getFeeText, roundVolume, roundWeight, roundWeightKg } from '@/libs/js/config'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import _ from 'lodash'
import * as CargoInfo from '@/libs/constant/cargoInfoTable'
import { mapGetters } from 'vuex'

export default {
  name: 'CargoChangeCompare',
  mixins: [ tableWeightColumnMixin ],
  props: {
    // 修改后的货物列表
    newCargoList: {
      type: Array,
      required: true,
      default: () => []
    },
    // 修改前的货物列表
    oldCargoList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      oldCargoColumns: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '货物编号',
          key: 'cargoNo',
          render: (h, p) => {
            return h('span', p.row.cargoNo || '-')
          }
        },
        CargoInfo.unit,
        CargoInfo.quantity,
        CargoInfo.cargoCost,
        CargoInfo.volume,
        CargoInfo.dimension,
        CargoInfo.remark1,
        CargoInfo.remark2
      ],
      newCargoColumns: [
        {
          title: '货物名称',
          key: 'cargoName',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'cargoName') ? '#515a6e' : '#f00'
              }
            }, p.row.cargoName)
          }
        },
        {
          title: '货物编号',
          key: 'cargoNo',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'cargoNo') ? '#515a6e' : '#f00'
              }
            }, p.row.cargoNo || '-')
          }
        },
        {
          title: '包装方式',
          key: 'unit',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'unit') ? '#515a6e' : '#f00'
              }
            }, p.row.unit || '-')
          }
        },
        {
          title: '包装数量',
          key: 'quantity',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'quantity') ? '#515a6e' : '#f00'
              }
            }, isNumber(p.row.quantity) ? p.row.quantity : '-')
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'cargoCost') ? '#515a6e' : '#f00'
              }
            }, getFeeText(p.row.cargoCost))
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'volume') ? '#515a6e' : '#f00'
              }
            }, isNumber(p.row.volume) ? roundVolume(p.row.volume) : '-')
          }
        },
        {
          title: '包装尺寸（毫米）',
          key: 'dimension',
          render: (h, p) => {
            let text = ''
            if (isNumber(p.row.dimension.length) || isNumber(p.row.dimension.width) || isNumber(p.row.dimension.height)) {
              text = (isNumber(p.row.dimension.length) ? p.row.dimension.length : '-') + ' x ' + (isNumber(p.row.dimension.width) ? p.row.dimension.width : '-') + ' x ' + (isNumber(p.row.dimension.height) ? p.row.dimension.height : '-')
            } else {
              text = '-'
            }
            return h('span', {
              style: {
                color: this.compareFunc(p, 'dimension') ? '#515a6e' : '#f00'
              }
            }, text)
          }
        },
        {
          title: '备注1',
          key: 'remark1',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'remark1') ? '#515a6e' : '#f00'
              }
            }, p.row.remark1 || '-')
          }
        },
        {
          title: '备注2',
          key: 'remark2',
          render: (h, p) => {
            return h('span', {
              style: {
                color: this.compareFunc(p, 'remark2') ? '#515a6e' : '#f00'
              }
            }, p.row.remark2 || '-')
          }
        }
      ],
      oldWeight: CargoInfo.weight,
      oldWeightKg: CargoInfo.weightKg,
      newWeight: {
        title: '重量(吨)',
        key: 'weight',
        render: (h, p) => {
          return h('span', {
            style: {
              color: this.compareFunc(p, 'weight') ? '#515a6e' : '#f00'
            }
          }, isNumber(p.row.weight) ? roundWeight(p.row.weight) : '-')
        }
      },
      newWeightKg: {
        title: '重量(公斤)',
        key: 'weightKg',
        render: (h, p) => {
          return h('span', {
            style: {
              color: this.compareFunc(p, 'weightKg') ? '#515a6e' : '#f00'
            }
          }, isNumber(p.row.weightKg) ? roundWeightKg(p.row.weightKg) : '-')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置 1 吨  2 公斤
    ])
  },
  mounted () {
    // 判断显示吨列或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.oldCargoColumns, this.oldWeight, 5)
      this.triggerWeightColumn(this.newCargoColumns, this.newWeight, 5)
    } else {
      this.triggerWeightColumn(this.oldCargoColumns, this.oldWeightKg, 5)
      this.triggerWeightColumn(this.newCargoColumns, this.newWeightKg, 5)
    }
  },
  methods: {
    // 修改前、修改后货物字段比较，相同返回true，不同返回false
    compareFunc (p, key) {
      let oldCargo = _.find(this.oldCargoList, ['cargoId', p.row.cargoId])
      // old里没找到，说明是新添加的，返回false
      if (!oldCargo) {
        return false
      }
      // 包装尺寸需长宽高都一样才返回true
      if (key === 'dimension') {
        return p.row[key].length === oldCargo[key].length &&
               p.row[key].width === oldCargo[key].width &&
               p.row[key].height === oldCargo[key].height
      }
      return p.row[key] === oldCargo[key]
    }
  }
}
</script>
<style lang="stylus" scoped>
  .title
    color #333
    font-weight 500
    margin 20px 0
</style>
