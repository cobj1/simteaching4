<template>
  <UserList :role="route.params.roleId"></UserList>
</template>

<script setup lang="ts">
import UserList from '@/components/UserList.vue';
import { useRoute } from 'vue-router';

const route = useRoute()

</script>

<style scoped>

</style>
