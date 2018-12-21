<template>
  <div id="message-list-container" class="message-list-container temAll">
    <Row :style="{'min-height':DocumentHeight +'px'}">
      <Col span="24" class="contentDiv">
      <div class="contendBorderBttom">
        <span class="iconRightTitle"></span>
        <span class="rightTitleSty">{{rightTitle}}</span>
        <div v-if="batchBtnShowAll">
          <span v-if="batchBtnShow" key="1" class="rightConfBtnRemove">
            <Button style="margin-right:20px;" @click="removeInfoAll(searchData.type)">全部删除</Button>
            <Button @click="removeInfoSome">批量删除</Button>
          </span>
          <span v-if="!batchBtnShow" key="2" class="rightConfBtnRemove">
            <Button class="configBtnCancel" @click="removeCancelBtn">取消</Button>
            <Button :disabled="removeSubBtnDis" type="primary" class="configBtn" @click="removeSubBtn">确定</Button>
          </span>
        </div>
      </div>
      <div>
        <!--系统消息-->
        <div v-if="'0' === this.searchData.type">
          <div class="mesDivAll">
            <Checkbox
              v-if="!batchBtnShow"
              :indeterminate="indeterminate"
              :value="checkAll"
              class="checkBoxBtn"
              @click.prevent.native="handleCheckAll">
            <span class="checkBoxMessage">全选</span></Checkbox>
            <div v-if="this.sysMessageList.length === 0" style="flex-direction: column; -ms-flex-direction: column;" class="noneImg">
              <img src="./noneInfo.png"/>
              <p class="message-p">暂无消息</p>
            </div>
            <div v-for="msg in this.sysMessageList" v-else :key="msg.id" class="megDiv">
              <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" class="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox :label="msg.id" class="checkboxItem">
                  <span></span>
                </Checkbox>
              </CheckboxGroup>
              <div class="msgImg">
                <i class="icon font_family icon-xitongxiaoxi" style="color: #FFBB44;"></i>
              </div>
              <div class="msgContent" @click="clickContenInfo(msg)">
                <p class="msgContentTitle">{{msg.title}}</p>
                <div class="msgContentDiv" v-html="fiterContent(msg.content)"></div>
              </div>
              <div class="msgConfigDiv">
                <p style="color: #9DA1B0">{{ formatDate(msg.createTime) }}</p>
                <span class="msgConfigBtn" @click="msgRemoveBtn(msg)">
                  <i class="icon font_family icon-shanchu1" style="color: #777B89"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <!--订单消息-->
        <div v-if="'1' === this.searchData.type">
          <Col span="24">
          <div class="mesDivAll">
            <Checkbox
              v-if="!batchBtnShow"
              :indeterminate="indeterminate"
              :value="checkAll"
              class="checkBoxBtn"
              @click.prevent.native="handleCheckAll">
            <span class="checkBoxMessage">全选</span></Checkbox>
            <div v-if="this.orderMessageList.length === 0" style="flex-direction: column; -ms-flex-direction: column;" class="noneImg">
              <img src="./noneInfo.png"/>
              <p>暂无消息</p>
            </div>
            <div v-for="msg in this.orderMessageList" v-else :key="msg.id" class="megDiv">
              <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" class="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox :label="msg.id" class="checkboxItem"></Checkbox>
              </CheckboxGroup>
              <div class="msgImg">
                <i class="icon font_family icon-dingdanxiaoxi" style="color: #418DF9;"></i>
              </div>
              <div class="msgContent" @click="clickContenInfo(msg)">
                <p class="msgContentTitle">{{msg.title}}</p>
                <pre class="msgContentText">{{msg.content}}</pre>
              </div>
              <div class="msgConfigDiv">
                <p style="color: #9DA1B0">{{ formatDate(msg.createTime) }}</p>
                <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1" style="color: #777B89"></i></span>
              </div>
            </div>
          </div>
            </Col>
        </div>
        <!--运输消息-->
        <div v-if="'2' === this.searchData.type">
          <Col span="24">
          <div class="mesDivAll">
            <Checkbox
              v-if="!batchBtnShow"
              :indeterminate="indeterminate"
              :value="checkAll"
              class="checkBoxBtn"
              @click.prevent.native="handleCheckAll">
            <span class="checkBoxMessage">全选</span></Checkbox>
            <div v-if="this.transportMessageList.length === 0" style="flex-direction: column; -ms-flex-direction: column;" class="noneImg">
              <img src="./noneInfo.png"/>
              <p>暂无消息</p>
            </div>
            <div v-for="msg in this.transportMessageList" v-else :key="msg.id" class="megDiv">
              <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" class="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox :label="msg.id" class="checkboxItem"></Checkbox>
              </CheckboxGroup>
              <div class="msgImg">
                <i class="icon font_family icon-yunshuxiaoxi" style="color: #00A4BD;"></i>
              </div>
              <div class="msgContent" @click="clickContenInfo(msg)">
                <p class="msgContentTitle">{{msg.title}}</p>
                <pre class="msgContentText">{{msg.content}}</pre>
              </div>
              <div class="msgConfigDiv">
                <p style="color: #9DA1B0">{{ formatDate(msg.createTime) }}</p>
                <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1" style="color: #777B89"></i></span>
              </div>
            </div>
          </div>
            </Col>
        </div>
        <Modal v-model="visibaleRemove" transfer type="warning" width="360">
          <p slot="header" class="modalTitle">
            <span>提示</span>
          </p>
          <p>
            <i class="icon font_family icon-bangzhuzhongxin"></i>
          </p>
          <p class="modalMessage">确定要删除“{{messageInit.title}}”消息吗?</p>
          <div slot="footer">
            <Button type="primary" @click="removeSubForm">确定</Button>
            <Button  @click="removeCancelForm">取消</Button>
          </div>
        </Modal>
        <Modal v-model="visibaleRemoveSome" transfer type="warning" width="360">
          <p slot="header" class="modalTitle">
            <span>提示</span>
          </p>
          <p>
            <i class="icon font_family icon-bangzhuzhongxin"></i>
          </p>
          <p class="modalMessage">确定要批量删除选中的消息吗?</p>
          <div slot="footer">
            <Button type="primary" @click="removeSubFormSome">确定</Button>
            <Button  @click="removeCancelFormSome">取消</Button>
          </div>
        </Modal>
        <Modal v-model="visibaleRemoveAll" transfer type="warning" width="360">
          <p slot="header" class="modalTitle">
            <span>提示</span>
          </p>
          <p>
            <i class="icon font_family icon-bangzhuzhongxin"></i>
          </p>
          <p class="modalMessage">确定要删除所有的“{{rightTitle}}”?</p>
          <div slot="footer">
            <Button type="primary" @click="removeSubFormAll">确定</Button>
            <Button  @click="removeCancelFormAll">取消</Button>
          </div>
        </Modal>
      </div>
      <Page
        v-if="batchBtnShowAll"
        :total="totalCount"
        :current="searchData.pageNo"
        :page-size="searchData.pageSize"
        size="small"
        show-elevator
        show-total
        show-sizer
        style="float:right"
        @on-change="searchInfoData"
        @on-page-size-change="chagePageSize"/>
      </Col>
    </Row>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import TMSUrl from '@/libs/constant/url'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'info',
  components: {},
  mixins: [ BasePage ],
  metaInfo: {
    title: '消息'
  },
  data () {
    return {
      rightTitle: '',
      type: '0',
      typeName: '0',
      messageInit: {},
      messageType: '',
      messageCheckGroupInit: [],
      visibaleRemove: false,
      visibaleRemoveAll: false,
      visibaleRemoveSome: false,
      batchBtnShowAll: false,
      batchBtnShow: true,
      indeterminate: false,
      removeSubBtnDis: true,
      checkAll: false,
      checkAllGroup: [],
      checkBoxListInit: [],
      menuList: [{
        name: '系统消息',
        id: '0',
        infoNum: ''
      }],
      // }, {
      //   name: '订单消息',
      //   id: '1',
      //   infoNum: '',
      //   code: 110000
      // }, {
      //   name: '运输消息',
      //   id: '2',
      //   infoNum: '',
      //   code: 120000
      // }],
      searchData: {
        type: '0',
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      sysMessageList: [],
      orderMessageList: [],
      transportMessageList: []
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight'])
  },
  watch: {
    checkAllGroup (newVal) {
      if (newVal.length > 0) {
        this.removeSubBtnDis = false
      } else {
        this.removeSubBtnDis = true
      }
    }
  },
  created () {
    switch (this.$route.query.type) {
      case 0:
        this.rightTitle = this.typeName = '系统消息'
        this.searchData.type = '0'
        break
      // case 1:
      //   this.rightTitle = this.typeName = '订单消息'
      //   this.searchData.type = '1'
      //   break
      // case 2:
      //   this.rightTitle = this.typeName = '运输消息'
      //   this.searchData.type = '2'
      //   break
      default:
        this.rightTitle = this.typeName = '系统消息'
        this.searchData.type = '0'
    }
  },
  mounted: function () {
    this.getMessageCount()
    this.getMenuInfoNum()
    this.getMenuList(this.searchData)
    if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
      document.getElementById('message-list-container').style.maxHeight = (document.body.clientHeight - 80) + 'px'
    }
  },
  updated () {
    this.getMenuInfoNum()
    this.getMessageCount()
  },
  methods: {
    ...mapActions(['getMessageCount']),
    async init () {
      this.getMessageCount()
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    getMenuInfoNum () {
      // this.menuList[0].infoNum = this.$store.getters.MsgCount.sysNum
      // this.menuList[1].infoNum = this.$store.getters.MsgCount.orderNum
      // this.menuList[2].infoNum = this.$store.getters.MsgCount.carrierNum
    },
    getMenuList (params) {
      Server({
        url: 'message/listPage',
        method: 'get',
        data: params
      }).then(({ data }) => {
        if (params.type === '0') {
          this.sysMessageList = data.data.list
          this.searchData.type = '0'
          this.batchBtnShowAll = data.data.list.length > 0
        }
        // if (params.type === '1') {
        //   this.orderMessageList = data.data.list
        //   this.searchData.type = '1'
        //   this.batchBtnShowAll = data.data.list.length > 0
        // } else if (params.type === '2') {
        //   this.transportMessageList = data.data.list
        //   this.searchData.type = '2'
        //   this.batchBtnShowAll = data.data.list.length > 0
        // } else {
        //   this.sysMessageList = data.data.list
        //   this.searchData.type = '0'
        //   this.batchBtnShowAll = data.data.list.length > 0
        // }
        data.data.list.forEach(element => {
          this.checkBoxListInit.push(element.id)
        })
        this.searchData.pageNo = data.data.pageNo
        this.searchData.pageSize = data.data.pageSize
        this.totalCount = data.data.totalCount
      })
    },
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.searchData.type = id
      this.searchData.pageNo = 1
      this.getMenuList(this.searchData)
      this.checkBoxGroupInit()
      this.getMenuInfoNum()
      this.getMessageCount()
    },
    removeInfo (id, type) {
      let params = {}
      params.ids = id
      params.type = type
      Server({
        url: 'message/del',
        method: 'post',
        data: params
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success('删除成功!')
          this.visibaleRemove = false
          this.visibaleRemoveSome = false
          this.visibaleRemoveAll = false
          this.getMenuList(this.searchData)
          this.getMessageCount()
        }
      })
    },
    removeSubFormSome () {
      this.batchBtnShow = !this.batchBtnShow
      this.removeInfo(this.messageCheckGroupInit)
    },
    removeCancelFormSome () {
      this.visibaleRemoveSome = false
    },
    removeSubFormAll () {
      this.removeInfo(null, Number(this.messageType))
    },
    removeCancelFormAll () {
      this.visibaleRemoveAll = false
    },
    removeSubForm () {
      this.removeInfo([this.messageInit.id])
    },
    removeCancelForm () {
      this.visibaleRemove = false
    },
    msgRemoveBtn (msg) {
      this.messageInit = Object.assign({}, msg)
      this.visibaleRemove = true
    },
    clickContenInfo (msg) {
      let transformParams
      switch (msg.type) {
        // 0系统消息4订单消息5回单消息6运单消息7提货单消息8外转单消息
        case 0:
          this.openTab({
            path: TMSUrl.MESSAGE_DETAIL, // '/information/message-info',
            query: {
              id: msg.title,
              message: msg
            }
          })
          break
        case 4:
          this.openTab({
            path: TMSUrl.ORDER_MANAGEMENT, // '/order-management/order',
            title: '订单管理'
          })
          break
        case 5:
          this.openTab({
            path: TMSUrl.RECEIPT_ORDER_MANAGEMENT, // '/order-management/receipt',
            title: '回单管理'
          })
          break
        case 6:
          this.openTab({
            path: TMSUrl.TANSPORT_ORDER, // '/transport/waybill',
            title: '运单管理'
          })
          break
        case 7:
          this.openTab({
            path: TMSUrl.PICKUP_ORDER, // '/transport/pickupOrder',
            title: '提货单管理'
          })
          break
        case 8:
          this.openTab({
            path: TMSUrl.OUTER_ORDER, // '/transport/outerOrder',
            title: '外转单管理'
          })
          break
        case 17:
          if (!msg.comParam) {
            return
          }
          transformParams = JSON.parse(msg.comParam)
          // 试用期数据删除
          this.openDialog({
            name: 'dialogs/clear-trial-data.vue',
            data: {
              ...transformParams
            },
            methods: {
              ok () {},
              cancel () {}
            }
          })
          break
        case 18:
          if (!msg.comParam) {
            return
          }
          transformParams = JSON.parse(msg.comParam)
          // 邀请承运商合作
          this.openDialog({
            name: 'dialogs/invite-cooperation.vue',
            data: {
              phone: transformParams.inviterPhone,
              inviteId: transformParams.id,
              content: msg.content
            },
            methods: {
              ok () {},
              cancel () {}
            }
          })
          break
      }
    },
    removeInfoAll (type) {
      this.messageType = type
      this.visibaleRemoveAll = true
    },
    removeInfoSome () {
      this.batchBtnShow = !this.batchBtnShow
    },
    removeCancelBtn () {
      this.batchBtnShow = !this.batchBtnShow
    },
    removeSubBtn () {
      this.visibaleRemoveSome = true
      this.messageCheckGroupInit = Object.assign([], this.checkAllGroup)
    },
    checkBoxGroupInit () {
      // 复选框gourp Init
      this.batchBtnShow = true
      this.checkAllGroup = []
      this.checkAll = false
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.checkAllGroup = Object.assign([], this.checkBoxListInit)
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.checkBoxListInit.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    searchInfoData (page) {
      this.searchData.pageNo = page
      this.getMenuList(this.searchData)
      this.checkBoxGroupInit()
    },
    chagePageSize (pagenum) {
      this.searchData.pageSize = pagenum
      this.getMenuList(this.searchData)
    },
    fiterContent (value) {
      return value.replace(/<(\S*?)[^>]*>/g, '').trim() ? value.replace(/<(\S*?)[^>]*>/g, '') : '点击查看详情'
    }
  }
}

