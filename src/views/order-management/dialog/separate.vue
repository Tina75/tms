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
            费用合计：{{ detailData.totalFee / 100 }}元
          </i-col>
        </Row>
      </div>
      <div class="border-dashed margin-bottom-21"></div>
      <Row v-if="childOrderCargoList.length" class="order-number">
        <i-col span="10">
          子订单1：{{ childOneNo }}
        </i-col>
        <i-col span="14">
          费用：{{ childOneFee }}元
        </i-col>
      </Row>
      <Table :columns="columns1" :data="parentOrderCargoList"></Table>
    </div>
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
      <allocation-strategy
        ref="allocationStrategy"
        :allocation-orders="[...detailData]"
        source="order"
        class="separate-allocation"
        @changeAllocationStrategy="onChangeAllocation"></allocation-strategy>
    </div>
    <div slot="footer">
      <Button
        :disabled="!(parentOrderCargoList.length && childOrderCargoList.length)"
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
import { TABLE_COLUMNS_ONE, TABLE_COLUMNS_TWO } from '../constant/separate'
import _ from 'lodash'
import AllocationStrategy from '@/views/transport/components/AllocationStrategy.vue'

export default {
  name: 'separate',
  components: { AllocationStrategy },
  mixins: [BaseDialog],
  data () {
    return {
      isSeparate: false,
      columns1: TABLE_COLUMNS_ONE(this),
      columns2: TABLE_COLUMNS_TWO(this),
      detailData: {},
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
      allocationStrategy: 1
    }
  },

  computed: {
    childOneNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo : this.orderNo + '-1'
    },
    childTwoNo () {
      return this.orderNo.indexOf('-') > -1 ? this.orderNo.substring(0, this.orderNo.indexOf('-')) + '-' + (this.subOrderNum + 1) : this.orderNo + '-2'
    },
    childOneFee () {
      let fee = float.round(this.detailData.totalFee / 100)
      if (this.allocationStrategy === 1) { // 按订单数分摊费用
        fee /= 2
      } else if (this.allocationStrategy === 2 && this.detailData.quantity) { // 按件数分摊费用，件数必须大于0
        fee *= (this.parentQuantity / this.detailData.quantity)
      } else if (this.allocationStrategy === 3 && this.detailData.weight) { // 按重量分摊费用，重量必须大于0
        fee *= (this.parentWeight / this.detailData.weight)
      } else if (this.allocationStrategy === 4 && this.detailData.volume) { // 按体积分摊费用，体积必须大于0
        fee *= (this.parentVolume / this.detailData.volume)
      } else {
        fee = 0
      }
      return float.round(fee)
    },
    childTwoFee () {
      let fee = float.round(this.detailData.totalFee / 100)
      return float.round(fee - this.childOneFee)
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
        weight += item.weight
      })
      return weight
    },
    // 子单1的总体积
    parentVolume () {
      let volume = 0
      this.parentOrderCargoList.map((item) => {
        volume += item.volume
      })
      return volume
    }
  },

  mounted: function () {
    this.getData()
    this.getSubOrderNum()
  },

  methods: {
    onChangeAllocation (val) {
      this.allocationStrategy = val
    },
    save () {
      // 将参数中的重量体积四舍五入
      this.parentOrderCargoList.map((item) => {
        item.weight = float.round(item.weight)
        item.volume = float.round(item.volume)
      })
      this.childOrderCargoList.map((item) => {
        item.weight = float.round(item.weight)
        item.volume = float.round(item.volume)
      })
      const data = {
        id: this.id,
        orderCargoList: [[...this.parentOrderCargoList], [...this.childOrderCargoList]],
        allocationStrategy: this.$refs.allocationStrategy.getAllocation()
      }
      Server({
        url: 'order/disassemble',
        method: 'post',
        data: data,
        ignoreCode: true
      }).then((res) => {
        if (res.data.code === 50012) {
          this.close()
          this.openSeparateHintDialog([]) // 重复拆单
        } else {
          if (this.childOneNo + this.childTwoNo === res.data.data.orderNoList.join('')) {
            this.$Message.success('拆单成功')
            this.close()
          } else {
            this.close()
            this.openSeparateHintDialog(res.data.data.orderNoList) // 拆单过后子订单号有修改
          }
        }
        this.ok()
      })
    },
    // 拆单完成后的弹窗提示
    openSeparateHintDialog (list) {
      this.openDialog({
        name: 'order-management/dialog/separateHint',
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
        console.log(res)
        this.detailData = _.cloneDeep(res.data.data)
        let orderCargoList = res.data.data.orderCargoList
        // 将返回数据列表中货值、数量、重量、体积的''替换成0
        orderCargoList.map((item) => {
          item.cargoCost = item.cargoCost ? item.cargoCost : 0
          item.quantity = item.quantity ? item.quantity : 0
          item.weight = item.weight ? item.weight : 0
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
      this.childOrderCargoList.unshift(childList)
      this.cloneData = this.parentOrderCargoList
    },
    // 拆部分
    separatePartList (params) {
      // 修改原单数据
      let parentData = { ...params.row }
      let quantity = params.row.quantity
      let weight = params.row.weight
      let volume = params.row.volume
      let cargoCost = params.row.cargoCost
      parentData.quantity = this.quantityVal ? params.row.quantity - this.quantityVal : 0
      parentData.weight = this.weightVal ? params.row.weight - this.weightVal : 0
      parentData.volume = this.volumeVal ? params.row.volume - this.volumeVal : 0
      // 货值比例关联优先级：数量-->重量-->体积
      if (params.row.quantity !== 0) {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.quantity) / quantity)
      } else if (params.row.weight !== 0) {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.weight) / weight)
      } else {
        parentData.cargoCost = parseInt(float.round(cargoCost * parentData.volume) / volume)
      }
      this.$set(this.parentOrderCargoList, params.index, parentData)
      this.$set(this.cloneData, params.index, parentData)

      // 生成子单数据
      let childData = { ...params.row }
      childData.cargoCost = float.round(cargoCost - parentData.cargoCost)
      childData.quantity = this.quantityVal ? this.quantityVal : params.row.quantity
      childData.weight = this.weightVal ? this.weightVal : params.row.weight
      childData.volume = this.volumeVal ? this.volumeVal : params.row.volume
      this.childOrderCargoList.unshift(childData)
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
    .ivu-form-item-label
      color rgba(47,50,62,1) !important
      font-size 14px
      padding 10px 0 10px
</style>
