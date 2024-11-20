<template>
  <v-card>
    <v-toolbar title="组织管理"></v-toolbar>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="12">
        <v-treeview v-model:activated="active" v-model:opened="open" :items="items" :load-children="fetchUsers"
          color="warning" density="compact" item-title="name" item-value="id" activatable open-on-click transition>
        </v-treeview>
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup>
import { OrgApi } from '@/api/org';
import { computed, onMounted, ref, watch } from 'vue';
import { VTreeview } from 'vuetify/labs/VTreeview'

const avatars = [
  '?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
  '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
  '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
  '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
  '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
]

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

const active = ref([])
const avatar = ref(null)
const open = ref([])
const users = ref([])

const items = ref([]) //computed(() => [{ name: 'Users', children: users.value }])
const selected = computed(() => {
  if (!active.value.length) return undefined
  const id = active.value[0]
  return users.value.find(user => user.id === id)
})

watch(selected, () => randomAvatar())

const fetchUsers = async (item) => {
  const res = await OrgApi.selectByParent(item.id, true)
  if (res.length > 0)
    return item.children.push(...res.map(item => wrap(item)))
  else item.children = null
  return true;
}

const randomAvatar = () => {
  avatar.value = avatars[Math.floor(Math.random() * avatars.length)]
}

const wrap = (item) => {
  return { ...item, name: `${item.name} ( ${item.childrenCount} )`, children: (item.childrenCount > 0 ? [] : null) }
}

onMounted(async () => {
  const res = await OrgApi.selectByAdmin(true)
  items.value = res.map(item => wrap(item))
})

</script>
<script>


</script>
