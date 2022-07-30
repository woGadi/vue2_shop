<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 顶部添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环，嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <!-- ele-ui 的栅格布局默认是分成 24 等分  -->
                  <!-- 以下两列分别占6列和18列 -->
                  <el-col :span="6">
                    <el-tag type="success" @close="removeRightById(scope.row, item2.id)" closable>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)" closable>{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- eslint-disable -->
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsTree" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesListAPI } from '@/api/powerAPI/rolesAPI.js'
import { deleteRightAPI, addRightsAPI } from '@/api/powerAPI/rights_setAPI.js'
import { getRightsTreeAPI } from '@/api/powerAPI/rightsAPI.js'
export default {
  /*eslint-disable*/
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的树形数据
      rightsTree: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的复选框的 id 值数组
      defKeys: [],
      // 为角色分配权限时，这个角色的 id 值
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表方法
    async getRolesList() {
      const { data: res } = await getRolesListAPI()
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败了喔')

      // 将角色列表数据转存到 data 中
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 根据 id 删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') return this.$message.info('您取消了删除喔')

      // 确定删除
      const { data: res } = await deleteRightAPI(role.id, rightId)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败了喔')

      // 这里更新整个权限列表，会不能保持列表的展开状态
      // this.getRolesList()

      // 这里返回的data, 是当前角色下最新的权限数据
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(node) {
      // 在对话框展示时，将用户点击的那一行的 id 先存起来，供分配权限时使用
      this.roleId = node.id
      const { data: res } = await getRightsTreeAPI()
      if (res.meta.status !== 200) return this.$message.error('获取权限树失败了喔')

      // 将获取到的数据转存到 data 中
      this.rightsTree = res.data
      console.log(this.rightsTree)

      // 在为 defKsys 数组 push 数据时，重置数组，防止数据累加
      this.defKeys = []

      // 在展示对话框之前，递归获取三级节点的 id 值
      this.getLeafKeys(node, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的 id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 若当前 node 节点不包含 children 属性，说明此节点为三级节点。
      if (!node.children) {
        return arr.push(node.id)
      }
      // 若当前 node 不为三级节点，则利用递归的形式，将 node 的每一个子节点作为参数，再次调用此函数来判断；直到挖到每一项的三级节点，存储其 id 值。
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击分配权限的确定按钮，为角色分配权限
    async allotRights() {
      // 将树形控件的方法的元素展开，并放到 keys 数组中
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]

      // 因为服务器的请求参数要求为：以逗号分隔的字符串！
      const idStr = keys.join(',')

      // 向服务器发起角色授权请求
      const { data: res } = await addRightsAPI(this.roleId, idStr)

      if (res.meta.status !== 200) return this.$message.error('权限分配失败了喔')

      this.$message.success('分配权限成功~')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
