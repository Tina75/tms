<template>
  <div class="popTip" style="display: inline-block">
    <Poptip>
      <Icon type="ios-more" class="icon"/>
      <div slot="content" class="popTip-content">
        <Row>
          <Col v-for="(item,index) in list" :key = "index" :class="{'payed': item.verifyStatus === 0}" class="item" span="12">
          {{payTypeMap[item.payType]}}{{verifyStatusMap[item.verifyStatus]}}
          </Col>
        </Row>
      </div>
    </Poptip>
  </div>
</template>

<script>
import { payTypeMap, verifyStatusMap } from '../constant/numList'
export default {
  name: 'payTypeDialog',
  props: {
    list: {
      type: Array
    }
  },
  data () {
    return {
      payTypeMap: payTypeMap,
      verifyStatusMap: verifyStatusMap
    }
  },
  mounted () {
    console.log(this.list)
  }
}
</script>

<style scoped lang="stylus">
  .popTip
    /deep/
      .ivu-poptip-body
        width 240px
        padding 20px 20px 10px
      .item
        text-align center
        margin-bottom 10px
      .payed
        color #FA8C15
      .icon
        display inline-block
        width 15px
        height 15px
        border-radius 50%
        line-height 15px
        text-align center
        border 1px solid rgb(81, 90, 110)
</style>
