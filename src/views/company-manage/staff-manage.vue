<template>
  <div class="temAll">
    <Col span="23">
    <Card class="searchCard" dis-hover>
      <Form :model="formSearch" :label-width="80" style="padding-left:-20px;">
        <Col span="6">
        <FormItem label="姓名：">
          <SelectInput v-model="formSearch.name" :remote="true" :remote-method="searchName" placeholder="请输入姓名"></SelectInput>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="账号：">
          <Input v-model="formSearch.phone" placeholder="请输入账号"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="角色：">
          <Select v-model="formSearch.roleId" clearable>
            <Option
              v-for="item in selectList"
              :value="item.id"
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3">
        <FormItem>
          <Button type="primary" @click="searchBtn">搜索</Button>
        </FormItem>
        </Col>
      </Form>
    </Card>
    </Col>
    <Col span="23">
    <Button v-if="hasPower(140201)" type="primary" style="margin-top:6px;" @click="eaditStaff('add')">添加员工</Button>
    </Col>
    <Col span="23">
    <page-table :columns="menuColumns" :keywords="formSearchInit" url="employee/list" list-field="list" style="margin-top: 20px;"></page-table>
    </Col>
    <Modal v-model="visibaleTransfer" width="400">
      <p slot="header" style="text-align:center">
        <span>转移权限</span>
      </p>
      <Form ref="transferformModal" :model="transferformModal" :rules="rulesTransfer" :label-width="100" style="height: 70px;">
        <FormItem label="角色账号：" prop="staff">
          <Select v-model="transferformModal.staff" clearable>
            <Option
              v-for="item in staffSelectList"
              :value="item.phone"
              :key="item.phone">
              {{ item.name + '/' + item.phone}}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <p style="color:red; margin-top:-10px;">确认操作后，您将于接收该角色的人员互换角色</p>
        </FormItem>
      </Form>
      <div slot="footer" style="margin-top:20px;">
        <Button type="primary" @click="transferFormSub('transferformModal')">确定</Button>
        <Button  @click="transferCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <i class="icon font_family icon-bangzhuzhongxin" style="font-size:28px; background: white; color: #FFBB44;float:left;"></i>
      <p style="margin-top:13px; margin-left:40px;">确定要删除用户{{this.roleRowInit.name}}吗?</P>
      <div slot="footer">
        <Button type="primary" @click="removeSubForm">确定</Button>
        <Button  @click="removeCancelForm">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import pageTable from '@/components/page-table'
