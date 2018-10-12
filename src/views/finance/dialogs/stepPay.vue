<template>
  <Modal v-model="visiable" :mask-closable="false" width="440" footer-hide @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">核销</p>
    <div class="step-pay-data">
      <div class="total-data">
        <Row>
          <Col span="10">
          <p><label>结算方式：</label><span>{{settleTypeDesc}}</span></p>
          </Col>
          <Col span="10">
          <p><label>应付金额：</label><i>{{needPay}}</i><span>元</span></p>
          </Col>
        </Row>
      </div>
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-default ivu-table-with-fixed-top">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0">
              <colgroup>
                <col width="70">
                <col width="70">
                <col width="100">
                <col width="90">
                <col width="80">
              </colgroup>
              <thead>
                <tr>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">序号</span></div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">操作</span></div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">支付方式</span></div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">金额</span></div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell"><span class="">状态</span></div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="ivu-table-body">
            <table cellspacing="0" cellpadding="0" border="0">
              <colgroup>
                <col width="70">
                <col width="70">
                <col width="100">
                <col width="90">
                <col width="80">
              </colgroup>
              <tbody class="ivu-table-tbody">
                <tr v-for="(item, index) in payItems" :key="index" class="ivu-table-row">
                  <td class="" @mouseover="item.showAdjuster = true" @mouseleave="item.showAdjuster = false">
                    <div class="ivu-table-cell">
                      <span v-if="!item.showAdjuster">{{index + 1}}</span>
                      <div v-else class="adjuster">
                        <Icon v-if="index === payItems.length - 1" class="add" type="md-add-circle" @click="addItem(index)"/>
                        <Icon v-if="!item.verifyStatus && payItems.length > 1" class="remove" type="md-remove-circle" @click="removeItem(item, index)"/>
                      </div>
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <a v-if="((hasPower(170101) && scene === 1) || (hasPower(170201) && scene === 2) || (hasPower(170301) && scene === 3)) && !item.verifyStatus && !item.isEdit" @click="writeOff(item)">核销</a>
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <Select v-if="item.isEdit" v-model="item.payType">
                        <Option v-for="(value, key) in payTypeMap" :value="key" :key="key">{{ value }}</Option>
                      </Select>
                      <span v-else>{{item.payTypeDesc}}</span>
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <Input v-if="item.isEdit" v-model="item.fee"/>
                      <span v-else>{{item.feeText}}</span>
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <a v-if="item.isEdit" @click="saveItem(item)">保存</a>
                      <span v-else>{{item.verifyStatusDesc}}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p class="write-off-tip"><Icon class="alert" type="md-alert"/>请选择需单笔明细进行核销，也满足增加和删除核销项目明细！</p>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'

export default {
  name: 'stepPay',
  mixins: [BaseDialog],
  data () {
    return {
      payTypeMap: {
        1: '预付现金',
        2: '预付油卡',
        3: '到付现金',
        4: '到付油卡',
        5: '回付现金',
        6: '回付油卡'
      },
      payItems: []
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      Server({
        url: '/finance/verify/getPayItems',
        method: 'get',
        params: {
          orderId: this.id
        }
      }).then(res => {
        this.payItems = res.data.data.map(item => {
          return Object.assign({}, item, {
            feeText: (item.fee / 100).toFixed(2),
            isEdit: false,
            showAdjuster: false
          })
        })
        if (!res.data.data.some(item => !item.verifyStatus)) {
          this.close()
          this.ok()
        }
      }).catch(err => console.error(err))
    },
    writeOff (item) {
      const _this = this
      this.openDialog({
        name: 'finance/dialogs/writeOff',
        data: {
          id: item.id,
          scene: this.scene,
          verifyType: 2,
          isOil: item.payType === 2 || item.payType === 4 || item.payType === 6,
          needPay: item.feeText,
          settleTypeDesc: this.settleTypeDesc
        },
        methods: {
          ok () {
            _this.loadData()
          }
        }
      })
    },
    saveItem (item) {
      if (!item.payType) {
        this.$Message.error('请选择支付方式')
      } else if (!/^(0|([1-9]\d*))([.]\d{1,2})?$/.test(item.fee)) {
        this.$Message.error('请输入合法的金额')
      } else {
        Server({
          url: '/finance/verify/addPayItem',
          method: 'post',
          data: {
            orderId: this.id,
            payType: item.payType,
            fee: parseFloat(item.fee) * 100
          }
        }).then(res => {
          this.loadData()
        }).catch(err => console.error(err))
      }
    },
    addItem (index) {
      this.payItems.splice(index + 1, 0, {
        isEdit: true,
        showAdjuster: false,
        payType: '',
        fee: ''
      })
    },
    removeItem (item, index) {
      if (item.isEdit) {
        this.payItems.splice(index, 1)
      } else {
        Server({
          url: '/finance/verify/deletePayItem',
          method: 'post',
          data: {
            payItemId: item.id
          }
        }).then(res => {
          this.loadData()
        }).catch(err => console.error(err))
      }
    }
  }
}

</script>
<style lang='stylus' scoped>
  .step-pay-data
    .total-data
      margin-top: 10px
      margin-bottom: 10px
      p
        line-height: 28px
      label
        color: #777777
        vertical-align: middle
      span
        color: #333333
        vertical-align: middle
      i
        color: #00A4BD
        font-size: 20px
        font-weight: bolder
        font-style: normal
        vertical-align: top
        margin-right: 3px
    .ivu-table-cell
      padding-right: 8px
      padding-left: 8px
    .adjuster, .write-off-tip
      i
        display: inline-block
        font-size: 18px
        cursor: pointer
        &.add
          color: #7ED321
          margin-right: 10px
        &.remove
          color: #EC4E4E
        &.alert
          font-size: 14px
          display: inline-block
          color: #FFBB44
          margin-right: 5px
          vertical-align: text-top
    .write-off-tip
      margin-top: 10px
      span
        display: inline-block
        color: #777777
        font-size: 12px
        line-height: 14px
        vertical-align: middle
</style>
