<template>
  <Row class="temAll">
    <Col :style="styleHeight" span="4" class="colHeight">
    <Menu :active-name="menuInitName" class="leftMenu" style="width:100%" >
      <div class="centerBtnDiv">
        <Button v-if="hasPower(140101)" type="primary" class="centerBtn" @click="createRole">新增角色</Button>
      </div>
      <div>
        <MenuItem v-for="menu in roles" :key="menu.id" :name="menu.name" class="menu" @click.native="clickLeftMenu(menu)">
        <p class="menuTitle">{{menu.name}}</p>
        <span v-if="menu.type !== 1" class="configBtnItem">
          <span v-if="hasPower(140102)" class="configBtn" @click="editRole(menu)">修改</span>
          <span v-if="hasPower(140103)" type="text" class="configBtn" @click="removeRole(menu)">删除</span>
        </span>
          </MenuItem>
      </div>
      <Modal v-model="createRoleModal" width="400">
        <p slot="header" class="modalTitle">
          <span>{{editRoleModalTitle}}</span>
        </p>
        <Form ref="formModal" :model="formModal" :rules="rulesRole" :label-width="80" class="formSty">
          <FormItem label="角色名：" prop="name">
            <Input :maxlength="11" v-model="formModal.name" placeholder="请输入角色名" class="inputSty"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="subFormRole('formModal')">确定</Button>
          <Button  @click="cancelFormRole">取消</Button>
        </div>
      </Modal>
    </Menu>
    </Col>
    <Col span="20" class="rightHead">
    <div>
      <p class="rightTitle">{{title}}</p>
      <div v-if="hasPower(140102)" class="saveRoleBtn">
        <Button
          v-if="selectRole.type !== 1"
          :disabled="disSaveBtn"
          type="primary"
          style="width:80px;"
          @click="saveRole">
          保存
        </Button>
      </div>
    </div>
    </Col>
    <Col span="20" class="contentDiv">
    <Modal
      v-model="removeRoleModal"
      width="360">
      <p slot="header" class="modalTitle">
        <span>提示</span>
      </p>
      <p class="modalRemoveContend">
        <i class="icon font_family icon-bangzhuzhongxin"></i>
      </p>
      <p class="modalRemoveContendP">确定删除'{{selectRole.name}}'?</P>
        </p>
      <div slot="footer">
        <Button type="primary" @click="removeFormRole">确定</Button>
        <Button  @click="removeCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="removeRoleModalFail"
      width="400">
      <p slot="header" class="modalTitle">
        <span>提示</span>
      </p>
      <P style="color:gray;">有员工属于该角色，暂时不能删除,如需删除，请先将</P>
      <P style="color:gray;">员工更换角色。</P>
      <div slot="footer">
        <Button type="primary" @click="removeCancelFormFail">我知道了</Button>
      </div>
    </Modal>
    <div class="divTree">
      <Card v-for="treeData in listInitTreeList" :key="treeData.index" dis-hover class="cardTreeItem">
        <p slot="title">
          <!-- <Checkbox v-model="treeData[0].checked" @on-change="checkTitleBox(treeData[0].key)" style="margin-top: -5px;"></Checkbox> -->
          <span style="color:rgba(51,51,51,1)">{{treeData[0].title}}</span>
        </p>
        <Tree
          :ref="treeData[0].key"
          :expand="false"
          :data="treeData"
          class="treeContentDiv"
          show-checkbox
          @on-check-change="treeCheckBox">
        </Tree>
      </Card>
    </div>
    </Col>
  </Row>
</template>

