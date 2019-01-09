// 表格中的按钮方法
// import float from '@/libs/js/float'
import { divideFee } from '@/libs/js/config'
export default {
  methods: {
    // 分配
    assign (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/assign',
        data: {
          title: '分配油卡',
          assign: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 充值
    recharge (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/recharge',
        data: {
          title: '油卡充值',
          recharge: {
            id: p.row.id,
            amount: p.row.amount,
            type: p.row.type,
            issuer: p.row.issuer,
            primaryCardNumber: p.row.primaryCardNumber
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 加油
    refuel (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/refuel',
        data: {
          title: '油卡加油',
          refuel: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            type: p.row.type,
            driverName: p.row.driverName,
            truckNo: p.row.truckNo,
            issuer: p.row.issuer
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 转账
    transfer (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/transfer',
        data: {
          title: '油卡转账',
          transfer: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            type: p.row.type,
            issuer: p.row.issuer,
            primaryCardId: p.row.primaryCardId,
            primaryCardNumber: p.row.primaryCardNumber
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 修改
    update (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/addEdit',
        data: {
          title: '修改油卡',
          mode: 2,
          addEdit: {
            id: p.row.id,
            number: p.row.number,
            amount: typeof p.row.amount !== 'string' ? divideFee(p.row.amount) : '',
            remark: p.row.remark,
            type: p.row.type,
            issuer: p.row.issuer,
            primaryCardId: p.row.primaryCardId,
            primaryCardNumber: p.row.primaryCardNumber
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    },
    // 回收
    recover (p) {
      let _this = this
      this.openDialog({
        name: 'oilCard/dialog/recover',
        data: {
          title: '回收油卡',
          recover: {
            id: p.row.id,
            number: p.row.number,
            amount: p.row.amount,
            type: p.row.type,
            issuer: p.row.issuer,
            carrierName: p.row.carrierName,
            returnDeposit: typeof p.row.recieveDeposit !== 'string' ? divideFee(p.row.recieveDeposit) : ''
          }
        },
        methods: {
          ok () {
            _this.fetchData()
          }
        }
      })
    }
  }
}