import Server from '@/libs/js/server'
import SelectInput from '@/components/SelectInput'
export default {
  name: 'staff-manage',
  components: {
    pageTable,
    SelectInput
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '员工管理'
  },
  data () {
    return {
      userInfo: {},
      visibaleTransfer: false,
      visibaleRemove: false,
      visibaleMoadlTitle: '',
      roleRowInit: {},
      transferformModal: {
        staff: ''
      },
      formSearchInit: {},
      formSearch: {
        name: '',
        phone: '',
        roleId: ''
      },
      selectList: [],
      staffSelectList: [],
      menuColumns: [{
        title: '操作',
        key: 'do',
        width: 200,
        render: (h, params) => {
          if (params.row.type === 1 && this.userInfo.type === 1) {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: '#00A4BD',
                  marginLeft: '-20px'
                },
                on: {
                  click: () => {
                    this.transferAuthority(params)
                  }
                }
              }, '转移权限')
            ])
          } else if (params.row.type === 1 && this.userInfo.type !== 1) {

          } else {
            if (this.hasPower(140202) && this.hasPower(140203)) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00A4BD',
                    marginLeft: '-20px'
                  },
                  on: {
                    click: () => {
                      this.eaditStaff(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00A4BD'
                  },
                  on: {
                    click: () => {
                      this.removeStaff(params)
                    }
                  }
                }, '删除')
              ])
            } else if (this.hasPower(140202)) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00A4BD',
                    marginLeft: '-20px'
                  },
                  on: {
                    click: () => {
                      this.eaditStaff(params)
                    }
                  }
                }, '修改')
              ])
            } else if (this.hasPower(140203)) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  style: {
                    color: '#00A4BD',
                    marginLeft: '-20px'
                  },
                  on: {
                    click: () => {
                      this.removeStaff(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        }
      },
      {
        title: '姓名',
        key: 'name'
      },
      {
        title: '账号',
        key: 'phone'
      },
      {
        title: '角色',
        key: 'roleName'
      },
      {
        title: '创建时间',
        key: 'createTime',
        render: (h, params) => {
          let text = this.formatDate(params.row.createTime)
          return h('div', { props: {} }, text)
        }
      }],
      rulesTransfer: {
        staff: [
          { required: true, message: '请选择角色账号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    this.getUserInfo()
    this.getRoleSelectList()
    this.getStaffSelectList()
  },
  methods: {
    getUserInfo () {
      Server({
        url: 'set/userInfo',
        method: 'get'
      }).then(({ data }) => {
        this.userInfo = Object.assign({}, data.data)
      })
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    getRoleSelectList () {
      Server({
        url: 'role/list',
        method: 'get'
      }).then(({ data }) => {
        this.selectList = data.data
      })
    },
    getStaffSelectList () {
      Server({
        url: 'employee/list',
        method: 'get'
      }).then(({ data }) => {
        for (let index = 0; index < data.data.list.length; index++) {
          if (data.data.list[index].type === 1) {
            data.data.list.splice(index, 1)
          }
        }
        this.staffSelectList = Object.assign({}, data.data.list)
      })
    },
    searchName () {
      let params = {}
      params.name = this.formSearch.name
      if (!params.name) {
        return Promise.resolve([])
      }
      return Server({
        url: 'employee/nameLike',
        method: 'get',
        data: params
      }).then(({ data }) => {
        return data.data.map(item => ({value: item.name, name: item.name + '/' + item.phone}))
      })
        .catch((errorInfo) => {
          return Promise.reject(errorInfo)
        })
    },
    searchBtn () {
      this.formSearchInit = Object.assign({}, this.formSearch)
    },
    eaditStaff (params) {
      if (params !== 'add') {
        this.visibaleMoadlTitle = '修改员工信息'
      } else {
        this.visibaleMoadlTitle = '添加员工'
      }
      const _this = this
      this.openDialog({
        name: 'company-manage/edited-staff-dialog',
        data: {
          title: this.visibaleMoadlTitle,
          formData: params.row
        },
        methods: {
          ok (node) {
            _this.formSearchInit = {}
          }
        }
      })
    },
    transferFormSub (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = {}
          params.phone = this.transferformModal.staff
          Server({
            url: 'employee/role',
            method: 'post',
            data: params
          }).then(({ data }) => {
            if (data.code === 10000) {
              this.$Message.success('转移成功!')
              this.visibaleTransfer = false
              this.formSearchInit = {}
            } else {
              this.$Message.error(data.msg)
              this.visibaleTransfer = false
            }
          })
        }
      })
    },
    transferCancelForm () {
      this.visibaleTransfer = false
    },
    removeStaff (params) {
      this.roleRowInit = Object.assign({}, params.row)
      this.visibaleRemove = true
    },
    transferAuthority (params) {
      this.roleRowInit = Object.assign({}, params.row)
      this.visibaleTransfer = true
    },
    removeSubForm () {
      let params = {}
      params.id = this.roleRowInit.id
      Server({
        url: 'employee/del',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.visibaleRemove = false
          this.$Message.success('删除成功！')
          this.formSearchInit = {}
        } else {
          this.$Message.error(data.msg)
          this.visibaleRemove = false
        }
      })
    },
    removeCancelForm () {
      this.visibaleRemove = false
    }
  }
}

</script>
<style lang='stylus' scoped>
.temAll
  margin-left 20px;
.classPage
  clear: both;
  float: right;
  margin: 50px;
.searchCard
  height:70px;
  background:rgba(249,249,249,1);
.dialog
  p
  text-align center
</style>
