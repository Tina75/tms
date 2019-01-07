<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="1200" @on-visible-change="close">
    <p slot="header" style="text-align:center">添加异常货物信息</p>
    <CargoTable
      ref="cargoTable"
      :type="`exception`"
      :order-set="OrderSet"
      :orders="orders"
      :data-source="consignerCargoes"
      :on-append="appendCargo"
      :on-remove="removeCargo"
      :on-select="selectCargo">
    </CargoTable>
    <div slot="footer" style="text-align: center;">
      <Button type="primary" @click="ok">确定</Button>
      <Button type="default" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseDialog from '@/basic/BaseDialog'
import Cargo from '@/views/order/create/libs/cargo'
import CargoTable from '@/views/order/create/components/CargoTable.vue'
export default {
  name: 'addCargo',
  components: {
    CargoTable
  },
  mixins: [ BaseDialog ],
  data () {
    return {
      consignerCargoes: [new Cargo()]
    }
  },
  computed: {
    ...mapGetters([
      'OrderSet'
    ])
  },
  mounted () {
    // 编辑时回显
    // this.consignerCargoes = orderDetail.orderCargoList.map((item) => new Cargo(item, true))
  },
  methods: {
    // 货物名称选择下拉项目时触发
    selectCargo (params, cargoItem) {
      const cargo = this.cargoes.find(cg => cg.id === cargoItem.id)
      if (cargo) {
        this.fullUpdateCargo({ index: params.index, cargo })
      }
    },
    /**
     * 添加一行货物信息
     * @param {*} store
     * @param {*} index
     */
    appendCargo (index) {
      this.consignerCargoes.splice(index + 1, -1, new Cargo())
    },
    /**
     * 删除一行
     * @param {*} store
     * @param {*} index
     */
    removeCargo (index) {
      if (this.consignerCargoes.length === 1) {
        return
      }
      this.consignerCargoes.splice(index, 1)
    },
    /**
     * 删除后增加
     */
    fullUpdateCargo (item) {
      this.consignerCargoes.splice(item.index, 1, new Cargo(item.cargo))
    },
    validate () {
      return new Promise((resolve, reject) => {
        const vm = this
        const orderCargoList = vm.consignerCargoes
        let findError = null
        // 校验货物信息
        for (let index in orderCargoList) {
          let cargo = orderCargoList[index]
          let info = cargo.validateExp()
          if (!info.success) {
            findError = info.message
            break
          }
        }
        if (findError) {
          vm.$Message.error(findError)
          vm.disabled = false
          return reject(new Error(findError.message))
        }
        const data = orderCargoList.map(cargo => cargo.toExceptionJson())
        resolve(data)
      })
    },
    ok () {
      this.validate().then(data => {
        this.complete(data)
        this.close()
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