</script>
<style lang='stylus' scoped>
.message-list-container
  overflow auto
>>> .ivu-menu-vertical.ivu-menu-light:after
  background: #fff;
>>> .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu)
    background: #fff;
    color: #333333;
    font-weight: bold;
.temAll
  width: 100%;
  background: #fff
  margin: -20px -15px;
.megDiv
  clear: both;
  height: 70px;
  margin: 20px 15px;
  border-bottom: 1px dashed #e9e9e9;
  padding-bottom:10px;
  margin-top: 25px;
.msgImg
  float: left;
  margin-right: 20px;
  margin-top: -3px;
.msgContentTitle
  font-weight: bold
  color: "#2F323E"
  margin-bottom: 5px;
  font-size:14px;
.msgContentDiv
  width: 80%;
  height: 20px;
  overflow: hidden;
.msgConfigDiv
  float: right;
  margin-top: -45px;
.msgContentText
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 630px;
  color: #777B89
  font-size:12px;
  font-family: PingFangSC-Regular;
.msgContent
  cursor: pointer;
.msgConfigBtn
  cursor: pointer;
  float: right;
.noneImg
  display flex
  display -ms-flexbox
  flex-direction column
  justify-content center
  -ms-flex-pack center
  align-items center
  -ms-flex-align center
  margin-top: 112px;
  text-align: center;
  color: #999999;
  font-size: 16px;
  font-weight: 400;
