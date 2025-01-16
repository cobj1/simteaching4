<template>
  <v-btn prepend-icon="mdi-bank" class="ma-2 flex-1-1" size="large" min-height="56">
    <div v-if="orgItem">{{ orgItemNames.at(-1) }} </div>
    <div v-else> 筛选组织</div>
    <SelectionOrg @confirm="handleSearchSelectionOrgConfirm"></SelectionOrg>
    <v-tooltip v-if="orgItem" activator="parent" location="top">
      {{ orgItemNames.join(' / ') }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
import { OrgApi } from '@/api/user/org';
import { computed, ref } from 'vue';

const org = defineModel()
const orgItem = ref()

const orgItemNames = computed(() => {
  if (orgItem.value) {
    return orgNames(orgItem.value).reverse()
  }
  return null;
})

const handleSearchSelectionOrgConfirm = async (value) => {
  org.value = value
  orgItem.value = await OrgApi.selectOneAndParentById(value.join(','))
}

const orgNames = (org) => {
  if (org.parent) return [org.name, ...orgNames(org.parent)]
  else return [org.name]
}
</script>

<style lang="scss" scoped></style>
