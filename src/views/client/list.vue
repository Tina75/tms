<template>
  <div class="page">
    <div class="header">
      <Card :bordered="false" class="header_card">
        <div class="header_item">
          <label>手机号码：</label>
          <template>
            <Input v-model="phone" placeholder="请输入手机号码" style="width: 200px" />
          </template>
        </div>
        <div class="header_item">
          <label>打款状态：</label>
          <template>
            <Select v-model="withdrawStatus" style="width:200px">
              <Option v-for="item in selectStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </template>
        </div>
        <div class="header_item">
          <label>申请提款时间：</label>
          <template>
            <DatePicker type="daterange" placeholder="请选择" style="width: 200px" placement="top" @on-change="changedate"></DatePicker>
          </template>
        </div>
        <div class="header_item">
          <template>
            <Button icon="ios-search" type="primary" @click="search">查询</Button>
          </template>
        </div>
      </Card>
    </div>
    <div class="footer">
      <template>
        <Button type="primary" @click="exportList">导出</Button>
      </template>
      <template>
        <Table :columns="columns1" :data="data1" border></Table>
      </template>
      <div class="pagers">
        <div>
          <span>共{{totalCount}}条记录，当前展示{{data1.length}}条</span>
        </div>
        <template>
          <Page :total="totalCount" :page-size-opts="pageArray" :current="pageNo" show-sizer @on-change="pagerNum" @on-page-size-change="pagerSize"/>
        </template>
      </div>
    </div>
    <template>
      <Modal
        v-model="modal1"
        title="打款失败原因"
        @on-ok="failOk">
        <template>
          <RadioGroup v-model="vertical" vertical>
            <Radio v-for="(key,val) in failreason" :label="key" :key="val" >
              <span>{{key}}</span>
            </Radio>
            <!-- <template v-if="vertical==='其他'">
              <Input v-model="value" placeholder="请输入失败原因" style="width: 300px" />
            </template> -->
          </RadioGroup>
        </template>
      </Modal>
    </template>
  </div>
