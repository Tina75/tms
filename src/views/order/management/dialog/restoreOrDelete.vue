<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="delete-dialog" width="400" @on-visible-change="close">
    <p slot="header" class="dialog-title">{{ name }}</p>
    <div class="tip-text">
      <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
      <div v-if="canDelete" style="display: inline">
        <div v-if="isStatus20">
          <div v-if="check20DelObj.onlyOne">
            订单删除后，提货单将一并删除，且订单不支持再还原
            <Row class="order-box">
              <i-col span="9" style="text-align: right;color: #666;line-height: 20px;">
                提货单号：
              </i-col>
              <i-col span="15" class="pickup-order">
                <p v-for="(item, index) in check20DelObj.billNoList" :key="index">
                  {{ item }}
                </p>
              </i-col>
            </Row>
          </div>
          <div v-else>
            此订单已提货成功，订单删除将不支持还原
          </div>
        </div>
        <div v-else-if="isStatus50">
          <div v-if="check50DelObj.onlyOne">
            订单删除后，提货单和运单将一并删除，且订单不支持再还原
            <Row class="order-box">
              <i-col v-if="check50DelObj.loadbillList.length > 0">
                <Row>
                  <i-col span="9" style="text-align: right;color: #666;line-height: 20px;">
                    提货单号：
                  </i-col>
                  <i-col span="15" class="pickup-order">
                    <p v-for="(item, index) in check50DelObj.loadbillList" :key="index">
                      {{ item }}
                    </p>
                  </i-col>
                </Row>
              </i-col>
              <i-col v-if="check50DelObj.waybillList.length > 0">
                <Row>
                  <i-col span="9" style="text-align: right;color: #666;line-height: 20px;">
                    运单号：
                  </i-col>
                  <i-col span="15" class="pickup-order">
                    <p v-for="(item, index) in check50DelObj.waybillList" :key="index">
                      {{ item }}
                    </p>
                  </i-col>
                </Row>
              </i-col>
            </Row>
          </div>
          <div v-else>
            这些订单状态为已回单，订单删除将不支持还原
          </div>
        </div>
        <div v-else>共选择了{{ id.length }}条订单，确定{{ name }}吗？</div>
      </div>
      <div v-else>
        <div v-if="id.length === 1">{{ message }}</div>
        <div v-else>
          <div v-if="isDisassemble">
            包含已被拆单调度的订单，删除将导致其他订单的删除，暂不支持删除
          </div>
          <div v-else>
            您选中的订单中有订单已在处理中了， “
            <FontIcon type="ico-ing" size="11" color="#9DA1B0"></FontIcon>
            ” 为处理中订单，不可以批量删除
          </div>
          <!-- <div v-else>您选中的订单已有订单在{{ message }}，为保证数据安全，不可以批量删除</div> -->
        </div>
      </div>
    </div>
    <div slot="footer">
      <div v-if="canDelete">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click.native="close">取消</Button>
      </div>
      <div v-else>
        <Button  type="primary"  @click.native="close">我知道了</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import FontIcon from '@/components/FontIcon'
