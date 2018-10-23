<template>
  <Modal v-model="visiable" :mask-closable="false" width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <p slot="header" style="text-align:center">{{info.code}}</p>
    <Form ref="info" :model="info" :rules="rules" :label-width="80">
      <p style="text-align:center">{{other}}</p>
      <FormItem label="姓名" prop="name">
        <Input v-model="info.name" style="width:200px" placeholder="请输入"/>
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Input v-model="info.phone" style="width:200px" placeholder="请输入"/>
      </FormItem>
      <FormItem label="城市" prop="city">
        <SelectInputForCity v-model="info.code"></SelectInputForCity>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button  type="primary"  @click="save">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
// import Server from '@/libs/js/server'
import SelectInputForCity from '@/components/SelectInputForCity'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'demo-dialog1',
  components: {
    SelectInputForCity
  },
  mixins: [BaseDialog],
  data () {
    return {
      info: { name: '', phone: '', code: '' },
      rules: {
        name: { required: true, message: '请填写姓名', trigger: 'blur' },
        phone: { required: true, message: '请填写手机号', trigger: 'blur' }
      }
    }
  },
  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        console.log(this.code)
        if (valid) {
          // Server({
          //   url: 'user/update',
          //   method: 'post',
          //   data: this.info
          // }).then(() => {
          this.ok()
          // this.close()
          // })
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
</style>
