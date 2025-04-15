import { FileApi } from "../../api/file";
import type { FileLoader } from '@ckeditor/ckeditor5-upload';
import type { Editor } from '@ckeditor/ckeditor5-core';

export class MyUploadAdapter {
  private loader : FileLoader;

  constructor(loader : FileLoader) {
    this.loader = loader;
  }

  async upload() : Promise<{ default : string }> {
    const file = await this.loader.file;

    try {
      const res = await FileApi.upload(file, 'help-document/ckeditor/images');
      return {
        default: `${FileApi.filePath}/${res.url}`
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('文件上传失败');
    }
  }
}

export function MyCustomUploadAdapterPlugin(editor : Editor) : void {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader : FileLoader) => {
    return new MyUploadAdapter(loader);
  };
}
