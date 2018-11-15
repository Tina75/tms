<template>
  <div>
    <div class="add_btn">
      <Button v-if="(active === '1'&&hasPower(130113)) || (active === '2'&&hasPower(130215))" type="primary" @click="addRule">新增规则</Button>
    </div>
    <div  :style="{height: height > 600 ? height+'px' : 600+'px'}" class="rule">
      <div v-if="companyData.length===0" class="data-total-empty">
        <!--<img src="../../../assets/img-empty.png" class="data-empty-img">-->
        <div class="data-empty-img">
          <FontIcon slot="icon" type="ico-price" ></FontIcon>
        </div>
        <p>暂无计费规则，快新增一个吧~</p>
      </div>
      <ul v-if="companyData.length>0"  class="ruleList">
        <li v-for="(item,index) in companyData" :class="{companyDataActive:companyDataActive === item.ruleId}" :key="index" class="list" @click="showRuleDetail(item)">
          <div class="icon">
            <FontIcon slot="icon" type="ico-price" ></FontIcon>
          </div>
          <div class="content">
            <div v-if="item.ruleName.length<8" class="ruleName">{{item.ruleName}}</div>
            <Tooltip v-else :content="item.ruleName" max-width="200" class="ruleName" placement="top-start" style="display: list-item">
              <div >{{item.ruleName.slice(0,8)}}...</div>
            </Tooltip>
            <div v-if="item.partnerName.length<8"  class="tips">{{item.partnerName}}</div>
            <Tooltip v-else :content="item.partnerName" max-width="200" class="tips" placement="bottom-start" style="display: list-item">
              <div >{{item.partnerName.slice(0,8)}}...</div>
            </Tooltip>
          </div>
          <div class="operate">
            <span v-if="(active === '1'&&hasPower(130114)) || (active === '2'&&hasPower(130216))" style="margin-right: 12px;" @click.stop="editRule(item)">修改</span>
            <span v-if="(active === '1'&&hasPower(130115)) || (active === '2'&&hasPower(130217))" @click="removeRule(item.ruleId)">删除</span>
          </div>
        </li>
      </ul>
      <div v-if="companyData.length>0"  class="ruleDetail">
        <div v-if="!ruleDetail.ruleId" class="data-empty">
          <img src="../../../assets/img-empty.png" class="data-empty-img">
          <p>请点击左侧{{sceneMap[active]}}设置计费规则明细～</p>
        </div>
        <div v-else class="rule-block">
          <div class="rule-basic">
            <Form ref="ruleBasic" :model="ruleDetail" :rules="basicValidate" inline>
              <span>按</span>
              <FormItem prop="ruleType" style="width: 100px">
                <Select v-model="ruleDetail.ruleType">
                  <Option v-for="(value, key) in ruleTypeMap" v-if="((active === '1' || active ==='3') && (key ==='3' || key === '4')) || key ==='1' || key ==='2'" :key="key" :value="key">{{value}}</Option>
                </Select>
              </FormItem>
              <span>计算</span>
            </Form>
          </div>
          <div class="rules-list">
            <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
              <Collapse v-model="item.showRule" class="rule-content">
                <div class="rule-route">
                  <Form ref="ruleRoute" :model="item" :rules="routeValidate" inline>
                    <Row :gutter="24">
                      <Col span="5"  class="styleCommon">
                      <FormItem prop="departure" style="text-align: left">
                        <SelectInputForCity :code-type = "1" v-model="item.departure" placeholder="请输入始发地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="1" class="styleCommon">
                      <i class="icon font_family icon-ico-line"></i>
                      </Col>
                      <Col span="5" class="styleCommon">
                      <FormItem prop="destination" style="text-align: left">
                        <SelectInputForCity :code-type = "1" v-model="item.destination" placeholder="请输入目的地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="11" class="styleCommon">
                      <div class="startPrice">
                        <FormItem prop="startType" style="width: 80px">
                          <Select v-model="item.startType" @on-change="startTypeChange(item)">
                            <Option v-for="(value, key) in startTypeMap"  :key="key" :value="key">{{value}}</Option>
                          </Select>
                        </FormItem>
                        <span style="margin:0 10px">：货物  ＜</span>
                        <FormItem prop="startNum" inline style="margin-bottom: 0;">
                          <Input v-model="item.startNum" style="width: 80px" @on-change="setItemStartNum(item)"/>
                        </FormItem>
                        <span>{{unitMap[ruleDetail.ruleType]}}，</span>
                        <!--起步价 startType 1-->
                        <div v-if="item.startType === '1'" style="display: inline-block">
                          <FormItem prop="startPrice" inline style="margin-bottom: 0;">
                            <Input v-model="item.startPrice" style="width: 80px"/>
                          </FormItem>
                          <span>元起</span>
                        </div>
                        <!--起送量 startType 2-->
                        <div v-if="item.startType === '2'" style="display: inline-block">
                          按<span style="padding: 0 10px">{{item.startNum}}</span>
                          {{unitMap[ruleDetail.ruleType]}}计算
                        </div>
                      </div>
                      </Col>
                      <Col span="2">
                      <span class="delete_btn" @click="removeItem(index)">删除</span>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <Panel :name="(index + 1) + ''">
                  <div slot></div>
                  <div slot="content">
                    <ul class="rule-detail">
                      <li v-for="(el, no) in item.chargeRules" :key="no" class="rule-detail-item">
                        <div>
                          <span>{{valueTypeMap[ruleDetail.ruleType]}}</span>
                          <span style="margin-left: 5px">≥</span>
                          <Form ref="ruleBase" :model="el" :rules="baseValidate" style="display: inline-block" inline>
                            <FormItem prop="baseAndStart" inline style="margin-bottom: 0">
                              <Input v-model="el.base" @on-change="setElStartNum(item, el)"/>
                            </FormItem>
                            <span>{{unitMap[ruleDetail.ruleType]}}</span>
                          </Form>
                        </div>
                        <div>
                          <span>单价</span>
                          <span style="margin-left: 5px">=</span>
                          <Form ref="rulePrice" :model="el" :rules="priceValidate" style="display: inline-block" inline>
                            <FormItem prop="price" inline style="margin-bottom: 0">
                              <Input v-model="el.price" />
                            </FormItem>
                            <span>元/{{valueMap[ruleDetail.ruleType]}}</span>
                          </Form>
                        </div>
                        <div class="add_decrease">
                          <span v-if="item.chargeRules.length > 1" style="margin-right: 12px"  @click="removeEl(index, no)">删除</span>
                          <span v-if="item.chargeRules.length - 1 === no" @click="addEl(index)">新增</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Panel>
              </Collapse>
            </div>
            <div class="item-add-btn">
              <p @click="addItem">
                <Icon class="add" type="md-add-circle"/>
                新增计费明细
              </p>
            </div>
          </div>
          <div class="rules-operation">
            <Button v-if="(active === '1'&&hasPower(130114)) || (active === '2'&&hasPower(130216))" type="primary" @click="saveRules()">保存</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import SelectInputForCity from '@/components/SelectInputForCity'
