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
        <Input v-model="queryParams.operator" :maxlength="15" placeholder="请输入操作人"></Input>
        </Col>
      </Row>
      <Row class="item-row">
        <Col span="5">
        <Select v-model="queryParams.operateType" clearable placeholder="请选择操作" >
          <Option v-for="item in operateTypeList" :value="item.value" :key="item.label">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col offset="1" span="5">
        <Select v-model="queryParams.cardType" clearable placeholder="请选择类型">
          <Option v-for="item in cardTypeList" :value="item.value" :key="item.label">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col offset="1" span="5">
        <Select v-model="queryParams.issuer" clearable placeholder="请选择发卡机构">
          <Option v-for="item in issuerList" :value="item.value" :key="item.label">{{ item.label }}</Option>
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
        <Col offset="1" span="5">
        <Input v-model="queryParams.driverName" :maxlength="15" placeholder="请输入持卡人"></Input>
        </Col>
        <Col span="5">
        <div class="query-btn">
          <Button type="primary">搜索</Button>
          <Button>清除条件</Button>
        </div>
        </Col>
      </Row>
    </div>
    <!--操作按钮-->
    <div class="operateBtn">
      <Button v-for="(item, key) in showButtons" :key="key"
              :type="key === 0 ? 'primary' : 'default'"
              class="actionBtn">
        {{ item.name }}
      </Button>
    </div>
    <!--列表展示-->
    <PageTable
      :columns="tableColumns"
      :keywords="searchFields"
      class="pageTable"
      row-id="id"
      method="post"
      url="http://192.168.1.39:3000/mock/214/oilCard/log/queryList"></PageTable>
  </div>
</template>

<script>
import { USEDBTN } from '../constant/oil'
import commonmixin from '../mixin/commonmixin'
export default {
  name: 'used-list',
  mixins: [commonmixin],
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
      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      currentBtns: USEDBTN(this)
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus">
  @import "../style/common.styl"
</style>
