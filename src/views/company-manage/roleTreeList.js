export default {
  data1: [{
    key: 'data1',
    title: '受理开单',
    code: '100000',
    expand: true,
    children: [{
      title: '手工下单',
      expand: true,
      code: '100100',
      parentId: '100000',
      children: [
        { title: '保存', code: '100101', parentId: '100100' },
        { title: '打印并保存', code: '100102', parentId: '100100' },
        { title: '清空', code: '100103', parentId: '100100' }
      ]
    },
    {
      title: '批量导入',
      expand: true,
      code: '100200',
      parentId: '100000',
      children: [
        { title: '导入文件', code: '100201', parentId: '100200' },
        { title: '下载模板', code: '100202', parentId: '100200' },
        { title: '下载（列表上）', code: '100203', parentId: '100200' },
        { title: '查看订单', code: '100204', parentId: '100200' }
      ]
    }]
  }],
  data2: [{
    key: 'data2',
    title: '订单管理',
    code: '110000',
    expand: true,
    children: [{
      title: '订单管理',
      code: '110100',
      parentId: '110000',
      expand: true,
      children: [
        { title: '送货调度', code: '110101', parentId: '110100' },
        { title: '提货调度', code: '110102', parentId: '110100' },
        { title: '拆单', code: '110103', parentId: '110100' },
        { title: '外转', code: '110104', parentId: '110100' },
        { title: '订单还原', code: '110105', parentId: '110100' },
        { title: '编辑', code: '110106', parentId: '110100' },
        { title: '删除', code: '110107', parentId: '110100' },
        { title: '打印', code: '110108', parentId: '110100' },
        { title: '导出', code: '110109', parentId: '110100' }
      ]
    }, {
      title: '回单管理',
      code: '110200',
      parentId: '110000',
      expand: true,
      children: [
        { title: '回收', code: '110201', parentId: '110200' },
        { title: '返厂', code: '110202', parentId: '110200' },
        { title: '导出', code: '110203', parentId: '110200' }
      ]
    }]
  }],
  data3: [{
    key: 'data3',
    title: '运输管理',
    code: '120000',
    expand: true,
    children: [{
      title: '运单管理',
      code: '120100',
      parentId: '120000',
      expand: true,
      children: [
        { title: '发运', code: '120102', parentId: '120100' },
        { title: '派车', code: '120101', parentId: '120100' },
        { title: '打印', code: '120103', parentId: '120100' },
        { title: '到货', code: '120104', parentId: '120100' },
        { title: '删除', code: '120105', parentId: '120100' },
        { title: '位置', code: '120106', parentId: '120100' },
        { title: '编辑', code: '120107', parentId: '120100' },
        { title: '导出', code: '120108', parentId: '120100' }
      ]
    }, {
      title: '提货单管理',
      code: '120200',
      parentId: '120000',
      expand: true,
      children: [
        { title: '提货', code: '120201', parentId: '120200' },
        { title: '打印', code: '120202', parentId: '120200' },
        { title: '到货', code: '120203', parentId: '120200' },
        { title: '删除', code: '120204', parentId: '120200' },
        { title: '位置', code: '120205', parentId: '120200' },
        { title: '编辑', code: '120206', parentId: '120200' },
        { title: '导出', code: '120207', parentId: '120200' }
      ]
    }, {
      title: '外转单管理',
      code: '120300',
      parentId: '120000',
      expand: true,
      children: [
        { title: '发运', code: '120301', parentId: '120300' },
        { title: '到货', code: '120302', parentId: '120300' },
        { title: '编辑', code: '120303', parentId: '120300' },
        { title: '删除', code: '120304', parentId: '120300' },
        { title: '导出', code: '120305', parentId: '120300' }
      ]
    }]
  }],
  data4: [{
    key: 'data4',
    title: '客户管理',
    code: '130000',
    expand: true,
    children: [{
      title: '发货方管理',
      code: '130100',
      parentId: '130000',
      expand: true,
      children: [
        { title: '新增发货方', code: '130101', parentId: '130100' },
        { title: '修改发货方', code: '130102', parentId: '130100' },
        { title: '删除发货方', code: '130103', parentId: '130100' },
        { title: '新增发货地址', code: '130104', parentId: '130100' },
        { title: '修改发货地址', code: '130105', parentId: '130100' },
        { title: '删除发货地址', code: '130106', parentId: '130100' },
        { title: '新增收货方', code: '130107', parentId: '130100' },
        { title: '修改收货方', code: '130108', parentId: '130100' },
        { title: '删除收货方', code: '130109', parentId: '130100' },
        { title: '新增常发货物', code: '130110', parentId: '130100' },
        { title: '修改常发货物', code: '130111', parentId: '130100' },
        { title: '删除常发货物', code: '130112', parentId: '130100' }
      ]
    }, {
      title: '承运商管理',
      code: '130200',
      parentId: '130000',
      expand: true,
      children: [
        { title: '新增承运商', code: '130201', parentId: '130200' },
        { title: '修改承运商', code: '130202', parentId: '130200' },
        { title: '删除承运商', code: '130203', parentId: '130200' },
        { title: '新增司机', code: '130204', parentId: '130200' },
        { title: '修改司机', code: '130205', parentId: '130200' },
        { title: '删除司机', code: '130206', parentId: '130200' },
        { title: '新增车辆', code: '130207', parentId: '130200' },
        { title: '修改车辆', code: '130208', parentId: '130200' },
        { title: '删除车辆', code: '130209', parentId: '130200' }
      ]
    }, {
      title: '外转方管理',
      expand: true,
      code: '130300',
      parentId: '130000',
      children: [
        { title: '新增外转方', code: '130301', parentId: '130300' },
        { title: '修改外转方', code: '130302', parentId: '130300' },
        { title: '删除外转方', code: '130303', parentId: '130300' }
      ]
    }]
  }],
  data5: [{
    key: 'data5',
    title: '公司管理',
    expand: true,
    code: '140000',
    children: [{
      title: '角色管理',
      expand: true,
      code: '140100',
      parentId: '140000',
      children: [
        { title: '添加角色', code: '140101', parentId: '140100' },
        { title: '更改角色', code: '140102', parentId: '140100' },
        { title: '删除角色', code: '140103', parentId: '140100' }
      ]
    }, {
      title: '员工管理',
      expand: true,
      code: '140200',
      parentId: '140000',
      children: [
        { title: '添加员工', code: '140201', parentId: '140200' },
        { title: '修改员工', code: '140202', parentId: '140200' },
        { title: '删除员工', code: '140203', parentId: '140200' }
      ]
    }]
  }],
  data6: [{
    key: 'data6',
    title: '设置',
    expand: true,
    code: '150000',
    children: [
      { title: '公司设置', code: '150100', parentId: '150000' },
      { title: '短信设置', code: '150200', parentId: '150000' }
    ]
  }]
}
