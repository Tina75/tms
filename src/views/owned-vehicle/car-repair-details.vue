<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">维修信息</span>
        <div class="btnItem">
          <Button class="btnSty" @click="removeRepairData">删除</Button>
          <Button type="primary" class="btnSty" @click="updateRepairData">修改</Button>
        </div>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNO}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修类别：</span>
            {{infoData.repairType === 1 ? '维修' : null }}
            {{infoData.repairType === 2 ? '保养' : null }}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修日期：</span>
            {{formatDate(infoData.repairDate)}}
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">送修人：</span>
            {{infoData.repairPerson}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">送修公里数：</span>
            {{infoData.repairMile}}<span>公里</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">维修费用：</span>
            {{infoData.repairMoney / 100}}<span>元</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">已支付费用：</span>
            {{infoData.payMoney / 100}}<span>元</span>
          </div>
          </Col>
          <Col span="6">
          <div>
            <span class="label">未支付费用：</span>
            {{infoData.waitPayMoney / 100}}<span>元</span>
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修单位：</span>
            {{infoData.repairUnit}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修原因：</span>
            {{infoData.repairReason}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">维修结果：</span>
            {{infoData.repairResult}}
          </div>
          </Col>
        </Row>
        <Row class="row">
          <Col span="20">
          <div>
            <span class="label">备注：</span>
            {{infoData.remark}}
          </div>
          </Col>
        </Row><br/>
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">操作日志</span>
        </div>
        <div class="list-info">
          <record-list :search-data="searchLogData" methods-url="/ownerCar/carrierLog/list"></record-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import RecordList from '@/components/RecordList'
export default {
  name: 'car-repair-details',
  components: { RecordList },
  mixins: [ BasePage ],
  metaInfo: {
    title: '维修保养详情'
  },
  data () {
    return {
      infoData: {},
      id: '',
      carrierId: '',
      searchLogData: {}
    }
  },
  computed: {
  },
  created () {
    this.searchLogData.carrierId = this.$route.query.carrierId
    this.searchLogData.id = this.$route.query.rowData.id
    this.searchLogData.logType = 'repair'
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.id = this.$route.query.rowData.id
    this.carrierId = this.$route.query.carrierId
  },
  methods: {
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    removeRepairData () {
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
          }
        }
      })
    },
    updateRepairData () {
      let _this = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '修改维修记录',
          flag: 2, // 修改
          id: _this.infoData.driverId,
          carrierId: _this.carrierId,
          driverId: _this.infoData.driverId,
          carId: _this.infoData.carId,
          validate: { ..._this.infoData, repairDate: new Date(_this.infoData.repairDate) }
        },
        methods: {
          ok () {
            _this.queryByIdReparir()
          }
        }
      })
    },
    queryByIdReparir () {
      // let _this = this
      // queryByIdCarrier({
      //   id: _this.infoData.id.toString(),
      //   carrierId: _this.carrierId.toString(),
      //   type: 'repair'
      // }).then(res => {
      //   if (res.data.code === CODE) {
      //     _this.infoData = res.data.data
      //   } else {
      //     _this.$Message.error(res.data.msg)
      //   }
      // })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
</style>
