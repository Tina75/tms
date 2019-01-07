<template>
  <Modal v-model="visiable" :mask-closable="false" transfer class="separate-dialog" width="850" @on-visible-change="close">
    <p slot="header" class="dialog-title">
      <span>拆单</span>
    </p>
    <div>
      <div class="order-number first-line">
        <Row>
          <i-col span="12">
            订单号：{{ orderDetail.orderNo }}
          </i-col>
          <i-col span="12">
            客户：{{ orderDetail.consignerName }}
          </i-col>
        </Row>
      </div>
      <div class="order-number">
        <Row>
          <i-col span="12">
            始发地／目的地：{{ orderDetail.startName + ' - ' + orderDetail.endName }}
          </i-col>
          <i-col span="12">
            费用合计：{{ totalFee }}元
          </i-col>
        </Row>
      </div>
      <Table :columns="columns" :data="cargoList"></Table>
      <div class="border-dashed"></div>
      <div class="separate-action">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem label="批量拆成：" prop="separateNum">
            <InputNumber :min="1" v-model="formInline.separateNum"></InputNumber>
            &nbsp;单
          </FormItem>
          <FormItem>
            <Button @click="handleSeparate">确定</Button>
          </FormItem>
        </Form>
      </div>
      <div class="separate-table">
        <Table :columns="columnsSeparate" :data="separateCargoList"></Table>
      </div>
    </div>
    <div slot="footer">
      <Button
        :disabled="separateCargoList.length === 0"
        type="primary"
        @click="save">
        确定
      </Button>
      <Button  type="default"  @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
/**
 * 批量拆单满足条件：
 * 订单只有一条货物信息
 * 货物的包装数量不为1（若包装数量没有填，则默认为可以按照数量无限制拆）
 * 货物的重量（吨）不为0.001、重量（公斤 ）不为1、体积（方）不为0.000001；（若该字段没有值，则默认为可以按照该数量无限制拆）
 */
import BaseDialog from '@/basic/BaseDialog'
import float from '@/libs/js/float'
import { divideFee, roundFee, roundVolume, roundWeight, roundWeightKg } from '@/libs/js/config'
import { mapGetters } from 'vuex'
import { TABLE_COLUMNS_AVERAGE, TABLE_COLUMNS_AVERAGE_EDIT, COLUMNS_THREE_WEIGHT, COLUMNS_THREE_WEIGHTKG, COLUMNS_TWO_WEIGHT, COLUMNS_TWO_WEIGHTKG } from '../constant/separate.js'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import Cargo from '../libs/cargo.js'

