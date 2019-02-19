<template>
  <div class="upstream">
    <TabHeader ref="$tab" :tabs="tabList" :type="tabType" @on-change="tabChanged"></TabHeader>
    <template>
      <div class="easy-search-box">

        <!-- 按钮组 -->
        <div class="custom-style">
          <Button v-for="(item, key) in showButtons" :key="key"
                  :type="key === 0 ? 'primary' : 'default'"
                  class="action-btn"
                  @click="item.func">{{ item.name }}</Button>
        </div>
        <!-- 简易搜索 -->
        <div v-if="isEasySearch" class="right custom-style">
          <Select v-model="easySelectMode"
                  transfer
                  style="width:120px; margin-right: 11px"
                  @on-change="resetEasySearch"
          >
            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <SelectInput
            v-if="easySelectMode === 1"
            v-model="easySearchKeyword"
            :maxlength="20"
            :remote="false"
            :clearable="true"
            :local-options="cooperationClients"
            placeholder="请选择或输入客户名称"
            style="width:200px"
            @on-focus.once="getClients"
            @on-clear="resetEasySearch"
          >
          </SelectInput>
          <Input v-if="easySelectMode === 2"
                 v-model="easySearchKeyword"
                 :icon="easySearchKeyword ? 'ios-close-circle' : ''"
                 :maxlength="20"
                 placeholder="请输入客户订单号"
                 class="search-input"
                 @on-click="resetEasySearch"
          />

          <Button icon="ios-search" type="primary"
                  class="search-btn-easy"
                  @click="startSearch"
          ></Button>

          <Button class="senior-search"
                  type="text" size="small"
                  @click="changeSearchType">高级搜索</Button>
        </div>
      </div>
      <!-- 高级搜索 -->
      <div v-if="!isEasySearch" class="operate-box custom-style">

        <div style="margin-bottom: 10px;">
          <SelectInput
            v-model="seniorSearchFields.shipperCompanyName"
            :maxlength="20"
            :remote="false"
            :local-options="cooperationClients"
            placeholder="请选择或输入客户名称"
            class="search-input-senior"
            @on-focus.once="getClients"
          >
          </SelectInput>
          <Input v-model="seniorSearchFields.customerOrderNo"
                 mode="carrier"
                 placeholder="请输入客户订单号"
                 class="search-input-senior"
          />
          <SelectInputForCity v-model="seniorSearchFields.departureCity"  placeholder="请输入发货城市" class="search-input-senior" />
          <SelectInputForCity v-model="seniorSearchFields.destinationCity"  placeholder="请输入收货城市" class="search-input-senior" />
        </div>

        <div class="complex-query">
          <div>
            <DatePicker
              v-model="seniorSearchFields.dateRange"
              :options="timeOption" :start-date="perMonth"
              type="daterange"
              transfer
              split-panels placeholder="开始日期-结束日期" class="search-input-senior"></DatePicker>
          </div>
          <div>
            <Button type="primary"
                    class="action-btn"
                    @click="startSearch">搜索</Button>
            <Button type="default"
                    class="action-btn"
                    @click="resetSeniorSearch()">清除条件</Button>
            <Button type="default"
                    style="margin-right: 0;"
                    class="action-btn"
                    @click="changeSearchType">简易搜索</Button>
          </div>
        </div>

      </div>
    </template>
    <PageTable ref="$table"
               :columns="tableColumns"
               :show-filter="true"
               :keywords="searchFields"
               :table-head-type="headType"
               list-field="list"
               row-id="shipperOrderId"
               url="/busconnector/shipper/list"
               method="post"
               style="margin-top: 15px"
               @on-selection-change="selectionChanged"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Export from '@/libs/js/export'
