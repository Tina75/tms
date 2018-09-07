<template>
  <div>
    <Col span="5">
    <Menu :theme="theme" class="leftMenu">
      <p class="title">角色列表</p>
      <Input v-model="searchInput" placeholder="搜索角色" style="padding: 20px 5px" clearable @on-change="searchChange"></Input>
      <div style="height:420px; overflow-y:auto">
        <MenuItem v-for="menu in list1" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.name)">
        {{menu.name}}
          </MenuItem>
      </div>
      <Button type="primary" class="centerBtn" @click="createRole">新增角色</Button>
      <Modal
        v-model="createRoleModal"
        :title="editRoleModalTitle"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form :model="formModal" :label-width="80" style="height: 50px;">
          <Col span="22">
          <FormItem label="角色名：">
            <Input v-model="formModal.roleName" placeholder="Enter something..."></Input>
          </FormItem>
            </Col>
        </Form>
      </Modal>
    </Menu>
    </Col>
    <Col span="18">
    <Card>
      <p slot="title">{{rightTitle}}的权限</p>
      <div class="btn-item">
        <Button
          v-show="rightTitle !== '用户角色的权限'"
          class="item-conf-btn"
          type="primary"
          @click="editRole">
          更改角色名
        </Button>
        <Button
          v-show="rightTitle !== '用户角色的权限'"
          class="item-conf-btn"
          type="error"
          @click="removeRole">
          删除
        </Button>
        <Button
          v-show="rightTitle !== '用户角色的权限'"
          class="item-conf-btn"
          type="primary"
          @click="saveRole">
          保存
        </Button>
        <Modal
          v-model="removeRoleModal"
          title="提示"
          @on-ok="ok"
          @on-cancel="cancel">
          <P>确定删除'{{rightTitle}}'?</P>
        </Modal>
      </div>
      <div class="divTree">
        <Tree
          v-show="rightTitle !== '用户角色的权限'"
          ref="roleTree"
          :data="data2"
          show-checkbox>
        </Tree>
      </div>
    </Card>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
export default {
  name: 'employee-manage',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: 'employee-manage'
  },
  data () {
    return {
      theme: 'light',
      rightTitle: '用户角色的权限',
      searchInput: '',
      createRoleModal: false,
      removeRoleModal: false,
      editRoleModalTitle: '',
      formModal: {
        roleName: ''
      },
      listInit: [],
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
        name: '2222222',
        id: '6'
      }, {
        name: 'asdfsadfsadf',
        id: '7'
      }, {
        name: 'aaaaaaaaaa',
        id: '8'
      }, {
        name: 'bbbbbbbb',
        id: '9'
      }, {
        name: 'bcccccccccc',
        id: '10'
      }, {
        name: 'dddddddddddd',
        id: '11'
      }, {
        name: 'gggggggggyjgfhjfgjgfhj',
        id: '12'
      }],
      data2: [{
        title: 'parent 1',
        expand: true,
        children: [{
          title: 'parent 1-1',
          expand: true,
          children: [
            {
              title: 'leaf 1-1-1'
            },
            {
              title: 'leaf 1-1-2'
            }
          ]
        },
        {
          title: 'parent 1-2',
          expand: true,
          children: [
            {
              title: 'leaf 1-2-1'
            },
            {
              title: 'leaf 1-2-1'
            }
          ]
        }
        ] }]
    }
  },
  computed: {},
  mounted: function () {
    this.listInit = Object.assign([], this.list1)
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
    editRole () {
      this.editRoleModalTitle = '修改角色'
      this.createRoleModal = true
      this.formModal.roleName = this.rightTitle
    },
    removeRole () {
      this.removeRoleModal = true
    },
    saveRole () {
      // let num = Math.random(10000);
      // let target = {
      //   name: num,
      //   href: "/company-manage/employee-manage",
      //   powerCode: 0
      // }
      // this.$store.commit('changeTab', target)
      console.log(this.$refs.roleTree.getCheckedNodes())
    },
    searchChange () {
      this.list1 = Object.assign([], this.listInit)
      setTimeout(() => {
        if (this.searchInput) {
          this.list1 = []
          let searchValue = this.searchInput
          this.listInit.forEach(element => {
            if (element.name.indexOf(searchValue) > -1) {
              this.list1.push(element)
            }
          })
        }
      }, 300)
    },
    ok () {
      console.log(this.roleName)
    },
    cancel () {
      this.roleName = ''
    }
  }
}

</script>
<style lang='stylus' scoped>
.leftMenu
  min-height: 600px;
.title
  font-size: 20px;
  color: white;
  text-align: center;
  background: #2b85e4;
  line-height: 49px;
  padding: 0;
  margin: 0;
.rightTitle
  font-size: 20px;
  color: white;
  text-align: left ;
  background: #2b85e4;
  line-height: 49px;
  padding: 0 20px;
  margin: 0 -15px;
.btn-item
  width: 300px;
  height: 50px;
  line-height: 50px;
  float: right;
  .item-conf-btn
    margin-right: 10px;
.divTree
  clear: both;
.ivu-menu-item
  text-align: center;
.centerBtn
  position: absolute;
  bottom: 0px;
  left: 50%;
  margin-left: -45px;
</style>
