<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="text-align:center">
        <span>编辑</span>
      </p>
      <Form ref="info" :model="info" :rules="rules" :label-width="100" label-position="left">
        <FormItem label="外转方" prop="transfereeName">
          <SelectInput
            v-model="info.transfereeName"
            :maxlength="20"
            :remote="false"
            :local-options="transferees"
            placeholder="请输入"
            style="width:200px"
            @on-select="handleSelectTransferee">
          </SelectInput>
        </FormItem>
        <FormItem label="外转方运单号">
          <Input v-model="info.outTransNo" :maxlength="20" style="width:200px" placeholder="请输入"/>
        </FormItem>
        <FormItem label="付款方式" prop="payType">
          <Select v-model="info.payType" style="width:200px">
            <Option value="1">现付</Option>
            <Option value="2">到付</Option>
            <Option value="3">回单付</Option>
            <Option value="4">月结</Option>
          </Select>
        </FormItem>
        <FormItem label="外转运费" prop="transFee">
          <TagNumberInput :min="0" v-model="info.transFee" :parser="handleParseFloat" style="width:180px">
            <span slot="suffix" class="order-create__input-suffix">元</span>
          </TagNumberInput>
          <Icon type="ios-calculator" size="26" color="#00a4bd" @click="showCounter"></Icon>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import SelectInput from '@/components/SelectInput.vue'
import TagNumberInput from '@/views/order/create/TagNumberInput'
import float from '@/libs/js/float'
export default {
  name: 'outer',

  components: {
    SelectInput,
    TagNumberInput
  },

  mixins: [BaseDialog],
  data () {
    return {
      transferees: [],
      info: {
        transfereeName: '',
        outTransNo: '',
        payType: '',
        transFee: ''
      },
      rules: {
        transfereeName: { required: true, message: '请填写外转方' },
        payType: { required: true, message: '请选择付款方式' },
        transFee: { required: true, type: 'number', message: '请填写外转运费', trigger: 'blur' }
      },
      visibale: true
    }
  },

  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },

  created: function () {
    this.fetchData()
    this.getTransferees()
  },

  methods: {
    getTransferees () {
      Server({
        url: '/transferee/listOrderbyUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.transferees = res.data.data.transfereeList.map(item => {
          return {
            name: item.name,
            value: item.name,
            payType: item.payType.toString()
          }
        })
      })
    },

    handleSelectTransferee (name, row) {
      if (row.payType) this.info.payType = row.payType
    },

    // 保留2位小数
    handleParseFloat (value) {
      return float.floor(value)
    },

    save () {
      this.$refs['info'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.info)
          data.transFee = data.transFee * 100

          Server({
            url: '/outside/bill/update',
            method: 'post',
            data
          }).then((res) => {
            this.$Message.success('操作成功')
            this.close()
            this.complete()
          })
        }
      })
    },

    // 显示计费规则
    showCounter () {
      const _this = this
      this.openDialog({
        name: 'transport/dialog/financeRule',
        data: {
          value: 0
        },
        methods: {
          ok (value) {
            _this.info.transFee = value || 0
          },
          cancel () {
            self.close()
          }
        }
      })
    },

    fetchData () {
      Server({
        url: '/outside/bill/detail',
        method: 'post',
        data: { transId: this.id }
      }).then(res => {
        const data = res.data.data
        for (let key in this.info) {
          this.info[key] = data.customerInfo[key]
        }
        this.info.payType = this.info.payType.toString()
      }).catch(err => console.error(err))
    }
  }

}

</script>
<style lang='stylus' scoped>
  .dialog
    p
      text-align center
</style>
