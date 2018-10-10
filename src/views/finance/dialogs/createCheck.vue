<template>
  <Modal v-model="visiable" :mask-closable="true" width="330" @on-visible-change="close">
    <p slot="header" style="text-align:center;font-size:17px">生成对账单</p>
    <div class="create-data">
      <p><label>承运方：</label><span>{{partnerName}}</span></p>
      <p><label>订单数：</label><span>{{orderNum}}</span></p>
      <p><label>日期范围：</label>
        <span v-if="startTime && endTime">{{startTime|datetime('yyyy-MM-dd')}} 至 {{endTime|datetime('yyyy-MM-dd')}}</span>
        <span v-if="startTime && !endTime">从{{startTime|datetime('yyyy-MM-dd')}}开始</span>
        <span v-if="!startTime && endTime">截止{{endTime|datetime('yyyy-MM-dd')}}</span>
        <span v-if="!startTime && !endTime">截止{{new Date().getTime()|datetime('yyyy-MM-dd')}}</span>
      </p>
    </div>
    <div slot="footer" style="text-align:center">
      <Button type="primary" @click="save">确定</Button>
      <Button type="default" @click="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import '@/libs/js/filter'
import BaseDialog from '@/basic/BaseDialog'
import Server from '@/libs/js/server'

export default {
  name: 'createCheck',
  mixins: [BaseDialog],
  data () {
    return {
      startTime: 0,
      endTime: 0
    }
  },
  methods: {
    save () {
      Server({
        url: '/finance/reconcile/new',
        method: 'post',
        data: {
          idList: this.idList,
          partnerType: this.partnerType,
          dayType: this.dayType,
          dateRange: this.startTime ? (this.endTime ? `${new Date(this.startTime).Format('yyyy-MM-dd')}至${new Date(this.endTime).Format('yyyy-MM-dd')}` : `从${new Date(this.startTime).Format('yyyy-MM-dd')}开始`) : `截至${new Date(this.endTime || new Date().getTime()).Format('yyyy-MM-dd')}`,
          partnerName: this.partnerName
        }
      }).then(res => {
        this.ok()
        this.close()
      }).catch(err => console.error(err))
    }
  }

}

</script>
<style lang='stylus' scoped>
  .create-data
    p
      line-height: 28px
    label
      display: inline-block
      width: 60px
      color: #777777
      vertical-align: middle
    span
      display: inline-block
      color: #333333
      vertical-align: middle
</style>
