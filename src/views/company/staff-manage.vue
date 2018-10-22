<template>
  <div class="temAll">
    <Col span="24">
    <div class="searchCard">
      <Form :model="formSearch" :label-width="60" label-position="left">
        <Col span="6">
        <FormItem label="姓名：" class="searchInput">
          <SelectInput v-model="formSearch.name" :remote="true" :remote-method="searchName" placeholder="请输入姓名" class="minWidth"></SelectInput>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="账号：" class="searchInput">
          <Input v-model="formSearch.phone" placeholder="请输入账号" class="minWidth"></Input>
        </FormItem>
        </Col>
        <Col span="6">
        <FormItem label="角色：" class="searchInput">
          <Select v-model="formSearch.roleId" class="minWidth">
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
          <Button type="primary" class="searchBtn" @click="searchBtn">搜索</Button>
        </FormItem>
        </Col>
      </Form>
    </div>
    </Col>
    <Col span="24">
    <Button v-if="hasPower(140201)" type="primary" class="addStaffBtn" @click="eaditStaff('add')">添加员工</Button>
    </Col>
    <Col span="24">
    <page-table :columns="menuColumns" :keywords="formSearchInit" class="pageTable" url="employee/list" list-field="list"></page-table>
    </Col>
    <Modal v-model="visibaleTransfer" width="400">
      <p slot="header" class="modalTitle">
        <span>转移权限</span>
      </p>
      <Form ref="transferformModal" :model="transferformModal" :rules="rulesTransfer" :label-width="100" class="transferformModal">
        <FormItem label="角色账号：" prop="staff">
          <Select v-model="transferformModal.staff" clearable class="minWidth">
            <Option
              v-for="item in staffSelectList"
              :value="item.phone"
              :key="item.phone">
              {{ item.name + '/' + item.phone}}
            </Option>
          </Select>
        </FormItem>
        <FormItem class="transferformModalForm">
          <p>确认操作后，您将与接收该角色的人员互换角色</p>
        </FormItem>
      </Form>
      <div slot="footer" class="modalFooter">
        <Button type="primary" @click="transferFormSub('transferformModal')">确定</Button>
        <Button  @click="transferCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" class="modalTitle">
        <span>提示</span>
      </p>
      <p class="visibaleRemoveP">
        <i class="icon font_family icon-bangzhuzhongxin"></i>
      </p>
      <p class="visibaleRemoveMessage">确定要删除用户{{this.roleRowInit.name}}吗?</P>
      </p>
      <div slot="footer" class="modalFooter">
        <Button type="primary" @click="removeSubForm">确定</Button>
        <Button  @click="removeCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal v-model="visibaleAddStaffSuccess" width="400">
      <p slot="header" class="modalTitle">
        <span>提示</span>
      </p>
      <P>添加员工成功，员工的登录账号为手机号</P>
      <p>初始登录密码已发送至员工手机</p>
      <div slot="footer">
        <Button type="primary" @click="knowCancel">我知道了</Button>
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
      visibaleAddStaffSuccess: false,
      visibaleMoadlTitle: '',
      roleRowInit: {},
      transferformModal: {
        staff: ''
      },
      formSearchInit: {},
      formSearch: {
        name: '',
        phone: '',
        roleId: '全部'
      },
      selectList: [],
      staffSelectList: [],
      menuColumns: [{
        title: '操作',
        key: 'do',
        width: 100,
        render: (h, params) => {
          if (params.row.type === 1 && this.userInfo.type === 1) {
            return h('div', [
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.transferAuthority(params)
                  }
                }
              }, '转移权限')
            ])
          } else if (params.row.type === 1 && this.userInfo.type !== 1) {
            return h('div', '—')
          } else {
            if (this.hasPower(140202) && this.hasPower(140203)) {
              return h('div', [
                h('span', {
                  style: {
                    color: '#00A4BD',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.eaditStaff(params)
                    }
                  }
                }, '修改'),
                h('span', {
                  style: {
                    color: '#00A4BD',
                    cursor: 'pointer',
                    marginLeft: '20px'
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
                h('span', {
                  style: {
                    color: '#00A4BD',
                    cursor: 'pointer'
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
                h('span', {
                  style: {
                    color: '#00A4BD',
                    cursor: 'pointer',
                    marginLeft: '20px'
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
        width: 150,
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
        this.selectList.unshift({ id: '全部', name: '全部' })
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
        return data.data.map(item => ({ value: item.name, name: item.name + '/' + item.phone }))
      })
        .catch((errorInfo) => {
          return Promise.reject(errorInfo)
        })
    },
    searchBtn () {
      this.formSearch.roleId = (this.formSearch.roleId === '全部' ? '' : this.formSearch.roleId)
      this.formSearchInit = Object.assign({}, this.formSearch)
      this.formSearch.roleId = (this.formSearch.roleId === '' ? '全部' : this.formSearch.roleId)
    },
    eaditStaff (params) {
      if (params !== 'add') {
        this.visibaleMoadlTitle = '修改员工信息'
      } else {
        this.visibaleMoadlTitle = '添加员工'
      }
      const _this = this
      this.openDialog({
        name: 'company/edited-staff-dialog',
        data: {
          title: this.visibaleMoadlTitle,
          formData: params.row
        },
        methods: {
          ok (node) {
            _this.formSearchInit = {}
            if (params === 'add') {
              _this.visibaleAddStaffSuccess = true
            }
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
              location.reload()
            } else {
              this.visibaleTransfer = false
            }
          })
        }
      })
    },
    knowCancel () {
      this.visibaleAddStaffSuccess = false
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
      this.getStaffSelectList()
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
  width: 100%
  overflow: auto;
.searchCard
  height:70px;
  background:rgba(249,249,249,1);
  border: none;
  padding-top: 18px;
  .searchInput
    margin-right:40px;
    margin-left: 10px;
.addStaffBtn
  margin-top:10px;
.searchBtn
  width:80px;
.pageTable
  margin-top: 20px;
  min-height: 700px;
.modalTitle
  text-align:center;
  font-size: 16px;
  font-weight: bold;
.visibaleRemoveP
  margin-top: 5px;
  margin-left:10%;
  i.icon.font_family.icon-bangzhuzhongxin
    font-size:28px;
    background: white;
    color: #FFBB44;
    float:left;
    width:40px;
.visibaleRemoveMessage
  margin-top:16px;
  font-size: 14px;
  margin-bottom: 5px;
.modalFooter
  margin-top:20px;
.transferformModal
  height: 70px;
  margin-top:20px
  .transferformModalForm
    width: 370px;
    p
     color:red;
     margin-top:-10px;
.minWidth
  min-width:200px;
.dialog
  p
  text-align center
</style>
