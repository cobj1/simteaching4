<template>
  <v-hover >
    <template #default="{ isHovering, props }">
      <v-card class="mb-2 mx-2" ariant="text" style="box-shadow:none;" :class="{ 'elevation-4': isHovering }" v-bind="props">
        <template #default>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title disable-icon-rotate>
                <v-icon icon="mdi-home" size="30" class="mr-2" />
                {{ item.name }}
                <template v-slot:actions>
                  <CourseResourceItemOptions :id="item.id"></CourseResourceItemOptions>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                ut aliquip ex
                ea commodo consequat.
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup>
defineProps(['item'])
</script>

<style lang="scss" scoped></style>
