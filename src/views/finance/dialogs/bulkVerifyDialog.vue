<template>
  <!--批量核销弹窗-->
  <Modal v-model="visiable" :mask-closable="false" class="modal" transfer width="520" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <div class="bulk">
      <div class="bulk-header">
        <div class="bulk-left">请选择需要批量核销的费用：</div>
        <Checkbox :value="checkAll" class="bulk-right" @on-change="handleCheckAll">全选</Checkbox>
      </div>
      <div class="bulk-content">
        <CheckboxGroup v-model="checkGroup" @on-change="checkAllGroupChange">
          <Row>
            <Col v-for="(item, index) in list" :key="index" span="12">
            <div class="bulk-list">
              <Checkbox :label="item.value" :disabled="item.count === 0" class="bulk-box">{{item.label}}</Checkbox>
              <p v-show="item.count" class="tips">{{item.count}}单 应付费用总计：{{item.money | toPoint}}</p>
            </div>
            </Col>
          </Row>
        </CheckboxGroup>
        <liner class="liner"></liner>
      </div>
    </div>
    <div slot="footer">
      <Button  type="primary"  @click="writeOffAll">核销</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import { payTypeMap } from '../constant/numList'
import BaseDialog from '@/basic/BaseDialog'
import float from '@/libs/js/float'
import '@/libs/js/filter'
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
    // console.log(this.freshSheet)
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
      let _this = this
      let arr = []
      let needPay = 0
      _this.list.map(item => {
        _this.checkGroup.map(list => {
          if (item.value === list) needPay += float.floor(item.money / 100, 2)
        })
      })
      _this.checkGroup.map(item => {
        item.split(',').map(list => {
          if (list) arr.push(parseInt(list))
        })
      })
      if (arr.length === 0) {
        _this.$Message.error('请先选择')
        return
      }
      _this.close()
      _this.openDialog({
        name: 'finance/dialogs/writeOff',
        data: {
          ids: arr,
          verifyType: 2,
          needPay: needPay
        },
        methods: {
          ok () {
            _this.close()
            _this.$Message.success('核销成功')
            _this.freshSheet() // 刷新页面
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
.modal /deep/ .ivu-modal-body
  padding-right 20px
.bulk
  /*padding 0 30px*/
  /deep/
    .ivu-checkbox
      margin-right 5px
  .bulk-content
    position relative
  .liner
    position absolute
    width 1px
    top 0
    height 228px
    border-right 1px solid rgba(237,241,245,1)
    right 260px
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
    font-size 12px
    margin-bottom 20px
    height 50px
    .bulk-box
      color #333
    .tips
      margin-top 10px
      color #00A4BD
      margin-left 20px
</style>
