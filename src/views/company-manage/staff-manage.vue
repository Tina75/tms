<template>
  <div class="temAll">
    <Col span="23">
    <Card class="searchCard" dis-hover>
      <Form :model="formSearch" :label-width="80" style="padding-left:-20px;">
        <Col span="6">
        <FormItem label="姓名：">
          <Input v-model="formSearch.name" placeholder="请输入姓名"></Input>
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
              :value="item.name"
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
    <Button type="primary" style="margin-top:6px;" @click="eaditStaff('add')">添加员工</Button>
    </Col>
    <Col span="23">
    <page-table :columns="menuColumns" url="employee/list" list-field="users" style="margin-top: 20px;"></page-table>
    </Table>
    </Col>
    <Modal v-model="visibaleTransfer" width="360">
      <p slot="header" style="text-align:center">
        <span>转移权限</span>
      </p>
      <Form ref="transferformModal" :model="transferformModal" :rules="rulesTransfer" :label-width="100" style="height: 50px;">
        <FormItem label="角色账号：" prop="select">
          <Select v-model="transferformModal.roleId" clearable>
            <Option
              v-for="item in selectList"
              :value="item.name"
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <p style="color:red; margin-top:-10px;">角色转移之后，您的角色将变成"管理员"</p>
        </FormItem>
      </Form>
      <div slot="footer" style="margin-top:40px;">
        <Button type="primary" @click="transferFormSub('transferformModal')">确定</Button>
        <Button  @click="transferCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal v-model="visibaleRemove" type="warning" width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <p>确定要删除用户{{this.roleRowInit.name}}吗?</P>
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
export default {
  name: 'staff-manage',
  components: {
    pageTable
  },
  mixins: [ BasePage ],
  metaInfo: {
    title: '员工管理'
  },
  data () {
    return {
      visibaleTransfer: false,
      visibaleRemove: false,
      visibaleMoadlTitle: '',
      roleRowInit: {},
      transferformModal: {
        roleId: ''
      },
      formSearch: {
        name: '',
        phone: '',
        roleId: '全部',
        pageNo: 1,
        pageSize: 20
      },
      selectList: [{
        name: '全部',
        id: '1'
      }, {
        name: '管理员',
        id: '2'
      }, {
        name: '录入员',
        id: '3'
      }],
      menuColumns: [{
        title: '操作',
        key: 'do',
        width: 200,
        render: (h, params) => {
          if (params.row.name === '超级管理员') {
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
          } else {
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
        key: 'roleId'
      },
      {
        title: '创建时间',
        key: 'create_time'
      }],
      rulesTransfer: {
        roleId: [
          { required: true, message: '请选择角色账号', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {},
  methods: {
    searchBtn () {
      Server({
        url: 'employee/list',
        method: 'get',
        data: this.formSearch
      }).then(({ data }) => {
        // this.data1 = data.data;
      })
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
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    transferFormSub (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          Server({
            url: 'employee/role',
            method: 'post',
            data: this.roleRowInit.phone
          }).then(({ data }) => {
            // this.data1 = data.data;
          })
          this.$Message.success('Success!')
          this.visibaleTransfer = false
        } else {
          this.$Message.error('Fail!')
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
      Server({
        url: 'employee/del',
        method: 'post',
        data: this.roleRowInit.id
      }).then(({ data }) => {
        console.log(data)
      })
      this.visibaleRemove = false
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
