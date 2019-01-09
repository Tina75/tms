<template>
  <Modal v-model="visiable" :mask-closable="false" transfer class="separate-dialog" width="850" @on-visible-change="close">
    <p slot="header" class="dialog-title">
      <span>拆单</span>
    </p>
    <div>
      <div class="order-number first-line">
        <Row>
          <i-col span="12">
            订单号：{{ orderNo }}
          </i-col>
          <i-col span="12">
            客户：{{ detailData.consignerName }}
          </i-col>
        </Row>
      </div>
      <div class="order-number">
        <Row>
          <i-col span="12">
            始发地／目的地：{{ detailData.startName + ' - ' + detailData.endName }}
          </i-col>
          <i-col span="12">
            费用合计：{{ detailData.allocationFee / 100 }}元
          </i-col>
        </Row>
      </div>
      <div class="border-dashed margin-bottom-21"></div>
      <Row v-if="childOrderCargoList.length || muiltyOrderCargoList.length" class="order-number">
        <i-col span="10">
          子订单1：{{ childOneNo }}
        </i-col>
        <i-col span="14">
          费用：{{ childOneFee }}元
        </i-col>
      </Row>
      <Table :columns="columns1" :data="parentOrderCargoList"></Table>
    </div>
    <div v-if="childOrderCargoList.length || muiltyOrderCargoList.length">
      <div v-if="childOrderCargoList.length">
        <div class="border-dashed margin-dashed-two"></div>
        <Row class="order-number">
          <i-col span="10">
            子订单2：{{ childTwoNo }}
          </i-col>
          <i-col span="14">
            费用：{{ childTwoFee }}元
          </i-col>
        </Row>
        <Table :columns="columns2" :data="childOrderCargoList"></Table>
      </div>
      <template v-for="(cargo, index) in muiltyOrderCargoList" v-if="muiltyOrderCargoList.length">
        <div :key="index">
          <div class="border-dashed margin-dashed-two"></div>
          <Row class="order-number">
            <i-col span="10">
              子订单{{index+2}}：{{ getMuiltyOrderNo(cargo, index) }}
            </i-col>
            <i-col span="14">
              费用：{{ getSeparateOrderFeeByStrategy(cargo, index) }}元
            </i-col>
          </Row>
          <Table :columns="columns2" :data="[cargo]"></Table>
        </div>
      </template>
      <allocation-strategy
        ref="allocationStrategy"
        :allocation-orders="[...detailData]"
        :pass-allocation="detailData.parentId ? detailData.allocationStrategy : null"
        source="order"
        class="separate-allocation"
        @changeAllocationStrategy="onChangeAllocation"></allocation-strategy>
    </div>
    <div slot="footer">
      <Button
        :disabled="!(parentOrderCargoList.length && (childOrderCargoList.length || muiltyOrderCargoList.length))"
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
import float from '@/libs/js/float'
import { TABLE_COLUMNS_ONE, TABLE_COLUMNS_TWO, COLUMNS_ONE_WEIGHT, COLUMNS_ONE_WEIGHTKG, COLUMNS_TWO_WEIGHT, COLUMNS_TWO_WEIGHTKG } from '../constant/separate'
import _ from 'lodash'
import AllocationStrategy from '@/views/transport/components/AllocationStrategy.vue'
import { mapGetters } from 'vuex'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import { roundFee, roundWeight, roundVolume, roundWeightKg } from '@/libs/js/config'

