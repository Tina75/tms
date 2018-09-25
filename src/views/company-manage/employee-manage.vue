<template>
  <div>
    <Col span="5">
    <Menu :active-name="menuInitName" class="leftMenu">
      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:50px;">
        <Button type="primary" class="centerBtn" @click="createRole">新增角色</Button>
      </div>
      <div style="max-height:500px; overflow-y:auto; padding-top: 20px;">
        <MenuItem v-for="menu in menuList" :key="menu.id" :name="menu.name" class="menu" @click.native="clickLeftMenu(menu)">
        <p class="menuTitle">{{menu.name}}</p>
        <span v-if="menu.type !== 1" class="configBtnItem">
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
      rightTitle: '',
      menuInitName: '',
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
      if (this.menuParam.type === 1) {
        this.initTreeList(newList, 'type')
      } else {
        this.initTreeList(newList)
      }
    }
  },
  created () {
    this.getMenuList()
    this.initTreeList(this.arrayCodeList, 'type')
  },
  methods: {
    getMenuList (selectMenu) {
      Server({
        url: 'role/list',
        method: 'get'
      }).then(({ data }) => {
        this.menuList = data.data
        for (let index = 0; index < data.data.length; index++) {
          if (selectMenu) {
            if (data.data[index].id === selectMenu.id) {
              this.menuParam = data.data[index]
              this.rightTitle = this.menuInitName = data.data[index].name
              this.arrayCodeList = JSON.parse(data.data[index].codes)
            }
          } else {
            if (data.data[index].type === 1) {
              this.menuParam = data.data[index]
              this.rightTitle = this.menuInitName = data.data[index].name
              this.arrayCodeList = JSON.parse(data.data[index].codes)
            }
          }
        }
      })
    },
    initTreeList (arrayCodeList, type) {
      const treeList = _.cloneDeep(roleTreeList)
      for (let key in treeList) {
        if (type) {
          treeList[key][0].disabled = true
        } else {
          treeList[key][0].disabled = false
        }
        this.getTreeList(arrayCodeList, treeList[key][0].children, type)
      }
      this.listInitTreeList = treeList
    },
    getTreeList (arrayCodeList, treeData, type) {
      const vm = this
      treeData.forEach(element => {
        for (let index = 0; index < arrayCodeList.length; index++) {
          if (arrayCodeList.includes(element.code) && type) {
            element.disabled = true
            if (element.children) {
              vm.getTreeList(arrayCodeList, element.children, type)
            } else {
              element.checked = true
            }
          } else if (arrayCodeList.includes(element.code)) {
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
      this.arrayCodeList = (menu.codes === '' ? [] : JSON.parse(menu.codes))
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
          // 加入父级code
          if (!selectChecBoxList.includes(node.parentId) && node.parentId !== undefined) {
            selectChecBoxList.push(node.parentId)
          }
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
          this.getMenuList(this.menuParam)
        } else {
          this.$Message.error(data.msg)
        }
      }).then(() => {
        debugger
        this.arrayCodeList = this.menuParam.codes
        this.rightTitle = this.menuParam.name
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
    width: 270px;
    height: 400px;
    float: left;
    margin: 5px;
    .treeContentDiv
      width: 252px;
      height: 330px;
      margin-top: -15px;
      overflow-y:auto;
      overflow-x:auto;
.saveRoleBtn
  float: right;
  margin-right: 20px;
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
