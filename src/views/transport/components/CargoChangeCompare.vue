<template>
  <div>
    <div class="title">修改前货物:</div>
    <Table :columns="oldCargoColumns" :data="oldCargoList"></Table>
    <div class="title">修改后货物:</div>
    <Table :columns="newCargoColumns" :data="newCargoList"></Table>
  </div>
</template>
<script>
import { isNumber, renderVolume, renderFee, renderWeight, renderWeightKg } from '@/libs/js/config'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
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
          key: 'cargoNo'
        },
        {
          title: '包装方式',
          key: 'unit'
        },
        {
          title: '包装数量',
          key: 'quantity',
          render: (h, p) => {
            return h('span', isNumber(p.row.quantity) ? p.row.quantity : '-')
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          render: (h, p) => {
            return renderFee(h, p.row.cargoCost)
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, p) => {
            return renderVolume(h, p.row.volume)
          }
        },
        {
          title: '包装尺寸（毫米）',
          key: 'dimension'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ],
      newCargoColumns: [
        {
          title: '货物名称',
          key: 'cargoName'
        },
        {
          title: '货物编号',
          key: 'cargoNo'
        },
        {
          title: '包装方式',
          key: 'unit'
        },
        {
          title: '包装数量',
          key: 'quantity',
          render: (h, p) => {
            return h('span', isNumber(p.row.quantity) ? p.row.quantity : '-')
          }
        },
        {
          title: '货值(元)',
          key: 'cargoCost',
          render: (h, p) => {
            return renderFee(h, p.row.cargoCost)
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          render: (h, p) => {
            return renderVolume(h, p.row.volume)
          }
        },
        {
          title: '包装尺寸（毫米）',
          key: 'dimension'
        },
        {
          title: '备注1',
          key: 'remark1'
        },
        {
          title: '备注2',
          key: 'remark2'
        }
      ],
      oldWeight: {
        title: '重量(吨)',
        key: 'weight',
        render: (h, p) => {
          return renderWeight(h, p.row.weight)
        }
      },
      oldWeightKg: {
        title: '重量(公斤)',
        key: 'weightKg',
        render: (h, p) => {
          return renderWeightKg(h, p.row.weightKg)
        }
      },
      newWeight: {
        title: '重量(吨)',
        key: 'weight',
        render: (h, p) => {
          return renderWeight(h, p.row.weight)
        }
      },
      newWeightKg: {
        title: '重量(公斤)',
        key: 'weightKg',
        render: (h, p) => {
          return renderWeightKg(h, p.row.weightKg)
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
  }
}
</script>
<style lang="stylus" scoped>
  .title
    color #333
    font-weight 500
    margin 20px 0
</style>
