<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="发货地址:" prop="address">
          <Input v-model="validate.address" :maxlength="60" placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { consignerAddressAdd, consignerAddressUpdate, CODE } from '../client'
export default {
  name: 'sender-address',
  mixins: [BaseDialog],
  data () {
    return {
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        address: ''
      },
      ruleValidate: {
        address: [
          { required: true, message: '发货地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
          this.close()
        }
      })
    },
    add () {
      let data = {
        consignerId: this.consignerId,
        address: this.validate.address
      }
      consignerAddressAdd(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        id: this.id,
        address: this.validate.address
      }
      consignerAddressUpdate(data).then(res => {
        console.log(res)
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
</style>
