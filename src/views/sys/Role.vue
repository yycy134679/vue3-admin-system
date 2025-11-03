<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoleList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openAdd">新增角色</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          :icon="InfoFilled"
          icon-color="red"
          title="确定批量删除吗？"
          @confirm="delHandle(null)"
        >
          <template #reference>
            <el-button type="danger" :disabled="delState">批量删除</el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="name" label="名称" width="120"> </el-table-column>

      <el-table-column prop="code" label="唯一编码" width="120"> </el-table-column>

      <el-table-column prop="remark" label="描述" show-overflow-tooltip> </el-table-column>

      <el-table-column prop="statu" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.statu === 1" size="small" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.statu === 0" size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作">
        <template #default="scope">
          <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-popconfirm @confirm="delHandle(scope.row.id)" title="确定删除吗？">
            <template #reference>
              <el-button type="text">删除</el-button>
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

    <el-dialog title="菜单信息" v-model="dialogVisible" width="600px" :before-close="handleClose">
      <!-- 对话框表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="statu">
          <el-radio-group v-model="editForm.statu">
            <el-radio :value="0">禁用</el-radio>
            <el-radio :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="分配权限" v-model="permDialogVisible" width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreedata"
          show-checkbox
          ref="permTree"
          :default-expand-all="true"
          node-key="id"
          :props="defaultProps"
        >
        </el-tree>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermFormHandle">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

const searchForm = ref({ name: '' })
const delState = ref(true)
const multipleTable = ref(null)
const multipleSelection = ref([])

const total = ref(0)
const current = ref(1)
const size = ref(10)

const dialogVisible = ref(false)
const editFormRef = ref(null)

const editForm = ref({
  name: '',
  code: '',
  remark: '',
  statu: 1,
})

const editFormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入唯一编码', trigger: 'blur' }],
  statu: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}

const tableData = ref([])

const permDialogVisible = ref(false)
const permForm = ref({})
const defaultProps = {
  children: 'children',
  label: 'name',
}
const permTreedata = ref([])

// 获取角色列表
const getRoleList = () => {
  proxy.$request
    .get('/sys/role/list', {
      params: {
        name: searchForm.value.name,
        current: current.value,
        size: size.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.data.records || []
      size.value = res.data.data.size
      current.value = res.data.data.current
      total.value = res.data.data.total
    })
    .catch((err) => {
      console.error('获取角色列表失败:', err)
    })
}

// 编辑角色
const editHandle = (id) => {
  proxy.$request
    .get('/sys/role/info/' + id)
    .then((res) => {
      editForm.value = res.data.data
      dialogVisible.value = true
    })
    .catch((err) => {
      console.error('获取角色信息失败:', err)
    })
}

// 删除角色（复用菜单管理 delHandle 逻辑）
const delHandle = (id) => {
  const ids = []
  if (id) {
    console.log('id:', id)
    ids.push(id)
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.id)
    })
  }
  console.log('ids:', ids)
  proxy.$request
    .post('/sys/role/delete', ids)
    .then((res) => {
      proxy.$message({
        showClose: true,
        message: '删除成功',
        type: 'success',
        onClose: () => {
          getRoleList()
        },
      })
    })
    .catch((err) => {
      console.error('删除失败:', err)
    })
}

function handleSelectionChange(val) {
  multipleSelection.value = val
  delState.value = val.length === 0
}

function handleSizeChange(val) {
  size.value = val
  getRoleList()
}

function handleCurrentChange(val) {
  current.value = val
  getRoleList()
}

// 提交表单
const submitForm = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      proxy.$request
        .post('/sys/role/' + (editForm.value.id ? 'update' : 'save'), editForm.value)
        .then((res) => {
          proxy.$message({
            showClose: true,
            message: '恭喜，操作成功',
            type: 'success',
            onClose: () => {
              getRoleList()
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

// 重置表单
const resetForm = () => {
  editFormRef.value.resetFields()
  editForm.value = {
    name: '',
    code: '',
    remark: '',
    statu: 1,
  }
}

// 新增：打开新增对话框并重置表单
const openAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 组件挂载时获取数据
onMounted(() => {
  getRoleList()
  proxy.$request.get('/sys/menu/list').then((res) => {
    permTreedata.value = res.data.data
  })
})
// 分配权限处理
const permTree = ref(null)
const permHandle = (id) => {
  permDialogVisible.value = true
  nextTick(() => {
    proxy.$request.get('/sys/role/info/' + id).then((res) => {
      // 设置树选中项
      permTree.value.setCheckedKeys(res.data.data.menuIds)
      permForm.value = res.data.data
    })
  })
}

// 分配权限提交
const submitPermFormHandle = () => {
  const menuIds = permTree.value.getCheckedKeys()
  console.log('提交时的勾选菜单id:', menuIds)
  proxy.$request
    .post('/sys/role/perm/' + permForm.value.id, menuIds)
    .then((res) => {
      proxy.$message({
        showClose: true,
        message: '恭喜，操作成功',
        type: 'success',
        onClose: () => {
          getRoleList()
        },
      })
      permDialogVisible.value = false
    })
    .catch((err) => {
      console.error('分配权限失败:', err)
    })
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 25px;
}
</style>
