<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="210px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" min-width="90px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" min-width="160px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="editDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address01">
          <el-cascader v-model="addressForm.address01" :options="cityData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address02">
          <el-input v-model="addressForm.address02"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 物流时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderListAPI } from '@/api/orderAPI/order_listAPI.js'
import cityData from '@/assets/citydata.js'
// 暂时不用，接口失效了
// import { queryProgressInfoAPI } from '@/api/orderAPI/order_query_infoAPI.js'
// 用导入写shi的文档物流数据，来代替接口
import resData from '@/api/orderAPI/order_jia_data.js'
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
        // user_id: '',
        // pay_status: '',
        // is_send: '',
        // order_fapiao_title: '',
        // order_fapiao_company: '',
        // order_fapiao_content: '',
        // consignee_addr: ''
      },
      // 商品订单列表数据
      orderList: [],
      // 总数据条数
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址的表单对象
      addressForm: {
        address01: [],
        address02: ''
      },
      // 修改地址表单的校验规则
      addressFormRules: {
        address01: [{ required: true, message: '请输入省市区/县', trigger: 'blur' }],
        address02: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 导入的地址数据
      cityData,
      // 控制物流进度对话框的显示与隐藏
      progressVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取商品订单列表
    async getOrderList() {
      const { data: res } = await getOrderListAPI(this.queryInfo)

      if (res.meta.status !== 200) return this.$message.error('获取商品订单列表失败了喔')

      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 监听页码值的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听当前页码的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 监听修改对话框的显示
    showEditDialog() {
      this.addressVisible = true
    },
    // 监听修改地址对话框的关闭
    editDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 监听物流进度对话框的展示
    async showProgressDialog() {
      // 展示对话框之前获取物流信息
      // 这个接口的请求地址失效了
      /* const { data: res } = await queryProgressInfoAPI()
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败了喔') */

      // 失效了，所以暂时赋值写shi数据了
      this.progressInfo = resData.data
      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped></style>
