import { FileApi } from "../../api/file";

export class MyUploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;

    try {
      const res = (await FileApi.upload(
        file,
        "help-document/ckeditor/images"
      )) as any;
      return {
        default: `${FileApi.filePath}/${res.url}`,
      };
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("文件上传失败");
    }
  }
}

export function MyCustomUploadAdapterPlugin(editor: any): void {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}
