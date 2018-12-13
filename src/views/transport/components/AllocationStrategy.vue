<template>
  <div>
    <Form ref="allocationForm" :label-width="82" :rules="rules" label-position="left">
      <FormItem :label="allocationLabel" class="detail-form-label" prop="allocation">
        <Select v-model="allocation" transfer placeholder="请选择" style="width: 180px;" @on-change="handleChange">
          <Option v-for="opt in allocationStrategy" :key="opt.value" :value="opt.value">{{opt.label}}</Option>
        </Select>
        <Tooltip :content="content" placement="right" transfer max-width="500">
          <Icon type="ios-alert" size="20" color="#FFBB44" style="margin-left: 14px;"/>
        </Tooltip>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import allocationStrategy from '../constant/allocation.js'
import { mapActions } from 'vuex'

export default {
  name: 'AllocationStrategy',

  props: {
    // 使用场景：1、order:订单拆单    2、transport：提货和送货
    source: {
      type: String,
      default: 'transport'
    },
    // 传入的订单list,需要校验每个订单的数量、体积、重量
    allocationOrders: {
      type: Array,
      default: () => {
        return [{
          quantity: 1,
          weight: 1,
          volume: 1
        }]
      }
    },
    // 传入的标签
    allocationLabel: {
      type: String,
      default: '分摊策略：'
    },
    // 更新选项后向父组件传值
    changeAllocationStrategy: Function
  },
  data () {
    // 9位整数 2位小数
    const validateStrategy = (rule, value, callback) => {
      if (this.allocation === 1) {
        callback()
      } else if (this.allocation === 2 && validAllocationOrders('quantity')) {
        callback(new Error('存在未填写包装数量的订单'))
      } else if (this.allocation === 3 && validAllocationOrders('weight')) {
        callback(new Error('存在未填写重量的订单'))
      } else if (this.allocation === 4 && validAllocationOrders('volume')) {
        callback(new Error('存在未填写体积的订单'))
      }
    }
    const validAllocationOrders = (type) => {
      if (type === 'quantity') {
        return this.allocationOrders.some((item) => {
          return item.quantity <= 0
        })
      } else if (type === 'weight') {
        return this.allocationOrders.some((item) => {
          return item.weight <= 0
        })
      } else if (type === 'volume') {
        return this.allocationOrders.some((item) => {
          return item.volume <= 0
        })
      }
    }
    return {
      allocation: 1, // 默认按订单数分摊
      rules: {
        allocation: [
          { validator: validateStrategy }
        ]
      },
      allocationStrategy,
      content: `分摊策略用于将合计运费按分摊策略分摊到订单里，以便算出每个订单的利润。
        按订单数分摊：按照单据里包含的订单数量平均分配的合计运费。
        按件数分摊：按照每个订单里的件数的占比来分摊合计运费。
        按重量分摊：按照每个订单里的重量的占比来分摊合计运费。
        按体积分摊：按照每个订单里的体积的占比来分摊合计运费。`
    }
  },
  watch: {
    allocationOrders (val) {
      this.$refs.allocationForm.validate()
    }
  },
  mounted () {
    this.getAllocationStrategy().then((res) => {
      let data = res.data.data
      this.allocation = this.source === 'order' ? data.orderStrategy : data.waybillStrategy
      this.handleChange(this.allocation) // 初始化传值给父组件
      this.$refs.allocationForm.validate()
    })
  },

  methods: {
    ...mapActions([
      'getAllocationStrategy'
    ]),
    getAllocation () {
      return this.allocation
    },
    handleChange (val) {
      this.$emit('changeAllocationStrategy', val)
    }
  }
}

</script>

<style lang='stylus' scoped>

</style>
