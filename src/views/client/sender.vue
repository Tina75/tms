<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <Button type="primary">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <template v-if="selectStatus==0">
          <Input v-model="name" placeholder="请输入发货方名称" search style="width: 200px"  @on-click="searchList" />
        </template>
        <template v-else>
          <Input v-model="contact" placeholder="请输入发货方联系人" search style="width: 200px"  @on-click="searchList" />
        </template>
      </div>
    </div>
    <div class="content">
      <template>
        <Table :columns="columns1" :data="data1"></Table>
      </template>
    </div>
    <div class="footer">
      <template>
        <Page :total="totalCount"
              :current="pageNo" :page-size-opts="pageArray"
              size="small"
              show-sizer show-elevator show-total/>
      </template>
    </div>
  </div>
</template>

<script>
// import { senderList } from './client'
export default {
  name: 'sender',
  data () {
    return {
      selectStatus: 0,
      selectList: [
        {
          value: 0,
          label: '发货方'
        },
        {
          value: 1,
          label: '发货联系人'
        }
      ],
      name: '',
      contact: '',
      totalCount: '' || 100,
      pageArray: [10, 20, 50, 100],
      pageNo: 1,
      pageSize: 10,
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  },
  methods: {
    searchList () {
      console.log('触发')
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../libs/css/client.styl"
</style>
