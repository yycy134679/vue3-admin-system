<template>
  <div>
    <!-- 顶部操作栏 -->
    <div style="margin-bottom: 15px">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" sortable width="180" />

      <el-table-column prop="perms" label="权限编码" sortable width="180" />

      <el-table-column prop="icon" label="图标" />

      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag size="small" v-if="row.type === 0">目录</el-tag>
          <el-tag size="small" v-if="row.type === 1" type="success">菜单</el-tag>
          <el-tag size="small" v-if="row.type === 2" type="info">按钮</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="path" label="菜单URL" />

      <el-table-column prop="component" label="菜单组件" />

      <el-table-column prop="orderNum" label="排序号" />

      <el-table-column prop="statu" label="状态">
        <template #default="{ row }">
          <el-tag size="small" v-if="row.statu === 1" type="success">正常</el-tag>
          <el-tag size="small" v-if="row.statu === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="Operate" label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="editHandle(row.id)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-popconfirm
            title="确定删除吗？"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="delHandle(row.id)"
          >
            <template #reference>
              <el-button type="text">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑对话框 -->
    <el-dialog title="菜单信息" v-model="dialogVisible" width="600px" :before-close="handleClose">
      <!-- 对话框表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="请选择上级菜单" style="width: 100%">
            <template v-for="item in tableData" :key="item.id">
              <el-option :label="item.name" :value="item.id"></el-option>
              <template v-for="child in item.children" :key="child.id">
                <el-option :label="child.name" :value="child.id">
                  <span>{{ child.name }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="editForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="editForm.icon" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单URL" prop="path">
          <el-input v-model="editForm.path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="editForm.component" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio :value="0">目录</el-radio>
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="editForm.statu">
            <el-radio :value="0">禁用</el-radio>
            <el-radio :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="editForm.orderNum" :min="1" label="排序号"></el-input-number>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'

const { proxy } = getCurrentInstance()

const dialogVisible = ref(false)
const editFormRef = ref(null)

// 表单数据
const editForm = ref({
  parentId: '',
  name: '',
  perms: '',
  icon: '',
  path: '',
  component: '',
  type: 0,
  statu: 1,
  orderNum: 1,
})

// 表单验证规则
const editFormRules = ref({
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  perms: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  orderNum: [{ required: true, message: '请填入排序号', trigger: 'blur' }],
  statu: [{ required: true, message: '请选择状态', trigger: 'blur' }],
})

// 提交表单
const submitForm = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      proxy.$request
        .post('/sys/menu/' + (editForm.value.id ? 'update' : 'save'), editForm.value)
        .then((res) => {
          proxy.$message({
            showClose: true,
            message: '恭喜，操作成功',
            type: 'success',
            onClose: () => {
              getMenuTree()
            },
          })
          dialogVisible.value = false
        })
        .catch((error) => {
          console.error('操作失败:', error)
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 编辑菜单
const editHandle = (id) => {
  proxy.$request
    .get('/sys/menu/info/' + id)
    .then((res) => {
      editForm.value = res.data.data
      dialogVisible.value = true
    })
    .catch((err) => {
      console.error('获取菜单信息失败:', err)
    })
}

// 删除菜单
const delHandle = (id) => {
  proxy.$request
    .post('/sys/menu/delete/' + id)
    .then((res) => {
      proxy.$message({
        showClose: true,
        message: '删除成功',
        type: 'success',
        onClose: () => {
          getMenuTree()
        },
      })
    })
    .catch((err) => {
      console.error('删除失败:', err)
    })
}

// 重置表单
const resetForm = () => {
  editFormRef.value.resetFields()
  editForm.value = {
    parentId: '',
    name: '',
    perms: '',
    icon: '',
    path: '',
    component: '',
    type: 0,
    statu: 1,
    orderNum: 1,
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 菜单列表数据
const tableData = ref([])

// 获取菜单列表
const getMenuTree = () => {
  proxy.$request
    .get('/sys/menu/list')
    .then((res) => {
      tableData.value = res.data.data || []
    })
    .catch((err) => {
      console.error('获取菜单列表失败:', err)
    })
}

// 组件挂载时获取数据
onMounted(() => {
  getMenuTree()
})
</script>

<style scoped></style>