</template>
<script>
import axios from '@/libs/axios'
export default {
  data () {
    return {
      modal1: false,
      vertical: '',
      totalCount: '' || 0,
      // value: '',
      failreason: {},
      columns1: [{ title: '提现流水号', key: 'tradeNo' },
        {
          title: '提现金额（元）',
          key: 'withdrawAmount',
          width: 150,
          render: (h, params) => {
            let text = (parseInt(params.row.withdrawAmount) / 100).toFixed(2)
            return h('div', {
              props: {}
            }, text)
          }
        },
        { title: '提现人姓名', key: 'payeeName' },
        { title: '提现人电话', key: 'phone' },
        { title: '提现银行卡开户行', key: 'payeeDepositBank' },
        {
          title: '提现银行卡卡号',
          key: 'payeeBankNo',
          width: 200,
          render: (h, params) => {
            let text = params.row.payeeBankNo.replace(/(\d{4})(?=\d)/g, '$1 ')
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '操作',
          width: 200,
          render: (h, params) => {
            if (params.row.withdrawStatusStr === '待打款') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.successOk(params.row.tradeNo)
                    }
                  }
                }, '打款成功'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.modal1 = true
                      this.tradeNo = params.row.tradeNo
                      this.getreason()
                    }
                  }
                }, '打款失败')
              ])
            } else {
              return h('div', { props: {} }, '--')
            }
          }
        },
        { title: '申请提现时间',
          key: 'createTime',
          render: (h, params) => {
            let text = this.formatDate(params.row.createTime)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '打款状态',
          key: 'withdrawStatusStr'
        },
        {
          title: '打款时间',
          key: 'updateTime',
          render: (h, params) => {
            let text = this.formatDate(params.row.updateTime)
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '备注',
          key: 'memo'
        }
      ],
      pageArray: [10, 20, 50, 100],
      newStatusStr: '',
      data1: [],
      statusList: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '待打款'
        },
        {
          value: '2',
          label: '打款成功'
        },
        {
          value: '3',
          label: '打款失败'
        }
      ],
      phone: '',
      withdrawStatus: '0',
      startTime: '',
      endTime: '',
      pageSize: 10,
      pageNo: 1,
      tradeNo: '',
      success: ''
    }
  },
  methods: {
    successOk (tradeNo) {
      this.$Modal.confirm({
        title: '消息提示',
        content: '<p>确认此单已打款成功？确认后将提醒用户查看账户余额。</p>',
        onOk: () => {
          this.tradeNo = tradeNo
          this.success = 1
          this.getStatus()
        }
      })
    },
    failOk () {
      this.success = 2
      this.getStatus()
    },
    getreason () {
      // if (this.vertical === '其他' && this.value !== '') {
      //   this.vertical = this.value
      // }
      axios({
        url: 'dictionary/queryWithDict',
        method: 'post',
        data: {
          dictTypeCode: 'withdraw_fail_reason'
        }
      }).then(({ data }) => {
        if (data.data.success) {
          this.failreason = data.data.result
          // console.log(this.failreason)
        }
        // this.value = ''
      }).catch((err) => {
        console.log(err)
      })
    },
    getStatus () {
      axios({
        url: 'trade/withdraw/callBack',
        method: 'post',
        data: {
          tradeNo: this.tradeNo,
          success: this.success,
          memo: this.vertical
        }
      }).then((data) => {
        axios({
          url: 'trade/withdraw/list',
          method: 'post',
          data: {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            withdrawStatus: this.withdrawStatus
          }
        }).then((data) => {
          this.data1 = data.data.data.list
          if (this.data1.length < 0) {
            this.pageNo = this.pageNo - 1
          }
          this.totalCount = data.data.data.totalCount
        })
      })
    },
    search () {
      axios({
        url: 'trade/withdraw/list',
        method: 'post',
        data: {
          pageNo: 1,
          pageSize: this.pageSize,
          phone: this.phone,
          withdrawStatus: this.withdrawStatus,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then((data) => {
        this.pageNo = 1
        this.data1 = data.data.data.list
        this.totalCount = data.data.data.totalCount
      })
    },
    exportList () {
      axios({
        url: 'trade/withdraw/export',
        method: 'post',
        ignoreCode: true,
        responseType: 'blob',
        data: {
          phone: this.phone,
          withdrawStatus: this.withdrawStatus,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then((data) => {
        var blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }) // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        var date = this.formatDate(new Date(), 'yyyy-MM-dd')
        downloadElement.download = `提现记录_${date}.xls` // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch((err) => {
        console.log(err)
      })
    },
    formatDate (value, format) {
      if (value) { return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm') } else { return '' }
    },
    formatTime (time) {
      const date = new Date(time)
      return date.getTime()
    },
    pagerNum (value) {
      this.pageNo = value
      axios({
        url: 'trade/withdraw/list',
        method: 'post',
        data: {
          pageNo: value,
          pageSize: this.pageSize,
          withdrawStatus: this.withdrawStatus,
          phone: this.phone,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then((data) => {
        this.data1 = data.data.data.list
      })
    },
    pagerSize (value) {
      this.pageSize = value
      axios({
        url: 'trade/withdraw/list',
        method: 'post',
        data: {
          pageNo: 1,
          pageSize: value,
          withdrawStatus: this.withdrawStatus,
          phone: this.phone,
          startTime: this.startTime,
          endTime: this.endTime
        }
      }).then((data) => {
        this.data1 = data.data.data.list
      })
    },
    changedate (e) {
      this.startTime = this.formatTime(e[0]) - 28800000
      this.endTime = this.formatTime(e[1]) + 57599000
    }
  }
}
</script>
<style lang="stylus" scoped>
.page
  padding: 10px;
  .header
    padding: 10px;
    &_item
      display: inline-block;
      margin-right: 20px;
  .footer
    padding 10px
    .pagers
      padding: 10px
      border: 1px solid #cccccc
      display:flex
      justify-content:space-between
</style>
