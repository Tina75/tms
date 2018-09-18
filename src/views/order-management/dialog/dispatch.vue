<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="1036">
      <p slot="header" style="text-align:center">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>{{name}}</span>
      </p>
      <Form v-if="name === '送货调度'" ref="send" :model="send" :rules="sendRules" :label-width="60" inline label-position="left">
        <FormItem label="始发地" prop="start">
          <area-select v-model="send.start" style="width:180px"></area-select>
        </FormItem>
        <FormItem label="目的地" prop="end" style="margin-left:27px;">
          <area-select v-model="send.end" style="width:180px"></area-select>
        </FormItem>
      </Form>
      <Form v-else ref="pick" :model="pick" :rules="pickRules" :label-width="60" inline label-position="left">
        <FormItem label="承运商" prop="carrierName">
          <!-- <Input v-model="pick.companny" style="width:180px" placeholder="请输入"/> -->
          <AutoComplete
            v-model="pick.carrierName"
            :data="maintainData"
            placeholder="请输入"
            style="width:180px">
          </AutoComplete>
        </FormItem>
        <FormItem label="车牌号" prop="carNo" style="margin-left:27px;">
          <!-- <Input v-model="pick.number" style="width:180px" placeholder="请输入"/> -->
          <AutoComplete
            v-model="pick.carNo"
            :data="maintainData"
            placeholder="请输入"
            style="width:180px">
          </AutoComplete>
        </FormItem>
        <FormItem label="司机" prop="driver" style="margin-left:27px;">
          <!-- <Input v-model="pick.driver" style="width:180px" placeholder="请输入"/> -->
          <AutoComplete
            v-model="pick.driver"
            :data="maintainData"
            placeholder="请输入"
            style="width:180px">
          </AutoComplete>
        </FormItem>
      </Form>
      <Table :columns="tableColumns" :data="id"></Table>
      <div class="table-footer">
        <span style="padding-right: 5px;box-sizing:border-box">合计</span>
        <span>订单总数：{{ orderTotal }}</span>
        <span>总体积：{{ volumeTotal }}</span>
        <span>总重量：{{ weightTotal }}</span>
      </div>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import AreaSelect from '@/components/AreaSelect'
export default {
  name: 'dispatch',

  components: {
    AreaSelect
  },

  mixins: [BaseDialog],

  data () {
    return {
      send: { start: [], end: [] },
      sendRules: {
        start: { required: true, type: 'array', min: 1, message: '请填写始发地', trigger: 'change' },
        end: { required: true, type: 'array', min: 1, message: '请填写目的地', trigger: 'change' }
      },
      pick: { carrierName: '', carNo: '', driver: '' },
      pickRules: {
        carrierName: { required: true, message: '请填写承运商', trigger: 'blur' },
        carNo: { required: true, message: '请填写车牌号', trigger: 'blur' },
        driver: { required: true, message: '请填写司机姓名', trigger: 'blur' }
      },
      visibale: true,
      tableColumns: [
        {
          title: '操作',
          key: 'do',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '5px',
                  color: '#00a4bd'
                },
                on: {
                  click: () => {
                    this.id.splice(params.index, 1)
                    if (this.id.length === 0) {
                      this.close()
                    }
                  }
                }
              }, '移除')
            ])
          }
        },
        {
          title: '订单号',
          key: 'orderNo',
          width: 160
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo'
        },
        {
          title: '客户名称',
          key: 'consignerName',
          width: 180
        },
        {
          title: '始发地',
          key: 'start'
        },
        {
          title: '目的地',
          key: 'end'
        },
        {
          title: '体积（方）',
          key: 'volume'
        },
        {
          title: '重量（吨）',
          key: 'weight'
        }
      ],
      tableData: [],
      maintainData: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive']
    }
  },

  computed: {
    orderTotal () {
      return this.id.length
    },
    volumeTotal () {
      let total = 0
      this.id.map((item) => {
        total += item.volume
      })
      return total
    },
    weightTotal () {
      let total = 0
      this.id.map((item) => {
        total += item.weight
      })
      return total
    },
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },

  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },

  mounted: function () {
  },

  methods: {
    save () {
      if (this.name === '送货调度') {
        this.doSendDispatch()
      } else {
        this.doPickDispatch()
      }
    },
    // 送货调度  创建运单
    doSendDispatch () {
      this.$refs['send'].validate((valid) => {
        console.log(valid)
        console.log(this.send)
        if (valid) {
          // 地址入参为最后一级区号
          let sendCodes = {
            start: Number(this.send.start[this.send.start.length - 1]),
            end: Number(this.send.end[this.send.end.length - 1])
          }
          const data = Object.assign(sendCodes, {orderIds: this.orderIds})
          Server({
            url: 'waybill/create',
            method: 'post',
            data: data
          }).then(() => {
            // this.ok()
            this.$Message.success('创建运单成功')
            this.visibale = false
          })
        }
      })
    },
    // 提货调度  创建提货单
    doPickDispatch () {
      this.$refs['pick'].validate((valid) => {
        console.log(valid)
        console.log(this.pick)
        if (valid) {
          const data = Object.assign(this.pick, {orderIds: this.orderIds})
          Server({
            url: 'loadbill/bill/create',
            method: 'post',
            data: data
          }).then(() => {
            // this.ok()
            this.$Message.success('创建提货单成功')
            this.visibale = false
          })
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
.table-footer
  height 48px
  border 1px solid #dcdee2
  border-top none
  line-height 48px
  font-family 'PingFangSC-Regular'
  color rgba(51,51,51,1)
  span
    display inline-block
    min-width 111px
    text-align center
</style>