export default {
  name: 'sparate-average',
  mixins: [BaseDialog, tableWeightColumnMixin],
  data () {
    const vm = this
    return {
      columns: TABLE_COLUMNS_AVERAGE,
      columns1Weight: COLUMNS_THREE_WEIGHT(this),
      columns1WeightKg: COLUMNS_THREE_WEIGHTKG(this),
      columns2Weight: COLUMNS_TWO_WEIGHT(this),
      columns2WeightKg: COLUMNS_TWO_WEIGHTKG(this),
      columnsSeparate: TABLE_COLUMNS_AVERAGE_EDIT(this),
      // 订单详情数据
      orderDetail: {},
      // 列表数据
      cargoList: [],
      separateCargoList: [],
      formInline: {
        separateNum: null
      },
      ruleInline: {
        separateNum: [
          { validator: (rule, value, callback) => {
            if (value) {
              if (value === 1) {
                callback(new Error('至少要拆成2单'))
              } else if (vm.cargoQuantity !== 0 && value > vm.cargoQuantity) {
                // 用户输入了数量，必须小于货物数量
                callback(new Error('拆单数量不可大于包装数量'))
              } else {
                callback()
              }
            } else {
              callback(new Error('拆单数量不能为空'))
            }
          },
          trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'WeightOption' // 重量配置
    ]),
    /**
     * 原货物货值
     */
    cargoCost () {
      if (this.cargoList.length > 0) {
        return divideFee(this.cargoList[0].cargoCost) || 0
      }
      return 0
    },
    /**
     * 原货物数量
     */
    cargoQuantity () {
      // 批量拆单，只能拆只有一个货物的时候，所以这里直接取默认第一个货物的数量
      if (this.cargoList.length > 0) {
        return this.cargoList[0].quantity || 0
      }
      return 0
    },
    /**
     * 原货物体积
     */
    cargoVolume () {
      //
      if (this.cargoList.length > 0) {
        return this.cargoList[0].volume || 0
      }
      return 0
    },
    /**
     * 原货物重量
     */
    cargoWeight () {
      //
      if (this.cargoList.length > 0) {
        if (this.WeightOption === 1) {
          return this.cargoList[0].weight || 0
        } else {
          return this.cargoList[0].weightKg || 0
        }
      }
      return 0
    },
    totalFee () {
      if (!this.orderDetail.allocationFee) {
        return 0
      }
      return divideFee(this.orderDetail.allocationFee)
    }
  },
  mounted () {
    // 动态添加吨或公斤列
    if (this.WeightOption === 1) {
      this.triggerWeightColumn(this.columns, this.columns2Weight, 2)
      this.triggerWeightColumn(this.columnsSeparate, this.columns1Weight, 2)
    } else {
      this.triggerWeightColumn(this.columns, this.columns2WeightKg, 2)
      this.triggerWeightColumn(this.columnsSeparate, this.columns1WeightKg, 2)
    }
  },
  methods: {

    handleChange (index, key, value) {
      this.separateCargoList[index][key] = value
    },
    /**
     * 开始批量拆
     */
    handleSeparate () {
      const vm = this
      vm.separateCargoList = []
      this.$refs.formInline.validateField('separateNum', (valid) => {
        if (!valid) {
          if (vm.cargoQuantity) {
            // 基于数量拆分
            vm.separateByQuantity()
          } else {
            // 重量体积平均拆分
            vm.separateByWeightAndVolume()
          }
        }
      })
    },
    /**
     * 没有包装数量，按照体积和重量平均拆分
     */
    separateByWeightAndVolume () {
      const vm = this
      // 若包装数量没有值，则按照重量、体积，平均拆
      let separateNum = vm.formInline.separateNum
      let averageVolume = roundVolume(vm.cargoVolume / separateNum)
      let averageWeight = roundWeight(vm.cargoWeight / separateNum)
      let averageCost = roundFee(vm.cargoCost / separateNum)
      let i = 0
      while (i < separateNum) {
        let cargo = new Cargo(vm.cargoList[0])

        if ((i + 1) !== separateNum) {
          if (vm.WeightOption === 1) {
            cargo.weight = averageWeight
          } else {
            cargo.weightKg = averageWeight
          }
          cargo.volume = averageVolume
          cargo.cargoCost = averageCost
        } else {
          if (vm.WeightOption === 1) {
            cargo.weight = roundWeight(vm.cargoWeight - roundWeight((separateNum - 1) * averageWeight))
          } else {
            cargo.weightKg = roundWeight(vm.weightKg - roundWeight((separateNum - 1) * averageWeight))
          }
          cargo.volume = roundVolume(vm.cargoVolume - roundVolume((separateNum - 1) * averageVolume))
          cargo.cargoCost = roundFee(vm.cargoCost - roundFee((separateNum - 1) * averageCost))
        }

        vm.separateCargoList.push(cargo)
        i++
      }
    },
    /**
     * 基于包装数量，平均拆分货物
     */
    separateByQuantity () {
      const vm = this
      // 如包装数量为10，要拆成6单，不能平均拆。10/6=1.67，前5单每单的包装数量为1，第6单的包装数量为5；
      let separateNum = vm.formInline.separateNum

      let baseNum = float.round(vm.cargoQuantity / separateNum)
      // 每个货物 体积比例
      let volumePercent = float.round(vm.cargoVolume / vm.cargoQuantity)
      // 每个货物重量比例
      let weightPercent = float.round(vm.cargoWeight / vm.cargoQuantity)
      // 货值比例
      let costPercent = float.round(vm.cargoCost / vm.cargoQuantity)
      let i = 0
      while (i < separateNum) {
        let cargo = new Cargo(vm.cargoList[0])

        if ((i + 1) !== separateNum) {
          cargo.quantity = parseInt(baseNum)
        } else {
          // 最后一个，需要将剩下的全都赋值
          cargo.quantity = vm.cargoQuantity - (separateNum - 1) * parseInt(baseNum)
        }
        // 按照数量的比例，计算相应的货物体积和重量值
        cargo.volume = roundVolume(volumePercent * cargo.quantity)
        cargo.cargoCost = roundFee(costPercent * cargo.quantity)
        if (vm.WeightOption === 1) {
          cargo.weight = roundWeight(weightPercent * cargo.quantity)
        } else {
          cargo.weightKg = roundWeightKg(weightPercent * cargo.quantity)
        }
        vm.separateCargoList.push(cargo)
        i++
      }
    },
    // 移除货物
    removeCargo (index) {
      this.separateCargoList.splice(index, 1)
    },
    save () {
      let vm = this
      if (vm.separateCargoList.length === 0) {
        return
      }
      if (vm.cargoQuantity) {
        let totalQuantity = vm.separateCargoList.map((cargo) => cargo.quantity).reduce((total, value) => {
          total = roundVolume(total + value)
          return total
        }, 0)
        if (totalQuantity !== vm.cargoQuantity) {
          this.$Message.error('拆单后货物的数量之和应与原货物信息相等')
          return
        }
      }
      if (vm.cargoWeight) {
        let totalWeight = vm.separateCargoList.reduce((total, cargo) => {
          if (vm.WeightOption === 1) {
            total = roundWeight(total + cargo.weight)
          } else {
            total = roundWeightKg(total + cargo.weightKg)
          }
          return total
        }, 0)
        if (totalWeight !== this.cargoWeight) {
          this.$Message.error('拆单后货物的重量之和应与原货物信息相等')
          return
        }
      }
      if (vm.cargoVolume) {
        let totalVolume = vm.separateCargoList.reduce((total, cargo) => {
          total = roundVolume(total + cargo.volume)
          return total
        }, 0)
        if (totalVolume !== this.cargoVolume) {
          this.$Message.error('拆单后货物的体积之和应与原货物信息相等')
          return
        }
      }
      vm.ok(vm.separateCargoList)
      vm.close()
    }
  }
}
</script>

<style lang='stylus' scoped>
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
  margin-top 20px
.separate-action
  margin 20px 0
  >>> .ivu-form-item-content
        float left
        .ivu-form-item-error-tip
          white-space nowrap
</style>