import FontIcon from '@/components/FontIcon'
import mixin from './mixin'
export default {
  name: 'rule-index',
  components: { SelectInputForCity, FontIcon },
  mixins: [ BasePage, mixin ],
  props: {
    /* 合作方类型
       *1 发货方
       *2 承运商
       *3 外转方
     */
    active: {
      type: [String]
    },
    partnerName: {
      type: [String],
      default: ''
    },
    partnerId: {
      type: [Number],
      default: 0
    },
    height: {
      type: [Number],
      default: 0
    }
  },
  data () {
    return {
    }
  },
  watch: {
    partnerName (val) {
      if (val) {
        this.getRules()
      }
    }
  },
  // mounted () {
  //   this.getRules()
  //   console.log('名称')
  //   console.log(this.partnerName)
  // },
  methods: {
    addRule () {
      const _this = this
      this.openDialog({
        name: 'client/ruleForClient/dialogs/createRule',
        data: {
          scene: this.active,
          operateNum: 1,
          createRuleForm: {
            partnerName: this.partnerName,
            partnerId: this.partnerId
          }
        },
        methods: {
          ok (ruleId) {
            _this.getRules().then((companyData) => {
              _this.showRuleDetail(companyData.find(item => {
                return item.ruleId === ruleId
              }))
              _this.addItem()
            })
          }
        }
      })
    },
    editRule (item) {
      const _this = this
      this.openDialog({
        name: 'client/ruleForClient/dialogs/createRule',
        data: {
          operateNum: 2,
          scene: this.active,
          ruleId: item.ruleId,
          ruleType: item.detail.ruleType,
          createRuleForm: {
            ruleName: item.ruleName,
            partnerName: this.partnerName
          }
        },
        methods: {
          ok () {
            _this.getRules()
          }
        }
      })
    },
    getRules () {
      return Server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerType: this.active,
          paramName: this.partnerName
        }
      }).then(res => {
        this.companyData = res.data.data
        this.$emit('update:count', this.companyData.length ? this.companyData.length : 0)
        if (this.ruleDetail && this.ruleDetail.ruleId && this.companyData.some(item => item.ruleId === this.ruleDetail.ruleId)) {
          this.showRuleDetail(this.companyData.find(item => item.ruleId === this.ruleDetail.ruleId))
        } else {
          this.ruleDetail = {}
        }
        return res.data.data
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style scoped lang="stylus">
.add_btn
  padding-bottom 11px
  border-bottom 1px solid #E4E7EC
.rule
  display flex
  margin-bottom -20px
  .data-total-empty
    text-align center
    margin-top 150px
    width 100%
    .data-empty-img
      i
        font-size 100px
        color #E9EAEC
    p
     color #999
  .ruleList
    height 100%
    border-right 1px solid #e4e7ec
    flex 0 0 270px
    margin-left -15px
    margin-bottom -20px
    overflow hidden
    &:hover
      overflow auto
    .list
      list-style none
      height 60px
      line-height 60px
      display flex
      border-bottom 1px solid #E4E7EC
      &.companyDataActive
        background #E9FCFF
      &:hover
        background #E9FCFF
        .operate
          display block
      .icon
        flex 0 0 60px
        text-align center
        position relative
        &:after
          position absolute
          bottom -1px
          content ''
          display block
          height 1px
          width 15px
          border-top  1px solid #fff
        i
          display inline-block
          width 30px
          height 30px
          background #f9f9f9
          border-radius 50%
          line-height 30px
          &:after
            border none
      .content
        flex 1
        font-size 12px
        .ruleName
          height 30px
          line-height 1
          padding-top 11px
          color #333
          font-weight bold
        .tips
          height 30px
          line-height 1
          padding-top 6px
          color #999
      .operate
        display none
        flex 0 0 80px
        cursor pointer
        color #00A4BD
  .ruleDetail
    flex 1
    height 100%
    position relative
    .data-empty
      display flex
      flex-direction column
      justify-content center
      align-items center
      margin-top 150px
      /*border 1px solid #dcdee2*/
      .data-empty-img
        width 70px
        margin-bottom 12px
      p
        color #999999
        text-align center
    .rule-block
      padding-left 10px
      .rule-basic
        padding: 14px
        border-bottom: 1px solid #E4E7EC
        .ivu-form-item
          margin-bottom: 0
        span
          display: inline-block
          color: #333333
          font-size: 12px
          line-height: 35px
          margin-right: 10px
      .rules-list
        height 465px
        overflow: auto
        padding: 20px 0
        border-bottom: 1px solid #E4E7EC
        margin-right -15px
        margin-left -11px
        padding-left 11px
        padding-right 15px
        .rule-item
          display: flex
          margin-bottom: 30px
          .rule-content
            position: relative
            .rule-route
              display: block
              position: absolute
              width: calc(100% - 55px)
              top: 17px
              left: 20px
              z-index: 8
              .startPrice
                line-height 32px
              .delete_btn
                float: right
                text-align right
                line-height 33px
                font-size 14px
                color #00A4BD
                cursor pointer
              .icon
                color: #9DA1B0
                font-size: 24px
                line-height: 28px
              .styleCommon
                padding 0!important
                text-align center
            .rule-detail
              list-style none
              .rule-detail-item
                display flex
                padding 18px 16px
                height auto
                border-bottom 1px solid #DCDEE2
                &>div
                  flex 1
                  /deep/ .ivu-form-inline .ivu-form-item
                    vertical-align middle
                    width 128px
                    margin-left 10px
                &:last-child
                  border-bottom none
                .add_decrease
                  line-height 32px
                  color #00A4BD
                  font-size 14px
                  cursor pointer
          .item-remove
            width: 25px
            align-items center
            align-self: center
            .ivu-icon
              color: #EC4E4E
              font-size: 18px
          .ivu-collapse
            flex: 1
            .ivu-collapse-item
              border-top: none
              /deep/ .ivu-collapse-content
                padding 0
            /deep/ .ivu-collapse-content>.ivu-collapse-content-box
              padding 0
            /deep/ .ivu-collapse-header
              height: 70px
              background-color: rgba(248,248,248,1)
              padding: 15px 20px 15px
              padding-right 0
              text-align: right
              border-bottom 1px solid #DCDEE2
              .ivu-icon
                vertical-align: top
                margin-top: 12px
            .ivu-table-cell
              padding: 5px
              span
                padding: 10px
                display: inline-block
                vertical-align: middle
              .ivu-form-item
                margin-bottom: 0
              /deep/ .ivu-form-item-error-tip
                position: relative
            .adjuster
              i
                display: inline-block
                font-size: 18px
                cursor: pointer
                &.add
                  color: #7ED321
                  margin-right: 10px
                &.remove
                  color: #EC4E4E
        .item-add-btn
          cursor: pointer
          text-align: center
          height: 35px
          border: 1px dashed #E4E7EC
          line-height: 35px
          color: #00A4BD
          i
            font-size: 14px
      .rules-operation
        position absolute
        left 50%
        margin-left -43px
        bottom 20px
        text-align: center
        .ivu-btn
          padding-left: 30px
          padding-right: 30px
</style>
