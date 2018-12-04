<template>
  <div class="exception">
    <template v-for="(item,index) in errorInfoList">
      <ExpRecord :data="item" :key="index" :index="index" :list-length="listLength" :bill-type="billType" :pickup-id="pickupId"/>
    </template>
    <ExpTimeLine :data="errorLogs"/>
  </div>
</template>
<script>
import ExpRecord from '../components/ExpRecord.vue'
import ExpTimeLine from '../components/ExpTimeLine.vue'
import Server from '@/libs/js/server'
export default {
  name: 'exception',
  components: {
    ExpRecord,
    ExpTimeLine
  },
  props: {
    pickupId: {
      type: Number | String
    },
    cnt: {
      type: Number | String
    },
    billType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      errorInfoList: [],
      errorLogs: [],
      billObj: {
        billNo: '',
        billType: '',
        billStatus: '',
        billTypeDesc: ''
      }
    }
  },
  computed: {
    listLength () {
      return this.errorInfoList.length
    }
  },
  methods: {
    initData () {
      Server({
        url: '/abnormal/detail',
        method: 'post',
        data: {
          billId: Number(this.pickupId),
          billType: this.billType // 1 提货单 2 外转单 3 运单
        }
      }).then(res => {
        const data = res.data.data
        this.errorInfoList = data.abnormalList
        this.billObj = {
          billNo: data.billNo,
          billType: data.billType,
          billStatus: data.billStatus,
          billTypeDesc: data.billTypeDesc
        }
        this.errorLogs = data.operaterLog
      })
    }
  }
}
</script>
