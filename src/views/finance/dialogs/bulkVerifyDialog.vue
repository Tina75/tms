<template>
  <!--批量核销弹窗-->
  <Modal v-model="visiable" :mask-closable="false" transfer width="500" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <div class="bulk">
      <div class="bulk-header">
        <div class="bulk-left">请选择需要批量核销的费用</div>
        <Checkbox :value="checkAll" class="bulk-right" @on-change="handleCheckAll">全选</Checkbox>
      </div>
      <div class="bulk-content">
        <CheckboxGroup v-model="checkGroup" @on-change="checkAllGroupChange">
          <Row>
            <Col v-for="(item, index) in list" :key="index" span="12">
            <div class="bulk-list">
              <Checkbox :label="item.value" :disabled="item.count === 0" class="bulk-box">{{item.label}}</Checkbox>
              <p v-show="item.count" class="tips">{{item.count}}单 应付费用合计：{{item.money | toPoint}}</p>
            </div>
            </Col>
          </Row>
        </CheckboxGroup>
      </div>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="writeOffAll">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { payTypeMap } from '../constant/numList'
import BaseDialog from '@/basic/BaseDialog'
import float from '@/libs/js/float'
// import _ from 'lodash'
export default {
  name: 'bulkVerifyDialog',
  mixins: [BaseDialog],
  data () {
    return {
      payTypeMap: payTypeMap,
      title: '',
      list: [],
      checkAll: false,
      checkGroup: []
    }
  },
  computed: {
    allValue () {
      let arr = []
      this.list.map(item => {
        if (item.count > 0) arr.push(item.value)
      })
      return arr
    }
  },
  mounted () {
    console.log(this.freshSheet)
  },
  methods: {
    // 全选
    handleCheckAll () {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.checkGroup = this.allValue
      } else {
        this.checkGroup = []
      }
    },
    // 批量核销弹窗
    writeOffAll () {
      this.close()
      let arr = []
      let needPay = 0
      this.list.map(item => {
        this.checkGroup.map(list => {
          if (item.value === list) needPay += float.floor(item.money / 100, 2)
        })
      })
      this.checkGroup.map(item => {
        item.split(',').map(list => {
          if (list) arr.push(parseInt(list))
        })
      })
      this.openDialog({
        name: 'finance/dialogs/writeOff',
        data: {
          ids: arr,
          verifyType: 2,
          needPay: needPay
        },
        methods: {
          ok () {
            this.$Message.success('核销成功')
            this.freshSheet() // 刷新页面
          }
        }
      })
    },
    checkAllGroupChange () {
      if (this.checkGroup.length === this.allValue.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.bulk
  /deep/
    .ivu-checkbox
      margin-right 5px
  .bulk-header
    overflow hidden
    color #333
    font-size 12px
    margin-bottom 30px
    .bulk-left
      float left
    .bulk-right
      float right
  .bulk-list
    margin-bottom 20px
    .bulk-box
      color #333
    .tips
      margin-top 10px
      color #00A4BD
      margin-left 20px
</style>
