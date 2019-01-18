<template>
  <div class="clear-data">
    <div class="message i-bar-warning i-status-warning">
      <Icon type="md-alert icon" />提示：该功能请谨慎使用，数据一旦清除将无法恢复！
    </div>
    <div class="steps">
      <div :class="{'active': active > 0}" class="step">
        <div class="big-circle">
          <div class="small-circle">1</div>
        </div>
        <div class="text">身份认证</div>
      </div>
      <div :class="{'active': active > 1}" class="step">
        <div class="liner"></div>
        <div class="big-circle">
          <div class="small-circle">2</div>
        </div>
        <div class="text">选择数据范围</div>
      </div>
      <div :class="{'active': active > 2}" class="step">
        <div class="liner"></div>
        <div class="big-circle">
          <div class="small-circle">3</div>
        </div>
        <div class="text">确认清除</div>
      </div>
      <div :class="{'active': active > 3}" class="step">
        <div class="liner"></div>
        <div class="big-circle">
          <div class="small-circle">4</div>
        </div>
        <div class="text">完成数据清除</div>
      </div>
    </div>
    <div class="operation-content">
      <!-- 第一步：身份认证 -->
      <div v-if="active === 1" class="operation">
        <div class="account">
          <span>当前账号为：</span>
          <span class="phone">{{UserInfo.phone | formatphone}}</span>
        </div>
        <div class="verify">
          <p class="label">请先输入账号密码，完成身份验证</p>
          <Input v-model="password" placeholder="请输入密码" type="password" clearable style="width: 261px" />
        </div>
        <div class="btn" style="margin-top: 30px">
          <Button type="primary" @click="toSecond">下一步</Button>
        </div>
      </div>
      <!-- 第二步 选择数据范围 -->
      <div v-if="active === 2" class="operation">
        <div class="verify">
          <p class="label">请选择需要清除数据的时间段</p>
          <DatePicker v-model="dateRange" format="yyyy-MM-dd" type="daterange" placeholder="请选择起始日期" style="width: 261px"></DatePicker>
        </div>
        <div class="data-type">
          <p class="tips">请选择需要删除的数据类型，数据删除后不可恢复</p>
          <CheckboxGroup v-model="types" class="types" >
            <div v-for="(item, index) in typesList" :key="index" class="type-item" >
              <Checkbox :label="item.value" >{{item.label}}</Checkbox>
              <p class="label">{{item.desc}}</p>
            </div>
          </CheckboxGroup>
        </div>
        <div class="btn">
          <Button type="primary"  @click="toThird">下一步</Button>
        </div>
      </div>
      <!-- 第三步 确认清除 -->
      <div v-if="active === 3" class="operation">
        <p class="confirm">您选择清除的数据日期是：<span class="stand">{{dateRange[0] | date}}~{{dateRange[1] | date}}</span></p>
        <p class="confirm">
          <span class="show_left">您选择的数据范围是：</span>
          <span class="stand show_right">
            <span v-for="(item, index) in typesValue" :key="item">{{item}}{{index===typesValue.length-1 ? '' : '、'}}</span>
          </span>
        </p>
        <p class="confirm">数据删除之后，将无法恢复，请再次确认哦！</p>
        <div class="btn btn-show">
          <Button :loading="loading" type="primary" style="margin-right: 10px;padding: 5px 15px 6px" @click="nextWay">确认清除数据</Button>
          <Button @click="active--">上一步</Button>
        </div>
      </div>
      <!-- 第四步 完成数据清除 -->
      <div v-if="active===4" class="operation">
        <div class="checkmark"><Icon type="ios-checkmark" /></div>
        <div class="success">数据清除成功，<span>{{second}}</span>秒后自动返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Server from '@/libs/js/server'
