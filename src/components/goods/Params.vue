<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKeys" :options="cateList" :props="{ expandTrigger: 'hover', ...cascaderPorps }" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>

      <!-- Tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialog">添加参数</el-button>
          <!-- 动态参数的 table 表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 列首的展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <!-- eslint-disable -->
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="showAddDialog">添加属性</el-button>
          <!-- 静态属性的 table 表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染 tag 标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="tagClosed(i, scope.row)">{{ item }}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <!-- eslint-disable -->
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 动态参数和静态属性共用的对话框 -->
    <el-dialog :title="`添加${titleText}`" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 动态参数和静态属性共用的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="`${titleText}：`" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数/属性的对话框 -->
    <el-dialog :title="`添加${titleText}`" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 动态参数和静态属性共用的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="`${titleText}：`" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAPI } from '@/api/goodsAPI/goods_cateAPI.js'
import { getCateParamsAPI } from '@/api/goodsAPI/goods_cate_paramsAPI.js'
import { addParamsAPI } from '@/api/goodsAPI/goods_add_paramsAPI.js'
import { queryParamsAPI } from '@/api/goodsAPI/goods_query_paramsAPI.js'
import { editParamsAPI } from '@/api/goodsAPI/goods_edit_paramsAPI.js'
import { removeParamsAPI } from '@/api/goodsAPI/goods_delete_paramsAPI.js'
import { addParamsTagAPI } from '@/api/goodsAPI/goods_add_tagAPI.js'
export default {
  /*eslint-disable*/
  name: 'Params',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 请求服务器所得的查询信息
      queryInfo: {
        type: 3
      },
      // 用于存储，级联选择器的选中项的 id 的一个数组
      selectedKeys: [],
      // 级联选择器的配置对象
      cascaderPorps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加参数对话框的展示与隐藏
      addDialogVisible: false,
      // 添加参数/属性的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数/属性的表单验证规则对象
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数/属性', trigger: 'blur' }]
      },
      // 控制修改对话框的展示与隐藏
      editDialogVisible: false,
      // 修改参数/属性的表单数据对象
      editForm: {},
      // 修改参数/属性的表单验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数/属性', trigger: 'blur' }]
      },
      // 修改对话框展示时 input 显示的 value
      // 自己添加的：防止未修改参数值，而向服务器请求修改
      editDialogShowingValue: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await getCateListAPI(this.queryInfo)

      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败了喔')

      this.cateList = res.data
      console.log(this.cateList)
    },
    // 监听级联选择器里的选项变化的事件
    handleChange() {
      this.getParamsData()
    },
    // 监听 tab 页签的点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      // sk 数组长度不等于3，证明未选中3级分类
      if (this.selectedKeys.length !== 3) {
        // console.log(this.selectedKeys)
        this.selectedKeys = []
        // 切换到2级分类时，清空 table 表格
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选中了3级分类
      console.log(this.selectedKeys)

      const { data: res } = await getCateParamsAPI(this.selectCateId, this.activeName)
      if (res.meta.status !== 200) return this.$message.error('获取分类参数失败了喔')

      // 将返回参数列表的每一项(行)数据，的 attr_vals 字符串改造成“以空格分隔的数组”
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制按钮与文本框的切换显示
        item.inputVisible = false
        // 文本框中输入的内容
        item.inputValue = ''
      })
      console.log(res.data)

      // 将请求回来的数据进行区分，供数据对应的表格使用
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 点击添加参数按钮，弹出对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 监听添加参数/属性对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮，添加参数/属性
    async addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
      })

      const { data: res } = await addParamsAPI(this.selectCateId, this.addForm.attr_name, this.activeName)

      if (res.meta.status !== 201) return this.$message.error(`添加${this.titleText.slice(2, 4)}失败了喔`)

      console.log(res)
      this.$message.success(`添加${this.titleText.slice(2, 4)}成功~`)
      this.addDialogVisible = false
      this.getParamsData()
    },
    // 点击修改按钮，展示修改的对话框
    async showEditDialog(attrId) {
      // 查询将要修改项的参数信息
      const { data: res } = await queryParamsAPI(this.selectCateId, attrId, this.activeName)

      if (res.meta.status !== 200) return this.$message.error('获取查询的参数信息失败了喔')

      // console.log(res.data, '001')
      this.editDialogShowingValue = res.data.attr_name
      this.editForm = res.data

      this.editDialogVisible = true
    },
    // 在修改对话框关闭时，重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮，修改参数/属性
    async editParams() {
      this.$refs.editFormRef.validate((valid) => {
        // console.log(this.editForm.attr_name, '002')
        // console.log(this.editDialogShowingValue === this.editForm.attr_name)
        if (!valid) return
      })

      // 若修改的参数/属性和修改前相同，则不发起修改请求
      if (this.editDialogShowingValue === this.editForm.attr_name) {
        this.editDialogVisible = false
        return this.$message.info('您未修改任何信息喔~')
      }

      const { data: res } = await editParamsAPI(this.selectCateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName)

      if (res.meta.status !== 200) return this.$message.error('修改参数/属性失败了喔')

      console.log(res.data)
      this.$message.success('修改参数/属性成功~')

      // this.editForm = res.data
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 根据 id 删除对应的参数项
    async removeParams(attrId) {
      const confirmResult = await this.$confirm(`此操作将永久删除该${this.titleText.slice(2, 4)}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      console.log(confirmResult)

      if (confirmResult === 'confirm') {
        const { data: res } = await removeParamsAPI(this.selectCateId, attrId)

        if (res.meta.status !== 200) return this.$message.error(`删除${this.titleText.slice(2, 4)}失败了喔`)

        console.log(res.data)
        this.$message.success(`删除${this.titleText.slice(2, 4)}成功~`)
        this.getParamsData()
      }
    },
    // 文本框失去焦点 或 摁下回车键 都会触发这个事件
    async handleInputConfirm(row) {
      // 若输入无效值，则清空输入框，不发起添加 tag 请求
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 将有效值加入到每一项参数的数组中
      row.attr_vals.push(row.inputValue.trim())
      // 加入完成后清空输入框，并关闭
      row.inputValue = ''
      row.inputVisible = false

      // 将添加的 tag 保存到服务器中
      // 这个方法封装了完整的请求过程
      addParamsTagAPI(this.selectCateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals)
    },
    // 点击按钮，展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // $nextTick 方法的作用：写在这方法里面的代码，会在页面渲染完毕之后，才会运行回调函数里的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数标签
    tagClosed(i, row) {
      row.attr_vals.splice(i, 1)
      addParamsTagAPI(this.selectCateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals)
    }
  },
  computed: {
    isBtnDisabled() {
      // 当商品分类未选择时，return true 来激活两个按钮的禁用属性
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的分类的 id 值
    selectCateId() {
      // 若选中的分类为3级，则返回其 id 值
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
      return null
    },
    // 动态计算对话框标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag,
.button-new-tag {
  width: 120px;
}
</style>