import BasePage from '@/basic/BasePage'
import PageTable from '@/components/page-table'
import SelectInput from '@/components/SelectInput.vue'
import SelectInputForCity from '@/components/SelectInputForCity.vue'
import TabHeader from '../components/TabHeader'
import headType from '@/libs/constant/headtype'
import { TABLE_COLUMNS, TABLIST, BTNLIST, setTabList } from '../constant/upstream.js'
import Server from '@/libs/js/server'
import { getPreMonth } from '../../../libs/js/getPerMonth'
export default {
  name: 'upstream',
  components: { TabHeader, PageTable, SelectInput, SelectInputForCity },
  mixins: [BasePage],
  metaInfo: { title: '上游来单' },
  data () {
    return {
      tabType: 'upstream',
      currentBtns: [], // 当前按钮组
      // 表头
      headType: headType.UPSTREAM_ORDER,
      // 简易搜索类型
      selectList: [
        { value: 1, label: '客户名称' },
        { value: 2, label: '客户订单号' }
      ],
      isEasySearch: true, // 是否为简易搜索
      inSearching: false, // 当前是否搜索中
      easySelectMode: 1, // 简易搜索当前类型
      easySearchKeyword: '', // 简易搜索字段

      // 高级搜索字段
      seniorSearchFields: {
        shipperCompanyName: '', // 客户名称
        customerOrderNo: '', // 客户单号
        departureCity: '', // 发货城市
        destinationCity: '', // 收货城市
        dateRange: ['', ''] // 日期范围
      },
      tabList: TABLIST,
      btnList: BTNLIST(this),
      tableColumns: TABLE_COLUMNS(this), // 表头
      searchFields: {}, // 发起请求时的搜索字段
      tableSelection: [], // 表格的选中项
      timeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() // 过滤当前日期之后的日期
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'cooperationClients'
    ]),
    perMonth () {
      return getPreMonth()
    },
    // tab切换后根据tab和权限确定应展示的按钮组
    showButtons () {
      return this.currentBtns.filter(item => {
        return this.hasPower(item.code)
      })
    }
  },
  created () {
    this.setTabToCustom()
  },
  methods: {
    ...mapActions([
      'getClients',
      'getCount'
    ]),
    /**
     * 将tab切换到用户设置的tab页并查询数据
     * 1. 如果从其他页面进入，则从url获取tab tag并切换
     * 2. 如果直接打开，则从session中获取上次打开时最后切换到的tab
     * 3. 如果session也没有，则进入第一个tab
     */
    setTabToCustom () {
      let tab
      if (this.$route.query.tab !== undefined && this.$route.query.tab < this.tabList.length) {
        tab = this.tabList[this.$route.query.tab].name
        window.sessionStorage.setItem('upstream' + this.tabType, tab)
      } else {
        tab = window.sessionStorage['upstream' + this.tabType]
      }

      if (tab !== undefined) {
        this.tabStatus = this.setTabStatus(tab)
        this.tabChanged(tab)
      } else {
        this.tabStatus = this.setTabStatus(this.tabList[0].name)
        if (this.tabType === 'upstream') this.currentBtns = this.btnList[0].btns
        this.fetchData()
      }
    },
    // 设置标签状态
    setTabStatus (tab) {
      switch (tab) {
        case '全部':
          return
        case '待接收':
          return 0
        case '已接收':
          return 1
        case '已拒绝':
          return 2
        default:
      }
    },
    // tab切换
    tabChanged (tab) {
      // 设置当前的按钮组
      for (let i = 0; i < this.btnList.length; i++) {
        if (tab === this.btnList[i].tab) {
          this.currentBtns = this.btnList[i].btns
          break
        }
      }
      // 设置当前tab状态
      this.tabStatus = this.setTabStatus(tab)
      // 重置搜索条件
      this.resetEasySearch()
      this.resetSeniorSearch()
      // 查询数据
      this.fetchData()
      // 搜索与查询
      // this.fetchTabCount && this.fetchTabCount()
    },
    // 查询标签页数量
    fetchTabCount () {
      this.getCount().then(res => {
        // console.log(res)
        this.tabList = setTabList(res)
      })
      // Server({
      //   url: '/busconnector/shipper/getOrderNumByStatus',
      //   method: 'get'
      // }).then(res => {
      //   this.tabList = setTabList(res.data.data)
      // })
    },
    // 简易与高级搜索切换
    changeSearchType () {
      this.isEasySearch = !this.isEasySearch
      this.resetEasySearch()
      this.resetSeniorSearch()
    },
    // 重置高级搜索
    resetSeniorSearch () {
      let needReset = false
      for (let key in this.seniorSearchFields) {
        if (key === 'dateRange') {
          this.seniorSearchFields.dateRange = []
        } else if (this.seniorSearchFields[key] !== '') {
          this.seniorSearchFields[key] = ''
          needReset = true
        }
      }
      if (!needReset || !this.inSearching) return
      // this.page.current = 1
      this.inSearching = false
      // this.resetSeniorSearch()
      this.fetchData()
    },
    // 重置简易搜索
    resetEasySearch () {
      if (this.easySearchKeyword === '') return
      this.easySearchKeyword = ''
      if (!this.inSearching) return
      // this.page.currentcurrent = 1
      this.inSearching = false
      this.fetchData()
    },
    // 设置查询参数
    setFetchParams () {
      let params = {
        acceptStatus: this.tabStatus
      }
      if (this.inSearching) {
        if (this.isEasySearch) {
          if (this.easySearchKeyword) {
            if (this.easySelectMode === 1) {
              params.shipperCompanyName = this.easySearchKeyword
            } else if (this.easySelectMode === 2) {
              params.customerOrderNo = this.easySearchKeyword
            }
          }
        } else {
          if (this.seniorSearchFields.dateRange[0]) {
            // this.seniorSearchFields.createTimeStart = this.seniorSearchFields.dateRange[0].Format('yyyy-MM-dd hh:mm:ss')
            this.seniorSearchFields.createTimeStart = this.seniorSearchFields.dateRange[0].getTime()
          } else this.seniorSearchFields.createTimeStart = ''
          if (this.seniorSearchFields.dateRange[1]) {
            let endTime = this.seniorSearchFields.dateRange[1].getTime() + (24 * 60 * 60 - 1) * 1000
            // this.seniorSearchFields.createTimeEnd = (new Date(endTime)).Format('yyyy-MM-dd hh:mm:ss')
            this.seniorSearchFields.createTimeEnd = endTime
          } else this.seniorSearchFields.createTimeEnd = ''

          for (let key in this.seniorSearchFields) {
            if (key === 'dateRange') continue
            if (this.seniorSearchFields[key]) {
              params[key] = this.seniorSearchFields[key]
            }
          }
        }
      }
      return params
    },
    // 查询数据
    fetchData () {
      this.tableSelection = []
      this.$refs.$table && this.$refs.$table.clearSelected() // 清空已选项
      this.searchFields = this.setFetchParams() // 设置请求搜索字段，page table组件会自动查询
      this.fetchTabCount && this.fetchTabCount() // 如果存在查询tab数量的方法则查询
    },
    // 状态码转名称
    statusToName (code) {
      let name
      switch (code) {
        case 0:
          name = '待接收'
          break
        case 10:
          name = '待提货'
          break
        case 20:
          name = '待送货'
          break
        case 30:
          name = '在途'
          break
        case 40:
          name = '已到货'
          break
        case 50:
          name = '已回单'
          break
        case 99:
          name = '已拒绝'
          break
        case 100:
          name = '已删除'
          break
        default:
      }
      return name
    },
    /**
     * 搜索
     * 如果是简易搜索则直接进行搜索
     * 如果是高级搜索且存在搜索关键字则搜索
     */
    startSearch () {
      if (!this.isEasySearch) {
        let canSearch = false
        for (let key in this.seniorSearchFields) {
          if (this.seniorSearchFields[key] !== '') canSearch = true
        }
        if (!canSearch) return
      }
      this.inSearching = true
      this.fetchData()
    },
    // 校验批量操作时是否已选择
    checkTableSelection () {
      if (!this.tableSelection.length) {
        this.$Message.error('请至少选择一条信息')
        return false
      }
      return true
    },
    // 选中的表格行
    selectionChanged (selection) {
      this.tableSelection = selection
    },
    // 导出
    upstreamExport () {
      let data = this.setFetchParams()
      data.shipperOrderIds = this.tableSelection.map(item => item.shipperOrderId)
      if (data.shipperOrderIds.length <= 0) {
        data.shipperOrderIds = undefined
      }
      // console.log(data)
      Export({
        url: '/busconnector/shipper/export',
        method: 'post',
        data,
        fileName: '订单明细'
      })
    },
    // 接受
    accept () {
      if (!this.checkTableSelection()) return
      let shipperOrderIds = this.tableSelection.map(item => item.shipperOrderId)
      Server({
        url: '/busconnector/shipper/accept',
        method: 'post',
        data: { shipperOrderIds }
      }).then(res => {
        this.$Message.success('接受成功')
        this.fetchData()
      })
    },
    // 拒绝
    reject () {
      const self = this
      if (!this.checkTableSelection()) return
      self.openDialog({
        name: 'upstream/dialog/confirm',
        data: {
          title: '提示',
          message: '确认要拒绝选中的订单吗？拒绝后将无法恢复'
        },
        methods: {
          confirm () {
            let shipperOrderIds = self.tableSelection.map(item => item.shipperOrderId)
            Server({
              url: '/busconnector/shipper/reject',
              method: 'post',
              data: { shipperOrderIds }
            }).then(res => {
              self.$Message.success('拒绝完成')
              self.fetchData()
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.upstream
  .custom-style
    .ivu-input
      display inling-block
    .action-btn
      margin-right 15px
      min-width 80px
    .ivu-btn-default
      background #F9F9F9
  .easy-search-box
    display flex
    display -ms-flexbox
    justify-content space-between
    -ms-flex-pack justify
    margin-top 30px
  .search-btn-easy
    width 40px !important
    margin-left -2px
    margin-right 0 !important
    border-top-left-radius 0
    border-bottom-left-radius 0
  .senior-search
    width 36px !important
    line-height 1.2
    letter-spacing 1px
    padding 0
    white-space normal
    margin-right 0 !important
    margin-left 8px !important
  .operate-box
    background: rgba(249,249,249,1)
    margin: 15px 0
    padding: 10px
  .complex-query
    display: flex;
    display -ms-flexbox
    justify-content: space-between;
    -ms-flex-pack justify
  .search-input
    display inline-block
    width: 200px

    &-senior
      display inline-block
      width 190px !important
      margin-right 20px

  .table-pagination
    text-align right
    margin-top 20px
</style>