// import _ from 'lodash'
export default {
  name: 'restoreOrDelete',

  components: {
    FontIcon
  },

  mixins: [BaseDialog],

  data () {
    return {
      message: '',
      canDelete: true, // 是否可以删除
      check20DelObj: {}, // 20状态下检查删除接口返回对象
      check50DelObj: {} // 500状态下检查删除接口返回对象
    }
  },

  computed: {
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    },
    // 判断勾选的订单是否status都为20且pickupStatus为1
    isStatus20 () {
      return !this.id.some(this.checkIsStatus20)
    },
    // 判断勾选的订单是否status都为50
    isStatus50 () {
      return !this.id.some(this.checkIsStatus50)
    },
    // 判断勾选的订单是否status都为50且有拆单订单
    isDisassemble () {
      return this.isStatus50 && this.id.some(this.checkIsDisassemble)
    }
  },

  mounted () {
    if (this.name === '删除') {
      if (this.id.length === 1) {
        if (this.id[0].status === 10 && this.id[0].pickupStatus === 1) {
          this.message = '此订单已经在提货中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 20 && this.id[0].pickupStatus === 1) {
          // this.message = '此订单已完成提货，为保证数据安全，不可以删除'
          // this.canDelete = true
          this.check20Delete()
        }
        if (this.id[0].status === 20 && this.id[0].waybillNo) {
          this.message = '此订单已经在送货中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status < 30 && this.id[0].transStatus === 1) {
          this.message = '此订单已经外转处理，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 30) {
          this.message = '此订单已经在途中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 40) {
          this.message = '此订单已经到货，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 50 && this.id[0].disassembleStatus) {
          this.message = '此订单已被拆单调度，删除将导致其他订单的删除，暂不支持删除'
          this.canDelete = false
        }
        if (this.id[0].status === 50 && !this.id[0].disassembleStatus) {
          // this.message = '此订单已完成提货，为保证数据安全，不可以删除'
          // this.canDelete = true
          this.check50Delete()
        }
        if (this.id[0].status === 100) {
          this.message = '此订单已经删除'
          this.canDelete = false
        }
      } else {
        if (this.id.some(this.checkSelectList)) {
          this.canDelete = false
        } else {
          // 都是20状态调待送货下删除接口
          if (this.isStatus20) {
            this.check20Delete()
          }
          // 都是50状态调已回单下删除接口
          if (this.isStatus50) {
            this.check50Delete()
          }
        }
        /*
        if (this.tab === '全部') {
          if (this.id.some(this.checkSelectList)) {
            this.canDelete = false
          }
        } else {
          if (this.tab === '待提货') {
            if (this.id.some(this.checkSelectList)) {
              this.message = '提货中'
              this.canDelete = false
            }
          } else if (this.tab === '待送货') {
            if (this.id.some(this.checkSelectList)) {
              this.message = '送货中'
              this.canDelete = false
            }
          }
        }
        */
      }
    }
  },

  methods: {
    save () {
      if (this.name === '删除') {
        this.doDelete()
      } else {
        this.doRestore()
      }
    },
    // 订单还原
    doRestore () {
      Server({
        url: 'order/recovery',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        this.ok()
        this.$Message.success('还原成功')
        this.close()
      })
    },
    // 订单删除
    doDelete () {
      Server({
        url: 'order/delete',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then(() => {
        this.ok()
        this.$Message.success('删除成功')
        this.close()
      })
    },
    // 筛选选中项是否有不满足条件的选项(已外转订单、待提货下已提货订单、待送货下已送货订单、status大于20的订单)
    checkSelectList (list) {
      if (list.status === 30 ||
          list.status === 40 ||
          (list.status === 50 && list.disassembleStatus) ||
          list.status === 100 ||
          (list.status < 30 && list.transStatus === 1) ||
          (list.status === 10 && list.pickupStatus === 1) ||
          (list.status === 20 && list.waybillNo)) {
        return true
      }
      return false
    },
    checkIsStatus20 (list) {
      if (list.status !== 20 || list.pickupStatus !== 1) {
        return true
      }
      return false
    },
    checkIsStatus50 (list) {
      if (list.status !== 50) {
        return true
      }
      return false
    },
    checkIsDisassemble (list) {
      if (list.disassembleStatus) {
        return true
      }
      return false
    },
    // 待送货下删除接口
    check20Delete () {
      Server({
        url: '/order/modify/wait/deliver/delete/check',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then((res) => {
        this.check20DelObj = res.data.data
      })
    },
    // 已回单下删除接口
    check50Delete () {
      Server({
        url: '/order/modify/receipt/delete/check',
        method: 'post',
        data: { orderIds: this.orderIds }
      }).then((res) => {
        this.check50DelObj = res.data.data
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
  .dialog-title
    text-align center
    font-size 16px
    font-family 'PingFangSC-Medium'
    font-weight 700
    color rgba(47,50,62,1)
    letter-spacing 1px
  .tip-text
    display: flex;
    display -ms-flexbox
    justify-content:center;
    -ms-flex-pack center
  .order-box
    border 1px dashed #ddd
    background #F9F9F9
    padding 8px
    margin-top 14px
  .pickup-order
    color #333
    p
      line-height 20px
</style>
<style lang='stylus'>
  .delete-dialog
    .ivu-modal-body
      padding 24px 40px 20px 40px
</style>
