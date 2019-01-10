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
            <InputNumber :min="1" v-model="formInline.separateNum" :parser="handleParser"></InputNumber>
            &nbsp;单
          </FormItem>
          <FormItem>
            <Button @click="handleSeparate">确定</Button>
          </FormItem>
        </Form>
      </div>
      <div class="separate-table">
        <Table v-show="separateCargoList.length > 0" ref="separateTable" :columns="columnsSeparate" :data="separateCargoList">
          <template slot-scope="{row, index}" slot="quantity">
            <span v-if="!orderDetail.quantity">-</span>
            <TagNumberInput v-else :precision="0" :min="0" :value="row.quantity" @on-change="(v)=>handleChange(index,'quantity',v)"></TagNumberInput>
          </template>
          <template slot-scope="{row, index}" slot="volume">
            <span v-if="!orderDetail.volume">-</span>
            <TagNumberInput v-else :min="0" :precision="$numberPrecesion.volume" :value="row.volume" @on-change="(v)=>handleChange(index,'volume',v)"></TagNumberInput>
          </template>
          <template slot-scope="{row, index}" slot="cargoCost">
            <span v-if="!cargoCost">-</span>
            <TagNumberInput v-else :min="0" :precision="$numberPrecesion.fee" :value="divideFee(row.cargoCost)" @on-change="(v)=>handleChange(index,'cargoCost',v)"></TagNumberInput>
          </template>
        </Table>
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
import { divideFee, roundFee, roundVolume, roundWeight, roundWeightKg, multiplyFee } from '@/libs/js/config'
import { mapGetters } from 'vuex'
import { TABLE_COLUMNS_AVERAGE, TABLE_COLUMNS_AVERAGE_EDIT, COLUMNS_THREE_WEIGHT, COLUMNS_THREE_WEIGHTKG, COLUMNS_TWO_WEIGHT, COLUMNS_TWO_WEIGHTKG } from '../constant/separate.js'
import tableWeightColumnMixin from '@/views/transport/mixin/tableWeightColumnMixin.js'
import Cargo from '../libs/cargo.js'
import NP from 'number-precision'
import TagNumberInput from '@/components/TagNumberInput'
import _ from 'lodash'
export default {
  name: 'sparate-average',
  components: {
    TagNumberInput
  },
  mixins: [BaseDialog, tableWeightColumnMixin],

  data () {
    const vm = this
    return {
      columns: TABLE_COLUMNS_AVERAGE(this), // 顶部
      columns1Weight: COLUMNS_THREE_WEIGHT(this), // 编辑表格的表头
      columns1WeightKg: COLUMNS_THREE_WEIGHTKG(this),
      columns2Weight: COLUMNS_TWO_WEIGHT(this), // 顶部
      columns2WeightKg: COLUMNS_TWO_WEIGHTKG(this),
      columnsSeparate: TABLE_COLUMNS_AVERAGE_EDIT(this), // 编辑表格的表头
      // 订单详情数据
      orderDetail: {},
      // 列表数据
      cargoList: [],
      separateCargoList: [],
      backupCargoList: [], // 具体的变化操作数据
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
          // trigger： 上下箭头，必须触发chang
          trigger: 'change' }
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
        return this.cargoList[0].cargoCost || 0
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
    divideFee: divideFee,
    /**
     * 拆单数量必须为整数
     */
    handleParser (value) {
      if (value) {
        return parseInt(value).toString()
      }
      return value
    },
    handleChange (index, key, value) {
      if (key === 'cargoCost') {
        this.backupCargoList[index][key] = multiplyFee(value)
      } else {
        this.backupCargoList[index][key] = value
      }
    },
    /**
     * 开始批量拆
     */
    handleSeparate () {
      const vm = this
      vm.separateCargoList = []
      vm.backupCargoList = []
      this.$refs.formInline.validateField('separateNum', (valid) => {
        if (!valid) {
          if (vm.cargoQuantity) {
            // 基于数量拆分，基于数量的话，需要将数量的基数算出平均值，体积和重量需要跟随数量进行计算
            vm.separateByQuantity()
          } else {
            // 重量体积平均拆分
            vm.separateByWeightAndVolume()
          }
          // vm.separateAverage()
        }
      })
    },
    /**
     * 基于包装数量，平均拆分货物数量
     * 重量，体积和货值都要基于货物数量分摊数值
     */
    separateByQuantity () {
      const vm = this
      // 如包装数量为10，要拆成6单，不能平均拆。10/6=1.67，前5单每单的包装数量为1，第6单的包装数量为5；
      let separateNum = vm.formInline.separateNum
      let cargoCost = divideFee(vm.cargoCost)
      let baseNum = float.floor(NP.divide(vm.cargoQuantity, separateNum))
      // 每个货物 体积比例
      let volumePercent = float.floor(NP.divide(vm.cargoVolume, vm.cargoQuantity), this.$numberPrecesion.volume)
      // 每个货物重量比例
      let weightPercent = float.floor(NP.divide(vm.cargoWeight, vm.cargoQuantity), vm.WeightOption === 1 ? this.$numberPrecesion.weight : this.$numberPrecesion.weightKg)
      // 货值比例
      let costPercent = float.floor(NP.divide(cargoCost, vm.cargoQuantity), vm.$numberPrecesion.fee)
      let i = 0
      let baseAverageNum = parseInt(baseNum)
      while (i < separateNum) {
        let cargo = new Cargo(vm.cargoList[0])

        if ((i + 1) !== separateNum) {
          cargo.quantity = baseAverageNum
          // 按照数量的比例，计算相应的货物体积和重量值
          cargo.volume = roundVolume(NP.times(volumePercent, cargo.quantity))
          cargo.cargoCost = multiplyFee(NP.times(costPercent, cargo.quantity))
          if (vm.WeightOption === 1) {
            cargo.weight = roundWeight(NP.times(weightPercent, cargo.quantity))
          } else {
            cargo.weightKg = roundWeightKg(NP.times(weightPercent, cargo.quantity))
          }
        } else {
          // 最后一个，需要将剩下的全都赋值
          cargo.quantity = NP.minus(vm.cargoQuantity, NP.times((separateNum - 1), parseInt(baseNum)))
          /**
           * 按照数量的比例，计算相应的货物体积和重量值
           * ! 但是这样永远都有浮点数的缺陷，少0.0001,所以要用已有的数减去
           */
          // cargo.volume = roundVolume(NP.times(volumePercent, cargo.quantity))
          // cargo.cargoCost = multiplyFee(NP.times(costPercent, cargo.quantity))
          // if (vm.WeightOption === 1) {
          //   cargo.weight = roundWeight(NP.times(weightPercent, cargo.quantity))
          // } else {
          //   cargo.weightKg = roundWeight(NP.times(weightPercent, cargo.quantity))
          // }
          /**
           * 这里是将除最后一个货物信息外所有的货物和累计起来，用总和减去，剩下来的值就是最后一条货物的值
           */
          cargo.volume = NP.minus(vm.cargoVolume, roundVolume(NP.times(volumePercent, baseAverageNum, (separateNum - 1))))
          cargo.cargoCost = multiplyFee(NP.minus(cargoCost, NP.times(costPercent, baseAverageNum, (separateNum - 1))))
          if (vm.WeightOption === 1) {
            cargo.weight = NP.minus(vm.cargoWeight, roundWeight(NP.times(weightPercent, baseAverageNum, (separateNum - 1))))
          } else {
            cargo.weightKg = NP.minus(vm.cargoWeight, roundWeight(NP.times(weightPercent, baseAverageNum, (separateNum - 1))))
          }
          // this.setCargoLeftValue(cargo, cargoCost)
        }

        vm.separateCargoList.push(cargo)
        i++
      }
      vm.backupCargoList = _.cloneDeep(vm.separateCargoList)
    },
    /**
     * 2000 / 3 6666.66666667
     * 1. 如果四舍五入，会导致前面会多分配0.0001
     * 2. 所以这里需要floor，不四舍五入
     */
    separateByWeightAndVolume () {
      const vm = this
      // 如包装数量为10，要拆成6单，不能平均拆。10/6=1.67，前5单每单的包装数量为1，第6单的包装数量为5；
      let separateNum = vm.formInline.separateNum
      let cargoCost = divideFee(vm.cargoCost)
      // 每个货物 体积比例
      let volumePercent = float.floor(NP.divide(vm.cargoVolume, separateNum), this.$numberPrecesion.volume)
      // 每个货物重量比例
      let weightPercent = float.floor(NP.divide(vm.cargoWeight, separateNum), vm.WeightOption === 1 ? this.$numberPrecesion.weight : this.$numberPrecesion.weightKg)
      // 货值比例
      let costPercent = float.floor(NP.divide(cargoCost, separateNum), this.$numberPrecesion.fee)
      let i = 0
      while (i < separateNum) {
        let cargo = new Cargo(vm.cargoList[0])

        if ((i + 1) !== separateNum) {
          // 按照数量的比例，计算相应的货物体积和重量值
          cargo.volume = roundVolume(volumePercent)
          cargo.cargoCost = roundFee(multiplyFee(costPercent))
          if (vm.WeightOption === 1) {
            cargo.weight = roundWeight(weightPercent)
          } else {
            cargo.weightKg = roundWeightKg(weightPercent)
          }
        } else {
          // 最后一个，需要将剩下的全都赋值
          // vm.setCargoLeftValue(cargo, cargoCost)
          if (vm.WeightOption === 1) {
            cargo.weight = roundWeight(NP.minus(vm.cargoWeight, NP.times((separateNum - 1), weightPercent)))
          } else {
            cargo.weightKg = roundWeightKg(NP.minus(vm.cargoWeight, NP.times((separateNum - 1), weightPercent)))
          }
          cargo.volume = roundVolume(NP.minus(vm.cargoVolume, NP.times((separateNum - 1), volumePercent)))
          cargo.cargoCost = roundFee(NP.minus(multiplyFee(cargoCost), NP.times((separateNum - 1), multiplyFee(costPercent))))
        }

        vm.separateCargoList.push(cargo)
        i++
      }
      vm.backupCargoList = _.cloneDeep(vm.separateCargoList)
    },
    /**
     * 最后一个货物，取总的货物值-减去已经分配的
     */
    setCargoLeftValue (cargo, cargoCost) {
      const vm = this
      let totals = vm.separateCargoList.reduce((oTotals, cargo) => {
        oTotals.weight = roundWeight(NP.plus(oTotals.weight, cargo.weight))
        oTotals.weightKg = roundWeightKg(NP.plus(oTotals.weightKg, cargo.weightKg))
        oTotals.volume = roundVolume(NP.plus(oTotals.volume, cargo.volume))
        oTotals.cargoCost = roundFee(NP.plus(oTotals.cargoCost, cargo.cargoCost))
        return oTotals
      }, { weight: 0, weightKg: 0, volume: 0, cargoCost: 0 })
      if (vm.WeightOption === 1) {
        cargo.weight = roundWeight(NP.minus(vm.cargoWeight, totals.weight))
      } else {
        cargo.weightKg = roundWeightKg(NP.minus(vm.cargoWeight, totals.weightKg))
      }
      cargo.volume = roundVolume(NP.minus(vm.cargoVolume, totals.volume))
      cargo.cargoCost = roundFee(NP.minus(multiplyFee(cargoCost), totals.cargoCost))
    },
    // 移除货物
    removeCargo (index) {
      this.backupCargoList.splice(index, 1)
      this.separateCargoList = _.cloneDeep(this.backupCargoList)
    },
    save () {
      let vm = this
      if (vm.backupCargoList.length <= 1) {
        this.$Message.error('至少要拆成2单')
        return
      }
      let errorKeywords = []
      if (vm.cargoQuantity) {
        let totalQuantity = vm.backupCargoList.map((cargo) => cargo.quantity).reduce((total, value) => {
          total = roundVolume(NP.plus(total, value))
          return total
        }, 0)
        if (totalQuantity !== vm.cargoQuantity) {
          errorKeywords.push('数量')
        }
      }
      if (vm.cargoWeight) {
        let totalWeight = vm.backupCargoList.reduce((total, cargo) => {
          if (vm.WeightOption === 1) {
            total = roundWeight(NP.plus(total, cargo.weight))
          } else {
            total = roundWeightKg(NP.plus(total, cargo.weightKg))
          }
          return total
        }, 0)
        if (totalWeight !== this.cargoWeight) {
          errorKeywords.push('重量')
        }
      }
      if (vm.cargoVolume) {
        let totalVolume = vm.backupCargoList.reduce((total, cargo) => {
          total = roundVolume(NP.plus(total, cargo.volume))
          return total
        }, 0)
        if (totalVolume !== this.cargoVolume) {
          errorKeywords.push('体积')
        }
      }
      if (vm.cargoCost) {
        let totalCost = vm.backupCargoList.reduce((total, cargo) => {
          total = roundFee(NP.plus(total, cargo.cargoCost))
          return total
        }, 0)
        if (totalCost !== vm.cargoCost) {
          errorKeywords.push('货值')
        }
      }
      if (errorKeywords.length > 0) {
        this.$Message.error(`拆单后货物的${errorKeywords.join('、')}之和应与原货物信息相等`)
        return
      }
      vm.ok(vm.backupCargoList)
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
