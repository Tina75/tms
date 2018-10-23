<template>
  <div>
    <Modal v-model="visiable" :mask-closable="false" class="dispatch-dialog" width="1032" @on-visible-change="close">
      <p slot="header" class="dialog-title">
        <!-- <Icon type="ios-information-circle"></Icon> -->
        <span>{{name}}</span>
      </p>
      <Form v-if="name === '送货调度'" ref="send" :model="send" :rules="sendRules" :label-width="60" inline label-position="left">
        <FormItem label="始发地" prop="start">
          <!-- <area-select v-model="send.start" :deep="true" style="width:180px"></area-select> -->
          <city-select v-model="send.start" style="width:180px"></city-select>
        </FormItem>
        <FormItem label="目的地" prop="end" style="margin-left:27px;">
          <!-- <area-select v-model="send.end" :deep="true" style="width:180px"></area-select> -->
          <city-select v-model="send.end" style="width:180px"></city-select>
        </FormItem>
      </Form>
      <Form v-else ref="pick" :model="pick" :rules="pickRules" :label-width="70" inline label-position="left">
        <FormItem label="承运商" prop="carrierName">
          <SelectInput
            v-model="pick.carrierName"
            :maxlength="20"
            :remote="false"
            :local-options="carriers"
            placeholder="请输入"
            style="width:180px"
            @on-focus.once="getCarriers"
            @on-select="handleSelectCarrier">
          </SelectInput>
        </FormItem>
        <FormItem label="车牌号" prop="carNo" style="margin-left:27px;">
          <SelectInput
            v-model="pick.carNo"
            :maxlength="20"
            :remote="false"
            :local-options="carrierCars"
            placeholder="请输入"
            style="width:180px"
            @on-blur="handleCarNoBlur">
          </SelectInput>
        </FormItem>
        <FormItem label="司机" prop="driverName" style="margin-left:27px;">
          <SelectInput
            v-model="pick.driverName"
            :maxlength="15"
            :remote="false"
            :local-options="carrierDrivers"
            placeholder="请输入"
            style="width:180px">
          </SelectInput>
        </FormItem>
      </Form>
      <Table :columns="tableColumns" :data="id" :height="id.length > 10 ? 520 : id.length * 48 + 40"></Table>
      <div class="table-footer">
        <span style="padding-right: 5px;box-sizing:border-box;margin-left:-12px;">合计</span>
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
// import AreaSelect from '@/components/AreaSelect'
import CitySelect from '@/components/SelectInputForCity'
import SelectInput from '@/components/SelectInput.vue'
import { mapGetters, mapActions } from 'vuex'
import City from '@/libs/js/city'
import { CAR } from '@/views/client/client'
export default {
  name: 'dispatch',

  components: {
    // AreaSelect,
    CitySelect,
    SelectInput
  },

  mixins: [BaseDialog],

  data () {
    return {
      send: { start: [], end: [] },
      sendRules: {
        start: { required: true, type: 'array', min: 1, message: '请填写始发地', trigger: 'change' },
        end: { required: true, type: 'array', min: 1, message: '请填写目的地', trigger: 'change' }
      },
      pick: { carrierName: '', carNo: '', driverName: '' },
      pickRules: {
        carrierName: [
          { required: true, message: '请填写承运商', trigger: 'blur' },
          { required: true, message: '请填写承运商', trigger: 'change' }
        ],
        carNo: [
          { required: true, message: '请填写车牌号', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' },
          { required: true, message: '请填写车牌号', trigger: 'change' }
        ],
        driverName: [
          { required: true, message: '请填写司机姓名', trigger: 'blur' },
          { required: true, message: '请填写司机姓名', trigger: 'change' }
        ]
      },
      tableColumns: [
        {
          title: '操作',
          key: 'do',
          align: 'center',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
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
          minWidth: 160,
          tooltip: true
        },
        {
          title: '客户订单号',
          key: 'customerOrderNo',
          minWidth: 140,
          render: (h, p) => {
            return h('span', p.row.customerOrderNo ? p.row.customerOrderNo : '-')
          }
        },
        {
          title: '客户名称',
          key: 'consignerName',
          minWidth: 130,
          tooltip: true
        },
        {
          title: '始发地',
          key: 'start',
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            if (this.cityFormatter(params.row.start).length > 8) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: this.cityFormatter(params.row.start)
                }
              }, [
                h('span', this.formatterAddress(this.cityFormatter(params.row.start)))
              ])
            } else {
              return h('span', this.cityFormatter(params.row.start))
            }
          }
        },
        {
          title: '目的地',
          key: 'end',
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            if (this.cityFormatter(params.row.end).length > 8) {
              return h('Tooltip', {
                props: {
                  placement: 'bottom',
                  content: this.cityFormatter(params.row.end)
                }
              }, [
                h('span', this.formatterAddress(this.cityFormatter(params.row.end)))
              ])
            } else {
              return h('span', this.cityFormatter(params.row.end))
            }
          }
        },
        {
          title: '体积（方）',
          key: 'volume',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '重量（吨）',
          key: 'weight',
          minWidth: 100,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'carriers',
      'carrierCars',
      'carrierDrivers'
    ]),
    orderTotal () {
      return this.id.length
    },
    volumeTotal () {
      let total = 0
      this.id.map((item) => {
        total += item.volume
      })
      return total.toFixed(1)
    },
    weightTotal () {
      let total = 0
      this.id.map((item) => {
        total += item.weight
      })
      return total.toFixed(2)
    },
    orderIds () {
      let arr = []
      this.id.map((item) => {
        arr.push(item.id)
      })
      return arr
    }
  },
  created () {

  },
  mounted: function () {
    // modify:20181023 by 宣飞 加上第一条数据的始发城市和目的城市
    setTimeout(() => {
      this.send.start = this.id[0].start
      this.send.end = this.id[0].end
    }, 0)
  },

  methods: {
    ...mapActions([
      'getCarriers'
    ]),
    // 选择承运商dropdown的数据
    handleSelectCarrier (name, row) {
      console.log(name, row)
      this.$store.dispatch('getCarrierCars', row.id).then((res) => {
        this.pick.carNo = res[0].carNO //  默认带出第一条车牌号
        this.pick.driverName = res[0].driverName //  默认带出第一条司机姓名
      })
      this.$store.dispatch('getCarrierDrivers', row.id)
    },
    // 选择承运商车辆信息
    handleSelectCarrierCars (name, row) {
      console.log(name, row)
    },
    // 过滤已维护的客户信息
    filterMethod (value, option) {
      if (value) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
      }
    },
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
          const data = Object.assign(sendCodes, { orderIds: this.orderIds })
          Server({
            url: 'waybill/create',
            method: 'post',
            data: data
          }).then(() => {
            this.ok()
            this.$Message.success('创建运单成功')
            this.close()
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
          const data = Object.assign(this.pick, { orderIds: this.orderIds })
          Server({
            url: 'load/bill/create',
            method: 'post',
            data: data
          }).then(() => {
            this.ok()
            this.$Message.success('创建提货单成功')
            this.close()
          })
        }
      })
    },
    // 将地址字符串8位后的替换成...
    formatterAddress (str) {
      let dot = str.substring(8)
      return str.replace(dot, ' ...')
    },
    // 车牌号小写转大写
    handleCarNoBlur (val) {
      this.pick.carNo = val.toUpperCase()
    },
    // 格式化城市
    cityFormatter (code) {
      if (!code) return ''
      return Array.from(new Set(City.codeToFullNameArr(code, 3))).join('')
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog-title
  text-align center
  font-size 16px
  font-family 'PingFangSC-Medium'
  font-weight 700
  color rgba(47,50,62,1)
  letter-spacing 1px
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
<style lang='stylus'>
.dispatch-dialog
  .ivu-modal-body
    padding 22px 40px
</style>
