<template>
  <Modal v-model="visiable" :mask-closable="false" transfer class="separate-dialog" width="1175" @on-visible-change="close">
    <p slot="header" class="dialog-title">
      <span>添加异常货物信息</span>
    </p>
    <div>
      <div class="order-number">
        运单货物信息
      </div>
      <div>
        <table-extend :order-list="parentOrderData" style="float: left"></table-extend>
        <Table :columns="columns1" :data="parentOrderCargoList"></Table>
      </div>
    </div>
    <div v-if="childOrderCargoList.length">
      <div class="border-dashed"></div>
      <div class="order-number">
        异常货物信息
      </div>
      <div>
        <table-extend :order-list="childOrderData" style="float: left"></table-extend>
        <Table :columns="columns2" :data="childOrderCargoList"></Table>
      </div>
    </div>
    <div slot="footer">
      <Button
        :disabled="!childOrderCargoList.length"
        type="primary"
        @click="save">
        确定
      </Button>
      <Button  type="default"  @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
// import float from '@/libs/js/float'
import { TABLE_COLUMNS_ONE, TABLE_COLUMNS_TWO, COLUMNS_ONE_WEIGHT, COLUMNS_ONE_WEIGHTKG, COLUMNS_TWO_WEIGHT, COLUMNS_TWO_WEIGHTKG } from '../constant/abnormalCargo.js'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import TableExtend from '../components/TableExtend.vue'
import { roundFee, roundWeight, roundVolume, roundWeightKg } from '@/libs/js/config'

