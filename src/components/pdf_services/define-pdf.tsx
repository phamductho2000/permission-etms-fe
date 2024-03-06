import {TDocumentDefinitions} from "pdfmake/interfaces";
import dayjs from "dayjs";
import {fullDateFormat} from "@/core/constant";
import {currentUser} from "@/core/global.state";
export const docDefine = (data: any, dataSearch: any, genData: any, noFooter?: boolean) => {
    const docDefinition: TDocumentDefinitions = {
        info: {
            title: ``
        },
        header: function (currentPage) {
            return currentPage !== 1 ? {text: currentPage.toString(), alignment: 'center'} : ''
        },
        footer: noFooter ? undefined : function (currentPage, pageCount) {
            return currentPage === pageCount ? {
                stack: [
                    {
                        text: `Người thực hiện: ${currentUser?.username}`,
                    },
                    {
                        text: `Ngày giờ in: ${dayjs().format(fullDateFormat)}`,
                    }
                ],
                style: 'footer'
            } : ''
        },
        content: genData(data, dataSearch),
        styles: {
            header: {
                fontSize: 13,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            footer: {
                fontSize: 11,
                alignment: `right`,
                italics: true,
                margin: [0, 0, 20, 0]
            },
            subHeader: {
                fontSize: 13,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            tableHeader: {
                alignment: `center`,
                bold: true,

            },
            textRight: {
                alignment: `right`,
            },
            textLeft: {
                alignment: `left`,
            },
            textCenter: {
                alignment: `center`,
                margin: [0, 0, 0, 5]
            },
            textCenterData: {
                alignment: `center`,
            }
        },
        pageSize: `A4`,
        pageOrientation: `landscape`,
        defaultStyle: {
            font: `TimesNewRoman`,
            fontSize: 12,
            preserveLeadingSpaces: true
        },

    };
    return docDefinition;
}