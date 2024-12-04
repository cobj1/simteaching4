<template>
  <v-card>
    <v-toolbar title="角色列表"></v-toolbar>
    <v-list>
      <v-list-item v-for="item in items" :key="item.id" :title="item.name">
        <template v-slot:append>
          <v-btn color="grey-lighten-1" icon="mdi-account-key" variant="text" @click="editItem(item)"></v-btn>
        </template>
      </v-list-item>
      <v-list-item-subtitle></v-list-item-subtitle>
    </v-list>
    <v-dialog v-model="dialog" max-width="600" scrollable>
      <v-card prepend-icon="mdi-account-key" title="设置角色权限" :loading="loading">
        <v-card-text style="max-height: 50vh;">
          <v-container>
            <v-checkbox v-model="selected" v-for="item in permissions" :key="item.id" :label="item.name"
              :value="item.id"></v-checkbox>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <small class="text-caption text-medium-emphasis ml-4">* 请慎重修改角色权限，以避免不可预估的错误。</small>
          <v-spacer></v-spacer>
          <v-btn text="关闭" variant="plain" @click="dialog = false"></v-btn>
          <v-btn color="primary" text="保存" variant="tonal" @click="save()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { Permission, PermissionApi } from '@/api/user/permission';
import { Role, RoleApi } from '@/api/user/role';
import { notify } from '@kyvg/vue3-notification';
import { onMounted, ref } from 'vue';

const items = ref<Role[]>([])
const dialog = ref(false)
const editedId = ref()
const selected = ref<string[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(true)

const editItem = async (item: Role) => {
  loading.value = true
  dialog.value = true
  editedId.value = item.id
  selected.value = []
  permissions.value = await PermissionApi.selectAll() as any
  const res = await PermissionApi.listByRole(item.id) as any
  if (res) selected.value = res.map((item: Permission) => item.id)
  loading.value = false
}

const save = async () => {
  const res = await RoleApi.save({ id: editedId.value, permission: selected.value.join(',') })
  if (res) {
    notify({ title: "保存成功", type: "info", })
  } else {
    notify({ title: "保存失败", type: "info", })
  }
  selected.value = []
  editedId.value = null
  dialog.value = false
}

onMounted(async () => {
  const res = await RoleApi.list() as any
  items.value = res.map((item: Role) => {
    return { id: item.id, name: item.name }
  })
})
</script>

<style scoped></style>
