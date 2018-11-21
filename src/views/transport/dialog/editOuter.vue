<template>
  <div class="dialog">
    <Modal v-model="show" :mask-closable="false" transfer width="400" @on-visible-change="close">
      <p slot="header" style="text-align:center">
        <span>编辑</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="110" label-position="right">
        <FormItem label="外转方：" prop="transfereeName">
          <SelectInput ref="transInput" v-model="info.transfereeName"
                       mode="transferee"
                       placeholder="请输入"
                       style="width:200px"
                       @on-select="handleSelectTransferee" />
        </FormItem>
        <FormItem label="外转方运单号：">
          <Input v-model="info.outTransNo" :maxlength="20" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="付款方式：" prop="payType">
          <Select v-model="info.payType" style="width:200px" transfer>
            <Option v-for="item in payType" :key="item.value" :value="item.value">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="公里数：" prop="mileage">
          <TagNumberInput :min="0" v-model="info.mileage" style="width:145px">
          </TagNumberInput>
          <span class="unitSpan">公里</span>
        </FormItem>
        <FormItem label="外转运费：" prop="transFee">
          <div style="width:200px">
            <TagNumberInput :min="0" v-model="info.transFee" style="width:145px">
            </TagNumberInput>
            <span class="unitSpan">元</span>
            <a @click.prevent="showChargeRules">
              <FontIcon type="jisuanqi" size="22" color="#00a4bd" class="i-ml-5" style="vertical-align: middle;"></FontIcon>
            </a>
          </div>
        </FormItem>
        <FormItem label="返现运费：" prop="cashBack">
          <TagNumberInput v-model="info.cashBack" style="width:145px">
          </TagNumberInput>
          <span class="unitSpan">元</span>
          <span>
            <Tooltip
              max-width="200"
              transfer
              content="返现运费是指在实际运输过程中存在某一段运输没有执行，需要将提前支付的运费返还">
              <Icon type="ios-alert" class="ios-alert" />
            </Tooltip>
          </span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary"  @click="save">确定</Button>
        <Button type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

/**
 * 编辑外转单
 */

import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '../components/SelectInput.vue'
import TagNumberInput from '@/components/TagNumberInput'
import payType from '@/libs/constant/settlement'
import FontIcon from '@/components/FontIcon'

export default {
  name: 'outer',

  components: {
    SelectInput,
    TagNumberInput,
    FontIcon
  },

  mixins: [ BaseDialog ],
  data () {
    // 9位整数 2位小数
    const validateFee = (rule, value, callback) => {
      if ((value && /^[0-9]{0,9}(?:\.\d{1,2})?$/.test(value)) || !value) {
        callback()
      } else {
        callback(new Error('最多整数位只可输入9位,小数两位'))
      }
    }
    return {
      show: true,
      payType,

      info: {
        transfereeName: '',
        outTransNo: '',
        payType: '',
        transFee: void 0,
        cashBack: null,
        mileage: null
      },
      points: {}, // 始发地目的地经纬度 { startPoint, endPoint }
      rules: {
        transfereeName: [
          { required: true, message: '请填写外转方', trigger: 'blur' },
          { required: true, message: '请填写外转方', trigger: 'change' }
        ],
        transFee: [
          { required: true, type: 'number', message: '请填写外转运费' },
          { validator: validateFee }
        ],
        payType: [
          { required: true, message: '请选择付款方式' }
        ],
        mileage: [
          { message: '小于等于六位整数,最多一位小数', pattern: /^[0-9]{0,6}(?:\.\d{1})?$/ }
        ],
        cashBack: [
          { validator: validateFee }
        ]
      }
    }
  },
  created: function () {
    this.fetchData()
  },

  methods: {
    handleSelectTransferee ({ row }) {
      if (row.payType) this.info.payType = row.payType
    },

    save () {
      const self = this
      self.$refs['info'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, self.info)
          data.transFee = data.transFee * 100
          data.mileage = Number(data.mileage) * 1000
          data.cashBack = Number(data.cashBack) * 100

          Server({
            url: '/outside/bill/update',
            method: 'post',
            data
          }).then((res) => {
            self.$Message.success('操作成功')
            self.close()
            self.complete()
          })
        }
      })
    },

    // 显示计费规则
    showChargeRules () {
      const self = this
      if (!self.info.transfereeName) {
        this.$Message.error('请先选择或输入外转方')
        return
      }
      const transfereeItem = this.$refs.transInput.options.find(transferee => transferee.name === self.info.transfereeName)
      if (!transfereeItem) {
        this.$Message.warning('您选择或输入的外转方没有维护的计费规则')
        return
      }
      let transfereeId = transfereeItem.id
      if (!transfereeId) {
        this.$Message.warning('您选择或输入的外转方没有维护的计费规则')
        return
      }
      this.openDialog({
        name: 'dialogs/financeRule',
        data: {
          partnerId: transfereeId,
          partnerType: 3,
          partnerName: self.info.transfereeName,
          ...self.financeRulesInfo,
          ...self.points
        },
        methods: {
          ok (charge) {
            self.info.transFee = charge || 0
          },
          closeParentDialog () {
            self.close()
          }
        }
      })
    },

    fetchData () {
      const vm = this
      Server({
        url: '/outside/bill/detail',
        method: 'post',
        data: { transId: vm.id }
      }).then(res => {
        const data = res.data.data
        for (let key in vm.info) {
          vm.info[key] = data.customerInfo[key]
        }
        if (data.customerInfo.consignerAddressLongitude && // 发货方纬度
            data.customerInfo.consignerAddressLatitude && // 发货方经度
            data.customerInfo.consigneeAddressLongitude && // 收货方纬度
            data.customerInfo.consigneeAddressLatitude) { // 收货方经度
          vm.points = {
            startPoint: { lng: data.customerInfo.consignerAddressLongitude, lat: data.customerInfo.consignerAddressLatitude },
            endPoint: { lng: data.customerInfo.consigneeAddressLongitude, lat: data.customerInfo.consigneeAddressLatitude }
          }
        }
        vm.info.transFee = vm.info.transFee / 100
        vm.info.cashBack = vm.info.cashBack / 100 || null
        vm.info.payType = vm.info.payType
        vm.info.mileage = Number(vm.info.mileage) / 1000 || null
      }).catch(err => console.error(err))
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
.blank
  /deep/ .ivu-form-item-label:before
    visibility: hidden
.unitSpan
  margin-left 5px
.ios-alert
  font-size 20px
  color #FFBB44
  margin -3px 0 0 5px
</style>
