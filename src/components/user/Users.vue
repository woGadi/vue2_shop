<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!-- 可以创建带斑马纹的表格: stripe -->
      <!-- 具有竖直方向的边框: border -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- 切换每页显示多少条的下拉菜单时触发 size-change 事件 -->
      <!-- 切换页码，页码值发生变化时触发 current-change 事件 -->
      <!-- 当前显示第几页的数据：current-page -->
      <!-- 每页显示多少条的下拉菜单的页码大小：page-sizes -->
      <!-- 当前每页显示多少条数据：page-size -->
      <!-- 指定页面需要展示哪些功能组件：layout -->
      <!-- 总数据：total -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <!-- 控制对话框的显示和隐藏，值为布尔值：:visible.sync -->
    <!-- 控制对话框的宽度：width -->
    <!-- 对话框关闭之前会触发对应事件：:before-close -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <!-- 通过 label 指定下拉所展示的那些名称 -->
          <!-- 通过 value 指定下拉菜单所选项的真正的那个值 -->
          <!-- 何谓真正的值？如：某一项展示的是文本，而真正操作的数据是文本的 id 值 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserListAPI } from '@/api/userAPI/usersAPI.js'
import { userStateChangedAPI } from '@/api/userAPI/users_stateAPI.js'
import { addUserAPI } from '@/api/userAPI/users_addAPI.js'
import { queryUsersAPI } from '@/api/userAPI/users_queryAPI.js'
import { editUserAPI } from '@/api/userAPI/users_editAPI.js'
import { deleteUserAPI } from '@/api/userAPI/users_deleteAPI.js'
import { getRolesListAPI } from '@/api/powerAPI/rolesAPI.js'
import { setUserRoleAPI } from '@/api/userAPI/users_roleAPI.js'
export default {
  /*eslint-disable*/
  name: 'Users',
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      // 用户数据总条目
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色 id 值
      selectedRoleId: ''
    }
  },
  methods: {
    // 获取用户列表数据方法
    async getUserList() {
      const { data: res } = await getUserListAPI(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听页面大小改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await userStateChangedAPI(userinfo.id, userinfo.mg_state)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败了喔')
      }
      this.$message.success('更新用户状态成功~')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 对话框确定按钮，预校验之后，添加新用户并提交
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        // 发起添加用户的网络请求
        const { data: res } = await addUserAPI(this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败了喔')

        this.$message.success('添加用户成功~')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示修改用户的对话框
    async showEditDialog(id) {
      const { data: res } = await queryUsersAPI(id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败了喔')

      // 将查询到的数据存到 data() 中
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 对话框确定按钮，预校验之后，修改用户信息并提交
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return

        // 发起添加用户的网络请求
        const { data: res } = await editUserAPI(this.editForm.id, this.editForm.email, this.editForm.mobile)
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败了喔')
        console.log(res)

        this.$message.success('修改用户信息成功~')
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 通过 id 删除对应的用户信息
    async removeUserById(id) {
      // 确认删除消息弹框
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('您取消了删除')
      // 正式发起删除请求
      const { data: res } = await deleteUserAPI(id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败了喔')
      this.$message.success('删除用户成功~')
      // 改动了用户列表数据，需要更新一下数据
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      // 在弹出对话框之前，获取当前用户的用户信息
      this.userInfo = userInfo

      // 在弹出对话框之前，获取所有角色的列表
      const { data: res } = await getRolesListAPI()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败了喔')

      this.rolesList = res.data
      console.log(this.rolesList)

      this.setRoleDialogVisible = true
    },
    // 点击分配角色的确定按钮之后，将分配的角色信息存到服务器中
    async saveRoleInfo() {
      // 若已选中的角色 id 值为空字符串，说明用户还未选择分配的角色
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色喔')

      const { data: res } = await setUserRoleAPI(this.userInfo.id, this.selectedRoleId)

      if (res.meta.status !== 200) return this.$message.error('分配角色失败了喔')

      this.$message.success('分配角色成功~')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      // 让下拉菜单里的 value 重置为空字符串
      this.selectedRoleId = ''
      // 重置需要被分配角色的用户信息
      // 疑惑：若不重置这里有何影响？？
      this.userInfo = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped></style>
