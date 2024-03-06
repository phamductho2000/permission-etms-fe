import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Pdfmakefonts2 } from "./pdfmake/pdfmake-fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
// import ReviewResultHook from './Hooks/hooks';
// import { GetApproveList } from './review-result-slice';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = Pdfmakefonts2.vfs;
pdfMake.fonts = {
  // Times New Roman font added
  TimesNewRoman: {
    normal: 'timesNewRoman',
    bold: 'timesNewRomanBold',
    italics: 'timesNewRomanItalic',
    bolditalics: 'timesNewRomanBoldItalic'
  }
};

export const generatePdf = (docDefinition: TDocumentDefinitions, fileName: string, type: 'download' | 'generate' | 'view' | 'print') => {
  // pdfMake.createPdf(docDefinition).open();
  if (type === 'download') {
    pdfMake.createPdf(docDefinition).download(fileName);
  } else if (type === 'print') {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob) => {
      const blobURL = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const theWindow = window.open(blobURL);
      if (!theWindow) {
        alert('Có thể trình duyệt của bạn đang chặn mở cửa sổ mới, vui lòng bật và thử lại!')
      } else {
        const theDoc = theWindow.document;
        const theScript = document.createElement("script");
        function injectThis() {
          window.print();
        }
        theScript.innerHTML = `window.onload = ${injectThis.toString()};`;
        theDoc.body.appendChild(theScript);
      }
    });
  } else if (type === 'view') {
    pdfMake.createPdf(docDefinition).open();
  }
}
export const generatePdfFileUrl = (docDefinition: TDocumentDefinitions, callback: (arg0: string) => void) => {
  pdfMake.createPdf(docDefinition).getDataUrl((data) => {
    callback(data)
  })
}


