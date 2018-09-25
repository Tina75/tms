<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>{{name}}</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="100">
        <FormItem :label="'共' + name + '回单数量'" style="margin-left: 40px;">
          <span style="color: #00A4BD;margin-right: 5px;font-size: 13px;">{{id.length}}</span>份
        </FormItem>
        <FormItem :label="name === '回收' ? '回收人' : '接收人'" prop="name">
          <Input v-model="info.name" :maxlength="15" style="width:200px" placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'return',
  mixins: [BaseDialog],
  data () {
    return {
      info: { name: '' },
      rules: {
        name: { required: true, message: '请填写回收人', trigger: 'blur' }
      },
      visibale: true
    }
  },

  computed: {
    // 订单ID集合
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    },
    // 回单id集合
    ids () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.receiptOrder.id)
      })
      return arr
    }
  },

  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },

  mounted: function () {
  },

  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          let status = this.name === '回收' ? 1 : 2
          this.doRecovery(status)
        }
      })
    },
    // receiptStatus：1回收   2返厂
    doRecovery (status) {
      const data = {
        receiptStatus: status,
        orderIds: this.orderIds, // 订单id集合
        ids: this.ids // 回单id集合
      }
      if (status === 1) { // 回收人
        data.recoveryName = this.info.name
      } else { // 返厂人
        data.returnName = this.info.name
      }
      Server({
        url: 'order/updateReceiptOrder',
        method: 'post',
        data: data
      }).then(() => {
        this.ok()
        this.visibale = false
        this.$Message.success(this.name + '成功')
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
</style>
