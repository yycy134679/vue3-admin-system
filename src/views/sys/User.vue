<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchForm.username" placeholder="用户名" clearable />
      </el-form-item>

      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <template #reference>
            <el-button type="danger" :disabled="delBtlStatu">批量删除</el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTableRef"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="头像" width="50">
        <template #default="{ row }">
          <el-avatar size="small" :src="row.avatar" />
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="120" />

      <el-table-column prop="code" label="角色名称">
        <template #default="{ row }">
          <el-tag
            v-for="item in row.roles"
            :key="item.id"
            size="small"
            type="info"
            style="margin-right: 5px"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机号" />

      <el-table-column prop="statu" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.statu === 1" size="small" type="success">正常</el-tag>
          <el-tag v-else-if="row.statu === 0" size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="created" width="200" label="创建时间" />

      <el-table-column prop="icon" width="260px" label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="roleHandle(row.id)">分配角色</el-button>
          <el-divider direction="vertical" />

          <el-button type="primary" link @click="repassHandle(row.id, row.username)">
            重置密码
          </el-button>
          <el-divider direction="vertical" />

          <el-button type="primary" link @click="editHandle(row.id)">编辑</el-button>
          <el-divider direction="vertical" />

          <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(row.id)">
            <template #reference>
              <el-button type="primary" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="current"
      v-model:page-size="size"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="提示" width="600px" :before-close="handleClose">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off" />
          <el-alert
            title="初始密码为888888"
            :closable="false"
            type="info"
            style="line-height: 12px"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" autocomplete="off" />
        </el-form-item>

        <el-form-item label="状态" prop="statu" label-width="100px">
          <el-radio-group v-model="editForm.statu">
            <el-radio :value="0">禁用</el-radio>
            <el-radio :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm(editFormRef)">取 消</el-button>
          <el-button type="primary" @click="submitForm(editFormRef)">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog v-model="roleDialogFormVisible" title="分配角色" width="600px">
      <el-form :model="roleForm">
        <el-tree
          ref="roleTreeRef"
          :data="roleTreeData"
          show-checkbox
          :check-strictly="checkStrictly"
          node-key="id"
          :default-expand-all="true"
          :props="defaultProps"
        />
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="roleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitRoleHandle">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 搜索表单
const searchForm = reactive({
  username: '',
})

// 表格数据
const tableData = ref([])
const multipleTableRef = ref()
const multipleSelection = ref([])
const delBtlStatu = ref(true)

// 分页
const total = ref(0)
const size = ref(10)
const current = ref(1)

// 新增/编辑对话框
const dialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive({
  id: null,
  username: '',
  email: '',
  phone: '',
  statu: 1,
})

const editFormRules = {
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  statu: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}

// 分配角色对话框
const roleDialogFormVisible = ref(false)
const roleTreeRef = ref()
const roleForm = ref({})
const roleTreeData = ref([])
const checkStrictly = ref(true)
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 获取用户列表
const getUserList = () => {
  proxy.$request
    .get('/sys/user/list', {
      params: {
        username: searchForm.username,
        current: current.value,
        size: size.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.data.records
      size.value = res.data.data.size
      current.value = res.data.data.current
      total.value = res.data.data.total
    })
}

// 表格多选处理
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  delBtlStatu.value = val.length === 0
}

// 分页处理
const handleSizeChange = (val) => {
  size.value = val
  getUserList()
}

const handleCurrentChange = (val) => {
  current.value = val
  getUserList()
}

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.value = false
  Object.assign(editForm, {
    id: null,
    username: '',
    email: '',
    phone: '',
    statu: 1,
  })
}

// 关闭对话框
const handleClose = () => {
  resetForm(editFormRef.value)
}

// 提交表单
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      proxy.$request
        .post('/sys/user/' + (editForm.id ? 'update' : 'save'), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: '恭喜你,操作成功',
            type: 'success',
            onClose: () => {
              getUserList()
            },
          })
          dialogVisible.value = false
        })
    }
  })
}

// 编辑用户
const editHandle = (id) => {
  proxy.$request.get('/sys/user/info/' + id).then((res) => {
    Object.assign(editForm, res.data.data)
    dialogVisible.value = true
  })
}

// 删除用户
const delHandle = (id) => {
  const ids = []
  if (id) {
    ids.push(id)
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.id)
    })
  }

  proxy.$request.post('/sys/user/delete', ids).then((res) => {
    ElMessage({
      showClose: true,
      message: '恭喜你,操作成功',
      type: 'success',
      onClose: () => {
        getUserList()
      },
    })
  })
}

// 分配角色
const roleHandle = (id) => {
  roleDialogFormVisible.value = true

  proxy.$request.get('/sys/user/info/' + id).then((res) => {
    roleForm.value = res.data.data
    roleTreeRef.value.setCheckedKeys(res.data.data.roles)
  })
}

// 提交角色分配
const submitRoleHandle = () => {
  const roleIds = roleTreeRef.value.getCheckedKeys()
  console.log('分配角色所选ID:', roleIds)
  proxy.$request.post('/sys/user/role/' + roleForm.value.id, roleIds).then((res) => {
    ElMessage({
      showClose: true,
      message: '恭喜你,操作成功',
      type: 'success',
      onClose: () => {
        getUserList()
      },
    })
    roleDialogFormVisible.value = false
  })
}

// 重置密码
const repassHandle = (id, username) => {
  ElMessageBox.confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      return proxy.$request.post('/sys/user/repass', id)
    })
    .then((res) => {
      ElMessage({
        showClose: true,
        message: '恭喜你,操作成功',
        type: 'success',
      })
    })
    .catch((err) => {
      if (err !== 'cancel') {
        console.error('操作失败:', err)
      }
    })
}

// 初始化
onMounted(() => {
  getUserList()

  proxy.$request.get('/sys/role/list').then((res) => {
    roleTreeData.value = res.data.data.records
  })
})
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
