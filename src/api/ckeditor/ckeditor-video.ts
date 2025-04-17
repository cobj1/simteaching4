import { Plugin, ButtonView } from "ckeditor5";
import { useFileDialog } from "@vueuse/core";
import { FileApi } from "../../api/file";

const fileDialog = useFileDialog({
  accept: "video/*", // Set to accept only image files
});

export class CkeditorVideo extends Plugin {
  init() {
    const editor = this.editor;
    console.log(editor);
    fileDialog.onChange(async (files) => {
      if (files == null) return;

      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);

        const res = (await FileApi.upload(
          file,
          "help-document/ckeditor/videos"
        )) as any;
        editor.model.change((writer) => {
          const cover = writer.createElement("imageBlock", {
            src: FileApi.filePath + "/" + res.cover,
            width: "960",
            height: "540",
            htmlImgAttributes: {
              styles: {
                "aspect-ratio": "960/540",
              },
            },
            linkHref: FileApi.filePath + "/" + res.url,
            "data-url": "wangshuo",
          });
          const el = writer.createElement("paragraph");
          el._appendChild(cover);
          editor.model.insertContent(el);
        });
      }
    });
    editor.ui.componentFactory.add("video", () => {
      // The button will be an instance of ButtonView.
      const button = new ButtonView();
      button.set({
        label: "视频",
        tooltip: "插入视频",
        withText: true,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>`,
      });
      button.on("execute", () => fileDialog.open());
      return button;
    });
  }
}