export default {
  name: 'separate',
  components: { AllocationStrategy },
  mixins: [BaseDialog, tableWeightColumnMixin],
  data () {
    return {
      isSeparate: false,
      columns1: TABLE_COLUMNS_ONE(this),
      columns2: TABLE_COLUMNS_TWO(this),
      detailData: {},
      subOrderNum: void 0, // 子订单数
      parentOrderCargoList: [], // 拆部分或批量拆的原单或第一条货物数据
      childOrderCargoList: [], // 拆部分的子单
      muiltyOrderCargoList: [], // 拆批量的子单
      currentId: 0,
      // childPortionData: {}, // 拆分成子单后的数据
      quantityVal: 0,
      weightVal: 0,
      volumeVal: 0,
      cargoCostVal: 0,
      cloneData: [], // 复制一份货物详情数据
      allocationStrategy: 1,
      columns1Weight: COLUMNS_ONE_WEIGHT(this),
      columns1WeightKg: COLUMNS_ONE_WEIGHTKG(this),
      columns2Weight: COLUMNS_TWO_WEIGHT(this),
      columns2WeightKg: COLUMNS_TWO_WEIGHTKG(this)
    }
  },

  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置
    ]),
    childOneNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo : this.orderNo + '-1'
    },
    childTwoNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo.substring(0, this.orderNo.indexOf('-')) + '-' + (this.subOrderNum + 1) : this.orderNo + '-2'
    },
    childOneFee () {
      let fee = roundFee(this.detailData.allocationFee / 100)
      if (this.allocationStrategy === 1) { // 按订单数分摊费用
        if (this.childOrderCargoList.length > 0) {
          // 拆部分，除以2
          fee /= 2
        } else {
          // 拆批量，根据多个订单平均数
          fee /= (this.muiltyOrderCargoList.length + 1)
        }
      } else if (this.allocationStrategy === 2 && this.detailData.quantity) { // 按件数分摊费用，件数必须大于0
        fee *= roundFee(this.parentQuantity / this.detailData.quantity)
      } else if (this.allocationStrategy === 3 && (this.detailData.weight || this.detailData.weightKg)) { // 按重量分摊费用，重量必须大于0
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          fee *= roundFee(this.parentWeight / this.detailData.weight)
        } else {
          fee *= roundFee(this.parentWeight / this.detailData.weightKg)
        }
      } else if (this.allocationStrategy === 4 && this.detailData.volume) { // 按体积分摊费用，体积必须大于0
        fee *= roundFee(this.parentVolume / this.detailData.volume)
      } else {
        fee = 0
      }
      return roundFee(fee)
    },
    childTwoFee () {
      let fee = float.round(this.detailData.allocationFee / 100)
      if (this.allocationStrategy === 1 ||
         (this.allocationStrategy === 2 && this.detailData.quantity) ||
         (this.allocationStrategy === 3 && (this.detailData.weight || this.detailData.weightKg)) ||
         (this.allocationStrategy === 4 && this.detailData.volume)) { // 必须保证分摊时对应的策略都有值
        fee -= this.childOneFee
      } else {
        fee = 0
      }
      return roundFee(fee)
    },
    // 子单1的总数量
    parentQuantity () {
      let quantity = 0
      this.parentOrderCargoList.map((item) => {
        quantity += item.quantity
      })
      return quantity
    },
    // 子单1的总重量
    parentWeight () {
      let weight = 0
      this.parentOrderCargoList.map((item) => {
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          weight += item.weight
        } else {
          weight += item.weightKg
        }
      })
      return roundWeight(weight)
    },
    // 子单1的总体积
    parentVolume () {
      let volume = 0
      this.parentOrderCargoList.map((item) => {
        volume += item.volume
      })
      return roundVolume(volume, 6)
    }
  },

  mounted: function () {
    this.getData()
    this.getSubOrderNum()
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.columns1, this.columns1Weight, 2)
      this.triggerWeightColumn(this.columns2, this.columns2Weight, 2)
    } else {
      this.triggerWeightColumn(this.columns1, this.columns1WeightKg, 2)
      this.triggerWeightColumn(this.columns2, this.columns2WeightKg, 2)
    }
  },

  methods: {
    /**
     * 根据策略，计算该订单的费用
     * 拆批量的时候调用，计算每笔订单的费用合计
     * 1. 前面一批订单按照比例计算费用合计
     * 2. 最后一笔拆分的订单需要特殊处理，用户总费用减去之前的订单的总和，剩余的值赋值就可以
     */
    getSeparateOrderFeeByStrategy (cargo, index) {
      let fee = roundFee(this.detailData.allocationFee / 100)
      let total = this.muiltyOrderCargoList.length + 1
      // 最后一组，用减法，将剩余的赋值
      if ((index + 1) === this.muiltyOrderCargoList.length) {
        // 最后一条数据，特殊处理
        let no = 0
        let restFee = 0
        while (no < index) {
          restFee = roundFee(restFee + this.getSeparateOrderFeeByStrategy(this.muiltyOrderCargoList[no], no))
          no++
        }
        restFee = roundFee(restFee + this.childOneFee)
        fee -= restFee
      } else {
        if (this.allocationStrategy === 1) { // 按订单数分摊费用
          fee /= total
        } else if (this.allocationStrategy === 2 && cargo.quantity) { // 按件数分摊费用，件数必须大于0
          fee *= roundFee(cargo.quantity / this.detailData.quantity)
        } else if (this.allocationStrategy === 3 && (cargo.weight || cargo.weightKg)) { // 按重量分摊费用，重量必须大于0
        // 区分吨和公斤
          if (this.WeightOption === 1) {
            fee *= roundFee(cargo.weight / this.detailData.weight)
          } else {
            fee *= roundFee(cargo.weightKg / this.detailData.weightKg)
          }
        } else if (this.allocationStrategy === 4 && cargo.volume) { // 按体积分摊费用，体积必须大于0
          fee *= roundFee(cargo.volume / this.detailData.volume)
        } else {
          fee = 0
        }
      }

      return roundFee(fee)
    },
    /**
     * 批量顺序接口序号生成
     */
    getMuiltyOrderNo (cargo, index) {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo.substring(0, this.orderNo.indexOf('-')) + '-' + (this.subOrderNum + 1 + index) : this.orderNo + '-' + (index + 2)
    },
    onChangeAllocation (val) {
      this.allocationStrategy = val
    },
    save () {
      let vm = this
      let transformField = function (item) {
        // 区分吨和公斤 吨和公斤只需传一个
        if (vm.WeightOption === 1) {
          item.weight = roundWeight(item.weight)
          delete item.weightKg
        } else {
          item.weightKg = roundWeightKg(item.weightKg)
          delete item.weight
        }
        item.volume = roundVolume(item.volume)
      }
      // 将参数中的重量体积四舍五入
      vm.parentOrderCargoList.forEach(transformField)
      // 拆部分
      vm.childOrderCargoList.forEach(transformField)
      // 拆批量
      vm.muiltyOrderCargoList.forEach(transformField)
      let list = [[...vm.parentOrderCargoList]]
      if (vm.childOrderCargoList.length > 0) {
        list = list.concat([[...vm.childOrderCargoList]])
      } else {
        vm.muiltyOrderCargoList.forEach((cargo) => {
          list.push([cargo])
        })
      }
      const data = {
        id: this.id,
        orderCargoList: list,
        allocationStrategy: this.$refs.allocationStrategy.getAllocation()
      }
      Server({
        url: 'order/disassemble',
        method: 'post',
        data: data,
        ignoreCode: true
      }).then((res) => {
        if (res.data.code === 10000) {
          if (this.childOneNo + this.childTwoNo === res.data.data.orderNoList.join('')) {
            this.$Message.success('拆单成功')
            this.close()
          } else {
            this.close()
            this.openSeparateHintDialog(res.data.data.orderNoList) // 拆单过后子订单号有修改
          }
          this.ok()
        } else if (res.data.code === 50012) {
          this.close()
          this.openSeparateHintDialog([]) // 重复拆单
          this.ok()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 拆单完成后的弹窗提示
    openSeparateHintDialog (list) {
      this.openDialog({
        name: 'order/management/dialog/separateHint',
        data: { orderNoList: list },
        methods: {
          ok (node) {}
        }
      })
    },
    // 查货物详情
    getData () {
      Server({
        url: 'order/detail?id=' + this.id,
        method: 'get'
      }).then((res) => {
        this.detailData = _.cloneDeep(res.data.data)
        let orderCargoList = res.data.data.orderCargoList
        // 将返回数据列表中货值、数量、重量、体积的''替换成0
        orderCargoList.map((item) => {
          item.cargoCost = item.cargoCost ? item.cargoCost : 0
          item.quantity = item.quantity ? item.quantity : 0
          item.weight = item.weight ? item.weight : 0
          item.weightKg = item.weightKg ? item.weightKg : 0
          item.volume = item.volume ? item.volume : 0
        })
        this.parentOrderCargoList = orderCargoList
        this.cloneData = _.cloneDeep(this.parentOrderCargoList)
      })
    },
    // 获取子订单数
    getSubOrderNum () {
      Server({
        url: 'order/getSubOrderNum',
        method: 'get',
        data: {
          orderId: this.id
        }
      }).then((res) => {
        this.subOrderNum = res.data.data.subOrderNum
      })
    },
    // 拆整笔
    separateWholeList (index) {
      let childList = this.parentOrderCargoList.splice(index, 1)[0]
      let findedChildCargo = this.childOrderCargoList.find(cargo => cargo.id === childList.id)
      if (!findedChildCargo) {
        this.childOrderCargoList.unshift(childList)
        this.cloneData = this.parentOrderCargoList
      } else {
        this.mergeRepeatCargo(findedChildCargo, childList)
      }
    },
    /**
     * 部分拆单或拆整后，如果订单号是一样的，就合并货物信息，累计数据
     * @params {object} findedChildCargo 已拆分出来的列表，重复的货物项
     * @params {object} childCargo 拆出来的货物
     */
    mergeRepeatCargo (findedChildCargo, childCargo) {
      findedChildCargo.cargoCost = roundFee(findedChildCargo.cargoCost + childCargo.cargoCost)
      findedChildCargo.quantity = float.round(findedChildCargo.quantity + childCargo.quantity)
      findedChildCargo.volume = roundVolume(findedChildCargo.volume + childCargo.volume)
      if (this.WeightOption === 1) {
        findedChildCargo.weight = roundWeight(findedChildCargo.weight + childCargo.weight)
      } else {
        findedChildCargo.weightKg = roundWeightKg(findedChildCargo.weightKg + childCargo.weightKg)
      }
    },
    // 拆部分
    separatePartList (params) {
      // 修改原单数据
      let parentData = { ...params.row }
      let quantity = params.row.quantity
      let weight = (this.WeightOption === 1 ? params.row.weight : params.row.weightKg) // 区分吨和公斤
      let volume = params.row.volume
      let cargoCost = params.row.cargoCost
      parentData.quantity = this.quantityVal ? params.row.quantity - this.quantityVal : 0
      // 区分吨和公斤
      if (this.WeightOption === 1) {
        parentData.weight = float.round(this.weightVal ? params.row.weight - this.weightVal : 0, 3)
      } else {
        parentData.weightKg = this.weightVal ? params.row.weightKg - this.weightVal : 0
      }
      parentData.volume = float.round(this.volumeVal ? params.row.volume - this.volumeVal : 0, 6)
      // 货值比例关联优先级：数量-->重量-->体积
      if (params.row.quantity !== 0) {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.quantity) / quantity)
      } else if (params.row.weight !== 0 || params.row.weightKg !== 0) {
        // 区分吨和公斤
        if (this.WeightOption === 1) {
          parentData.cargoCost = parseInt(float.round(cargoCost * parentData.weight, 3) / weight)
        } else {
          parentData.cargoCost = parseInt(float.round(cargoCost * parentData.weightKg) / weight)
        }
      } else {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.volume, 6) / volume)
      }
      this.$set(this.parentOrderCargoList, params.index, parentData)
      this.$set(this.cloneData, params.index, parentData)

      // 生成子单数据
      let childData = { ...params.row }
      childData.cargoCost = float.round(cargoCost - parentData.cargoCost)
      childData.quantity = this.quantityVal ? this.quantityVal : params.row.quantity
      // 区分吨和公斤
      if (this.WeightOption === 1) {
        childData.weight = this.weightVal ? this.weightVal : params.row.weight
      } else {
        childData.weightKg = this.weightVal ? this.weightVal : params.row.weightKg
      }
      childData.volume = this.volumeVal ? this.volumeVal : params.row.volume
      let findedChildCargo = this.childOrderCargoList.find(cargo => cargo.id === childData.id)
      if (!findedChildCargo) {
        // 如果未找到，就放入数组
        this.childOrderCargoList.unshift(childData)
      } else {
        this.mergeRepeatCargo(findedChildCargo, childData)
        // findedChildCargo.cargoCost = roundFee(findedChildCargo.cargoCost + childData.cargoCost)
        // findedChildCargo.quantity = float.round(findedChildCargo.quantity + childData.quantity)
        // findedChildCargo.volume = roundVolume(findedChildCargo.volume + childData.volume)
        // if (this.WeightOption === 1) {
        //   findedChildCargo.weight = roundWeight(findedChildCargo.weight + childData.weight)
        // } else {
        //   findedChildCargo.weightKg = roundWeightKg(findedChildCargo.weightKg + childData.weightKg)
        // }
      }
    },
    // 拆批量
    separateAverage () {
      const vm = this
      this.openDialog({
        name: 'order/management/dialog/separate-average',
        data: {
          // 订单数据
          orderDetail: vm.detailData,
          // 货物信息
          cargoList: vm.parentOrderCargoList
        },
        methods: {
          ok (cargoList) {
            vm.$set(vm.parentOrderCargoList, 0, cargoList[0])
            // vm.parentOrderCargoList[0] = cargoList[0]
            vm.muiltyOrderCargoList = cargoList.slice(1).concat(vm.muiltyOrderCargoList)
            cargoList = null
          }
        }
      })
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
  margin-bottom 20px
.first-line
  margin-bottom 8px
.border-dashed
  border-top 1px dashed rgba(203,206,211,1)
.margin-bottom-21
  margin-bottom 21px
.margin-dashed-two
  margin 32px 0 20px
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
  .separate-allocation
    margin-top 32px
    margin-left -10px
    .ivu-form-item-label
      color rgba(47,50,62,1) !important
      font-size 14px
      padding 10px 0 10px
</style>
