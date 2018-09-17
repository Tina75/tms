<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>订单外转id={{id}}</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="100">
        <FormItem label="外转方" prop="name">
          <!-- <Input v-model="info.name" style="width:200px" placeholder="请输入"/> -->
          <AutoComplete
            v-model="info.name"
            :data="outerCompany"
            placeholder="请输入"
            style="width:200px">
          </AutoComplete>
        </FormItem>
        <FormItem label="外转方运单号">
          <Input v-model="info.phone" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="付款方式" prop="payType">
          <Select v-model="info.payType" style="width:200px">
            <Option v-for="item in payTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="外转运费" prop="outerCharge">
          <Input v-model="info.outerCharge" style="width:180px" placeholder="请输入"/>
          <Icon type="ios-calculator" size="26"/>
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
  name: 'editUser',
  mixins: [BaseDialog],
  data () {
    return {
      info: { name: '', waybillNum: '', payType: '0', outerCharge: '' },
      rules: {
        name: { required: true, message: '请填写外转方', trigger: 'blur' },
        payType: { required: true, message: '请选择付款方式', trigger: 'blur' },
        outerCharge: { required: true, message: '请填写外转运费', trigger: 'blur' }
      },
      visibale: true,
      outerCompany: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive'],
      payTypes: [
        { label: '到付', value: '0' },
        { label: '回付', value: '1' },
        { label: '周期结', value: '2' }
      ]
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
          Server({
            url: 'user/update',
            method: 'post',
            data: this.info
          }).then(() => {
            this.ok()
            this.visibale = false
          })
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
