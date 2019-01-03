<template>
  <div  class="popTip" style="display: inline-block">
    <Poptip trigger="hover">
      <!--<Icon type="icon-ico-more" class="icon"/>-->
      <!--<i class="icon icon-ico-card"></i>-->
      <FontIcon  size="14" type="ico-more" ></FontIcon>
      <div slot="content" class="popTip-content">
        <Row>
          <Col v-for="(item,index) in listSort" :key = "index" :class="{'payed': item.verifyStatus === 0}" class="item" span="12">
          {{payTypeMap[item.payType]}}{{verifyStatusMap[item.verifyStatus]}}
          </Col>
        </Row>
      </div>
    </Poptip>
  </div>
</template>

<script>
import { payTypeMap, verifyStatusMap } from '../constant/numList'
import FontIcon from '@/components/FontIcon'
import _ from 'lodash'
export default {
  name: 'payTypeDialog',
  components: { FontIcon },
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
  computed: {
    listSort () {
      let verified = this.list.filter(item => { return item.verifyStatus === 1 })
      verified = _.sortBy(verified, (item) => { return item.payType })
      let unVerified = this.list.filter(item => { return item.verifyStatus === 0 })
      unVerified = _.sortBy(unVerified, (item) => { return item.payType })
      return [].concat(unVerified, verified)
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
</style>