<script>
import BasePage from '@/basic/BasePage'
import roleTreeList from './roleTreeList.js'
import Server from '@/libs/js/server'
import _ from 'lodash'
export default {
  name: 'role-manage',
  mixins: [ BasePage ],
  metaInfo: {
    title: '角色管理'
  },
  data () {
    let this_ = this
    var hasRoleName = function (rule, value, callback) {
      if (value) {
        this_.roles.forEach(e => {
          if (value === (e.name)) {
            return callback(new Error('该角色名已被使用'))
          }
        })
        callback()
      } else {
        callback()
      }
    }
    return {
      single: true,
      menuInitName: '',
      selectRoleId: '', // 选中的角色id
      disSaveBtn: true,
      createRoleModal: false,
      removeRoleModal: false,
      removeRoleModalFail: false,
      editRoleModalTitle: '',
      removeMenuParams: {},
      initHeight: {
        type: Number,
        default: 0
      },
      formModal: {
        name: ''
      },
      listInitTreeList: {},
      roles: [],
      rulesRole: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { validator: hasRoleName, trigger: 'blur' },
          { type: 'string', max: 10, message: '角色名不能超过10个字', trigger: 'change' }
        ]
      },
      roleCodeList: []
    }
  },
  computed: {
    /**
     * 当前选中角色
     */
    selectRole () {
      return this.roles.find(role => role.id === this.selectRoleId) || { name: '超级管理员' }
    },
    /**
     * 右侧区域标题
     */
    title () {
      return this.selectRole.name + '的权限'
    },
    // 自适应高度
    styleHeight () {
      return { height: (this.initHeight + 50) + 'px' }
    }
  },
  watch: {
    roleCodeList (newList) {
      if (this.selectRole.type === 1) {
        // 超级管理员
        this.listInitTreeList = _.cloneDeep(roleTreeList)
      } else {
        this.initTreeList(newList)
      }
    }
  },
  created () {
    // 获取所有角色列表
    this.getRoleList()
    // 初始化角色树构建
    this.listInitTreeList = _.cloneDeep(roleTreeList)
  },
  mounted () {
    this.initHeight = document.getElementsByClassName('contentDiv')[0].offsetHeight
  },
  methods: {
    getRoleList () {
      Server({
        url: 'role/list',
        method: 'get'
      }).then(({ data }) => {
        // 全局
        this.roles = data.data
      })
    },
    initTreeList (roleCodeList) {
      const treeList = _.cloneDeep(roleTreeList)
      for (let key in treeList) {
        treeList[key][0].disabled = false
        treeList[key][0].checked = false
        this.getTreeList(roleCodeList, treeList[key][0].children)
      }
      this.listInitTreeList = treeList
    },
    getTreeList (roleCodeList, treeData) {
      const vm = this
      treeData.forEach(element => {
        // 默认设置false
        element.checked = false
        element.disabled = false
        if (roleCodeList.includes(element.code) || roleCodeList.includes(Number(element.code))) {
          if (element.children) {
            vm.getTreeList(roleCodeList, element.children)
          } else {
            element.checked = true
          }
        } else {
          if (element.children) {
            vm.getTreeList(roleCodeList, element.children)
          }
        }
      })
    },
    clickLeftMenu (menu) {
      this.selectRoleId = menu.id
      this.roleCodeList = (menu.codes === '' ? [] : JSON.parse(menu.codes))
      this.disSaveBtn = true
    },
    createRole () {
      this.editRoleModalTitle = '新增角色'
      this.createRoleModal = true
      this.formModal = {}
    },
    editRole (menu) {
      this.editRoleModalTitle = '修改角色'
      this.createRoleModal = true
      let param = {}
      param.id = menu.id
      param.name = menu.name
      this.formModal = Object.assign({}, param)
    },
    removeRole (menu) {
      this.removeMenuParams = menu
      this.removeRoleModal = true
    },
    saveRole () {
      let params = {}
      params.id = this.selectRole.id
      params.resIds = this.checkBrowsePage()
      Server({
        url: 'role/update',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success('角色权限修改成功!')
          // 同步更新本地相应角色下的权限数据
          const role = this.roles.find(_r => _r.id === params.id)
          if (role) {
            role.codes = JSON.stringify(params.resIds)
          }
        }
      })
    },
    subFormRole (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.createRoleModal = false
          if (this.editRoleModalTitle === '新增角色') {
            Server({
              url: 'role/add',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              if (data.code === 10000) {
                this.$Message.success('添加成功!')
                this.getRoleList()
              }
            })
          } else {
            Server({
              url: 'role/updateName',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              if (data.code === 10000) {
                this.$Message.success('修改成功!')
                this.getRoleList()
              }
            })
          }
        }
      })
    },
    cancelFormRole () {
      this.name = ''
      this.createRoleModal = false
    },
    removeFormRole () {
      let params = {}
      params.id = this.removeMenuParams.id
      Server({
        url: 'role/del',
        method: 'post',
        data: params
      }).then(({ data }) => {
        this.removeRoleModal = false
        if (data.code === 10000) {
          this.removeRoleModal = false
          this.$Message.success('删除角色成功!')
          this.getRoleList()
        } else if (data.code === 410009) {
          this.removeRoleModal = false
          this.removeRoleModalFail = true
        }
      })
    },
    removeCancelForm () {
      this.removeRoleModal = false
    },
    removeCancelFormFail () {
      this.removeRoleModalFail = false
    },
    checkBrowsePage () {
      let selectChecBoxList = []
      for (let key in this.listInitTreeList) {
        this.$refs[key][0].getCheckedNodes().forEach(node => {
          selectChecBoxList.push(node.code)
          // 加入父级code
          if (!selectChecBoxList.includes(node.parentId) && node.parentId !== undefined) {
            selectChecBoxList.push(node.parentId)
            if (node.grandId !== undefined) {
              selectChecBoxList.push(node.grandId)
            }
          }
        })
      }
      return selectChecBoxList
    },
    treeCheckBox (node) {
      this.disSaveBtn = false
      // this.roleCodeList = this.checkBrowsePage()
    }
    // renderContent (h, { root, node, data }) {
    //   if (node.nodeKey === 0) {
    //     return h('div', {
    //       style: {
    //         position: 'absolute',
    //         left: '60px',
    //         top: '10px'
    //       }
    //     }, data.title)
    //   } else {
    //     return h('span', [
    //       h('span', data.title),
    //     ]);
    //   }
    // },
    // checkTitleBox (treeName) {
    //   let flag = this.$refs[treeName][0].data[0].checked;
    //   this.checkTreeAllBox(this.$refs[treeName][0].data, flag)
    // },
    // checkTreeAllBox (node, flag) {
    //   const vm = this
    //   node.forEach(element => {
    //     element.checked = !flag;
    //     if (element.children) {
    //       vm.checkTreeAllBox(element.children, flag)
    //     }
    //   });
    // },
  }
}

