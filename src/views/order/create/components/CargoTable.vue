<template>
  <div :class="wrapperClass">
    <div :class="classes">
      <div :class="`${prefixClass}-body`">
        <table cellspacing="0" cellpadding="0" border="0" style="width:100%">
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index" :style="headerClass(header)">
                <div :class="headerColClass">
                  <span v-if="header.required" class="van-c-red">*</span>
                  <span v-text="header.title"></span>
                  <Tooltip v-if="header.poptip" :max-width="200" :content="header.poptip" placement="top" transfer>
                    <Icon type="ios-information-circle" size="16" color="#FFBB44"></Icon>
                  </Tooltip>
                </div>
              </th>
            </tr>
          </thead>
          <tbody :class="`${prefixClass}-tbody`">
            <tr v-for="(item, no) in dataSource" :class="`${prefixClass}-row`" :key="no">
              <td v-for="(col, index) in headers" :key="index">
                <CargoTableRow
                  :cargoes="cargoes"
                  :prefix-class="prefixClass"
                  :index="no"
                  :record="item"
                  :col="col"
                  :on-append="onAppend"
                  :on-remove="onRemove"
                  :on-select="onSelect"
                >
                </CargoTableRow>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div :class="`${prefixClass}-footer`">
        <tr class="ivu-table-row">
          <td>
            <div class="ivu-table-cell">
              合计
            </div>
          </td>
          <td>
            <div class="ivu-table-cell">总重量：{{statics.weight}}吨</div>
          </td>
          <td>
            <div class="ivu-table-cell">总体积：{{statics.volume}}方</div>
          </td>
          <td>
            <div class="ivu-table-cell">总货值：{{statics.cargoCost}}元</div>
          </td>
          <td>
            <div class="ivu-table-cell">总数量：{{statics.quantity}}</div>
          </td>
        </tr>
      </div>
    </div>
  </div>
</template>

<script>

import float from '@/libs/js/float'
import CargoTableRow from './CargoTableRow.vue'
const prefixClass = 'ivu-table'

export default {
  components: {
    CargoTableRow
  },
  props: {
    dataSource: {
      required: true,
      type: Array,
      default: () => []
    },
    cargoes: {
      type: Array,
      default: () => []
    },
    onAppend: Function,
    onRemove: Function,
    onSelect: Function
  },
  data () {
    return {
      prefixClass: prefixClass,
      headers: [
        {
          required: false,
          title: '',
          type: 'operation',
          width: 80
        },
        {
          required: true,
          title: '货物名称',
          key: 'cargoName',
          type: 'select',
          max: 10,
          width: 180
        },
        {
          required: true,
          title: '重量（吨）',
          key: 'weight',
          poptip: '为了方便您计算价格，重量和体积必须填写一项',
          type: 'number',
          min: 0,
          point: 2
        },
        {
          required: true,
          title: '体积（方）',
          key: 'volume',
          type: 'number',
          min: 0,
          point: 1
        },
        {
          required: false,
          title: '货值（元）',
          key: 'cargoCost',
          type: 'number',
          min: 0,
          point: 2
        },
        {
          required: false,
          title: '数量',
          key: 'quantity',
          type: 'number',
          min: 1,
          point: 0
        },
        {
          required: false,
          title: '包装方式',
          key: 'unit',
          type: 'text',
          max: 10
        },
        {
          required: false,
          title: '备注1',
          key: 'remark1',
          type: 'text',
          max: 100
        },
        {
          required: false,
          title: '备注2',
          key: 'remark2',
          type: 'text',
          max: 100
        }
      ]
    }
  },
  computed: {
    wrapperClass () {
      return [
        `${prefixClass}-wrapper`
      ]
    },
    classes () {
      return [
        prefixClass,
        `${prefixClass}-default`
      ]
    },

    headerColClass () {
      return `${prefixClass}-cell`
    },
    statics () {
      return this.dataSource.reduce((sum, cargo) => {
        // 读取临时数据

        sum.weight = float.round((cargo.weight || 0) + sum.weight)
        sum.volume = float.round((cargo.volume || 0) + sum.volume, 1)
        sum.cargoCost = float.round((cargo.cargoCost || 0) + sum.cargoCost)
        sum.quantity = (cargo.quantity || 0) + sum.quantity
        return sum
      }, {
        weight: 0,
        volume: 0,
        cargoCost: 0,
        quantity: 0
      })
    }
  },
  methods: {
    headerClass (header) {
      return {
        width: header.width ? `${header.width}px` : false
      }
    },
    handleParse (col) {
      return (value) => {
        float.floor(value, col.point).toString()
      }
    }
  }
}
</script>

<style>

</style>
