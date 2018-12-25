<template>
  <div class="contenAll">
    <WaveProcess :process="percent" class="ivu-chart-circle"></WaveProcess>
    <div class="contentLabel">
      <p v-if="percent !== 100" class="finallyLabel">欢迎探索运掌柜</p>
      <p v-if="percent !== 100" class="askLabel">完善以下相关信息，以便于您更好的管理业务哦~</p>
      <p v-if="percent === 100" class="finallyLabel">恭喜您完成运掌柜探索</p>
      <p v-if="percent === 100" class="askLabel">若有任何疑问，请联系您的专属客户经理哦~</P>
    </div>
    <Steps :current="-1" :style="stepMarginLeft" class="stepDiv">
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
                <span v-if="btn.click > 0">
                  <Icon type="md-checkmark" />
                </span>
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
import WaveProcess from '../components/WaveProcess.vue'
export default {
  name: 'explore',
  components: {
    WaveProcess
  },
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
      stepBtnList: [],
      stepMarginLeft: ''
    }
  },
  computed: {
    percent () {
      return Math.round(this.btnClickedNum / this.btnNum * 100)
    }
  },
  watch: {
    stepList (newList) {
      let setpLeft = ''
      if (newList.length === 1) setpLeft = '49%'
      else if (newList.length === 2) setpLeft = '32%'
      else if (newList.length === 3) setpLeft = '23%'
      else if (newList.length === 4) setpLeft = '18%'
      else if (newList.length === 5) setpLeft = '6%'
      this.stepMarginLeft = 'padding-left:' + setpLeft
    },
    $route (to, from) {
      if (to.path === '/helper/index' && localStorage.percent) {
        this.$Toast.success({
          content: '恭喜您完成运掌柜的探索',
          render (h) {
            return h('div', {
              style: {
                color: '#666666',
                fontSize: '12px'
              }
            }, '若还有任何疑问，还可以联系您专属客户经理咨询哦')
          }
        })
        localStorage.removeItem('percent')
      }
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
        }).then(() => {
          if (Math.round(this.btnClickedNum / this.btnNum * 100) === 100 && this.percent === 100) {
            localStorage.percent = true
          }
        })
      }
      // 根据code打开具体tab页面
      let code = this.stepBtnList.find(b => b.id === id).code
      switch (code) {
        case '100002':
          this.openTab({
            path: TMSUrl.PROCESS,
            title: '业务流程'
          })
          break
        case '140100':
          this.openTab({
            path: TMSUrl.EMPLOYEE_MANAGEMENT,
            title: '角色管理'
          })
          break
        case '140200':
          this.openTab({
            path: TMSUrl.STAFF_MANAGEMENT,
            title: '员工管理'
          })
          break
        case '140300':
          this.openTab({
            path: TMSUrl.COMPANY_SETTING,
            title: '公司设置'
          })
          break
        case '190100':
          this.openTab({
            path: TMSUrl.OWNEDVEHICLE_DRIVER,
            title: '司机管理'
          })
          break
        case '190200':
          this.openTab({
            path: TMSUrl.OWNEDVEHICLE_CAR,
            title: '车辆管理'
          })
          break
        case '130100':
          this.openTab({
            path: TMSUrl.SENDER_MANAGEMENT,
            title: '发货方管理'
          })
          break
        case '130200':
          this.openTab({
            path: TMSUrl.CARRIER_MANAGEMENT,
            title: '承运商管理'
          })
          break
        case '130300':
          this.openTab({
            path: TMSUrl.TRANSFER_MANAGEMENT,
            title: '外转方管理'
          })
          break
        case '100200':
          this.openTab({
            path: TMSUrl.IMPORT_ORDER,
            title: '批量导入'
          })
          break
        case '100100':
          this.openTab({
            path: TMSUrl.CREATE_ORDER,
            title: '手工开单'
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
      if (this.getBtn('140300') || this.getBtn('140100') || this.getBtn('140200')) {
        busList.BtnList.push(this.getBtn('140300'))
        busList.BtnList.push(this.getBtn('140100'))
        busList.BtnList.push(this.getBtn('140200'))
        busList.BtnList = busList.BtnList.filter(Boolean)
        this.stepList.push(busList)
      }

      let carList = { id: 5, name: '录入自有车资料', BtnList: [] }
      if (this.getBtn('190100') || this.getBtn('190200')) {
        carList.BtnList.push(this.getBtn('190100'))
        carList.BtnList.push(this.getBtn('190200'))
        carList.BtnList = carList.BtnList.filter(Boolean)
        this.stepList.push(carList)
      }
      let infoList = { id: 3, name: '录入客户资料', BtnList: [] }
      if (this.getBtn('130100') || this.getBtn('130200')) {
        infoList.BtnList.push(this.getBtn('130100'))
        infoList.BtnList.push(this.getBtn('130200'))
        // infoList.BtnList.push(this.getBtn('130300'))
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
>>>.ivu-steps .ivu-steps-head-inner>.ivu-steps-icon.ivu-icon
  color: #00A4BD
>>>.ivu-steps .ivu-steps-tail>i
  height 2px
.ivu-chart-circle
  margin-left: calc(50% - 70px);
.contenAll
  padding-top 60px
  margin 0 auto
  width 900px
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
  border #00A4BD
.stepDiv
  margin-top 60px
</style>
