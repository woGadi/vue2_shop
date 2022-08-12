<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <!-- 通过作用域插槽的形式，以调用过滤器来格式化时间 -->
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditGoodsDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="商品编辑" :visible.sync="editGoodsDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 编辑商品的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsListAPI } from '@/api/goodsAPI/goods_listAPI.js'
import { queryGoodsListAPI } from '@/api/goodsAPI/goods_list_queryAPI.js'
import { editGoodsAPI } from '@/api/goodsAPI/goods_editAPI.js'
import { removeGoodsByIdAPI } from '@/api/goodsAPI/goods_deleteAPI.js'
export default {
  name: 'List',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        // pagesize: 10
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 输入框搜索的内容 (好像没用到)
      // searchValue: ''
      // 编辑商品的表单对象
      editForm: {},
      // 编辑商品表单的校验对象
      editFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      // 控制编辑商品对话框的展示与隐藏
      editGoodsDialogVisible: false,
      // 展示编辑对话框时表单的值 (无修改则不请求)
      editDialogShowingValue: {}
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await getGoodsListAPI(this.queryInfo)

      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败了喔')

      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听当前页码值的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 监听编辑商品对话框的展示
    async showEditGoodsDialog(row) {
      const { data: res } = await queryGoodsListAPI(row.goods_id)
      if (res.meta.status !== 200) return this.$message.error('查询商品数据失败了喔')

      // 拿到修改前的值
      this.editDialogShowingValue.goods_name = res.data.goods_name
      this.editDialogShowingValue.goods_price = res.data.goods_price
      this.editDialogShowingValue.goods_weight = res.data.goods_weight

      this.editForm = res.data
      console.log(this.editForm)
      this.editGoodsDialogVisible = true
    },
    // 监听编辑商品对话框的关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改商品
    async editGoods() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
      })
      // 以下判断，商品不动表单数据，就能生效；如：删了原数据 “123”，又输入与原数据一样的 “123”，但却修改成功了？？按理还是属于未修改的
      if (this.editDialogShowingValue.goods_name === this.editForm.goods_name && this.editDialogShowingValue.goods_price === this.editForm.goods_price && this.editDialogShowingValue.goods_weight === this.editForm.goods_weight) {
        this.editGoodsDialogVisible = false
        return this.$message.info('您未修改任何信息呢')
      }

      const { data: res } = await editGoodsAPI(this.editForm.goods_id, this.editForm)

      if (res.meta.status !== 200) return this.$message.error('编辑商品失败了喔')

      this.getGoodsList()
      this.editGoodsDialogVisible = false
      this.$message.success('编辑商品成功~')
    },
    // 点击删除按钮，请求删除操作
    async removeGoodsById(row) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const { data: res } = await removeGoodsByIdAPI(row.goods_id)

        if (res.meta.status !== 200) return this.$message.error('删除商品失败了喔')

        this.$message.success('删除商品成功~')
        this.getGoodsList()
      }
    },
    // 点击添加商品，跳转到对应页面
    goAddPage() {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style lang="less" scoped></style>
