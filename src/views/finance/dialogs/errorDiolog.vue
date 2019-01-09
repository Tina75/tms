<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="510" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <div class="err-content">
      <div class="err-icon">
        <Icon type="ios-close-circle icon" />
      </div>
      <div class="list">
        <div v-for="(item, index) in errList" :key="index" class="err-list">
          <p class="err-title">{{index+1}}、{{item.title}}</p>
          <!--<p v-for="err in item.arr" :key="err" class="err-text">-->
          <Row class="err-text">
            <Col v-for="err in item.arr" :key="err" span="12" style="margin-bottom: 10px">
            {{err}}
              </Col>
          </Row>
        <!--</p>-->
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'errorDiolog',
  mixins: [BaseDialog],
  data () {
    return {
      title: '',
      errList: []
      // [
      // {
      //   title: '以下单据因为存在异常，不能批量核销',
      //   arr: ['Y10000222222222', 'Y41111225555']
      // },
      //   {
      //     title: '以下单据是月结，不能批量核销',
      //     arr: ['Y10000222222222', 'Y41111225555']
      //   }
      // ]
    }
  },
  methods: {
    save () {
      this.close()
    }
  }
}
</script>

<style scoped lang="stylus">
  .err-content
    display flex
    .err-icon
      flex 0 0 60px
      text-align center
      .icon
        font-size 28px
        color: #F75B5C
    .list
      flex 1
      font-size: 14px
      .err-list
        margin-bottom 30px
        .err-title
          color: rgb(0, 0, 0)
          font-weight: normal
          margin-bottom 15px
        .err-text
          text-align left
          margin-left 23px
          color: #515a6e
          /*margin-bottom 10px*/
</style>
