import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { observable, Observable } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CalendarService } from '../calendar/calendar.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class DienThoPhatMauService {

  readonly EXCEL_TYPE = 'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly EXCEL_EXTENSION = '.xlsx';
  readonly sheetId = `2PACX-1vR7KmDI0VFeL7oqXTNvj4OMS0qk9-oebKYLvZRxDujPS5FcSCGRSiODep9FGkCDu6SpAer8_ZYnMSUR`
  readonly dienThoPhatMauWorkbook: any;
  readonly dienThoPhatMau: any;
  readonly dienThoPhatMauSetting = <any>{};

  constructor(
    private sheetService: SheetService,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private currencyPipe: CurrencyPipe
  ) { }

  fetchDienThoPhatMauData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{}
        this.sheetService.decodeRawSheetData(ref.dienThoPhatMauWorkbook.Sheets['database'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.Timestamp === 'setting')
            const dienThoPhatMauSetting = <any>{}
            settings.forEach((item: any) => {
              dienThoPhatMauSetting[item?.logFrom] = item?.data
            })
            let price = <any>[];
            let bill = <any>[];
            let deletedBill = <any>[];
            let deletedPrice = <any>[];
            let updatedPrice = <any>[];
            let updatedBill = <any>[];
            let data = <any>[];
            res?.forEach((item: any, resIndex: any) => {
              if (item?.Timestamp != 'setting') {
                if (!data) {
                  data = <any>[]
                }
                if (!price) {
                  price = <any>[]
                }
                const dataRow = JSON.parse(item.data)
                dataRow?.forEach((dr: any, dataRowIndex: any) => {
                  if (dr?.key) {
                    switch (dr?.key) {
                      case 'price':
                        let priceData: any = <any>{}
                        priceData = dr?.data
                        priceData.updatedBy = item?.updatedBy
                        priceData.logFrom = item?.logFrom
                        price.push(priceData)
                        break;
                      case 'bill':
                        let billData: any = <any>{}
                        billData = dr?.data
                        billData.updatedBy = item?.updatedBy
                        billData.logFrom = item?.logFrom
                        bill.push(billData)
                        break;
                      case 'delete-bill':
                        let deletedBillData: any = <any>{}
                        deletedBillData = dr?.data
                        deletedBillData.updatedBy = item?.updatedBy
                        deletedBillData.logFrom = item?.logFrom
                        deletedBill.push(deletedBillData)
                        break;
                      case 'delete-price':
                        let deletedPriceData: any = <any>{}
                        deletedPriceData = dr?.data
                        deletedPriceData.updatedBy = item?.updatedBy
                        deletedPriceData.logFrom = item?.logFrom
                        deletedPrice.push(deletedPriceData)
                        break;
                      case 'update-price':
                        let updatedPriceData: any = <any>{}
                        updatedPriceData = dr?.data
                        updatedPriceData.updatedBy = item?.updatedBy
                        updatedPriceData.logFrom = item?.logFrom
                        updatedPrice.push(updatedPriceData)
                        break;
                      case 'update-bill':
                        let updatedBillData: any = <any>{}
                        updatedBillData = dr?.data
                        updatedBillData.updatedBy = item?.updatedBy
                        updatedBillData.logFrom = item?.logFrom
                        updatedBill.push(updatedBillData)
                        break;
                    }
                  }
                })
              }
              if (resIndex === res?.length - 1) {
                bill?.forEach((billItem: any) => {
                  billItem?.materials?.forEach((material: any) => {
                    if (typeof material?.material === 'string') {
                      const itemMaterial = price?.find((priceItem: any) => priceItem?.key === material.material)
                      material.material = itemMaterial
                    }
                  });
                  data.push(billItem);
                })
                updatedBill?.forEach((billItem: any) => {
                  billItem?.materials?.forEach((material: any) => {
                    if (typeof material?.material === 'string') {
                      const itemMaterial = price?.find((priceItem: any) => priceItem?.key === material.material)
                      material.material = itemMaterial
                    }
                  });
                })
                setTimeout(() => {
                  updatedPrice?.forEach((priceItem: any) => {
                    const foundUpdatedPrice = price?.find((up: any) => up?.key === priceItem?.key)
                    if (foundUpdatedPrice) {
                      price[price.indexOf(foundUpdatedPrice)] = priceItem
                    }
                  })
                  updatedBill?.forEach((billItem: any) => {
                    const foundUpdatedBill = data?.find((ub: any) => ub?.key === billItem?.key)
                    if (foundUpdatedBill) {
                      data[data.indexOf(foundUpdatedBill)] = billItem
                    }
                  })
                }, 0);
                deletedBill?.forEach((billItem: any) => {
                  data = data?.filter((db: any) => db?.key !== billItem?.key)
                })
                deletedPrice?.forEach((priceItem: any) => {
                  price = price?.filter((pb: any) => pb?.key !== priceItem?.key)
                })
              }
            })
            response.status = 200
            response.data = data
            response.price = price
            ref.dienThoPhatMauSetting = dienThoPhatMauSetting;
            ref.dienThoPhatMau = data;
            response.setting = dienThoPhatMauSetting
            observable.next(response)
            observable.complete()
          })
      }
      if (!ref.dienThoPhatMauWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.dienThoPhatMauWorkbook = res?.workbook
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
  }

  exportToExcel(dateRange: any): Observable<any> {
    return new Observable((observable: any) => {
      const dienThoPhatMauExportedWorkbook = new Workbook()
      this.materialImportSummaryReportWorkSheet(dienThoPhatMauExportedWorkbook, dateRange)

      // DOWNLOAD FILE
      dienThoPhatMauExportedWorkbook.xlsx.writeBuffer().then((data: any) => {
        const blob = new Blob([data], { type: this.EXCEL_TYPE })
        fs.saveAs(blob, `${this.datePipe.transform(dateRange.dateFrom, 'dd-MM-yy')}_${this.datePipe.transform(dateRange.dateTo, 'dd-MM-yy')}${this.EXCEL_EXTENSION}`);
        const response = {
          code: 200
        }
        observable.next(response)
        observable.complete()
      })

    })
  }

  materialImportSummaryReportWorkSheet(dienThoPhatMauExportedWorkbook: Workbook, dateRange: any) {
    const sheetLabel = `CHI TIẾT (${this.datePipe.transform(dateRange.dateFrom, 'dd-MM-YY')}-${this.datePipe.transform(dateRange.dateTo, 'dd-MM-YY')})`
    const startCol = `A`
    const defaultFontSize = 14
    const colCount = 7 - (1) // minus 1 because index from 0
    const endCol = String.fromCharCode(colCount + 'A'.charCodeAt(0))
    const dailyReportWorkSheet = dienThoPhatMauExportedWorkbook.addWorksheet(sheetLabel);
    // REPORT TITLE
    dailyReportWorkSheet.mergeCells(`${startCol}1:${endCol}1`);
    dailyReportWorkSheet.getCell('A1').value = 'BÁO CÁO NHẬP VẬT TƯ CHI TIẾT'
    dailyReportWorkSheet.getCell('A1').alignment = { horizontal: 'center' }
    dailyReportWorkSheet.getCell('A1').font = { size: 18, bold: true }
    // Date Range
    const lunarDateFrom = this.calendarService.getConvertedFullDate(dateRange.dateFrom)
    dailyReportWorkSheet.getCell('A2').value = `Từ ngày: `
    dailyReportWorkSheet.getCell('A2').font = { size: defaultFontSize, bold: true }
    dailyReportWorkSheet.getCell('B2').value = `${this.datePipe.transform(dateRange.dateFrom, 'dd-MM-YYYY')} (${lunarDateFrom.convertSolar2Lunar.lunarDay}-${lunarDateFrom.convertSolar2Lunar.lunarMonth}-${lunarDateFrom.convertSolar2Lunar.lunarYearName})`
    dailyReportWorkSheet.getCell('B2').font = { size: defaultFontSize, }
    const lunarDateTo = this.calendarService.getConvertedFullDate(dateRange.dateTo)
    dailyReportWorkSheet.getCell('A3').value = `Đến ngày: `
    dailyReportWorkSheet.getCell('A3').font = { size: defaultFontSize, bold: true }
    dailyReportWorkSheet.getCell('B3').value = `${this.datePipe.transform(dateRange.dateTo, 'dd-MM-YYYY')} (${lunarDateTo.convertSolar2Lunar.lunarDay}-${lunarDateTo.convertSolar2Lunar.lunarMonth}-${lunarDateTo.convertSolar2Lunar.lunarYearName})`
    dailyReportWorkSheet.getCell('B3').font = { size: defaultFontSize, }
    // Table Head
    const tableHeadSetting = [
      {
        label: 'Hoá đơn', width: 25,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Đơn vị cung cấp', width: 30,
        alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Tên vật tư', width: 30,
        alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Đơn vị tính', width: 15,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Số lượng', width: 15,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Đơn giá', width: 15,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
      {
        label: 'Thành tiền', width: 30,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      },
    ]
    const tableHeadRow = dailyReportWorkSheet.addRow(tableHeadSetting?.map((cell: any) => cell?.label))
    tableHeadRow.eachCell((cell: any, colNumber: number) => {
      cell.font = { size: defaultFontSize, bold: true }
      cell.alignment = tableHeadSetting[colNumber - 1].alignment
      cell.border = tableHeadSetting[colNumber - 1].border
    })
    dailyReportWorkSheet.columns?.forEach((col: any, index: any) => {
      col.width = tableHeadSetting[index]?.width
    })
    // Frozen from A row to E row
    dailyReportWorkSheet.views = [{ state: 'frozen', ySplit: 4, activeCell: 'A1' }];
    // GET DATA
    const exportedData = <any>[]
    const filteredData = this.dienThoPhatMau
      ?.filter((item: any) => new Date(item.logFrom) <= dateRange.dateTo && new Date(item.logFrom) >= dateRange.dateFrom)
      ?.sort((a: any, b: any) => new Date(a?.logFrom) < new Date(b?.logFrom) ? -1 : 1)
    filteredData?.forEach((item: any) => {
      const foundDate = exportedData.find((ed: any) => ed?.logFrom === item.logFrom)
      if (foundDate) {
        foundDate.bills.push(item)
      } else {
        exportedData.push({
          logFrom: item?.logFrom,
          bills: <any>[item]
        })
      }
    })
    exportedData?.forEach((item: any) => {
      // Date Row
      const rowLunarDate = this.calendarService.getConvertedFullDate(new Date(item?.logFrom)).convertSolar2Lunar
      const dateRow = dailyReportWorkSheet.addRow([`Ngày ${this.datePipe.transform(new Date(item?.logFrom), 'dd/MM/YYYY')} (${rowLunarDate.lunarDay}/${rowLunarDate.lunarMonth}/${rowLunarDate.lunarYearName})`])
      if (dateRow?.findCell(1)?.address) {
        const rowNumber = parseInt(dateRow?.findCell(1)?.address?.replace(startCol, '') || '1')
        dailyReportWorkSheet.mergeCells(`${dateRow?.findCell(1)?.address}`, `${endCol}${rowNumber}`)
        dailyReportWorkSheet.getCell(`${dateRow?.findCell(1)?.address}`).font = { bold: true, size: defaultFontSize }
      }
      dateRow.eachCell((cell: any) => {
        cell.border = {
          top: {
            style: 'double',
            color: { argb: '000000' }
          },
          right: {
            style: 'double',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'double',
            color: { argb: '000000' }
          },
          left: {
            style: 'double',
            color: { argb: '000000' }
          },
        }
      })
      // Date Details
      item?.bills?.forEach((billItem: any) => {
        let billRow: any;
        billItem?.materials?.forEach((materialItem: any, materialIndex: any) => {
          const materialRow = dailyReportWorkSheet.addRow([
            '',
            materialItem?.material?.provider || '...',
            materialItem?.material?.name,
            materialItem?.material?.unit,
            materialItem?.number,
            this.currencyPipe.transform(materialItem?.material?.price, 'VND'),
            this.currencyPipe.transform(materialItem?.totalPrice, 'VND'),
          ])
          if (materialIndex === 0) {
            billRow = materialRow?.findCell(1)
          }
          materialRow.eachCell((cell: any, colNumber: number) => {
            cell.font = { size: defaultFontSize }
            cell.alignment = tableHeadSetting[colNumber - 1].alignment
            cell.border = tableHeadSetting[colNumber - 1].border
          })
        });
        const billStartMaterialRow = `${billRow?.address?.match(/\d+/g)}`
        dailyReportWorkSheet.mergeCells(billRow?.address, `${billRow?.address?.replace(billStartMaterialRow, '')}${parseInt(billStartMaterialRow) + billItem?.materials?.length - 1}`)
        dailyReportWorkSheet.getCell(billRow?.address).value = billItem?.id
        dailyReportWorkSheet.getCell(billRow?.address).alignment = { horizontal: 'center', vertical: 'middle' }
        dailyReportWorkSheet.getCell(billRow?.address).font = { size: defaultFontSize }
      })
      const totalPriceDate = item?.bills?.map((bi: any) => bi?.billToTalPrice)?.reduce((a: any, b: any) => a + b, 0)
      item.totalPriceDate = totalPriceDate
      const totalDateRow = dailyReportWorkSheet.addRow([
        'Tổng cộng:'
      ])
      totalDateRow.font = { size: defaultFontSize, bold: true }
      totalDateRow.alignment = { horizontal: 'right' }
      dailyReportWorkSheet.mergeCells(`${totalDateRow.findCell(1)?.address}`, `${String.fromCharCode(colCount - 1 + 'A'.charCodeAt(0))}${totalDateRow.findCell(1)?.address?.match(/\d+/g)}`)
      dailyReportWorkSheet.getCell(`${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${totalDateRow.findCell(1)?.address?.match(/\d+/g)}`).value = this.currencyPipe.transform(totalPriceDate, 'VND')
      totalDateRow.eachCell((cell: any) => {
        cell.border = {
          top: {
            style: 'thin',
            color: { argb: '000000' }
          },
          right: {
            style: 'thin',
            color: { argb: '000000' }
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' }
          },
          left: {
            style: 'thin',
            color: { argb: '000000' }
          },
        }
      })
    })
    const reportTotalPriceRow = dailyReportWorkSheet.addRow([
      'TỔNG CỘNG',
    ])
    dailyReportWorkSheet.mergeCells(`${reportTotalPriceRow.findCell(1)?.address}`, `${String.fromCharCode(colCount - 1 + 'A'.charCodeAt(0))}${reportTotalPriceRow.findCell(1)?.address?.match(/\d+/g)}`)
    dailyReportWorkSheet.getCell(`${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${reportTotalPriceRow.findCell(1)?.address?.match(/\d+/g)}`).value = this.currencyPipe.transform(exportedData?.map((ed: any) => ed?.totalPriceDate).reduce((a: any, b: any) => a + b, 0), 'VND')
    reportTotalPriceRow.font = { bold: true, size: 18 }
    reportTotalPriceRow.alignment = { horizontal: 'right' }
    reportTotalPriceRow.eachCell((cell: any) => {
      cell.border = {
        top: {
          style: 'thin',
          color: { argb: '000000' }
        },
      }
    })
    // pageSetup
    dailyReportWorkSheet.pageSetup = {
      fitToPage: true,
      fitToHeight: colCount + 1, // plus 1 because index from 1
      paperSize: 9,
      margins: {
        top: 0.64,
        left: 0.64,
        bottom: 0.64,
        right: 0.64,
        header: 0.64,
        footer: 0.64,
      }
    }
  }
}