</script>
<style lang='stylus' scoped>
>>> .ivu-card-head
  background:rgba(248,248,248,1);
>>> .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
  color: #515a6e;
.temAll
  width: 100%;
  overflow: hidden;
  .contentDiv
    padding-left: 20px;
  .leftMenu
    height: 100%
    .centerBtnDiv
      border-bottom: 1px solid #e9e9e9;
      padding-bottom:50px;
  .leftMenu :hover
    max-height: calc(100% - 50px);
    overflow-y: auto;
  .centerBtnDiv:hover
    overflow: hidden;
  .menu:hover
    background: #e3fcfc;
    color: #515a6e;
    overflow: hidden;
    .configBtnItem
      display: block
    .configBtnItem:hover
      overflow: hidden;
  .menu
    margin-left: -50px;
    .menuTitle
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 75%;
      float:left;
  .rightHead
    border-bottom: 1px solid #e9e9e9;
    margin-top: 5px
    .rightTitle
      height: 55px;
      font-size: 20px;
      color: #333;
      line-height: 55px;
      padding: 0 20px 0 10px;
      margin-top: -10px;
      margin-left: 20px;
      font-weight:600;
  .divTree
    clear: both;
    margin-top:15px;
    .cardTreeItem
      width: 270px;
      height: 400px;
      float: left;
      margin: 5px;
      border-radius: 0px;
      .treeContentDiv
        width: 252px;
        height: 346px;
        margin-top: -15px;
        overflow:hidden;
      .treeContentDiv:hover
        width: 252px;
        height: 346px;
        margin-top: -15px;
        overflow-y:auto;
        overflow-x:auto;
  .saveRoleBtn
    float: right;
    margin-right: 120px;
    margin-top: -45px;
  .centerBtn
    position: absolute;
    left: 50%;
    margin-left: -75px;
    width:150px;
    height:35px;
    background:rgba(0,164,189,1);
    border-radius:2px;
  .centerBtn:hover
    overflow: hidden;
  .configBtnItem
      float: right;
      margin-top: -20px;
      display: none;
      margin-right: 5px;
      background: #e3fcfc;
      height: 20px;
    .configBtn
      color: #00A4BD;
      font-size: 12px;
      margin-left: 10px;
.colHeight
  height: 100%
.modalTitle
  text-align:center;
  font-size: 16px;
  font-weight: bold;
.modalRemoveContend
  margin-top: 5px;
  margin-left:10%;
  i.icon.font_family.icon-bangzhuzhongxin
    font-size:28px;
    background: white;
    color: #FFBB44;
    float:left;
    width:40px;
.modalRemoveContendP
  margin-top:16px;
  margin-bottom:20px;
  font-size: 14px;
.formSty
  padding:20px;
  height: 70px;
.inputSty
  width:200px;
</style>
