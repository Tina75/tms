<template>
  <div>
    <div class="header">
      <div class="left">
        <Button type="primary" @click="modaladd = true">新增</Button>
      </div>
      <div class="right">
        <template>
          <Select v-model="selectStatus"  style="width:120px;margin-right: 11px">
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <template v-if="selectStatus==0">
          <Input v-model="name" placeholder="请输入发货方名称" search style="width: 200px"  @on-search="searchList" />
        </template>
        <template v-else>
          <Input v-model="contact" placeholder="请输入发货方联系人" search style="width: 200px"  @on-search="searchList" />
        </template>
      </div>
    </div>
    <div>
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
    <template>
      <Modal
        v-model="modaladd"
        footer-hide
        title="新增发货方"
        label-position="left"
      >
        <Form ref="addValidate" :model="addValidate" :rules="addRuleValidate" :label-width="122">
          <FormItem label="发货方名称:" prop="name">
            <Input v-model="addValidate.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="发货方联系人:" prop="contact">
            <Input v-model="addValidate.contact" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input v-model="addValidate.phone" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="支付方式:" prop="city">
            <Select v-model="addValidate.payType" placeholder="Select your city">
              <Option value="1">现付</Option>
              <Option value="2">到付</Option>
              <Option value="3">回单付</Option>
              <Option value="4">月结</Option>
            </Select>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input v-model="addValidate.remark" :autosize="{minRows: 2,maxRows: 5}" type="textarea"  placeholder="请输入"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('addValidate')">确定</Button>
            <Button style="margin-left: 8px" @click="handleReset('addValidate')" >取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </template>
    <template>
      <Modal
        v-model="modalupdate"
        footer-hide
        title="修改发货方"
        label-position="left"
      >
        <Form ref="updateValidate" :model="updateValidate" :rules="updateRuleValidate" :label-width="122">
          <FormItem label="发货方名称:" prop="name">
            <Input v-model="updateValidate.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="发货方联系人:" prop="contact">
            <Input v-model="updateValidate.contact" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系电话" prop="phone">
            <Input v-model="updateValidate.phone" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="支付方式:" prop="city">
            <Select v-model="updateValidate.payType" placeholder="请选择">
              <Option value="1">现付</Option>
              <Option value="2">到付</Option>
              <Option value="3">回单付</Option>
              <Option value="4">月结</Option>
            </Select>
          </FormItem>
          <FormItem label="备注:" prop="remark">
            <Input v-model="updateValidate.remark" :autosize="{minRows: 2,maxRows: 5}" type="textarea"  placeholder="请输入"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('addValidate')">确定</Button>
            <Button style="margin-left: 8px" @click="handleReset('addValidate')" >取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </template>
  </div>
</template>

<script>
// import { senderList } from './client'
import BasePage from '@/basic/BasePage'
export default {
  name: 'sender',
  mixins: [BasePage],
  metaInfo: {
    title: '发货方管理'
  },
  data () {
    return {
      selectStatus: 0,
      selectList: [
        {
          value: 0,
          label: '发货方名称'
        },
        {
          value: 1,
          label: '发货联系人名称'
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
          title: '操作',
          key: 'id',
          // width: 150,
          // align: 'left',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.updateValidate = {
                      name: params.row.name,
                      contact: params.row.contact,
                      phone: params.row.phone,
                      payType: params.row.payType,
                      remark: params.row.remark
                    }
                    this.modalupdate = true
                  }
                }
              }, '修改'),
              h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        },
        {
          title: '发货方名称',
          // key: 'name',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#418DF9',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.openTab({ path: '/client/sender-info', query: {id: '111111'} })
                  }
                }
              }, params.row.name)
            ])
          }
        },
        {
          title: '发货方联系人',
          key: 'contact'
        },
        {
          title: '联系电话',
          key: 'phone'
        },
        {
          title: '发货方地址数量',
          key: 'consignerAddressCnt'
        },
        {
          title: '收货方数量',
          key: 'consigneeCnt'
        },
        {
          title: '货物数量',
          key: 'cargoCnt'
        },
        {
          title: '付款方式描述',
          key: 'payTypeDesc'
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true
        }
      ],
      data1: [
        {
          id: 1,
          name: 'John Brown',
          contact: 18,
          phone: 'New York No. 1 Lake Park',
          consignerAddressCnt: '2016-10-03',
          consigneeCnt: '2016-10-03',
          cargoCnt: '2016-10-03',
          payTypeDesc: '2016-10-03',
          createTime: '2016-10-03'
        }
      ],
      modaladd: false,
      addValidate: {
        name: '',
        contact: '',
        phone: '',
        payType: '',
        remark: ''
      },
      addRuleValidate: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please select the city', trigger: 'change' }
        ],
        payType: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        remark: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ]
      },
      modalupdate: false,
      updateValidate: {
        name: '',
        contact: '',
        phone: '',
        payType: '',
        remark: ''
      },
      updateRuleValidate: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: 'Please select the city', trigger: 'change' }
        ],
        payType: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ],
        remark: [
          { required: true, message: 'Please select gender', trigger: 'change' }
        ]
      }
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
