<template>
  <div>
    <!--搜索列表-->
    <div class="query-box">
      <Row>
        <Col span="5">
        <Input v-model="queryParams.number" :maxlength="20" placeholder="请输入主卡号或副卡号" />
        </Col>
        <Col offset="1" span="5">
        <Input v-model="queryParams.carrierName" :maxlength="10" placeholder="请输入承运商"></Input>
        </Col>
        <Col offset="1" span="5">
        <Input v-model="queryParams.truckNo" :maxlength="15" placeholder="请输入车牌号"></Input>
        </Col>
        <Col offset="1" span="5">
        <Input v-model="queryParams.driverName" :maxlength="15" placeholder="请输入操作人"></Input>
        </Col>
      </Row>
      <Row class="item-row">
        <Col span="5">
        <Select v-model="queryParams.operateType" placeholder="请选择操作">
          <Option v-for="item in operateTypeList" :value="item.value" :key="item.name">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col offset="1" span="5">
        <Select v-model="queryParams.cardType" placeholder="请选择类型">
          <Option v-for="item in cardTypeList" :value="item.value" :key="item.name">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col offset="1" span="5">
        <Select v-model="queryParams.issuer" placeholder="请选择发卡机构">
          <Option v-for="item in issuerList" :value="item.value" :key="item.name">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col offset="1" span="5">
        <DatePicker v-model="queryParams.systemDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请选择日期"></DatePicker>
        </Col>
      </Row>
      <Row class="item-row">
        <Col span="5">
        <DatePicker v-model="queryParams.systemDate" :options="dateOption" transfer format="yyyy-MM-dd" placeholder="请选择日期"></DatePicker>
        </Col>
        <Col span="5">
        <div class="query-btn">
          <Button type="primary">搜索</Button>
          <Button>清除条件</Button>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { OPERATETYPELIST, CARDTYPELIST, ISSUERLIST } from '../constant/enum'
export default {
  name: 'used-list',
  data () {
    return {
      queryParams: {
        number: '',
        operateType: '',
        cardType: '',
        operator: '',
        operateDate: '',
        carrierName: '',
        driverName: '',
        truckNo: '',
        systemDate: '',
        issuer: ''
      },
      operateTypeList: OPERATETYPELIST,
      cardTypeList: CARDTYPELIST,
      issuerList: ISSUERLIST,
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus">
  @import "../style/common.styl"
</style>
