<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>订单外转</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="100">
        <FormItem label="外转方" prop="transfereeName">
          <!-- <Input v-model="info.name" style="width:200px" placeholder="请输入"/> -->
          <AutoComplete
            v-model="info.transfereeName"
            :filter-method="filterMethod"
            :data="outerCompany"
            placeholder="请输入"
            style="width:200px">
          </AutoComplete>
        </FormItem>
        <FormItem label="外转方运单号">
          <Input v-model="info.outTransNo" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="付款方式" prop="payType">
          <Select v-model="info.payType" style="width:200px">
            <Option value="1">现付</Option>
            <Option value="2">到付</Option>
            <Option value="3">回单付</Option>
            <Option value="4">月结</Option>
          </Select>
        </FormItem>
        <FormItem label="外转运费" prop="transFee">
          <Input v-model="info.transFee" style="width:180px" placeholder="请输入"/>
          <Icon type="ios-calculator" size="26" color="#00a4bd" @click="showCounter"></Icon>
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
  name: 'outer',
  mixins: [BaseDialog],
  data () {
    return {
      info: { transfereeName: '', outTransNo: '', payType: '', transFee: '' },
      rules: {
        transfereeName: { required: true, message: '请填写外转方', trigger: 'blur' },
        payType: { required: true, message: '请选择付款方式', trigger: 'change' },
        transFee: { required: true, message: '请填写外转运费', trigger: 'blur' }
      },
      visibale: true,
      outerCompany: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive']
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
    // 过滤已维护的客户信息
    filterMethod (value, option) {
      if (value) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
    save () {
      this.$refs['info'].validate((valid) => {
        this.info = Object.assign({}, this.info, {orderId: this.id})
        if (valid) {
          Server({
            url: 'outside/bill/create',
            method: 'post',
            data: this.info
          }).then((res) => {
            this.$Message.success('创建外转单成功')
            this.visibale = false
          })
        }
      })
    },
    // 显示计费规则
    showCounter () {
      this.openDialog({
        name: 'order/create/CounterDialog.vue',
        data: {
          value: 0
        },
        methods: {
          ok (value) {
            // vm.orderForm.freightFee = value || 0
          }
        }
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
