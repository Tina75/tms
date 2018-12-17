<template>
  <div>
    <div class="add_btn">
      <Button v-if="(active === '1'&&hasPower(130113)) || (active === '2'&&hasPower(130215))" type="primary" @click="addRule">新增规则</Button>
    </div>
    <div  :style="{height: height > 600 ? height+'px' : 600+'px'}" class="rule">
      <div v-if="companyData.length===0" class="data-total-empty">
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
            <div v-else class="ruleName">{{item.ruleName.slice(0,8)}}...</div>
            <div v-if="item.partnerName.length<8"  class="tips">{{item.partnerName}}</div>
            <div v-else class="tips">{{item.partnerName.slice(0,8)}}...</div>
          </div>
          <div class="operate">
            <span v-if="(active === '1'&&hasPower(130114)) || (active === '2'&&hasPower(130216))" style="margin-right: 12px;" @click.stop="editRule(item)">修改</span>
            <span v-if="(active === '1'&&hasPower(130115)) || (active === '2'&&hasPower(130217))" @click="removeRule(item.ruleId)">删除</span>
          </div>
        </li>
      </ul>
      <div v-if="companyData.length>0"  class="ruleDetail">
        <data-empty v-if="!ruleDetail.ruleId">请点击左侧{{sceneMap[active]}}设置计费规则明细～</data-empty>
        <div v-else class="rule-block">
          <div class="rule-basic">
            <Form ref="ruleBasic" :model="ruleDetail" :rules="basicValidate" class="ruleBasic" inline>
              <span>按</span>
              <FormItem prop="ruleType" style="width: 120px">
                <Select v-model="ruleDetail.ruleType" transfer>
                  <Option v-for="(value, key) in ruleTypeMap"  :key="key" :value="key">{{value}}</Option>
                </Select>
              </FormItem>
              <span>计算</span>
              <popTipForRule></popTipForRule>
            </Form>
            <div class="title">
              <div class="ruleName">{{ruleDetail.ruleName}}</div>
              <div class="tips">{{ruleDetail.partnerName}}</div>
            </div>
          </div>
          <div class="rules-list">
            <div v-for="(item, index) in ruleDetail.details" :key="index" class="rule-item">
              <Collapse v-model="item.showRule" class="rule-content">
                <div class="rule-route">
                  <Form ref="ruleRoute" :model="item" :rules="routeValidate" inline>
                    <Row :gutter="24">
                      <Col span="4"  class="styleCommon">
                      <FormItem prop="departure" style="text-align: left">
                        <SelectInputForCity ref="city1" :code-type = "1" v-model="item.departure" placeholder="请输入始发地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="1" class="styleCommon">
                      <i class="icon font_family icon-ico-line"></i>
                      </Col>
                      <Col span="4" class="styleCommon">
                      <FormItem prop="destination" style="text-align: left">
                        <SelectInputForCity ref="city2" :code-type = "1" v-model="item.destination" placeholder="请输入目的地" class="search-input-senior"></SelectInputForCity>
                      </FormItem>
                      </Col>
                      <Col span="13" class="styleCommon">
                      <div v-if="ruleDetail.ruleType!=='5'" class="startPrice">
                        <FormItem prop="startType" style="width: 70px">
                          <Select v-model="item.startType" @on-change="startTypeChange(item)">
                            <Option v-for="(value, key) in startTypeMap"  :key="key" :value="key">{{value}}</Option>
                          </Select>
                        </FormItem>
                        <span style="margin:0 10px">：货物  ＜</span>
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
                        <div v-if="item.startType === '2'" style="display: inline-block">
                          按<span style="padding: 0 10px">{{item.startNum}}</span>
                          {{unitMap[ruleDetail.ruleType]}}计算
                        </div>
                      </div>
                      </Col>
                      <Col :offset="ruleDetail.ruleType==='5'? 13:0" span="2">
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
                        <div v-if="ruleDetail.ruleType!=='5'">
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
                        <div v-if="ruleDetail.ruleType!=='5'">
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
                        <!--车型-->
                        <div v-if="ruleDetail.ruleType==='5'">
                          <span>{{valueTypeMap[ruleDetail.ruleType]}}</span>
                          <Form ref="ruleCar" :model="el" :rules="carValidate"   style="display: inline-block"
                                inline>
                            <FormItem prop="carType" inline style="margin-bottom: 0">
                              <Select v-model="el.carType"
                                      transfer
                                      placeholder="请选择车型"
                                      class="detail-info-input-half"
                                      style="margin-right: 12px;width: 120px">
                                <Option v-for="item in carType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            <FormItem prop="carLength" inline style="margin-bottom: 0">
                              <Select v-model="el.carLength"
                                      transfer
                                      placeholder="请选择车长"
                                      class="detail-info-input-half"
                                      style="margin-right: 12px;width: 120px">
                                <Option v-for="item in carLength" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                          </Form>
                        </div>
                        <div v-if="ruleDetail.ruleType==='5'">
                          <span>包车价</span>
                          <Form ref="rulePrice" :model="el" :rules="priceValidate" style="display: inline-block"
                                inline>
                            <FormItem prop="price" inline style="margin-bottom: 0">
                              <!--<Input v-model="el.price" />-->
                              <TagNumberInput v-model="el.price" :show-chinese="false"></TagNumberInput>
                            </FormItem>
                            <span>元</span>
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
// import Server from '@/libs/js/server'
import SelectInputForCity from '@/components/SelectInputForCity'
import FontIcon from '@/components/FontIcon'
import TagNumberInput from '@/components/TagNumberInput'
import DataEmpty from '@/components/DataEmpty'
import mixin from './mixin'
import popTipForRule from '@/views/client/ruleForClient/dialogs/popTipForRule.vue'
// import { mapActions } from 'vuex'
export default {
  name: 'rule-index',
  components: { SelectInputForCity, FontIcon, TagNumberInput, DataEmpty, popTipForRule },
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
  computed: {
    // ...mapGetters(['carriesRule']),
    companyData () {
      let params = {
        paramName: this.rulesQuery.type !== '4' ? this.rulesQuery.paramName : '',
        partnerId: this.partnerId
      }
      if (this.active === '1') { // 发货方列表查询
        return this.$store.getters.senderRuleSearch(params)
      } else {
        return this.$store.getters.carriesRuleSearch(params)
      }
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
    // ...mapActions(['getSenderRules', 'getCarriesRules']),
    async getRules () {
      if (this.active === '1') {
        await this.getSenderRules()
      } else {
        await this.getCarriesRules()
      }
      if (this.ruleDetail && this.ruleDetail.ruleId && this.companyData.some(item => item.ruleId === this.ruleDetail.ruleId)) {
        this.showRuleDetail(this.companyData.find(item => item.ruleId === this.ruleDetail.ruleId))
      } else {
        this.ruleDetail = {}
      }
      this.$emit('update:count', this.companyData.length ? this.companyData.length : 0)
    },
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
          async ok (ruleId) {
            await _this.getRules()
            _this.showRuleDetail(_this.companyData.find(item => {
              return item.ruleId === ruleId
            }))
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
  display -ms-flexbox
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
    -ms-flex 0 0 270px
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
  .ruleDetail
    flex 1
    -ms-flex 1
    height 100%
    position relative
    .rule-block
      padding-left 10px
      .rule-basic
        padding: 14px
        border-bottom: 1px solid #E4E7EC
        overflow hidden
        .ruleBasic
          float left
        .title
          float right
          font-size 12px
          text-align right
          .ruleName
            margin-bottom 5px
            color #333
            font-weight bold
          .tips
            color #999
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
                  flex 0 0 80px
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
</style>
