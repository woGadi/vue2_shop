<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-row>
        <el-col>
          <el-alert title="添加商品信息" type="info" show-icon center :closable="false"> </el-alert>
        </el-col>
      </el-row>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 商品分类的级联选择器 -->
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover', ...cascaderProps }" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 多选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单的 item 项 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <!-- 注意 input 不支持 array 类型数据 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 是上传图片时，要请求的后台 API 接口 -->
            <!-- on-preview 是点击图片预览的操作时，触发的事件 -->
            <!-- on-remove 是移除图片的操作时，触发的事件 -->
            <!-- list-type 通过指定不同的值，来决定 upload 组件所渲染出来的 UI 效果 -->
            <!-- on-success 文件上传成功时的钩子 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAddGoods" @click="add">提交并添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getCateListAPI } from '@/api/goodsAPI/goods_cateAPI.js'
import { getCateParamsAPI } from '@/api/goodsAPI/goods_cate_paramsAPI.js'
import _ from 'lodash'
import { addAPI } from '@/api/goodsAPI/goods_addAPI.js'
export default {
  /*eslint-disable*/
  name: 'Add',
  data() {
    return {
      // 被激活项的索引
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组，存的是分类的 id 值
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详细描述
        goods_introduce: '',
        // 商品的参数/属性数组，存储 id，value 值
        attrs: []
      },
      // 表单的验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 图片上传的 URL 地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的 headers 请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览路径
      previewURL: '',
      // 控制图片预览对话框的显示与隐藏
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      // 不传递参数，默认获取所有值；见 API 文档
      const { data: res } = await getCateListAPI()

      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败了喔')

      console.log(res.data)
      this.cateList = res.data
    },
    // 级联选择器的选中项发生变化，会触发这个函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        // console.log(this.addForm.goods_cat)
        return
      }
      console.log(this.addForm.goods_cat)
    },
    // 在切换 tab 页签时，触发该函数
    beforeTabLeave(activeName, oldActiveName) {
      if ((oldActiveName = '0' && this.addForm.goods_cat.length !== 3)) {
        // console.log('即将离开：' + oldActiveName)
        // console.log('即将到达：' + activeName)
        this.$message.error('要选择商品分类先喔')
        return false
      }
    },
    // tab 页签被选中时触发
    async tabClicked() {
      // 若选择 tab 页签“动态参数”
      if (this.activeIndex === '1') {
        // 这是获取 many 动态参数的请求
        const { data: res } = await getCateParamsAPI(this.cateId, 'many')

        if (res.meta.status !== 200) return this.$message.error('获取分类参数列表失败了喔')

        console.log(res.data)
        // 将参数列表中的每一项的 attr_vals 分割成数组
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }
      // 若选择 tab 页签“静态属性”
      else if (this.activeIndex === '2') {
        const { data: res } = await getCateParamsAPI(this.cateId, 'only')

        if (res.meta.status !== 200) return this.$message.error('获取分类参数列表失败了喔')

        console.log(res.data)
        // 因为要使用 attr_vals 的是输入框，输入框不支持 array 类型数据
        // 将属性列表中的每一项的 attr_vals 分割成数组
        /* res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        }) */
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file);
      this.previewURL = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file)
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2、从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3、调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1、拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2、将图片信息对象，push 到 pics 数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 商品内容里的添加按钮的事件
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('是不是有表单项没填好呢~')

        // 执行添加的业务逻辑
        // 用到 lodash 的深拷贝函数
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await addAPI(form)

        if (res.meta.status !== 201) return this.$message.error('提交并添加商品失败了喔')

        this.$message.success('提交并添加商品成功~')
        // 跳转回商品列表的页面
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 计算商品分类的 id 值
    cateId() {
      // 若用户选择了3级分类，就返回对应分类的 id 值
      if (this.addForm.goods_cat.length === 3) {
        // 数组存储着所选中分类的 id 集合，最后一项就是3级分类对应的 id 值
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 5px 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAddGoods {
  margin-top: 15px;
}
</style>
