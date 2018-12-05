<template>
  <div class="info-detail">
    <div class="info">
      <div class="title">
        <span class="icontTitle"></span>
        <span class="iconTitleP">维修信息</span>
        <div class="btnItem">
          <Button v-if="hasPower(190303)" class="btnSty" @click="removeRepairData">删除</Button>
          <Button v-if="hasPower(190302)" type="primary" class="btnSty" @click="updateRepairData">修改</Button>
        </div>
      </div>
      <div class="list-info">
        <Row class="row">
          <Col span="6">
          <div>
            <span class="label">车牌号：</span>
            {{infoData.carNo}}
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
import Server from '@/libs/js/server'
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
    this.queryById()
  },
  methods: {
    queryById () {
      let vm = this
      Server({
        url: '/ownerCar/queryRepairDetail',
        method: 'get',
        data: { repairId: vm.infoData.id }
      }).then(({ data }) => {
        if (data.code === 10000) {
          vm.infoData = data.data
        }
      })
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    removeRepairData () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            Server({
              url: '/ownerCar/repair/del',
              method: 'post',
              data: { id: vm.infoData.id }
            }).then(({ data }) => {
              if (data.code === 10000) {
                vm.$Message.success('删除成功！')
                vm.ema.fire('closeTab', vm.$route)
              }
            })
          }
        }
      })
    },
    updateRepairData () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '修改维修记录',
          flag: 2, // 修改
          validate: { ...vm.infoData, repairDate: new Date(vm.infoData.repairDate) }
        },
        methods: {
          ok () {
            vm.queryById()
          }
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
</style>
