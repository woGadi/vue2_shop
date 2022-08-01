<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :show-row-hover="false" :expand-type="false" show-index index-text="#" border>
        <!-- 是否有效 -->
        <!-- 名称为 isOk 的插槽 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: green" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <!-- 名称为 order 的插槽 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 在级联选择器中选择了哪些项(这些项需要存到一个数组中)，需要双向绑定这些项：v-model -->
          <!-- 用来指定数据源：options -->
          <!-- 在级联选择器中“选中的是谁”、“展示的是谁”、“通过哪个属性来实现父子嵌套”，都要通过 props 预先配置 -->
          <el-cascader v-model="selectedKsys" :options="parentCateList" :props="{ expandTrigger: 'hover', ...cascaderProps, checkStrictly: true }" @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 添加分类说明 -->
      <p class="tips">tips：若想添加为1级分类，请将父级分类清空</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAPI } from '@/api/goodsAPI/goods_cateAPI.js'
import { getParentCateListAPI } from '@/api/goodsAPI/goods_parent_cateAPI'
import { addCateAPI } from '@/api/goodsAPI/goods_add_cateAPI.js'
export default {
  /*eslint-disable*/
  name: 'Cate',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 请求服务器所得的查询信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为 tree-table 指定列的定义
      columns: [
        // 这里的每一个对象都是一列
        {
          // 列名
          label: '分类名称',
          // 列值
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前列的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 要添加的分类的名称
        cat_name: '',
        // 父级分类的 id 值
        cat_pid: 0,
        // 要添加的分类的等级，默认是1级分类
        cat_level: 0
      },
      // 添加分类表单的校验规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的 id 数组
      selectedKsys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: res } = await getCateListAPI(this.queryInfo)

      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败了喔')

      this.cateList = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 对话框展示之前，先获取父级分类数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await getParentCateListAPI()
      if (res.meta.status !== 200) return this.$message.error('获取父级分类数据列表失败了喔')

      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 级联选择器的选择项发生变化时触发这个函数
    parentCateChanged() {
      // 若 selectedKsys 数组的长度大于0，说明有选择了父级分类
      if (this.selectedKsys.length > 0) {
        // sk 数组的最后一项是选中那一项的 id，即：父级分类的 id
        this.addCateForm.cat_pid = this.selectedKsys[this.selectedKsys.length - 1]
        // sk 数组的长度是多少，选择分类的等级深度就是多少
        this.addCateForm.cat_level = this.selectedKsys.length
        return
      } else {
        // 若 sk 数组长度等于0，说明没有选择父级分类，默认将此分类设定为第1级分类，分类等级也为1级；即：自己就是第1级父级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await addCateAPI(this.addCateForm)

        if (res.meta.status !== 201) return this.$message.error('添加分类失败了喔')

        this.$message.success('添加分类成功~')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      // 重置 input 输入框
      this.$refs.addCateFormRef.resetFields()
      // 重置 cascader 级联选择器
      this.selectedKsys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
  font-size: 14px;
}
.tips {
  display: inline;
  margin-left: 20px;
  padding: 0 5px;
  font-size: 12px;
  border: 2px dashed gray;
}
.el-cascader {
  width: 100%;
}
</style>
