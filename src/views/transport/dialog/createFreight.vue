<template>
  <Modal v-model="show" :mask-closable="false" transfer width="360" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="$form" :model="form" :rules="rules" :label-width="80" style="padding:0 20px;">
      <FormItem label="始发地：" prop="start">
        <SelectInputForCity v-model="form.start" placeholder="请输入"/>
      </FormItem>
      <FormItem label="目的地：" prop="end">
        <SelectInputForCity v-model="form.end" placeholder="请输入"/>
      </FormItem>
      <FormItem label="承运商：" prop="carrierName">
        <SelectInput v-model="form.carrierName"
                     mode="carrier"
                     placeholder="请选择"
                     @on-select="selectCarrierHandler" />
      </FormItem>
      <FormItem label="车牌号：" prop="carNo">
        <SelectInput :carrier-id="carrierId"
                     v-model="form.carNo"
                     mode="carNo"
                     placeholder="请选择"
                     @on-select="autoComplete" />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="create">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>

/**
 * 创建运单
 */

import BaseDialog from '@/basic/BaseDialog'
import SelectInputForCity from '@/components/SelectInputForCity'
import SelectInput from '@/views/transport/components/SelectInput.vue'
import SelectInputMixin from '@/views/transport/mixin/selectInputMixin'
import Server from '@/libs/js/server'
import { CAR } from '@/views/client/pages/client'

export default {
  name: 'CreatedFreight',
  components: { SelectInputForCity, SelectInput },
  mixins: [ BaseDialog, SelectInputMixin ],
  data () {
    return {
      show: true,

      // 下拉输入框数据
      keyFields: 'form',
      linkageFields: ['carNo'],

      form: {
        start: void 0,
        end: void 0,
        carrierName: '',
        carNo: ''
      },
      rules: {
        start: [
          { required: true, type: 'number', message: '请选择始发地', trigger: 'blur' }
        ],
        end: [
          { required: true, type: 'number', message: '请选择目的地', trigger: 'blur' }
        ],
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    create () {
      this.$refs.$form.validate(valid => {
        if (valid) {
          Server({
            url: '/dispatch/add/waybill',
            method: 'post',
            data: {
              start: this.form.start,
              end: this.form.end,
              carrierName: this.form.carrierName,
              carNo: this.form.carNo ? this.form.carNo : void 0
            }
          }).then(res => {
            this.$Message.success('新建成功')
            this.close()
            this.complete()
          }).catch(err => console.error(err))
        }
      })
    }
  }
}
</script>
