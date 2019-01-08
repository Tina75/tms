<template>
  <Poptip v-model="visible"
          placement="bottom" width="300" class="popTipForRule"
          @on-popper-show="init" @on-popper-hide="init">
    <i class="icon font_family icon-ico-setting setPosition"></i>
    <div slot="title">
      <div class="title">
        常发货物设置
        <Icon type="ios-close" class="icon" @click="close"/>
      </div>
    </div>
    <div slot="content">
      <CheckboxGroup v-model="CargoValue">
        <Row>
          <Col v-for="(value, key) in CargoList" :key="key" span="12" style="margin-top: 17px; text-align: left">
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
        <Button type="primary" @click="save(CargoValue)">确定</Button>
        <Button  @click="close">取消</Button>
      </div>
    </div>
  </Poptip>
</template>

<script>
import Server from '@/libs/js/server'
import { mapGetters, mapActions } from 'vuex'
// import _ from 'lodash'
const CargoInit = [
  {
    name: '货物编号',
    value: 'cargoNoOption'
  },
  {
    name: '货值',
    value: 'cargoCostOption'
  },
  {
    name: '包装方式',
    value: 'unitOption'
  },
  {
    name: '包装尺寸',
    value: 'dimensionOption'
  },
  {
    name: '重量（吨）',
    value: 'weightOption'
  },
  {
    name: '重量（公斤）',
    value: 'weightKgOption'
  },
  {
    name: '体积（方）',
    value: 'volumeOption'
  },
  {
    name: '备注1',
    value: 'remark1Option'
  },
  {
    name: '备注2',
    value: 'remark2Option'
  }
]
const defaltCargo = ['cargoNoOption', 'cargoCostOption', 'unitOption', 'dimensionOption', 'weightOption', 'volumeOption', 'remark1Option', 'remark2Option']
export default {
  name: 'setCargo',
  props: {
  },
  data () {
    return {
      visible: false,
      CargoList: CargoInit,
      CargoValue: []
    }
  },
  computed: {
    ...mapGetters(['tmsCargoDto'])
  },
  mounted () {
    this.getConfiguration()
  },
  methods: {
    ...mapActions(['getConfiguration']),
    init () {
      this.getConfiguration()
      let arr = []
      for (let key in this.tmsCargoDto) {
        if (this.tmsCargoDto[key] === 1) arr.push(key)
      }
      this.CargoValue = arr
    },
    close () {
      this.visible = false
    },
    setDefault () {
      // 默认展示字段：货物名称、货物编号、货值、包装方式、包装尺寸、重量（吨）、体积（方）、备注1、备注2
      this.save(defaltCargo)
    },
    async save (data) {
      let obj = {}
      CargoInit.map(item => {
        obj[item.value] = 2
        data.map(list => {
          if (item.value === list) obj[item.value] = 1
        })
      })
      await Server({
        url: '/consigner/cargo/setSave',
        method: 'POST',
        data: obj
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
    vertical-align text-bottom
    margin-left 5px
    cursor pointer
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
      text-align left
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
        padding 0
        height 32px
        width 70px
        margin-right 10px
    .setPosition
      position relative
      top 2px
</style>
