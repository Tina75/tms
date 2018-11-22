<template>
  <div class="finance-rules">
    <div class="tab-box">
      <Tabs v-model="active" @on-click="switchTab">
        <TabPane v-for="(name, key) in sceneMap" v-if="key !== '4'" :key="key" :label="name" :name="key" />
      </Tabs>
    </div>
    <div class="data-container">
      <div class="list-box">
        <Row type="flex">
          <Col span="5" class="left_father">
          <div :style="{height: height + 'px'}" style="{'-ms-flex-direction: column;flex-direction: column;'}" class="left">
            <div class="left_search">
              <Row type="flex" >
                <Col span="17">
                <div style="margin-right: 20px;">
                  <Form ref="rulesQuery" :model="rulesQuery" :rules="validate">
                    <FormItem prop="queryText">
                      <Input v-model="rulesQuery.paramName" :placeholder="`请输入${sceneMap[active]}、规则名称`" :maxlength="20" @on-keyup="getRules"  >
                      <Icon slot="prefix" type="ios-search" class="suffix-btn" @click="getRules"/>
                        </Input>
                    </FormItem>
                  </Form>
                </div>
                </Col>
                <Col span="7">
                <Button v-if="hasPower(170401)" type="primary" @click="addRule">新增</Button>
                </Col>
              </Row>
            </div>
            <ul :style="{height: height -77  + 'px'}" class="ruleList" >
              <li v-for="(item,index) in companyData" :class="{companyDataActive:companyDataActive === item.ruleId}" :key="index" class="list" @click="showRuleDetail(item)">
                <div class="icon">
                  <FontIcon slot="icon" type="ico-price" ></FontIcon>
                </div>
                <div class="content">
                  <div v-if="item.ruleName.length<8" class="ruleName">{{item.ruleName}}</div>
                  <Tooltip v-else :content="item.ruleName" max-width="200" class="ruleName" transfer placement="top-start" style="display: list-item">
                    <div >{{item.ruleName.slice(0,8)}}...</div>
                  </Tooltip>
                  <div v-if="item.partnerName.length<8"  class="tips">{{item.partnerName}}</div>
                  <Tooltip v-else :content="item.partnerName" max-width="200" class="tips" transfer placement="bottom-start" style="display: list-item">
                    <div >{{item.partnerName.slice(0,8)}}...</div>
                  </Tooltip>
                </div>
                <div class="operate">
                  <span style="margin-right: 12px;" @click.stop="editRule(item)">修改</span>
                  <span @click="removeRule(item.ruleId)">删除</span>
                </div>
              </li>
            </ul>
          </div>
          </Col>
          <Col :style="{height: height + 'px'}" span="19" style="flex: 1; -ms-flex: 1" >
          <data-empty v-if="!ruleDetail.ruleId">请点击左侧{{sceneMap[active]}}设置计费规则明细～</data-empty>
          <div v-else class="rule-block">
            <div class="rule-basic">
              <Form ref="ruleBasic" :model="ruleDetail" :rules="basicValidate" inline>
                <span>按</span>
                <FormItem prop="ruleType" style="width: 100px">
                  <Select v-model="ruleDetail.ruleType" transfer @on-change="ruleTypeChange">
                    <Option v-for="(value, key) in ruleTypeMap" v-if="((active === '1' || active ==='3') && (key ==='3' || key === '4')) || key ==='1' || key ==='2'" :key="key" :value="key">{{value}}</Option>
                  </Select>
                </FormItem>
                <span>计算</span>
              </Form>
            </div>
            <div :style="{height:(height - 115 - 20)+'px'}" class="rules-list">
              <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
                <Collapse v-model="item.showRule" class="rule-content">
                  <div class="rule-route">
                    <Form ref="ruleRoute" :model="item" :rules="routeValidate" inline>
                      <Row :gutter="24">
                        <Col span="4"  class="styleCommon">
                        <FormItem prop="departure" style="text-align: left">
                          <SelectInputForCity :code-type = "1" v-model="item.departure" placeholder="请输入始发地" class="search-input-senior"></SelectInputForCity>
                        </FormItem>
                        </Col>
                        <Col span="1" class="styleCommon">
                        <i class="icon font_family icon-ico-line"></i>
                        </Col>
                        <Col span="4" class="styleCommon">
                        <FormItem prop="destination" style="text-align: left">
                          <SelectInputForCity :code-type = "1" v-model="item.destination" placeholder="请输入目的地" class="search-input-senior"></SelectInputForCity>
                        </FormItem>
                        </Col>
                        <Col span="13" class="styleCommon">
                        <div class="startPrice">
                          <FormItem prop="startType" style="width: 70px">
                            <Select v-model="item.startType" @on-change="startTypeChange(item)">
                              <Option v-for="(value, key) in startTypeMap" :key="key"  :value="key" >{{value}}</Option>
                            </Select>
                          </FormItem>
                          <span style="margin:0 10px 0 0">：货物  ＜</span>
                          <FormItem prop="startNum" inline style="margin-bottom: 0;">
                            <!--<Input v-model="item.startNum" style="width: 80px" @on-change="setItemStartNum(item)"/>-->
                            <TagNumberInput v-model="item.startNum" :show-chinese="false" :precision="precision" style="width: 80px" @on-change="setItemStartNum(item)"></TagNumberInput>
                          </FormItem>
                          <span>{{unitMap[ruleDetail.ruleType]}}，</span>
                          <!--起步价 startType 1-->
                          <div v-if="item.startType === '1'" style="display: inline-block">
                            <FormItem prop="startPrice" inline style="margin-bottom: 0;">
                              <!--<Input v-model="item.startPrice" style="width: 80px"/>-->
                              <TagNumberInput v-model="item.startPrice" :show-chinese="false"  style="width: 80px"></TagNumberInput>
                            </FormItem>
                            <span>元起</span>
                          </div>
                          <!--起送量 startType 2-->
                          <div v-if="item.startType === '2'" style="display: inline-block">按<span style="padding: 0 10px">{{item.startNum}}</span>{{unitMap[ruleDetail.ruleType]}}计算</div>
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
                                <!--<Input v-model="el.base" @on-change="setElStartNum(item, el)"/>-->
                                <TagNumberInput v-model="el.base" :precision="precision" :show-chinese="false" @on-change="setElStartNum(item, el)"></TagNumberInput>
                              </FormItem>
                              <span>{{unitMap[ruleDetail.ruleType]}}</span>
                            </Form>
                          </div>
                          <div>
                            <span>单价</span>
                            <span style="margin-left: 5px">=</span>
                            <Form ref="rulePrice" :model="el" :rules="priceValidate" style="display: inline-block" inline>
                              <FormItem prop="price" inline style="margin-bottom: 0">
                                <!--<Input v-model="el.price" />-->
                                <TagNumberInput v-model="el.price" :show-chinese="false"></TagNumberInput>
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
              <Button v-if="hasPower(170403)" type="primary" @click="saveRules()">保存</Button>
            </div>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import SelectInputForCity from '@/components/SelectInputForCity'
