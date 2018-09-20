<template>
  <div class="finance-list">
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'account-list',
  metaInfo: {
    title: '已注册公司'
  },
  components: {},
  data () {
    return {
      accountQuery: {
        name: '',
        beginTime: '',
        endTime: '',
        status: ''
      },
      accountColumn: [
        {
          title: '公司名',
          key: 'rank',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.toDetail(params)
                }
              }
            }, params.row.name)
          }
        },
        {
          title: '姓名',
          key: 'userName'
        },
        {
          title: '账号',
          key: 'name'
        },
        {
          title: '注册时间',
          key: 'createTimeText'
        },
        {
          title: '有效时间',
          key: 'expirationTimeText'
        },
        {
          title: '充值审核时间',
          key: 'expUpdateTimeText'
        },
        {
          title: '沟通状态',
          key: 'statusText'
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toEdit(params)
                  }
                }
              }, '修改'),
              h('a', {
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.toAddLog(params)
                  }
                }
              }, '添加记录'),
              h('a', {
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.openPremium(params)
                  }
                }
              }, '延长有效期')
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['AccountQuerySave', 'CommunicateStatusMap', 'AccountData'])
  },
  methods: {
    ...mapActions(['setAccountQuery', 'getAccountList', 'accountUpgrade']),
    async startQuery () {
      await this.setAccountQuery(this.accountQuery)
      await this.getAccountList()
    },
    toDetail (data) {
      this.$router.push({
        name: 'accountDetail',
        params: {
          id: data.row.id
        }
      })
    },
    toEdit (data) {
      this.$router.push({
        name: 'accountEdit',
        params: {
          id: data.row.id
        }
      })
    },
    toAddLog (data) {
      this.$router.push({
        name: 'accountAddLog',
        params: {
          id: data.row.id
        }
      })
    },
    openPremium (data) {
      let _this = this
      this.$Modal.confirm({
        title: '提示',
        content: `${data.row.name}有效期为${data.row.expirationTimeText}，确认对其延长365天有效期？<br />请确保该公司已经线下打款进入公司账户`,
        okText: '确认',
        cancelText: '取消',
        async onOk () {
          await _this.accountUpgrade(data.row.id)
          await _this.getAccountList()
        }
      })
    }
  },
  async beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getAccountList()
    })
  }
}
</script>
<style lang="stylus" scoped>
.account-list
  padding: 20px
  .block
    background-color: #ffffff
    padding: 20px
    box-shadow: 0 3px 5px 0 #cccccc
    margin-bottom: 15px
    .ivu-select
      width: 100px
  .data-block
    text-align: right
    .ivu-table-wrapper
      margin-top: 20px
      margin-bottom: 20px
</style>
