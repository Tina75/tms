<template>
  <div>
    <Form :label-width="82" label-position="left">
      <FormItem label="分摊策略：">
        <Select v-model="allocation" transfer placeholder="请选择" style="width: 180px;">
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

  },
  data () {
    return {
      allocation: 1, // 默认按订单数分摊
      allocationStrategy,
      content: `分摊策略用于将合计运费按分摊策略分摊到订单里，以便算出每个订单的利润。
        按订单数分摊：按照单据里包含的订单数量平均分配的合计运费。
        按件数分摊：按照每个订单里的件数的占比来分摊合计运费。
        按重量分摊：按照每个订单里的重量的占比来分摊合计运费。
        按体积分摊：按照每个订单里的体积的占比来分摊合计运费。`
    }
  },

  mounted () {
    this.getAllocationStrategy().then((res) => {
      console.log(res)
    })
  },

  methods: {
    ...mapActions([
      'getAllocationStrategy'
    ]),
    getAllocation () {
      return this.allocation
    }
  }
}

</script>

<style lang='stylus' scoped>

</style>
