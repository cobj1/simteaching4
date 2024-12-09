export function FileFormat(fileName: string, isFolder: boolean) {
  try {
    const suffix = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (isFolder) return "folder";
    else if (".jpg.png.ico".includes(suffix)) return "picture";
    else if (
      ".mp4.ogv.mpeg.baiavi.navi.duasf.mov.3gp.wmv.divx.xvid.rm.rmvb.flv/f4v".includes(
        suffix
      )
    )
      return "video";
    else if (".txt.sql.java".includes(suffix)) return "text";
    else if (".xml.css.js.html".includes(suffix)) return "code";
    else if (".xlsx.xls".includes(suffix)) return "excel";
    else if (".ppt.pptx".includes(suffix)) return "ppt";
    else if (
      ".rar.zip.7z.cab.arj.lzh.tar.gz.ace.uue.bz2.jar.iso.mpq".includes(suffix)
    )
      return "zip";
    else if (".pdf".includes(suffix)) return "pdf";
    else if (".doc.docx".includes(suffix)) return "word";
  } catch (e) { /* empty */ }
  return "misc";
}
