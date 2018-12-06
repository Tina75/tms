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
      </div>
    </template>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import TabHeader from './components/TabHeader'
export default {
  name: 'upstream',
  components: { TabHeader },
  mixins: [BasePage],
  data () {
    return {
      tabType: 'upstream',
      isEasySearch: true, // 是否为简易搜索
      currentBtns: [], // 当前按钮组
      tabList: [
        { name: '全部', count: '' },
        { name: '待接收', count: '' },
        { name: '已接收', count: '' },
        { name: '拒绝', count: '' }
      ],
      btnList: [
        {
          tab: '全部',
          btns: [
            {
              name: '导出',
              code: 120102,
              func: () => {
                this.a()
              }
            }
          ]
        },
        {
          tab: '待接收',
          btns: [{
            name: '接收',
            code: 120108,
            func: () => {
              this.a()
            }
          }, {
            name: '拒绝',
            code: 120108,
            func: () => {
              this.a()
            }
          }, {
            name: '导出',
            code: 120108,
            func: () => {
              this.a()
            }
          }]
        },
        {
          tab: '已接收',
          btns: [
            {
              name: '导出',
              code: 120102,
              func: () => {
                this.a()
              }
            }
          ]
        },
        {
          tab: '拒绝',
          btns: [
            {
              name: '导出',
              code: 120102,
              func: () => {
                this.a()
              }
            }
          ]
        }
      ]
    }
  },
  computed: {
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
        // this.tabStatus = this.setTabStatus(tab)
        this.tabChanged(tab)
      } else {
        // this.tabStatus = this.setTabStatus(this.tabList[0].name)
        if (this.tabType === 'upstream') this.currentBtns = this.btnList[0].btns
        // this.fetchData()
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
      // this.tabStatus = this.setTabStatus(tab)
      // 重置搜索条件
      // this.resetEasySearch()
      // this.resetSeniorSearch()
      // 搜索与查询
      // if ((this.tabType === 'ABNORMAL') || (this.tabType === 'OUTER') || (this.tabType !== 'OUTER' && this.tabStatus)) this.fetchData()
      // else this.fetchTabCount && this.fetchTabCount()
    },
    a () {
      console.log('111')
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
