<template>
  <div class="temAll">
    <Col span="3">
    <Menu :active-name="typeName" class="leftMenu" style="width: 150px;  background: rgba(248,248,248,1);">
      <MenuItem v-for="menu in menuList" :key="menu.id" :name="menu.name" @click.native="clickLeftMenu(menu.id, menu.name)">
      <p class="menuTitle">{{menu.name}}</p>
      <Badge v-if="menu.infoNum" :text="menu.infoNum.toString()" style="float:right;margin-top:-20px;"></Badge>
      </MenuItem>
    </Menu>
    </Col>
    <Col span="18">
    <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:10px;margin-top: 14px;">
      <span class="iconRightTitle" style="width: 5px;height: 20px;background: #00a4bd; position: absolute;"></span>
      <span style="margin-left:25px; font-size: 16px;">{{rightTitle}}</span>
      <span style="float:right; margin-top:-10px;">
        <Button style="margin-right:20px;" @click="removeInfoAll">全部删除</Button>
        <Button  @click="removeInfoSome">批量删除</Button>
      </span>
    </div>
    <div style="min-height:520px;">
      <!--系统消息-->
      <div v-if="'0' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <div v-for="msg in this.sysMessageList" :key="msg.id" class="megDiv">
            <div class="msgImg">
              <i class="icon font_family icon-xitongxiaoxi" style="font-size:28px; background: white; color: #FFBB44;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
            </div>
          </div>
        </div>
          </Col>
      </div>
      <!--订单消息-->
      <div v-if="'1' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <div v-for="msg in this.orderMessageList" :key="msg.id" class="megDiv">
            <div class="msgImg">
              <i class="icon font_family icon-dingdanxiaoxi" style="font-size:28px; background: white; color: #418DF9;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
            </div>
          </div>
        </div>
        </Col>
      </div>
      <!--运输消息-->
      <div v-if="'2' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <div v-for="msg in this.transportMessageList" :key="msg.id" class="megDiv">
            <div class="msgImg">
              <i class="icon font_family icon-yunshuxiaoxi" style="font-size:28px; background: white; color: #00A4BD;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg)"><i class="icon font_family icon-shanchu1"></i></span>
            </div>
          </div>
        </div>
        </Col>
      </div>
    </div>
    <Page
      :total="pageTotal"
      :current="searchData.page"
      :page-size="searchData.pageSize"
      size="small"
      show-elevator
      show-total
      show-sizer
      style="float:right"
      @on-change="searchInfoData"
      @on-page-size-change="chagePageSize"/>
    </Col>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
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
      typeName: '',
      menuList: [{
        name: '系统消息',
        id: '0',
        infoNum: ''
      }, {
        name: '订单消息',
        id: '1',
        infoNum: ''
      }, {
        name: '运输消息',
        id: '2',
        infoNum: ''
      }],
      searchData: {
        type: '0',
        page: 1,
        pageSize: 10
      },
      pageTotal: 0,
      sysMessageList: [],
      orderMessageList: [],
      transportMessageList: []
    }
  },
  created () {
    switch (this.$route.query.type) {
      case 0:
        this.rightTitle = this.typeName = '系统消息'
        break
      case 1:
        this.rightTitle = this.typeName = '订单消息'
        break
      case 2:
        this.rightTitle = this.typeName = '运输消息'
        break
      default:
        this.rightTitle = this.typeName = '系统消息'
    }
  },
  mounted: function () {
    this.getMenuList(this.searchData)
    this.getMenuInfoNum()
  },
  methods: {
    getMenuInfoNum () {
      Server({
        url: 'message/num',
        method: 'get'
      }).then(({ data }) => {
        this.menuList[0].infoNum = data.data.sysNum > 99 ? '99+' : data.data.sysNum
        this.menuList[1].infoNum = data.data.orderNum > 99 ? '99+' : data.data.orderNum
        this.menuList[2].infoNum = data.data.carrierNum > 99 ? '99+' : data.data.carrierNum
      })
    },
    getMenuList (params) {
      Server({
        url: 'message/listPage',
        method: 'get',
        data: params
      }).then(({ data }) => {
        if (params.type === '1') {
          this.orderMessageList = data.data.list
          this.searchData.type = '1'
        } else if (params.type === '2') {
          this.transportMessageList = data.data.list
          this.searchData.type = '2'
        } else {
          this.sysMessageList = data.data.list
          this.searchData.type = '0'
        }
        this.searchData.page = 1
        this.searchData.pageSize = data.data.pageSize
        this.pageTotal = data.data.pageTotals
      })
    },
    clickLeftMenu (id, menuName) {
      this.rightTitle = menuName
      this.searchData.type = id
      this.searchData.page = 1
      this.getMenuList(this.searchData)
      this.getMenuInfoNum()
    },
    msgRemoveBtn (message) {
      Server({
        url: 'message/del',
        method: 'post',
        data: {id: message.id, type: message.type}
      }).then(({ data }) => {
        if (data.code === 10000) {
          this.$Message.success('删除成功!')
        } else {
          this.$Message.success(data.msg)
        }
      })
    },
    clickContenInfo (msg) {
      this.openTab({
        path: '/info/message-info',
        query: {
          id: msg.id,
          message: msg
        }
      })
    },
    removeInfoAll () {
      console.log('删除全部')
    },
    removeInfoSome () {
      console.log('删除部分')
    },
    searchInfoData (page) {
      this.searchData.page = page
      this.getMenuList(this.searchData)
    },
    chagePageSize (pagenum) {
      this.searchData.pageSize = pagenum
      this.getMenuList(this.searchData)
    }
  }
}

</script>
<style lang='stylus' scoped>
.temAll
  margin: 20px;
  .megDiv
    clear: both;
    height: 55px;
    margin: 20px 15px;
    border-bottom: 1px solid #e9e9e9;
    padding-bottom:10px;
    margin-top: 25px;
  .msgImg
    float: left;
    margin-right: 20px;
  .msgContentTitle
    font-weight: bold;
    margin-bottom: 5px;
  .msgConfigDiv
    float: right;
    margin-top: -55px;
  .msgContentText
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 630px;
  .msgContent
    cursor: pointer;
  .msgConfigBtn
    cursor: pointer;
    float: right;
</style>