export default {
  name: 'cargoSeparate',
  components: { TableExtend },
  mixins: [BaseDialog, tableWeightColumnMixin],
  data () {
    return {
      isSeparate: false,
      columns1: TABLE_COLUMNS_ONE(this),
      columns2: TABLE_COLUMNS_TWO(this),
      subOrderNum: void 0, // 子订单数
      parentOrderCargoList: [],
      childOrderCargoList: [],
      currentId: 0,
      // childPortionData: {}, // 拆分成子单后的数据
      quantityVal: 0,
      weightVal: 0,
      volumeVal: 0,
      cargoCostVal: 0,
      cloneData: [], // 复制一份货物详情数据
      originData: [], // 原始数据
      allocationStrategy: 1,
      columns1Weight: COLUMNS_ONE_WEIGHT(this),
      columns1WeightKg: COLUMNS_ONE_WEIGHTKG(this),
      columns2Weight: COLUMNS_TWO_WEIGHT(this),
      columns2WeightKg: COLUMNS_TWO_WEIGHTKG(this),
      parentOrderData: [], // 原单的订单号信息
      childOrderData: [] // 异常货物的订单号信息
    }
  },

  computed: {
    ...mapGetters([
      'WeightOption', // 重量配置
      'AbnormalCargoInfos' // 异常货物信息
    ])
  },

  mounted: function () {
    /** vuex里有值优先取vuex里的值
     * 有三种情况
     * 1、parentOrderCargoList和childOrderCargoList都是空数组，说明之前打开过货物操作弹窗，需要调接口拿货物信息
     * 2、parentOrderCargoList不是空数组，说明之前打开过货物操作弹窗，不调接口读取之前存入vuex的值
     * 3、parentOrderCargoList是空数组且childOrderCargoList不是空数组，说明该单之前已上报过异常货物，需要调接口拿原始货物信息并修改parentOrderCargoList里的值
    */
    if (this.AbnormalCargoInfos.parentOrderCargoList.length === 0 && this.AbnormalCargoInfos.childOrderCargoList.length === 0) {
      this.getData()
    }
    if (this.AbnormalCargoInfos.parentOrderCargoList.length > 0) {
      this.parentOrderCargoList = _.cloneDeep(this.AbnormalCargoInfos.parentOrderCargoList)
      this.parentOrderData = _.cloneDeep(this.AbnormalCargoInfos.parentOrderData)
      this.childOrderCargoList = _.cloneDeep(this.AbnormalCargoInfos.childOrderCargoList)
      this.childOrderData = _.cloneDeep(this.AbnormalCargoInfos.childOrderData)
      this.originData = _.cloneDeep(this.AbnormalCargoInfos.originData)

      this.cloneData = _.cloneDeep(this.parentOrderCargoList)
    }
    if (this.AbnormalCargoInfos.parentOrderCargoList.length === 0 && this.AbnormalCargoInfos.childOrderCargoList.length > 0) {
      this.getData()
    }
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.columns1, this.columns1Weight, 4)
      this.triggerWeightColumn(this.columns2, this.columns2Weight, 4)
    } else {
      this.triggerWeightColumn(this.columns1, this.columns1WeightKg, 4)
      this.triggerWeightColumn(this.columns2, this.columns2WeightKg, 4)
    }
  },

  methods: {
    save () {
      let cargo = {
        parentOrderCargoList: this.parentOrderCargoList,
        parentOrderData: this.parentOrderData,
        childOrderCargoList: this.childOrderCargoList,
        childOrderData: this.childOrderData,
        originData: this.originData
      }
      this.$store.commit('setAbnormalCargoInfos', cargo)
      this.close()
    },
    // 查货物详情
    getData () {
      const z = this
      Server({
        url: '/abnormal/order/cargo/list',
        method: 'post',
        data: {
          billId: z.billId,
          billType: z.billType
        }
      }).then((res) => {
        res.data.data.list.map((item) => {
          z.parentOrderCargoList.push(...item.cargoList)
        })
        // 将数据库中带空字符串的数值转为0
        z.parentOrderCargoList.map((item) => {
          item.quantity = item.quantity ? item.quantity : 0
          item.volume = item.volume ? item.volume : 0
          item.weight = item.weight ? item.weight : 0
          item.weightKg = item.weightKg ? item.weightKg : 0
          item.cargoCost = item.cargoCost ? item.cargoCost : 0
        })
        // 合并单元格需要
        z.mergeCell('parentOrderCargoList', 'parentOrderData')
        z.mergeCell('childOrderCargoList', 'childOrderData')

        z.originData = _.cloneDeep(z.parentOrderCargoList)

        // 将parentOrderCargoList和childOrderCargoList里对应项的对应属性值相减返回减后的数组
        z.subtractCargoList()

        // 修改vuex里的数据
        let cargo = {
          parentOrderCargoList: z.parentOrderCargoList,
          parentOrderData: z.parentOrderData,
          childOrderCargoList: z.AbnormalCargoInfos.childOrderCargoList,
          childOrderData: z.AbnormalCargoInfos.childOrderData,
          originData: z.originData
        }
        z.$store.commit('setAbnormalCargoInfos', cargo)

        z.parentOrderCargoList = _.cloneDeep(z.AbnormalCargoInfos.parentOrderCargoList) // 读取vuex里的数据
        z.parentOrderData = _.cloneDeep(z.AbnormalCargoInfos.parentOrderData) // 读取vuex里的数据
        z.childOrderCargoList = _.cloneDeep(z.AbnormalCargoInfos.childOrderCargoList) // 读取vuex里的数据
        z.childOrderData = _.cloneDeep(z.AbnormalCargoInfos.childOrderData) // 读取vuex里的数据
      })
    },
    // 将parentOrderCargoList和childOrderCargoList里对应项的对应属性值相减返回减后的数组
    subtractCargoList () {
      let totalCargoList = [...this.parentOrderCargoList, ...this.AbnormalCargoInfos.childOrderCargoList]
      let subtract = _.groupBy(totalCargoList, 'cargoId')
      for (let key in subtract) {
        if (subtract[key].length > 1) {
          subtract[key][0].quantity -= subtract[key][1].quantity
          subtract[key][0].volume = roundVolume(subtract[key][0].volume - subtract[key][1].volume)
          subtract[key][0].weight = roundWeight(subtract[key][0].weight - subtract[key][1].weight)
          subtract[key][0].weightKg = roundWeightKg(subtract[key][0].weightKg - subtract[key][1].weightKg)
          subtract[key][0].cargoCost = roundFee(subtract[key][0].cargoCost - subtract[key][1].cargoCost)
        }
      }
      this.cloneData = _.cloneDeep(this.parentOrderCargoList)
    },
    // 整笔异常
    separateWholeList (index) {
      let parentData = _.cloneDeep(this.parentOrderCargoList[index])
      // 判断有没有已经拆分过的异常货物信息
      let hasChildList = this.childOrderCargoList.find((item) => {
        return item.cargoId === parentData.cargoId
      })
      if (hasChildList === undefined) {
        this.childOrderCargoList.unshift(parentData)
      } else {
        hasChildList.quantity += parentData.quantity
        hasChildList.cargoCost = roundFee(hasChildList.cargoCost + parentData.cargoCost)
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          hasChildList.weight = roundWeight(hasChildList.weight + parentData.weight)
        } else {
          hasChildList.weightKg = roundWeightKg(hasChildList.weightKg + parentData.weightKg)
        }
        hasChildList.volume = roundVolume(hasChildList.volume + parentData.volume)
      }
      // 将原单修改数据置为0
      this.parentOrderCargoList[index].quantity = 0
      this.parentOrderCargoList[index].weight = 0
      this.parentOrderCargoList[index].weightKg = 0
      this.parentOrderCargoList[index].volume = 0
      this.parentOrderCargoList[index].cargoCost = 0
      this.cloneData = this.parentOrderCargoList

      // 合并单元格需要
      this.mergeCell('childOrderCargoList', 'childOrderData')
    },
    // 部分异常
    separatePartList (params) {
      // 修改原单货物信息数据
      let parentData = { ...params.row }
      let quantity = params.row.quantity
      let weight = (this.WeightOption === 1 ? params.row.weight : params.row.weightKg) // 区分吨和公斤
      let volume = params.row.volume
      let cargoCost = params.row.cargoCost
      parentData.quantity = this.quantityVal ? params.row.quantity - this.quantityVal : 0
      // 区分吨和公斤
      if (this.WeightOption === 1) {
        parentData.weight = roundWeight(this.weightVal ? params.row.weight - this.weightVal : 0)
      } else {
        parentData.weightKg = roundWeightKg(this.weightVal ? params.row.weightKg - this.weightVal : 0)
      }
      parentData.volume = roundVolume(this.volumeVal ? params.row.volume - this.volumeVal : 0)
      // 货值比例关联优先级：数量-->重量-->体积
      if (params.row.quantity !== 0) {
        parentData.cargoCost = parseInt(roundFee(cargoCost * parentData.quantity) / quantity)
      } else if (params.row.weight !== 0 || params.row.weightKg !== 0) {
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          parentData.cargoCost = parseInt(roundWeight(cargoCost * parentData.weight) / weight)
        } else {
          parentData.cargoCost = parseInt(roundWeightKg(cargoCost * parentData.weightKg) / weight)
        }
      } else {
        parentData.cargoCost = parseInt(roundVolume(cargoCost * parentData.volume) / volume)
      }
      this.$set(this.parentOrderCargoList, params.index, parentData)
      this.$set(this.cloneData, params.index, parentData)

      // 生成异常货物信息数据
      let childData = { ...params.row }
      childData.cargoCost = roundFee(cargoCost - parentData.cargoCost)
      childData.quantity = this.quantityVal ? this.quantityVal : params.row.quantity
      // 区分吨和公斤
      if (this.WeightOption === 1) {
        childData.weight = this.weightVal ? this.weightVal : params.row.weight
      } else {
        childData.weightKg = this.weightVal ? this.weightVal : params.row.weightKg
      }
      childData.volume = this.volumeVal ? this.volumeVal : params.row.volume
      // 判断有没有已经拆分过的异常货物信息
      let hasChildList = this.childOrderCargoList.find((item) => {
        return item.cargoId === childData.cargoId
      })
      if (hasChildList === undefined) {
        this.childOrderCargoList.unshift(childData)
      } else {
        hasChildList.quantity += childData.quantity
        hasChildList.cargoCost = roundFee(hasChildList.cargoCost + childData.cargoCost)
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          hasChildList.weight = roundWeight(hasChildList.weight + childData.weight)
        } else {
          hasChildList.weightKg = roundWeightKg(hasChildList.weightKg + childData.weightKg)
        }
        hasChildList.volume = roundVolume(hasChildList.volume + childData.volume)
      }

      // 合并单元格需要
      this.mergeCell('childOrderCargoList', 'childOrderData')
    },

    // 合并单元格需要
    mergeCell (orderCargoList, orderData) {
      // 将货物列表根据货物id排序
      this[orderCargoList] = _.sortBy(this[orderCargoList], ['cargoId'])
      // 将原来的tableExtend组件里的orderList置为空数组
      this[orderData] = []
      let obj = _.groupBy(this[orderCargoList], 'orderId')
      for (let key in obj) {
        // 合并单元格需要
        if (obj[key].length > 1) {
          obj[key].push(obj[key][0])
        }
        obj[key] = obj[key].map((item, index) => {
          return {
            orderNo: index === 0 ? item.orderNo : '',
            customerOrderNo: index === 0 ? item.customerOrderNo : '',
            cargoLength: index === 0 ? obj[key].length : 1
          }
        })
        this[orderData].push(...obj[key])
      }
    },

    // 比较originData和childOrderCargoList中是否有相同的值
    compareOriginAndChild (index) {
      const z = this
      let bool = false
      // 同步吨和公斤,去掉_index、_rowKey
      z.childOrderCargoList.map((item) => {
        delete item._index
        delete item._rowKey
        if (this.WeightOption === 1) {
          item.weightKg = parseInt(roundWeightKg(item.weight * 1000))
        } else {
          item.weight = roundWeight(item.weightKg / 1000)
        }
      })
      z.childOrderCargoList.map((item) => {
        if (JSON.stringify(item) === JSON.stringify(z.originData[index])) {
          bool = true
        }
      })
      return bool
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
  letter-spacing 1px
.order-number
  height 20px
  font-size 14px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(47,50,62,1)
  line-height 20px
  margin-bottom 18px
.border-dashed
  border-top 1px dashed rgba(203,206,211,1)
  margin 40px 0 30px
.ivu-btn-primary[disabled]
  background-color rgba(0,164,189,0.3)
  color #fff
</style>
<style lang='stylus'>
.padding-left-30
  .ivu-table-cell
    padding-left 30px
.separate-dialog
  .ivu-modal-body
    padding 20px 32px
  .ivu-table-cell
    padding-left 26px
</style>
