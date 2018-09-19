<template>
  <div>
    <Col span="5">
    <Menu active-name="超级管理员" class="leftMenu">
      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:50px;">
        <Button type="primary" class="centerBtn" @click="createRole">新增角色</Button>
      </div>
      <div style="max-height:500px; overflow-y:auto; padding-top: 20px;">
        <MenuItem v-for="menu in menuList" :key="menu.id" :name="menu.name" class="menu" @click.native="clickLeftMenu(menu)">
        <p class="menuTitle">{{menu.name}}</p>
        <span v-if="menu.name !== '超级管理员'" class="configBtnItem">
          <span class="configBtn" @click="editRole(menu)">修改</span>
          <span type="text" class="configBtn" @click="removeRole(menu)">删除</span>
        </span>
        </MenuItem>
      </div>
      <Modal v-model="createRoleModal" width="360">
        <p slot="header" style="text-align:center">
          <span>{{editRoleModalTitle}}</span>
        </p>
        <Form ref="formModal" :model="formModal" :rules="rulesRole" :label-width="80" style="height: 50px;">
          <FormItem label="角色名：" prop="name">
            <Input :maxlength="11" v-model="formModal.name" placeholder="请输入角色名"></Input>
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
        v-if="rightTitle !== '超级管理员'"
        :disabled="disSaveBtn"
        class="saveRoleBtn"
        type="primary"
        @click="saveRole">
        保存
      </Button>
    </p>
    <Modal
      v-model="removeRoleModal"
      width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <P>确定删除'{{rightTitle}}'?</P>
      <div slot="footer">
        <Button type="primary" @click="removeFormRole">确定</Button>
        <Button  @click="removeCancelForm">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="removeRoleModalFail"
      width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <P>有员工属于该角色，暂时不能删除</P>
      <P>如需删除，请先将员工更换角色。</P>
      <div slot="footer">
        <Button type="primary" @click="removeCancelFormFail">我知道了</Button>
      </div>
    </Modal>
    <div class="divTree">
      <Card v-for="treeData in listInitTreeList" :key="treeData.index" dis-hover class="cardTreeItem">
        <p slot="title">
          <!-- <Checkbox v-model="treeData[0].checked" @on-change="checkTitleBox(treeData[0].key)" style="margin-top: -5px;"></Checkbox> -->
          <span>{{treeData[0].title}}</span>
        </p>
        <Tree
          :ref="treeData[0].key"
          :expand="false"
          :data="treeData"
          class="treeContentDiv"
          multiple
          show-checkbox
          @on-check-change="treeCheckBox">
        </Tree>
      </Card>
    </div>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import roleTreeList from './roleTreeList.js'
import Server from '@/libs/js/server'
import _ from 'lodash'
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
        this_.menuList.forEach(e => {
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
      rightTitle: '超级管理员',
      disSaveBtn: true,
      createRoleModal: false,
      removeRoleModal: false,
      removeRoleModalFail: false,
      editRoleModalTitle: '',
      menuParam: {},
      removeMenuParams: {},
      formModal: {
        name: ''
      },
      listInitTreeList: {},
      menuList: [],
      rulesRole: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          { validator: hasRoleName, trigger: 'blur' },
          { type: 'string', max: 10, message: '角色名不能超过10个字', trigger: 'change' }
        ]
      },
      arrayCodeList: []
    }
  },
  watch: {
    arrayCodeList (newList) {
      this.initTreeList(newList)
    }
  },
  created () {
    // this.arrayCodeList = ["100000","110000","120000","130000","140000","150000","100100","100200","110100","110200","120100","120200","120300","130100","130200","130300","140100","140200","150100","150200","100101","100102","100103","100201","100202","100203","100204","110101","110102","110103","110104","110105","110106","110107","110108","110109","110201","110202","110203","120101","120102","120103","120104","120105","120106","120107","120108","120201","120202","120203","120204","120205","120206","120207","120301","120302","120303","120304","120305","130101","130102","130103","130104","130105","130106","130107","130108","130109","130110","130111","130112","130201","130202","130203","130204","130205","130206","130207","130208","130209","130301","130302","130303","140101","140102","140103","140201","140202","140203","110300"];
    this.arrayCodeList = ['100200', '100201', '100203', '100204']
    this.initTreeList(this.arrayCodeList)
    this.getMenuList()
  },
  methods: {
    getMenuList () {
      Server({
        url: 'role/list',
        method: 'get'
      }).then(({ data }) => {
        this.menuList = data.data
      })
    },
    initTreeList (arrayCodeList) {
      const treeList = _.cloneDeep(roleTreeList)
      for (let key in treeList) {
        this.getTreeList(arrayCodeList, treeList[key][0].children)
      }
      this.listInitTreeList = treeList
    },
    getTreeList (arrayCodeList, treeData) {
      const vm = this
      treeData.forEach(element => {
        for (let index = 0; index < arrayCodeList.length; index++) {
          if (arrayCodeList.includes(element.code)) {
            if (element.children) {
              vm.getTreeList(arrayCodeList, element.children)
            } else {
              element.checked = true
            }
          }
        }
      })
    },
    clickLeftMenu (menu) {
      this.rightTitle = menu.name
      this.arrayCodeList = (menu.codes === '' ? [] : menu.codes)
      this.menuParam = menu
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
      let selectChecBoxList = []
      for (let key in this.listInitTreeList) {
        this.$refs[key][0].getCheckedNodes().forEach(node => {
          selectChecBoxList.push(node.code)
        })
      }
      this.menuParam.codes = selectChecBoxList
      let params = {}
      params.id = this.menuParam.id
      params.resIds = this.menuParam.codes
      Server({
        url: 'role/update',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success('角色权限修改成功!')
        } else {
          this.$Message.success(data.msg)
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
                this.getMenuList()
              } else {
                this.$Message.success(data.msg)
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
                this.getMenuList()
              } else {
                this.$Message.success(data.msg)
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
          this.getMenuList()
        } else if (data.code === 410009) {
          this.removeRoleModal = false
          this.removeRoleModalFail = true
        } else {
          this.$Message.success(data.msg)
        }
      })
    },
    removeCancelForm () {
      this.removeRoleModal = false
    },
    removeCancelFormFail () {
      this.removeRoleModalFail = false
    },
    treeCheckBox () {
      this.disSaveBtn = false
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
.leftMenu
  min-height: 600px;
.menu:hover
  .configBtnItem
    display: block
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
    .treeContentDiv
      width: 282px;
      height: 330px;
      margin-top: -15px;
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
    display: none;
  .configBtn
    color: #00A4BD;
    font-size: 12px;
    margin-left: 10px;
</style>