.menuSty
  background:rgba(243,245,249,1);
  color: #333;
.menuInfoBadge
  float:right;
  width:30px;
.contentDiv
  background:#fff;
  padding: 0 25px 50px 25px;
.contendBorderBttom
  border-bottom: 1px solid #e9e9e9;
  padding-bottom:10px;
  margin-top: 14px;
.iconRightTitle
  width: 5px;
  height: 20px;
  background: #00a4bd;
  position: absolute;
  left:25px;
  margin-top: 2px;
  border-radius:3px;
.rightTitleSty
  margin-left:15px;
  font-size: 16px;
  font-weight:600;
.rightConfBtnRemove
  float:right;
  margin-top:-30px;
  margin-right:20px;
.checkBoxBtn
  margin-left: 15px;
  margin-top:10px;
.checkBoxMessage
  margin-left:10px;
  color:#777B89;
  cursor: default;
.checkAllGroup
  float: left;
  margin-top: 10px;
.icon-xitongxiaoxi
.icon-dingdanxiaoxi
.icon-yunshuxiaoxi
  font-size:36px;
  background: white;
.icon-bangzhuzhongxin
  font-size:28px;
  background: white;
  color: #FFBB44;
  float:left;
  width:40px;
  margin-top: 3px;
.modalMessage
  margin-top:15px;
  margin-bottom:20px;
  font-size:14px;
.configBtn
  width: 86px;
.configBtnCancel
  width: 86px;
  margin-right:20px;
.modalTitle
  text-align:center;
  font-size: 16px;
  font-weight:bold;
.message-p
  line-height 30px
</style>
