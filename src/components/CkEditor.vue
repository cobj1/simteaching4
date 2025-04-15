<template>
  <ckeditor ref="ckeditorRef" v-model="content" :editor="ClassicEditor" :config="editorConfig" />
</template>

<script setup>
  import {
    ClassicEditor,
    GeneralHtmlSupport,
    Alignment,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    FileRepository,
    HtmlEmbed,
    Table,
    Link,
    LinkImage,
  } from 'ckeditor5';
  import {
    ref,
    onMounted,
    watch,
    computed
  } from 'vue'
  import {
    useRoute,
    useRouter
  } from 'vue-router'
  import {
    FileApi
  } from '@/api/file'
  import {
    MyCustomUploadAdapterPlugin
  } from '@/api/ckeditor/ckeditor-upload-adapter'
  import {
    CkeditorVideo
  } from '@/api/ckeditor/ckeditor-video'
  import GLightbox from 'glightbox';

  const route = useRoute()
  const router = useRouter()
  const content = ref('')
  const ckeditorRef = ref()
  const contentInteraction = computed(() => {
    const main = document.createElement('div');
    main.innerHTML = content.value
    const aList = main.querySelectorAll('a')
    for (const aEl of aList) {
      aEl.setAttribute('onclick', `window.playVideo('${aEl.href}')`)
      aEl.href = "javascript:void(0)"
      aEl.style.position = 'relative'
      aEl.style.display = 'inline-block'
      const videoPlaybackMask = document.createElement('div')
      videoPlaybackMask.className = 'video-playback-mask'
      videoPlaybackMask.innerHTML =
        '<i class="el-icon" style="font-size: 50px; color: #fffc;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path></svg></i>'
      aEl.append(videoPlaybackMask)
    }
    return main.innerHTML;
  })

  const editorConfig = {
    htmlSupport: {
      allow: [{
        name: /.*/,
        attributes: true,
        classes: true,
        styles: true
      }]
    },
    plugins: [
      Alignment,
      FontBackgroundColor,
      FontColor, FontFamily, FontSize,
      Bold,
      Essentials,
      Italic,
      Mention,
      Paragraph,
      Undo,
      Image,
      ImageCaption,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      FileRepository,
      HtmlEmbed,
      Table,
      Link,
      LinkImage,
    ],
    toolbar: ['undo', 'redo', '|', 'alignment', '|', 'bold', '|', 'fontSize', 'fontFamily', 'fontColor',
      'fontBackgroundColor', 'italic', 'uploadImage', 'htmlEmbed', 'insertTable'],
    extraPlugins: [GeneralHtmlSupport, MyCustomUploadAdapterPlugin, CkeditorVideo],
    image: {
      resizeOptions: [{
          name: 'resizeImage:original',
          label: 'Default image width',
          value: null,
        },
        {
          name: 'resizeImage:50',
          label: '50% page width',
          value: '50',
        },
        {
          name: 'resizeImage:75',
          label: '75% page width',
          value: '75',
        },
      ],
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
  }

  /* watch(() => route.fullPath, (value) => {
    load()
  }) */

  window.playVideo = (href) => {
    const myGallery = GLightbox({
      elements: [{
        'href': href,
        'type': 'video',
      }],
      autoplayVideos: true,
    });
    myGallery.open();
  }
</script>

<style scoped>
  .content {
    position: relative;
    height: 100%;
  }

  .edit-button {
    position: absolute;
    top: 4px;
    right: 4px;
  }
</style>
<style>
  .video-playback-mask {
    position: absolute;
    inset: 0px;
    background-image: radial-gradient(circle, #0005, #000a);
  }

  .video-playback-mask .el-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
