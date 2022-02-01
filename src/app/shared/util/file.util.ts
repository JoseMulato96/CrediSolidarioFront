import * as FileSaver from 'file-saver';

export class FileUtils {
  constructor() {
    // do nothing
  }

  static getTypeFile(fileName): string {
    const fileExtension = '.' + fileName.split('.').pop();
    if (
      fileExtension === '.jpg' ||
      fileExtension === '.png' ||
      fileExtension === '.jpeg'
    ) {
      return 'image';
    }
    if (
      fileExtension === '.webm' ||
      fileExtension === '.ogg' ||
      fileExtension === '.mp4'
    ) {
      return 'video';
    }
    if (fileExtension === '.pdf') {
      return 'pdf';
    }
  }

  static generateFileName(file: File): string {
    const fileExtension = '.' + file.name.split('.').pop();
    return (
      Math.random()
        .toString(36)
        .substring(7) +
      new Date().getTime() +
      fileExtension
    );
  }

  static downloadPdfFile(data, name) {
    const blob = new Blob([data], { type: 'application/pdf' });
    FileSaver.saveAs(blob, `${name}.pdf`);
  }

  static downloadCsvFile(data, name) {
    const blob = new Blob([data], { type: 'text/plain' });
    FileSaver.saveAs(blob, `${name}.txt`);
  }

  static downloadXlsFile(data, name) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    FileSaver.saveAs(blob, name + '.xlsx');
  }

  static downloadZipFile(data, name) {
    const blob = new Blob([data], { type: 'application/zip' });
    FileSaver.saveAs(blob, `${name}.zip`);
  }
}
