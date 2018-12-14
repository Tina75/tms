<template>
  <Poptip v-model="visible"
          placement="bottom" width="300" class="popTipForRule"
          @on-popper-show="initRule" @on-popper-hide="initRule">
    <Icon type="ios-settings-outline" size="16" style="line-height: 35px"/>
    <div slot="title">
      <div class="title">
        计费类型设置
        <Icon type="ios-close" class="icon" @click="close"/>
      </div>
    </div>
    <div slot="content">
      <CheckboxGroup v-model="ruleTypeValue">
        <Row>
          <Col v-for="(value, key) in ruleTypeAllList" :key="key" span="12" style="margin-top: 17px">
          <Checkbox :label="value.value">{{value.name}}</Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
      <div class="tips">
        <span>注：</span>
        勾选表示展示，取消勾选则表示隐藏
      </div>
      <div class="btns">
        <Button @click="setDefault">恢复默认</Button>
        <Button type="primary" @click="save(ruleTypeValue)">确定</Button>
        <Button  @click="close">取消</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
import Server from '@/libs/js/server'
import { mapGetters, mapActions } from 'vuex'
import { ruleTypeAllList } from '@/libs/constant/ruleType.js'
import _ from 'lodash'
export default {
  name: 'popTipForRule',
  props: {
  },
  data () {
    return {
      visible: false,
      ruleTypeAllList: ruleTypeAllList,
      ruleTypeValue: []
    }
  },
  computed: {
    ...mapGetters(['ruleTypeList'])
  },
  methods: {
    ...mapActions(['getRuleTypeList']),
    initRule () {
      this.getRuleTypeList()
      this.ruleTypeValue = _.cloneDeep(this.ruleTypeList)
    },
    close () {
      this.visible = false
    },
    setDefault () {
      // 显示列默认为：重量（吨）、体积（方）、吨公里、方公里、车型
      this.save(['1', '2', '3', '4', '5'])
    },
    async save (data) {
      await Server({
        url: '/finance/charge/saveRuleType',
        method: 'POST',
        data: {
          customRuleType: data
        }
      }).then((res) => {
        this.$Message.success('保存成功')
        // 关闭弹窗
        this.visible = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .popTipForRule
    /deep/
      .ivu-poptip-arrow
        display none
      .ivu-poptip-title
        padding-top 16px
        padding-bottom 10px
      .title
        color #333
        font-weight 500
        font-size 14px
        line-height 20px
        text-align center
        .icon
          cursor pointer
          float right
          font-size 16px
          font-weight bold
      .ivu-poptip-body
        padding 8px 30px
      .ivu-poptip-title:after
        right 0
        left 0
      .tips
        text-align center
        margin-top 40px
        margin-bottom 23px
        color #999
        font-size 12px
        span
          color #FF9502
      .btns
        border-top 1px solid rgba(237,241,245,1)
        padding-top: 30px
        padding-bottom 20px
        text-align center
        button
          width 70px
          margin-right 10px
</style>
