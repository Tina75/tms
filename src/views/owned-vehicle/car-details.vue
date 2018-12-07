<template>
  <div>
    <div class="tab-head">
      <Tabs :animated="false" @on-click="clickTitleTab">
        <TabPane label="车辆信息详情" name="car">
        </TabPane>
        <TabPane label="维修记录汇总" name="repair">
        </TabPane>
      </Tabs>
    </div>
    <!-- 车辆信息详情 -->
    <div v-if="showTableOne" class="info-detail">
      <div class="info">
        <div class="title">
          <span class="icontTitle"></span>
          <span class="iconTitleP">基础信息</span>
          <div class="btnItem">
            <Button v-if="hasPower(190203)" class="btnSty"  @click="removeCar">删除</Button>
            <Button v-if="hasPower(190202)" type="primary" class="btnSty" @click="updateCar">修改</Button>
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
              <span class="label">车型：</span>
              {{infoData.carTypeInit}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车长：</span>
              {{infoData.carLengthInit}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">载重：</span>
              {{infoData.shippingWeight}}<span v-if="infoData.shippingWeight">吨</span>
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">净空：</span>
              {{infoData.shippingVolume}}<span v-if="infoData.shippingVolume">方</span>
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">车辆品牌：</span>
              {{infoData.carBrand}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">主司机：</span>
              {{infoData.driverName}}
            </div>
            </Col>
            <Col span="6">
            <div>
              <span class="label">副司机：</span>
              {{infoData.assistantDriverName}}
            </div>
            </Col>
          </Row>
          <Row class="row">
            <Col span="6">
            <div>
              <span class="label">购买日期：</span>
              {{formatDate(infoData.purchDate)}}
            </div>
            </Col>
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">常跑线路</span>
        </div>
        <div class="list-info">
          <div v-if="this.line1" class="lineSpanLabel">
            {{line1}}
          </div>
          <div v-if="this.line2" class="lineSpanLabel">
            {{line2}}
          </div>
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">证件照片</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col v-for="img in imageItems" :key="img.count" span="5">
            <div :v-if="img.src">
              <div :style="'height: 90px;background-image: url(' + img.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'" class="imageDiv" @click="handleView(img.count)"></div>
              <p :class="img.title.length > 3 ? 'uploadLabelID' : 'uploadLabel'">{{img.title}}</p>
            </div>
            </Col>
          </Row>
        </div>
        <div class="title" style="margin-top: 40px;">
          <span class="icontTitle"></span>
          <span class="iconTitleP">备注</span>
        </div>
        <div class="list-info">
          <Row class="row">
            <Col span="20">
            {{infoData.remark}}
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!-- 维修记录汇总 -->
    <div v-if="!showTableOne">
      <div class="addRepair">
        <Button v-if="hasPower(190301)" type="primary" @click="editRepair">新增维修保养</Button>
        <Button v-if="hasPower(190304)" class="buttonSty" @click="carExport">导出</Button>
      </div>
      <page-table
        :columns="menuColumns"
        :keywords="repairFormatInit"
        class="pageTable"
        url="/ownerCar/repair/list"
        list-field="list"
        method="post"
        @on-load="handleLoad">
      </page-table>
    </div>
  </div>
</template>
<script>
import BasePage from '@/basic/BasePage'
import { CAR_TYPE1, CAR_LENGTH1 } from '@/libs/constant/carInfo'
import RecordList from '@/components/RecordList'
import prepareOpenSwipe from '@/components/swipe/index'
import { CODE, deleteCarById, queryCarById, deleteRepairById } from './client'
import pageTable from '@/components/page-table'
import TMSUrl from '@/libs/constant/url'
import Export from '@/libs/js/export'
export default {
  name: 'car-details',
  components: { RecordList, prepareOpenSwipe, pageTable, Export },
  mixins: [ BasePage ],
  metaInfo: {
    title: '车辆详情'
  },
  data () {
    return {
      showTableOne: true,
      exportFile: true,
      infoData: {},
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH1,
      line1: '',
      line2: '',
      searchLogData: {},
      imageItems: [],
      repairFormatInit: {},
      menuColumns: [
        {
          title: '操作',
          key: 'id',
          width: 150,
          render: (h, params) => {
            let renderBtn = []
            if (this.hasPower(190302)) {
              renderBtn.push(h('span', {
                style: {
                  marginRight: '12px',
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    var vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/edit-repair',
                      data: {
                        title: '修改维修保养',
                        flag: 2, // 修改
                        validate: { ...params.row, repairDate: new Date(params.row.repairDate) }
                      },
                      methods: {
                        ok () {
                          vm.searchRepairByCar()
                        }
                      }
                    })
                  }
                }
              }, '修改'))
            }
            renderBtn.push(h('span', {
              style: {
                marginRight: '12px',
                color: '#00A4BD',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.openTab({
                    path: TMSUrl.OWNEDVEHICLE_REPAIRDETAILS,
                    query: {
                      id: '维修详情',
                      rowData: params.row,
                      carrierId: this.carrierId
                    }
                  })
                }
              }
            }, '查看'))
            if (this.hasPower(190303)) {
              renderBtn.push(h('span', {
                style: {
                  color: '#00A4BD',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let vm = this
                    this.openDialog({
                      name: 'owned-vehicle/dialog/confirmDelete',
                      data: {
                      },
                      methods: {
                        ok () {
                          deleteRepairById({ id: params.row.id }).then(res => {
                            if (res.data.code === CODE) {
                              vm.$Message.success('删除成功！')
                            }
                          }).then(() => {
                            vm.searchRepairByCar()
                          })
                        }
                      }
                    })
                  }
                }
              }, '删除'))
            }
            return h('div', renderBtn)
          }
        },
        {
          title: '车牌号',
          key: 'carNo'
        },
        {
          title: '维修类别',
          key: 'repairType',
          render: (h, params) => {
            let text = ''
            if (params.row.repairType === 1) {
              text = '维修'
            } else if (params.row.repairType === 2) {
              text = '保养'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '送修日期',
          key: 'repairDate',
          width: 150,
          render: (h, params) => {
            let text = this.formatDate(params.row.repairDate)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '送修人',
          key: 'repairPerson'
        },
        {
          title: '送修公里数',
          key: 'repairMile'
        },
        {
          title: '维修费用',
          key: 'repairMoney',
          render: (h, params) => {
            return h('span', Number(params.row.repairMoney) / 100)
          }
        },
        {
          title: '已支付费用',
          key: 'payMoney',
          render: (h, params) => {
            return h('span', Number(params.row.payMoney) / 100)
          }
        },
        {
          title: '未支付费用',
          key: 'waitPayMoney',
          render: (h, params) => {
            return h('span', Number(params.row.waitPayMoney) / 100)
          }
        },
        {
          title: '添加人',
          key: 'creater'
        },
        {
          title: '添加时间',
          key: 'createTime',
          width: 150,
          render: (h, params) => {
            let text = this.formatDateTime(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        }
      ]
    }
  },
  mounted () {
    this.infoData = this.$route.query.rowData
    this.queryById()
    this.searchRepairByCar()
  },
  methods: {
    // 切换头部tab
    clickTitleTab (val) {
      if (val === 'car') {
        this.showTableOne = true
      } else {
        this.showTableOne = false
      }
    },
    queryById () {
      let vm = this
      queryCarById({ carId: vm.infoData.id }).then(res => {
        if (res.data.code === CODE) {
          vm.infoData = res.data.data
          vm.initData()
          // 大图预览
          vm.openSwipe = prepareOpenSwipe(vm.imageItems)
        }
      }).catch(() => {
        this.$Toast.warning({
          title: '提示',
          content: '车辆信息不存在，请刷新列表',
          onOk () {
            vm.ema.fire('closeTab', vm.$route)
          },
          onCancel () {
            vm.ema.fire('closeTab', vm.$route)
          }
        })
      })
    },
    // 日期格式化
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd') } else { return '' }
    },
    formatDateTime (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    // 初始化数据格式
    initData () {
      this.imageItems = []
      let count = 0
      for (const key in this.infoData) {
        if (key === 'travelPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '行驶证', src: this.infoData.travelPhoto, count: count })
          count++
        }
        if (key === 'roadTransPhoto' && this.infoData[key]) {
          this.imageItems.push({ title: '道路运输证', src: this.infoData.roadTransPhoto, count: count })
          count++
        }
      }
      this.infoData.carTypeInit = this.carTypeMap[this.infoData.carType]
      this.infoData.carLengthInit = this.carLengthMap[this.infoData.carLength]
      let s1 = ''
      let n1 = ''
      let s2 = ''
      let n2 = ''
      if (this.infoData.regularLine && JSON.parse(this.infoData.regularLine).length === 1) {
        s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
        n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
      } else if (JSON.parse(this.infoData.regularLine).length === 2) {
        s1 = JSON.parse(this.infoData.regularLine)[0].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].sn
        n1 = JSON.parse(this.infoData.regularLine)[0].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[0].en
        s2 = JSON.parse(this.infoData.regularLine)[1].sn === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].sn
        n2 = JSON.parse(this.infoData.regularLine)[1].en === undefined ? '' : JSON.parse(this.infoData.regularLine)[1].en
      }
      this.line1 = s1 + '—' + n1 === '—' ? '' : s1 + '—' + n1
      this.line2 = s2 + '—' + n2 === '—' ? '' : s2 + '—' + n2
    },
    removeCar () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/confirmDelete',
        data: {},
        methods: {
          ok () {
            deleteCarById({ carId: vm.infoData.id }).then(res => {
              if (res.data.code === CODE) {
                vm.$Message.success('删除成功！')
                vm.ema.fire('closeTab', vm.$route)
              }
            })
          }
        }
      })
    },
    updateCar () {
      let vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-car',
        data: {
          title: '修改车辆',
          flag: 2,
          validate: { ...vm.infoData, purchDate: new Date(vm.infoData.purchDate) }
        },
        methods: {
          ok () {
            vm.queryById()
          }
        }
      })
    },
    handleView (index) {
      this.openSwipe(index)
    },
    // 新增车辆维修记录
    editRepair () {
      var vm = this
      this.openDialog({
        name: 'owned-vehicle/dialog/edit-repair',
        data: {
          title: '新增维修保养',
          flag: 1, // 新增
          carNo: vm.infoData.carNo
        },
        methods: {
          ok () {
            vm.searchRepairByCar()
          }
        }
      })
    },
    // 导出判空
    handleLoad (response) {
      try {
        if (response.data.data.list.length >= 1) this.exportFile = true
        else this.exportFile = false
      } catch (error) {
        this.exportFile = false
      }
    },
    // 导出维修信息
    carExport () {
      if (!this.exportFile) {
        this.$Message.error('导出内容为空')
        return
      }
      let params = { carNo: this.infoData.carNo }
      Export({
        url: '/ownerCar/repair/export',
        method: 'post',
        data: params,
        fileName: '导出维修列表'
      })
    },
    searchRepairByCar () {
      this.repairFormatInit = { carNo: this.infoData.carNo }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "client.styl"
>>>.ivu-tabs-nav
  font-size: 16px
.tab-head
  margin -15px
  padding 7px 15px
  border-bottom 15px solid #f5f7f9
  /deep/ .ivu-tabs-bar
    border-bottom none
    margin-bottom 1px
    .ivu-tabs-ink-bar
      bottom 2px
.info-detail
  margin-top: 80px;
.btnItem
  margin-top: -40px;
</style>