import TagNumberInput from '@/components/TagNumberInput'
import FontIcon from '@/components/FontIcon'
import DataEmpty from '@/components/DataEmpty'
import mixin from '../../views/client/ruleForClient/mixin'
export default {
  name: 'financeRules',
  metaInfo: {
    title: '计费规则'
  },
  components: { SelectInputForCity, FontIcon, TagNumberInput, DataEmpty },
  mixins: [ BasePage, mixin ],
  data () {
    return {
      height: 0,
      active: '1'
    }
  },
  computed: {
  },
  mounted () {
    this.getRules()
    this.height = document.body.clientHeight - 50 - 15 * 2 - 20 + 15 - 65
  },
  methods: {
    editRule (item) {
      const _this = this
      this.openDialog({
        name: 'finance/dialogs/editRule',
        data: {
          scene: this.active,
          ruleId: item.ruleId,
          ruleType: item.detail.ruleType,
          createRuleForm: {
            ruleName: item.ruleName
          }
        },
        methods: {
          ok () {
            _this.getRules()
          }
        }
      })
    },
    addRule () {
      const _this = this
      this.openDialog({
        name: 'finance/dialogs/createRule',
        data: {
          scene: this.active
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
    switchTab () {
      this.rulesQuery = {
        type: this.active,
        queryText: ''
      }
      this.getRules()
    },
    getRules () {
      return Server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerType: this.active,
          paramName: this.rulesQuery.type !== '4' ? this.rulesQuery.paramName : ''
        }
      }).then(res => {
        this.companyData = res.data.data
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
<style lang="stylus" scoped>
.finance-rules
  margin-bottom -20px
  .tab-box
    margin -15px
    padding 7px 15px
    border-bottom 15px solid #f5f7f9
    /deep/ .ivu-tabs-bar
      border-bottom none
      margin-bottom 1px
      .ivu-tabs-ink-bar
        bottom 2px

  .query-box
    /deep/ .ivu-select
      width: 100px
  .data-container
    margin: 15px 0 0
    .company-table
      /deep/ .operation
        a
          display: none
      /deep/ tr:hover
        .operation
          a
            display: inline
    .operate-block
      display: flex
      display: -ms-flexbox
      justify-content space-between
      -ms-flex-pack justify
      margin-bottom: 20px
      height: 35px
      .ivu-btn
        padding-left: 30px
        padding-right: 30px
      .suffix-btn
        background-color: #00a4bd
        color: #ffffff
        padding: 0 8px
        border-top-right-radius: 2px
        border-bottom-right-radius: 2px
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
        overflow: auto
        padding: 20px 0
        border-bottom: 1px solid #E4E7EC
        margin-right -15px
        margin-left -11px
        padding-left 11px
        padding-right 15px
        .rule-item
          display: flex
          display: -ms-flexbox
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
                display -ms-flexbox
                padding 18px 16px
                height auto
                border-bottom 1px solid #DCDEE2
                &>div
                  flex 1
                  -ms-flex 1
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
            -ms-flex-align center
            align-self: center
            -ms-flex-item-align: center
            .ivu-icon
              color: #EC4E4E
              font-size: 18px
          .ivu-collapse
            flex: 1
            -ms-flex 1
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
    .left_father
      flex 0 0 275px
      -ms-flex 0 0 275px
    .left
      display flex
      display -ms-flexbox
      flex-direction: column
      .left_search
        padding-top 21px
        flex 0 0 72px
        -ms-flex 0 0 72px
        border-right 1px solid #E4E7EC
      .ruleList
        border-top 1px solid #E4E7EC
        overflow hidden
        flex 1
        -ms-flex 1
        border-right 1px solid #E4E7EC
        margin-left -15px
        &:hover
          overflow auto
        .list
          list-style none
          height 60px
          line-height 60px
          display flex
          display -ms-flexbox
          border-bottom 1px solid #E4E7EC
          &.companyDataActive
            background #E9FCFF
          &:hover
            background #E9FCFF
            .operate
              display block
          .icon
            flex 0 0 60px
            -ms-flex 0 0 60px
            width unquote('60px'\9)
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
            -ms-flex 1
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
            -ms-flex 0 0 80px
            cursor pointer
            color #00A4BD
</style>
