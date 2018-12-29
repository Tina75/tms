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
            <tr v-for="(item, no) in dataSourceCpt" :class="`${prefixClass}-row`" :key="no">
              <td v-for="(col, index) in headers" :key="index">
                <CargoTableRow
                  :cargoes="cargoes"
                  :prefix-class="prefixClass"
                  :index="no"
                  :record="item"
                  :col="col"
                  :length="dataSourceCpt.length"
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
import { NumberPrecesion } from '@/libs/js/config'
import OrderMap from '../libs/orderMap'
const prefixClass = 'ivu-table'

export default {
  components: {
    CargoTableRow
  },
  props: {
    orderSet: Object,
    dataSource: {
      required: true,
      type: Array,
      default: () => []
    },
    cargoes: {
      type: Array,
      default: () => []
    },
    unitType: Number,
    onAppend: Function,
    onRemove: Function,
    onSelect: Function
  },
  data () {
    return {
      prefixClass: prefixClass,
      headersOption: [
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
          max: 200,
          width: 180
        },
        {
          required: false,
          title: '货物编号',
          key: 'cargoNo',
          type: 'text',
          max: 200
        },
        {
          required: false,
          title: '重量（吨）',
          key: 'weight',
          type: 'number',
          min: 0,
          point: NumberPrecesion.weight
        },
        {
          required: false,
          title: '重量（公斤）',
          key: 'weightKg',
          type: 'number',
          min: 0,
          point: NumberPrecesion.weightKg
        },
        {
          required: false,
          title: '体积（方）',
          key: 'volume',
          type: 'number',
          min: 0,
          point: NumberPrecesion.volume
        },
        {
          required: false,
          title: '货值（元）',
          key: 'cargoCost',
          type: 'number',
          min: 0,
          point: NumberPrecesion.fee
        },
        {
          required: false,
          title: '包装方式',
          key: 'unit',
          type: 'package',
          max: 10
        },
        {
          required: false,
          title: '包装数量',
          key: 'quantity',
          type: 'number',
          min: 1,
          point: 0
        },
        {
          required: false,
          title: '包装尺寸',
          key: 'dimension',
          width: 180,
          type: 'multi',
          children: [
            {
              required: false,
              title: '长',
              key: 'length',
              min: 0,
              max: 9999999,
              point: 0
            },
            {
              required: false,
              title: '宽',
              key: 'width',
              min: 0,
              max: 9999999,
              point: 0
            },
            {
              required: false,
              title: '高',
              key: 'height',
              min: 0,
              max: 9999999,
              point: 0
            }
          ]
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
        if (cargo.cargoName) {
          sum.cargoInfos.push({ key: cargo.cargoName, value: cargo.quantity })
        }
        sum.weight = float.round((cargo.weight || 0) + sum.weight, NumberPrecesion.weight)
        sum.volume = float.round((cargo.volume || 0) + sum.volume, NumberPrecesion.volume)
        sum.cargoCost = float.round((cargo.cargoCost || 0) + sum.cargoCost)
        sum.quantity = (cargo.quantity || 0) + sum.quantity
        return sum
      }, {
        weight: 0,
        volume: 0,
        cargoCost: 0,
        quantity: 0,
        cargoInfos: []
      })
    },
    headers () {
      const res = this.headersOption.filter(el => {
        const key = OrderMap[el.key]
        return this.orderSet[key] !== 2
      })
      return res
    },
    dataSourceCpt () {
      return this.dataSource.map(el => {
        return el
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
    },
    float (value) {
      return float.round(value, 3)
    }
  }
}
</script>
