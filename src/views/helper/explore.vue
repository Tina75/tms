<template>
  <div class="contenAll">
    <i-circle :percent="percent">
      <span class="demo-circle-inner" style="font-size:24px">{{ percent }}%</span>
    </i-circle>
    <div class="contentLabel">
      <p class="finallyLabel">恭喜您完成运掌柜探索</p>
      <p class="askLabel">若有任何疑问，请联系您的专属客户经理哦~</P>
    </div>
    <Steps :current="4" class="stepDiv">
      <step v-for="btnItem in stepList" :key="btnItem.id" icon="md-radio-button-on">
        <div class="ivu-steps-content">
          <div class="configDiv">
            <label class="configlabel">{{btnItem.name}}</label><br/>
            <div v-for="btn in btnItem.BtnList" :key="btn.id">
              <Button
                v-if="btn.role > 0"
                :class="btn.click === 0 ? circleBtnClicked : circleBtn"
                shape="circle"
                @click="previewed(btn.id)">{{btn.name}}
                <span v-if="btn.click > 0">√</span>
              </Button>
            </div>
          </div>
        </div>
      </step>
    </Steps>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url.js'
export default {
  name: 'explore',
  mixins: [ BasePage ],
  metaInfo: {
    title: '探索运掌柜'
  },
  data () {
    return {
      step: 0,
      stepList: [],
      btnClickedNum: 0,
      btnNum: 0,
      circleBtnClicked: 'circleBtnClicked',
      circleBtn: 'circleBtn',
      stepBtnList: []
    }
  },
  computed: {
    percent () {
      return parseInt(this.btnClickedNum / this.btnNum * 100)
    }
  },
  mounted () {
    this.getBtnList()
  },
  methods: {
    previewed (id) {
      const btn = this.stepBtnList.find(b => b.id === id && b.click !== 1)
      if (btn) {
        let params = {}
        params.id = id
        Server({
          url: '/discover/look',
          method: 'post',
          data: params
        }).then(({ data }) => {
          this.btnClickedNum++
          btn.click = 1
        })
      }
      // 根据id打开具体tab页面
      switch (id) {
        case 207:
          this.openTab({
            path: TMSUrl.PROCESS,
            query: { id: '业务流程' }
          })
          break
        case 208:
          this.openTab({
            path: TMSUrl.EMPLOYEE_MANAGEMENT,
            query: { id: '角色管理' }
          })
          break
        case 209:
          this.openTab({
            path: TMSUrl.STAFF_MANAGEMENT,
            query: { id: '员工管理' }
          })
          break
        case 210:
          this.openTab({
            path: TMSUrl.SENDER_MANAGEMENT,
            query: { id: '发货方管理' }
          })
          break
        case 211:
          this.openTab({
            path: TMSUrl.CARRIER_MANAGEMENT,
            query: { id: '承运商管理' }
          })
          break
        case 212:
          this.openTab({
            path: TMSUrl.TRANSFER_MANAGEMENT,
            query: { id: '外转方管理' }
          })
          break
        case 213:
          this.openTab({
            path: TMSUrl.IMPORT_ORDER,
            query: { id: '批量导入' }
          })
          break
        case 214:
          this.openTab({
            path: TMSUrl.CREATE_ORDER,
            query: { id: '手工开单' }
          })
          break
      }
    },
    // 获取按钮集合（后端接口传入9个按钮，第一个在第一次进入页面标记作用）
    getBtnList () {
      Server({
        url: '/discover/list',
        method: 'get'
      }).then(({ data }) => {
        this.stepBtnList = data.data
      }).then(() => {
        this.setGroupBtn()
        this.percentNumber()
      })
    },
    // 获取百分比分子分母
    percentNumber () {
      this.stepBtnList.forEach(element => {
        if (element.click === 1 && element.role === 1 && element.code !== '100001') this.btnClickedNum++
        if (element.role === 1 && element.code !== '100001') this.btnNum++
      })
    },
    // 步骤分组
    setGroupBtn () {
      let flowList = { id: 1, name: '完善业务流程', BtnList: [] }
      if (this.getBtn('100002')) {
        flowList.BtnList.push(this.getBtn('100002'))
        this.stepList.push(flowList)
      }

      let busList = { id: 2, name: '完善公司信息', BtnList: [] }
      if (this.getBtn('140100') || this.getBtn('140200')) {
        busList.BtnList.push(this.getBtn('140100'))
        busList.BtnList.push(this.getBtn('140200'))
        busList.BtnList = busList.BtnList.filter(Boolean)
        this.stepList.push(busList)
      }

      let infoList = { id: 3, name: '录入客户资料', BtnList: [] }
      if (this.getBtn('130100') || this.getBtn('130200') || this.getBtn('130300')) {
        infoList.BtnList.push(this.getBtn('130100'))
        infoList.BtnList.push(this.getBtn('130200'))
        infoList.BtnList.push(this.getBtn('130300'))
        infoList.BtnList = infoList.BtnList.filter(Boolean)
        this.stepList.push(infoList)
      }

      let orderList = { id: 4, name: '录入客户订单', BtnList: [] }
      if (this.getBtn('100200') || this.getBtn('100100')) {
        orderList.BtnList.push(this.getBtn('100100'))
        orderList.BtnList.push(this.getBtn('100200'))
        orderList.BtnList = orderList.BtnList.filter(Boolean)
        this.stepList.push(orderList)
      }
    },
    // 获取阶段中的按钮
    getBtn (code) {
      return this.stepBtnList.find(btn => btn.code === code && btn.role === 1)
    }
  }
}
</script>
<style lang='stylus' scoped>
>>>.ivu-chart-circle
  margin-left: calc(50% - 60px);
.contenAll
  padding-top 100px
  margin 0 auto
  width 800px
  font-family PingFangSC-Medium
.contentLabel
  text-align center
  .finallyLabel
    color #333333
    font-size 16px
    line-height 40px
    font-weight bold
  .askLabel
    color #666666
    font-size 12px
    line-height 17px
.configDiv
  margin-left -60px
.configlabel
  color #333333
  font-size 14px
  line-height 35px
.circleBtnClicked
  margin 10px 0 0 -20px
  width 120px
.circleBtn
  margin 10px 0 0 -20px
  width 120px
  background #00A4BD
  color #FFFFFF
.stepDiv
  margin-top 60px
  margin-left 80px
</style>
