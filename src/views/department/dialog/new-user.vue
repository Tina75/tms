<!--  -->
<template>
  <div>
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>修改员工信息</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="80">
        <FormItem label="姓名" prop="name">
          <Input v-model="info.name" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="info.phone" style="width:200px" placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  type="error" size="large" long @click="save">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/axios'
export default {
  name: 'newUser',
  data () {
    return {
      info: {name: '', phone: ''},
      searchDepts: [],
      searchDeptNames: [],
      rules: {
        name: {required: true, message: '请填写姓名', trigger: 'blur'},
        phone: {required: true, message: '请填写手机号', trigger: 'blur'}
      },
      visibale: true
    }
  },
  watch: {
  },
  methods: {
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          axios({
            url: 'user/add',
            method: 'post',
            data: Object.assign({departId: this.id}, this.info)
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
</style>
