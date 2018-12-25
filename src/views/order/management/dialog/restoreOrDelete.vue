<template>
  <Modal v-model="visiable" :mask-closable="true" transfer class="delete-dialog" width="360" @on-visible-change="close">
    <p slot="header" class="dialog-title">{{ name }}</p>
    <div class="tip-text">
      <Icon type="ios-information-circle" size="24" color="#FFBB44" style="margin-top: -2px;margin-right: 5px;"></Icon>
      <div v-if="canDelete" style="display: inline">共选择了{{ id.length }}条订单，确定{{ name }}吗？</div>
      <div v-else>
        <div v-if="id.length === 1">{{ message }}</div>
        <div v-else>
          <div>
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
export default {
  name: 'restoreOrDelete',

  components: {
    FontIcon
  },

  mixins: [BaseDialog],

  data () {
    return {
      message: '',
      canDelete: true // 是否可以删除
    }
  },

  computed: {
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },

  mounted () {
    // console.log(this.tab)
    if (this.name === '删除') {
      if (this.id.length === 1) {
        if (this.id[0].status === 10 && this.id[0].pickupStatus === 1) {
          this.message = '此订单已经在提货中，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 20 && this.id[0].pickupStatus === 1) {
          this.message = '此订单已完成提货，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 20 && this.id[0].dispatchStatus === 1) {
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
        if (this.id[0].status === 50) {
          this.message = '此订单已经回单，为保证数据安全，不可以删除'
          this.canDelete = false
        }
        if (this.id[0].status === 100) {
          this.message = '此订单已经删除'
          this.canDelete = false
        }
      } else {
        if (this.id.some(this.checkSelectList)) {
          this.canDelete = false
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
      if (list.status > 20 || (list.status < 30 && list.transStatus === 1) || (list.status < 30 && list.pickupStatus === 1) || (list.status === 20 && list.dispatchStatus === 1)) {
        return true
      }
      return false
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
</style>
<style lang='stylus'>
  .delete-dialog
    .ivu-modal-body
      padding 24px 45px 20px 45px
</style>
