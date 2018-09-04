<template>
  <div>
    <Card :bordered="false"  class="i-mb-10">
      <p slot="title">{{info.departName}}</p>
      <Row style="font-size:13px">
        <i-col :span="5">
          部门主管：{{info.masterName}}
        </i-col>
        <i-col :span="6">
          上级部门：{{info.parentName}}
        </i-col>
        <i-col :span="6">
          组织类别：{{info.departType | departTypeToName}}
        </i-col>
        <i-col :span="4">
          部门人数：{{info.departMemberNum}}
        </i-col>
        <i-col :span="3">
          <Button type="success" size="small" icon="ios-add" @click="newUser">添加员工</Button>
        </i-col>
        <i-col :span="21" class="i-mt-5">
          <div v-show="info.departType==1">管辖城市：
            <span v-for="(cityId,index) in info.cityList" :key="index">{{cityId | codeToName}}&nbsp;</span>
          </div>
        </i-col>
      </Row>
    </Card>
    <Card :bordered="false" >
      <div style="text-align:center">
        <Table  :columns="columns" :data="employee" ></Table>
      </div>
    </Card>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Axios from '@/libs/axios'
export default {
  name: 'depart-detail',
  mixins: [ BasePage ],
  props: {
    id: {type: Number, required: true}
  },
  data () {
    return {
      info: {},
      employee: [],
      columns: [
        {title: '姓名', key: 'name', align: 'center'},
        {title: '手机号', key: 'phone', align: 'center'},
        {title: '角色',
          key: 'role',
          align: 'center'
        },
        {title: '微信号', key: 'wechat', align: 'center'},
        {title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {click: () => { this.removeEmployee(params.row) }}
              }, '删除'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {click: () => { this.editUser(params.row) }}
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {click: () => { this.untie(params.row) }}
              }, '解绑')
            ])
          } }
      ]
    }
  },
  computed: {},
  watch: {
    id: function (val) {
      this.init()
    }
  },

  mounted: function () {
    this.init()
  },

  methods: {
    async init () {
      this.info = await this.getDepartInfo(this.id)
      this.getEmployee(this.id)
    },
    newUser () {
      const _this = this
      this.openDialog({
        name: 'department/dialog/new-user',
        data: {id: this.currNode.departId},
        methods: {
          ok (node) {
            _this.onAddUserSuccess(node)
          }
        }
      })
    },
    getEmployee (departId = this.id) {
      departId > 0 && Axios({
        url: 'depart/users',
        method: 'get',
        data: {departId, pageNo: 1, pageSize: 1000}
      }).then(({data}) => {
        this.employee = data.data.list
        this.employee.forEach((item) => {
          item.role = item.departRole ? '主管' : '成员'
          item.departId = departId
          console.log('info->' + JSON.stringify(this.info))
          item.departName = this.info.departName
        })
      })
    },
    getDepartInfo (departId) {
      return Axios({
        url: 'depart/detail',
        method: 'get',
        data: {departId}
      }).then(({data}) => {
        return data.data
      })
    },
    removeEmployee (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: () => {
          Axios({
            url: 'user/delete',
            method: 'post',
            data: {userId: row.userId}
          }).then(() => {
            // this.employee.splice(row.index, 1)
            this.getEmployee()
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },

    untie (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要解绑吗？',
        onOk: () => {
          Axios({
            url: 'user/unbindWechat',
            method: 'post',
            data: {userId: row.userId}
          }).then(() => {
            this.$Message.success('解绑成功')
            this.employee[row.index].wechat = ''
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    editUser (row) {
      this.curRow = row
      const _this = this
      this.openDialog({
        name: 'department/dialog/edit-user',
        data: {row},
        methods: {
          ok () {
            _this.onEditUserSuccess()
          }
        }
      })
    },
    onEditUserSuccess () {
      this.$Message.success('操作成功')
      this.getDepartInfo()
      this.getEmployee()
    },
    onAddUserSuccess () {
      this.$Message.success('添加成功')
      this.getDepartInfo()
      this.getEmployee()
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
