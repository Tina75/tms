<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">计费规则</p>
    <Form v-if="!ruleEmpty" ref="$form" :model="ruleForm" :rules="rules" :label-width="80">
      <FormItem label="计费规则：" prop="ruleIndex">
        <Select v-model="ruleForm.ruleIndex" transfer @on-change="ruleChanged">
          <Option v-for="(item, key) in ruleOptions" :key="key" :value="key">{{ item.name }}</Option>
        </Select>
      </FormItem>
    </Form>

    <div v-else class="i-pb-10 i-pt-10" style="text-align: center;">
      <span>
        <Icon type="md-alert" size="26" color="#FFBB44"></Icon>
        您还未给此客户设置计费规则
      </span>
    </div>

    <div slot="footer">
      <Button v-if="ruleEmpty" type="primary" @click="gotoSetRules">去设置</Button>
      <Button v-else type="primary" @click="save">确定</Button>
      <Button type="default" class="i-ml-10" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>

/** 使用方式参考 /transport/detail/detailFreight.js showChargeRules 方法 */

import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'
import float from '@/libs/js/float'
import BMap from 'BMap'

let errorMsg = ''

export default {
  name: 'FinanceRule',
  mixins: [ BaseDialog ],
  data () {
    const chargeValidate = (rule, value, callback) => {
      const type = this.ruleOptions[value].ruleType
      if (errorMsg) callback(new Error(errorMsg))
      else if (((type === 1 || type === 3) && !this.weight) || ((type === 2 || type === 4) && !this.volume) || !type) callback(new Error('未能找到相应的计费规则'))
      else callback()
    }

    return {
      loading: true,
      ruleForm: { ruleIndex: void 0 },
      ruleOptions: [],
      ruleEmpty: false,
      charge: 0,
      distance: 0,
      zIndex: new Date().getTime(),
      rules: {
        ruleIndex: [{ validator: chargeValidate }]
      }
    }
  },
  created () {
    this.fetchRules()
    this.distanceCalculate()
  },
  methods: {
    // 查询计费规则
    fetchRules () {
      this.loading = true
      Server({
        method: 'get',
        url: '/finance/charge/getRulesByPartner',
        params: {
          partnerId: this.partnerId,
          partnerType: this.partnerType,
          partnerName: this.partnerName
        }
      }).then((res) => {
        this.ruleOptions = res.data.data
        this.ruleEmpty = res.data.data.length <= 0
      })
    },

    // 计算距离
    distanceCalculate () {
      if (this.startPoint && this.endPoint && !this.distance) { // 在有定位且未计算出距离时才执行
        const startPoint = new BMap.Point(this.startPoint.lng, this.startPoint.lat)
        const endPoint = new BMap.Point(this.endPoint.lng, this.endPoint.lat)
        const route = new BMap.DrivingRoute(startPoint, {
          policy: window.BMAP_DRIVING_POLICY_LEAST_DISTANCE, // 距离最短路线
          onSearchComplete: res => {
            const plan = res.getPlan(0)
            if (plan) this.distance = plan.getDistance(false)
            else this.$Message.error('线路查询失败，无法获取距离信息')
          }
        })
        route.search(startPoint, endPoint)
      }
    },

    async ruleChanged (index) {
      errorMsg = ''
      const rule = this.ruleOptions[index]
      if ((rule.ruleType === 3 || rule.ruleType === 4 || rule.ruleType === 7) && this.distance === 0) errorMsg = '地址填写不够详细无法算出里程数'
      this.$refs.$form.validate(valid => {
        if (!valid) return
        /**
         * 重量（吨）1
         * 体积（方）2
         * 吨公里3
         * 方公里4
         * v.1.08
         * 车型5
         * 重量（公斤） 6
         * 公斤公里 7
         */
        // 公斤先乘 1000
        const weight = float.round(rule.ruleType === 7 || rule.ruleType === 6 ? this.weight * 1000 : this.weight)
        const input = float.round(((rule.ruleType === 1 || rule.ruleType === 3 || rule.ruleType === 6 || rule.ruleType === 7) ? weight : this.volume) * 100)
        Server({
          url: '/finance/charge/calc',
          method: 'get',
          data: {
            ruleId: rule.id,
            departure: this.start,
            destination: this.end,
            distance: this.distance,
            input,
            carType: this.carType,
            carLength: this.carLength
          }
        }).then(res => {
          this.charge = float.round(res.data.data / 100)
          errorMsg = ''
          this.$refs.$form.validate()
        }).catch(err => {
          errorMsg = err.data.msg
          this.$refs.$form.validate()
        })
      })
    },

    save () {
      this.$refs.$form.validate(valid => {
        if (!valid) return
        this.ok(this.charge)
        this.close()
      })
    },

    gotoSetRules () {
      this.close()
      if (this.closeParentDialog) this.closeParentDialog()
      this.openTab({
        title: '计费规则',
        path: '/finance/rules',
        query: { tab: this.partnerType - 1 }
      })
    }
  }
}
</script>
