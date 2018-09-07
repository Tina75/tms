<template>
  <div class="temAll">
    <Col span="23">
    <Card style="height:70px;">
      <Form :model="formSearch" :label-width="80">
        <Col span="7">
        <FormItem label="姓名：">
          <Input v-model="formSearch.username" placeholder="Enter something..."></Input>
        </FormItem>
          </Col>
        <Col span="7">
        <FormItem label="账号：">
          <Input v-model="formSearch.account" placeholder="Enter something..."></Input>
        </FormItem>
          </Col>
        <Col span="7">
        <FormItem label="角色：">
          <Select v-model="formSearch.select" clearable>
            <Option
              v-for="item in selectList"
              :value="item.name"
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
          </Col>
      </Form>
    </Card>
    </Col>
    <Col span="23">
    <Button style="margin-top:6px;">添加员工</Button>
    </Col>
    <Col span="23">
    <Table :columns="columns1" :data="data1" style="margin-top:10px;">
    </Table>
    </Col>
  </div>
</template>

<script>
export default {
  name: 'staff-manage',
  data () {
    return {
      formSearch: {
        username: '',
        account: '',
        select: ''
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
      columns1: [{
        title: '操作',
        key: 'do',
        width: 300,
        render: (h, params) => {
          if (params.row.name === '超级管理员') {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  marginLeft: '110px'
                },
                on: {
                  click: () => {
                    this.showTableRow(params)
                  }
                }
              }, '转移')
            ])
          } else {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showTableRow(params)
                  }
                }
              }, '获取初始密码'),
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '5px',
                  color: '#2b85e4'
                },
                on: {
                  click: () => {
                    this.showTableRow(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: 'red'
                },
                on: {
                  click: () => {
                    this.removeTableRow(params)
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
        key: 'age'
      },
      {
        title: '角色',
        key: 'address'
      },
      {
        title: '创建时间',
        key: 'date'
      }],
      data1: [{
        do: '',
        name: '超级管理员',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03'
      },
      {
        do: '',
        name: 'Jim Green',
        age: 24,
        address: 'London No. 1 Lake Park',
        date: '2016-10-01'
      },
      {
        do: '',
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park',
        date: '2016-10-02'
      },
      {
        do: '',
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04'
      }
      ] }
  },
  mounted: function () {},
  methods: {
    removeTableRow (e) {
      console.log(e)
    },
    showTableRow (e) {
      console.log(e)
    }
  }
}

</script>
<style lang='stylus' scoped>
.temAll
  margin-left 20px;
</style>
