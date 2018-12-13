<template>
  <Poptip title="计费类型设置" placement="bottom" width="300" class="popTipForRule">
    <Icon type="ios-settings-outline" size="16" style="line-height: 35px"/>
    <div slot="content">
      <CheckboxGroup v-model="value">
        <Row>
          <Col v-for="(value, key) in ruleTypeMap" :key="key" span="12" style="margin-top: 17px">
          <Checkbox :label="value" :value="key"></Checkbox>
          </Col>
        </Row>
      </CheckboxGroup>
      <div class="tips">
        <span>注：</span>
        勾选表示展示，取消勾选则表示隐藏
      </div>
      <div class="btns">
        <Button>回复默认</Button>
        <Button type="primary">确定</Button>
        <Button>取消</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
export default {
  name: 'popTipForRule',
  props: {
  },
  data () {
    return {
      ruleTypeMap: {
        '1': '重量（吨）',
        '7': '重量（公斤）',
        '2': '体积（方）',
        '3': '吨公里',
        '6': '公斤公里',
        '4': '方公里',
        '5': '车型'
      },
      value: []
    }
  },
  mounted () {
    console.log(this.ruleTypeMap)
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
      .ivu-poptip-title-inner
        color #333
        line-height 20px
        text-align center
      .ivu-poptip-body
        padding 8px 30px
      .ivu-poptip-title:after
        right 0
        left 0
      .tips
        margin-top 40px
        margin-bottom 23px
        color #999
        font-size 12px
        span
          color #FF9502
      .btns
        button
          width 70px
          margin-right 10px
</style>
