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
        <FormItem label="部门名称" prop="departName">
          <AutoComplete
            v-model="info.departName"
            :data="searchDeptNames"
            placeholder="请输入"
            style="width:200px"
            @on-select="handleDeptSelect"
            @on-change="handleSearchDept">
          </AutoComplete>
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
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'editUser',
  mixins: [BaseDialog],
  data () {
    return {
      info: {name: '', userId: '', departId: '', phone: '', departName: ''},
      searchDepts: [],
      searchDeptNames: [],
      rules: {
        name: {required: true, message: '请填写姓名', trigger: 'blur'},
        phone: {required: true, message: '请填写手机号', trigger: 'blur'},
        departName: {required: true, message: '请选择部门', trigger: 'blur'}
      },
      visibale: true
    }
  },
  watch: {
    searchDepts: function (val) {
      this.searchDeptNames = []
      val.map(item => {
        this.searchDeptNames.push(item.departName)
      })
    },
    visibale: function (val) {
      !val && this.close()
    }
  },

  mounted: function () {
    this.info = Object.assign(this.info, this.row)
    console.log(JSON.stringify(this.info))
  },

  methods: {
    handleSearchDept (inputName) {
      inputName && inputName.length > 1 && axios({
        url: 'depart/search',
        method: 'get',
        data: {departName: inputName}
      }).then(({data}) => {
        console.log('search and searchDept change', this.searchDepts)
        this.searchDepts = data.data
      })
    },
    handleDeptSelect (selName) {
      console.log('select')
      const selDept = this.searchDepts.filter(item => {
        return item.departName === selName
      })
      console.log('select get select item', selDept)
      this.info.departId = selDept ? selDept[0].departId : ''
      console.log('info', this.info)
    },
    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          axios({
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
</style>
