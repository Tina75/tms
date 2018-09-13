<template>
  <Modal v-model="visibale" :mask-closable="true" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="info" :model="info" :rules="rules" :label-width="80">
      <p style="text-align:center">{{other}}</p>
      <FormItem label="姓名" prop="name">
        <Input v-model="info.name" style="width:200px" placeholder="请输入"/>
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Input v-model="info.phone" style="width:200px" placeholder="请输入"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="visibale = false">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'demo-dialog1',
  mixins: [BaseDialog],
  data () {
    return {
      info: { name: '', phone: '' },
      rules: {
        name: { required: true, message: '请填写姓名', trigger: 'blur' },
        phone: { required: true, message: '请填写手机号', trigger: 'blur' }
      },
      visibale: true
    }
  },
  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          // Server({
          //   url: 'user/update',
          //   method: 'post',
          //   data: this.info
          // }).then(() => {
          this.ok()
          this.visibale = false
          // })
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
</style>
