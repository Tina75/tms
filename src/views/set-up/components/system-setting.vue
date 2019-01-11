<template>
  <div class="system-setting">
    <Tabs :value="value" :animated="false">
      <TabPane label="分摊策略" name="apport">
        <div class="setup-allocation">
          <allocation-strategy ref="orderAllocation" allocation-label="订单：" source="order"></allocation-strategy>
          <div class="allocation-tips">选择以后订单拆单将默认选择此运费分摊策略</div>
          <allocation-strategy ref="transportAllocation" allocation-label="运单&提货单：" source="transport"></allocation-strategy>
          <div class="allocation-tips">选择以后运单和提货单将默认选择此运费分摊策略</div>
          <Button type="primary" class="msgSaveBtn" style="width:86px;left: 22%;" @click="handleSaveAllocation">保存</Button>
        </div>
      </TabPane>
      <TabPane label="开单设置" name="order">
        <div>
          <Unit />
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
/**
 * 系统设置
 */
import Unit from './unit.vue'
import AllocationStrategy from '@/views/transport/components/AllocationStrategy.vue'
import { mapMutations } from 'vuex'
import Server from '@/libs/js/server'
export default {
  name: 'system-setting',
  components: {
    Unit,
    AllocationStrategy
  },
  props: {
    value: {
      type: String,
      default: 'apport'
    }
  },
  methods: {
    ...mapMutations(['allocationStrategySetting']),
    handleSaveAllocation () {
      const data = {
        orderStrategy: this.$refs.orderAllocation.getAllocation(),
        waybillStrategy: this.$refs.transportAllocation.getAllocation()
      }
      Server({
        url: '/set/updateUserAllocationStrategy',
        method: 'post',
        data
      }).then((res) => {
        this.allocationStrategySetting(data)
        this.$Message.success('设置成功')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.system-setting
  min-height 400px
  .setup-allocation
    width 500px
    margin 48px auto
  >>>  .ivu-form-item-label
      width 110px !important
      font-size 14px
      font-family 'PingFangSC-Regular'
      color rgba(0,0,0,1)
  >>>  .ivu-select
      width 300px !important
  .allocation-tips
    font-size 12px
    font-family 'PingFangSC-Regular'
    color rgba(236,78,78,1)
    margin -20px 0 30px 110px

</style>