import md5 from 'md5'
export default {
  name: 'clear-data',
  props: {
    begin: '',
    end: ''
  },
  data () {
    return {
      active: 1,
      password: '',
      typesList: [
        {
          value: 1,
          label: '订单相关数据',
          desc: '订单相关的订单、运单、财务、报表等数据'
        },
        {
          value: 2,
          label: '发货方数据',
          desc: '客户管理中维护的发货方数据'
        },
        {
          value: 3,
          label: '承运商数据',
          desc: '承运商管理中维护的承运数据'
        },
        {
          value: 4,
          label: '自有车管理数据',
          desc: '和自有车相关的一系列数据'
        },
        {
          value: 5,
          label: '油卡管理数据',
          desc: '油卡及油卡使用记录等数据'
        }
      ],
      types: [],
      dateRange: ['', ''],
      loading: false,
      // beginTime: '',
      // endTime: '',
      second: 3,
      timer: null
    }
  },
  computed: {
    ...mapGetters(['UserInfo']),
    typesValue () {
      let arr = []
      if (this.types.length > 0) {
        let _this = this
        this.types.map((item, index) => {
          if (item === _this.typesList[index].value) arr.push(_this.typesList[index].label)
        })
      }
      return arr
    }
  },
  watch: {
    active (val) {
      if (val === 4) {
        this.timer = setInterval(() => {
          this.second--
          if (this.second === 0) {
            this.active = 1
            this.second = 3
            this.types = []
            this.dateRange = ['', '']
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    }
  },
  mounted () {
    if (this.begin && this.end) {
      // this.beginTime = this.timeFormatter(this.begin)
      // this.endTime = this.timeFormatter(this.endTime)
      this.dateRange = [this.timeFormatter(this.begin), this.timeFormatter(this.end)]
      // this.handleTimeChange(this.dateRange)
    }
  },
  methods: {
    async toSecond () {
      if (!this.password) {
        this.$Message.error('密码不能为空')
        return
      }
      if (await this.valiPassword(this.password)) this.active++
    },
    async valiPassword (value) {
      let flag = false
      await Server({
        url: 'set/pswRight',
        method: 'post',
        data: {
          oldPassword: md5(value)
        }
      }).then(({ data }) => {
        flag = true
      }).catch(() => {
        flag = false
      })
      return flag
    },
    toThird () {
      if (!this.dateRange[0] || !this.dateRange[1]) {
        this.$Message.error('起始日期不能为空')
        return
      }
      if (this.types.length === 0) {
        this.$Message.error('至少选择一项数据类型')
        return
      }
      this.active++
    },
    handleTimeChange (val) {
      this.beginTime = val[0]
      this.endTime = val[1]
    },
    nextWay () {
      this.loading = true
      Server({
        url: 'message/clearUserLitterInfo',
        method: 'post',
        data: {
          types: this.types,
          // endTime: this.endTime,
          beginTime: this.dateRange[0].getTime(),
          // beginTime: this.beginTime
          endTime: this.dateRange[1].getTime() + 86399999
        }
      })
        .then((resp) => {
          if (resp.data.code === 10000) {
            this.active++
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          throw error
        })
    },
    // 格式化时间
    timeFormatter (timestamp) {
      if (!timestamp) return ''
      return new Date(timestamp).Format('yyyy-MM-dd')
    }
  }
}
</script>

<style scoped lang="stylus">
.clear-data
  margin 30px 0 65px
  .message
    font-size 14px
    height 40px
    line-height 40px
    padding 0 20px
    .icon
      font-size 16px
      margin-right 12px
  .steps
    width 500px
    margin 50px auto
    /*border 1px solid #00a4bd*/
    .step
      position relative
      width 125px
      display inline-block
      &.active
        .big-circle
          border 1px dashed #00a4bb
          .small-circle
            border 1px dashed #00a4bb
            background #00a4bb
         .text
          color #333
         .liner
           background #00a4bb
      .big-circle
        margin 0 auto
        width 48px
        height 48px
        border-radius 50%
        border 1px dashed #c5c8ce
        .small-circle
          margin 3px auto 0
          width 40px
          height 40px
          border-radius 50%
          border 1px solid #c5c8ce
          background #c5c8ce
          text-align center
          line-height 40px
          color #fff
          font-size 20px
      .text
        text-align center
        font-size 16px
        color #666
        margin-top 20px
      .liner
        position absolute
        width 76px
        height 1px
        background #c5c8ce
        top 22px
        left -37px
  .operation-content
    color #333
    font-size 14px
    .operation
      width 335px
      margin 0 auto
      text-align left
      /deep/
        .ivu-btn
          padding 5px 21px 6px
      .account
        margin-bottom 25px
        .phone
          font-weight bold
          font-size 24px
      .verify
        .label
          margin-bottom 8px
      .data-type
        margin 27px 0 30px
        .tips
          margin-bottom 12px
        .types
          .type-item
            margin-top 18px
            /deep/
              .ivu-checkbox
                margin-right 18px
              .ivu-checkbox-wrapper
                font-weight bold
                font-size 14px
            .label
              color #999
              margin-left 36px
            &:first-child
              margin-top 0
      .btn
        text-align center
      .btn-show
        margin-top 43px
      .confirm
        display flex
        margin-bottom 20px
        .stand
          color #00A4BD
          margin-left 12px
        .show_left
          flex 0 0 140px
        .show_right
          flex 1
      .checkmark
        text-align center
        width 70px
        margin 17px auto 0
        height 70px
        line-height 70px
        background #00C185
        border-radius 50%
        color #fff
        font-size 70px
        font-weight bold
        /deep/
          .ivu-icon
            vertical-align unset
      .success
        font-size 16px
        margin-top: 20px
        text-align center
        span
          margin-right 3px
</style>
