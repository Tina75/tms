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
      <div v-if="batchBtnShowAll">
        <span v-if="batchBtnShow" key="1" style="float:right; margin-top:-35px;">
          <Button style="margin-right:20px;" @click="removeInfoAll(searchData.type)">全部删除</Button>
          <Button @click="removeInfoSome">批量删除</Button>
        </span>
        <span v-if="!batchBtnShow" key="2" style="float:right; margin-top:-10px;">
          <Button style="margin-right:20px;" @click="removeCancelBtn">取消</Button>
          <Button :disabled="removeSubBtnDis" type="primary" @click="removeSubBtn">确定</Button>
        </span>
      </div>
    </div>
    <div style="min-height:520px;">
      <!--系统消息-->
      <div v-if="'0' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <Checkbox
            v-if="!batchBtnShow"
            :indeterminate="indeterminate"
            :value="checkAll"
            style="margin-left: 15px;"
            @click.native="handleCheckAll">
            全选</Checkbox>
          <div v-if="this.sysMessageList.length === 0" class="noneImg">
            <img src="./noneInfo.png"/>
            <p>暂无消息</p>
          </div>
          <div v-for="msg in this.sysMessageList" v-else :key="msg.id" class="megDiv">
            <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" style="float: left; margin-top: 10px;" @on-change="checkAllGroupChange">
              <Checkbox :label="msg.id" class="checkboxItem"></Checkbox>
            </CheckboxGroup>
            <div class="msgImg">
              <i class="icon font_family icon-xitongxiaoxi" style="font-size:28px; background: white; color: #FFBB44;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg.id)">
                <i class="icon font_family icon-shanchu1"></i>
              </span>
            </div>
          </div>
        </div>
          </Col>
      </div>
      <!--订单消息-->
      <div v-if="'1' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <Checkbox
            v-if="!batchBtnShow"
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.native="handleCheckAll">
            全选</Checkbox>
          <div v-if="this.orderMessageList.length === 0" class="noneImg">
            <img src="./noneInfo.png"/>
            <p>暂无消息</p>
          </div>
          <div v-for="msg in this.orderMessageList" v-else :key="msg.id" class="megDiv">
            <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" style="float: left; margin-top: 10px;" @on-change="checkAllGroupChange">
              <Checkbox :label="msg.id" class="checkboxItem"></Checkbox>
            </CheckboxGroup>
            <div class="msgImg">
              <i class="icon font_family icon-dingdanxiaoxi" style="font-size:28px; background: white; color: #418DF9;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg.id)"><i class="icon font_family icon-shanchu1"></i></span>
            </div>
          </div>
        </div>
        </Col>
      </div>
      <!--运输消息-->
      <div v-if="'2' === this.searchData.type" style="height:250px;">
        <Col span="24">
        <div class="mesDivAll">
          <Checkbox
            v-if="!batchBtnShow"
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.native="handleCheckAll">
            全选</Checkbox>
          <div v-if="this.transportMessageList.length === 0" class="noneImg">
            <img src="./noneInfo.png"/>
            <p>暂无消息</p>
          </div>
          <div v-for="msg in this.transportMessageList" v-else :key="msg.id" class="megDiv">
            <CheckboxGroup v-if="!batchBtnShow" v-model="checkAllGroup" style="float: left; margin-top: 10px;" @on-change="checkAllGroupChange">
              <Checkbox :label="msg.id" class="checkboxItem"></Checkbox>
            </CheckboxGroup>
            <div class="msgImg">
              <i class="icon font_family icon-yunshuxiaoxi" style="font-size:28px; background: white; color: #00A4BD;"></i>
            </div>
            <div class="msgContent" @click="clickContenInfo(msg)">
              <p class="msgContentTitle">{{msg.title}}</p>
              <pre class="msgContentText">{{msg.content}}</pre>
            </div>
            <div class="msgConfigDiv">
              <p>{{msg.createTime}}</p>
              <span class="msgConfigBtn" @click="msgRemoveBtn(msg.id)"><i class="icon font_family icon-shanchu1"></i></span>
            </div>
          </div>
        </div>
        </Col>
      </div>
    </div>
    <Page
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
      batchBtnShowAll: true,
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
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      sysMessageList: [],
      orderMessageList: [],
      transportMessageList: []
    }
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
  updated () {
    if (!this.batchBtnShow) {
      for (let index = 0; index < document.getElementsByClassName('checkboxItem').length; index++) {
        document.getElementsByClassName('checkboxItem')[index].children[1].innerText = ''
      }
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
          this.batchBtnShowAll = data.data.list.length > 0
        } else if (params.type === '2') {
          this.transportMessageList = data.data.list
          this.searchData.type = '2'
          this.batchBtnShowAll = data.data.list.length > 0
        } else {
          this.sysMessageList = data.data.list
          this.searchData.type = '0'
          this.batchBtnShowAll = data.data.list.length > 0
        }
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
      this.getMenuInfoNum()
      this.checkBoxGroupInit()
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
          this.getMenuList(this.searchData)
          this.getMenuInfoNum()
        } else {
          this.$Message.success(data.msg)
        }
      })
    },
    msgRemoveBtn (id) {
      this.removeInfo([id])
    },
    clickContenInfo (msg) {
      switch (msg.type) {
        // 0系统消息4订单消息5回单消息6运单消息7提货单消息8外转单消息
        case 0:
          this.openTab({
            path: '/info/message-info',
            query: {
              id: msg.title,
              message: msg
            }
          })
          break
        case 4:
          this.openTab({
            path: '/order-management/order',
            query: { type: '' }
          })
          break
        case 5:
          this.openTab({
            path: '/order-management/receipt',
            query: { type: '' }
          })
          break
        case 6:
          this.openTab({
            path: '/transport/waybill',
            query: { type: '' }
          })
          break
        case 7:
          this.openTab({
            path: '/transport/receiveOrder',
            query: { type: '' }
          })
          break
        case 8:
          this.openTab({
            path: '/transport/outerOrder',
            query: { type: '' }
          })
          break
      }
    },
    removeInfoAll (type) {
      this.removeInfo(null, type)
    },
    removeInfoSome () {
      this.batchBtnShow = !this.batchBtnShow
    },
    removeCancelBtn () {
      this.batchBtnShow = !this.batchBtnShow
    },
    removeSubBtn () {
      this.removeInfo(this.checkAllGroup)
      this.batchBtnShow = !this.batchBtnShow
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
      this.getMenuInfoNum()
      this.checkBoxGroupInit()
    },
    chagePageSize (pagenum) {
      this.searchData.pageSize = pagenum
      this.getMenuList(this.searchData)
      this.getMenuInfoNum()
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
  .noneImg
    position: absolute;
    left: 50%;
    margin-left: -110px;
    margin-top: 100px;
    text-align: center;
    color: #999999;
    font-size: 16px;
    font-weight: 400;
</style>
