<template>
  <div>
    <Col span="5">
    <Menu :theme="theme" class="leftMenu">
      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:50px;">
        <Button type="primary" class="centerBtn" @click="createRole">新增角色</Button>
      </div>
      <div style="height:500px; overflow-y:auto; padding-top: 20px;">
        <MenuItem v-for="menu in list1" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.name)">
        <p class="menuTitle">{{menu.name}}</p>
        <span v-if="menu.name !== '超级管理员'" class="configBtnItem">
          <span class="configBtn" @click="editRole(menu.name)">修改</span>
          <span type="text" class="configBtn" @click="removeRole(menu.name)">删除</span>
        </span>
          </MenuItem>
      </div>
      <Modal v-model="createRoleModal" width="360">
        <p slot="header" style="text-align:center">
          <span>{{editRoleModalTitle}}</span>
        </p>
        <Form ref="formModal" :model="formModal" :rules="rulesRole" :label-width="80" style="height: 50px;">
          <FormItem label="角色名：" prop="roleName">
            <Input v-model="formModal.roleName" placeholder="请输入角色名"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="subFormRole('formModal')">确定</Button>
          <Button  @click="cancelFormRole">取消</Button>
        </div>
      </Modal>
    </Menu>
    </Col>
    <Col span="18">
    <p class="rightTitle">{{rightTitle}}的权限
      <Button
        class="saveRoleBtn"
        type="primary"
        @click="saveRole">
        保存
      </Button>
    </p>
    <Modal
      v-model="removeRoleModal"
      width="360"
      @on-ok="deleteRole"
      @on-cancel="cancelRole">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <P>确定删除'{{rightTitle}}'?</P>
    </Modal>
    <div class="divTree">
      <Card v-for="treeData in listInitTreeList" :key="treeData.index" dis-hover class="cardTreeItem">
        <p slot="title">{{treeData[0].title}}</p>
        <Tree
          ref="roleTree"
          :data="treeData"
          show-checkbox>
        </Tree>
      </Card>
    </div>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import roleTreeList from './roleTreeList.js'
export default {
  name: 'employee-manage',
  mixins: [ BasePage ],
  metaInfo: {
    title: '角色管理'
  },
  data () {
    let this_ = this
    var hasRoleName = function (rule, value, callback) {
      if (value) {
        this_.list1.forEach(e => {
          if (value === (e.name)) {
            return callback(new Error('角色名已存在'))
          }
        })
      } else {
        callback()
      }
    }
    return {
      theme: 'light',
      rightTitle: '超级管理员',
      createRoleModal: false,
      removeRoleModal: false,
      editRoleModalTitle: '',
      formModal: {
        roleName: ''
      },
      listInitTreeList: {},
      list1: [{
        name: '超级管理员',
        id: '1'
      }, {
        name: '安特曼',
        id: '2'
      }, {
        name: '蜘蛛侠',
        id: '3'
      }, {
        name: '钢铁侠',
        id: '4'
      }, {
        name: '1111111',
        id: '5'
      }, {
        name: '钢铁侠钢铁侠钢铁侠钢铁侠',
        id: '6'
      }],
      rulesRole: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { validator: hasRoleName, trigger: 'blur' },
          { type: 'string', max: 10, message: '角色名不能超过10个字', trigger: 'change' }
        ]
      }
    }
  },
  mounted: function () {
    this.listInitTreeList = Object.assign({}, roleTreeList)
  },
  methods: {
    clickLeftMenu (menu) {
      this.rightTitle = menu
    },
    createRole () {
      this.editRoleModalTitle = '新增角色'
      this.createRoleModal = true
      this.formModal.roleName = ''
    },
    editRole (name) {
      this.editRoleModalTitle = '修改角色'
      this.createRoleModal = true
      this.formModal.roleName = name
    },
    removeRole () {
      this.removeRoleModal = true
    },
    saveRole () {
      console.log(this.$refs.roleTree.getCheckedNodes())
    },
    subFormRole (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
          this.createRoleModal = false
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    cancelFormRole () {
      this.roleName = ''
      this.createRoleModal = false
    },
    deleteRole () {
    },
    cancelRole () {
    }
  }
}

</script>
<style lang='stylus' scoped>
.leftMenu
  min-height: 600px;
  .menuTitle
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
.rightTitle
  font-size: 20px;
  color: #333333;
  line-height: 35px;
  padding: 0 20px 0 10px;
.divTree
  clear: both;
  .cardTreeItem
    width: 300px;
    height: 400px;
    float: left;
    margin: 5px;
    overflow-y:auto;
    overflow-x:auto;
.saveRoleBtn
  float: right;
.centerBtn
  position: absolute;
  left: 30%;
  margin-left: -45px;
  width:150px;
  height:35px;
  background:rgba(0,164,189,1);
  border-radius:2px;
.configBtnItem
    float: right;
    margin-top: -20px;
  .configBtn
    color: #00A4BD;
    font-size: 12px;
    margin-left: 10px;
>>> .ivu-card-head
  background: rgba(248,248,248,1);
</style>
