import { Injectable } from '@angular/core';
import { SheetService } from '../sheet/sheet.service';
import { observable, Observable } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CalendarService } from '../calendar/calendar.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

@Injectable({
  providedIn: 'root',
})
export class DienThoPhatMauService {
  readonly EXCEL_TYPE =
    'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet;charset=UTF-8';
  readonly EXCEL_EXTENSION = '.xlsx';
  readonly sheetId = `2PACX-1vR7KmDI0VFeL7oqXTNvj4OMS0qk9-oebKYLvZRxDujPS5FcSCGRSiODep9FGkCDu6SpAer8_ZYnMSUR`;
  readonly dienThoPhatMauWorkbook: any;
  readonly dienThoPhatMau: any;
  readonly dienThoPhatMauSetting = <any>{};

  constructor(
    private sheetService: SheetService,
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private currencyPipe: CurrencyPipe
  ) {}

  fetchDienThoPhatMauData(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{};
        this.sheetService
          .decodeRawSheetData(ref.dienThoPhatMauWorkbook.Sheets['database'])
          .subscribe((res: any) => {
            const settings = res?.filter(
              (item: any) => item?.Timestamp === 'setting'
            );
            const dienThoPhatMauSetting = <any>{};
            settings.forEach((item: any) => {
              dienThoPhatMauSetting[item?.logFrom] = item?.data;
            });
            let price = <any>[];
            let bill = <any>[];
            let data = <any>[];
            const addBill = (billInfo: any) => {
              bill.push(billInfo);
            };
            const updateBill = (billInfo: any) => {
              const foundBillIndex = bill.indexOf(
                bill?.find((v: any) => v?.key == billInfo?.key)
              );
              bill[foundBillIndex] = billInfo;
            };
            const deleteBill = (billInfo: any) => {
              const foundBillIndex = bill.indexOf(
                bill?.find((v: any) => v?.key == billInfo?.key)
              );
              bill[foundBillIndex] = null;
              bill = bill?.filter((v: any) => !!v);
            };
            const addPrice = (priceInfo: any) => {
              price.push(priceInfo);
            };
            const updatePrice = (priceInfo: any) => {
              const foundPriceIndex = price.indexOf(
                price?.find((v: any) => v?.key == priceInfo?.key)
              );
              price[foundPriceIndex] = priceInfo;
            };
            const deletePrice = (priceInfo: any) => {
              const foundPriceIndex = price.indexOf(
                price?.find((v: any) => v?.key == priceInfo?.key)
              );
              price[foundPriceIndex] = null;
              price = price?.filter((v: any) => !!v);
            };
            let history = <any>[]
            res?.forEach((item: any, resIndex: any) => {
              if (item?.Timestamp != 'setting') {
                if (!price) {
                  price = <any>[];
                }
                history?.push(item)
                const dataRow = JSON.parse(item.data);

                if (dataRow?.length == 1) {
                  dataRow?.forEach((dr: any, dataRowIndex: any) => {
                    if (dr?.key) {
                      switch (dr?.key) {
                        case 'price':
                          let priceData: any = <any>{};
                          priceData = { ...priceData, ...dr?.data };
                          priceData.updatedBy = item?.updatedBy;
                          priceData.logFrom = item?.logFrom;
                          addPrice(priceData);
                          break;
                        case 'bill':
                          let billData: any = <any>{};
                          billData = { ...billData, ...dr?.data };
                          billData.updatedBy = item?.updatedBy;
                          billData.logFrom = item?.logFrom;
                          billData?.materials?.forEach((bd: any) => {
                            const foundPriceMaterial = price?.filter(
                              (v: any) => v?.key === bd?.material
                            );
                            bd.materialObject =
                              foundPriceMaterial[
                                foundPriceMaterial?.length - 1
                              ];
                            bd.totalPrice =
                              parseFloat(bd.materialObject?.price) *
                              parseFloat(bd?.number);
                          });
                          addBill(billData);
                          break;
                        case 'delete-bill':
                          let deletedBillData: any = <any>{};
                          deletedBillData = {
                            ...deletedBillData,
                            ...dr?.data,
                          };
                          deletedBillData.updatedBy = item?.updatedBy;
                          deletedBillData.logFrom = item?.logFrom;
                          deleteBill(deletedBillData);
                          break;
                        case 'delete-price':
                          let deletedPriceData: any = <any>{};
                          deletedPriceData = {
                            ...deletedPriceData,
                            ...dr?.data,
                          };
                          deletedPriceData.updatedBy = item?.updatedBy;
                          deletedPriceData.logFrom = item?.logFrom;
                          deletePrice(deletedPriceData);
                          break;
                        case 'update-price':
                          let updatedPriceData: any = <any>{};
                          updatedPriceData = {
                            ...updatedPriceData,
                            ...dr?.data,
                          };
                          updatedPriceData.updatedBy = item?.updatedBy;
                          updatedPriceData.logFrom = item?.logFrom;
                          updatePrice(updatedPriceData);
                          break;
                        case 'update-bill':
                          let updatedBillData: any = <any>{};
                          updatedBillData = {
                            ...updatedBillData,
                            ...dr?.data,
                          };
                          updatedBillData.updatedBy = item?.updatedBy;
                          updatedBillData.logFrom = item?.logFrom;
                          updateBill(updatedBillData);
                          break;
                      }
                    }
                  });
                }
                if (dataRow?.length > 1) {
                  let billDataList: any = <any>[];
                  let priceDataList: any = <any>[];
                  let deletedBillDataList: any = <any>[];
                  let deletedPriceDataList: any = <any>[];
                  let updatedPriceDataList: any = <any>[];
                  let updatedBillDataList: any = <any>[];
                  dataRow?.forEach((dr: any, dataRowIndex: any) => {
                    if (dr?.key) {
                      switch (dr?.key) {
                        case 'price':
                          let priceData: any = <any>{};
                          priceData = { ...priceData, ...dr?.data };
                          priceData.updatedBy = item?.updatedBy;
                          priceData.logFrom = item?.logFrom;
                          priceDataList.push(priceData);
                          break;
                        case 'bill':
                          let billData: any = <any>{};
                          billData = { ...billData, ...dr?.data };
                          billData.updatedBy = item?.updatedBy;
                          billData.logFrom = item?.logFrom;
                          billData?.materials?.forEach((bd: any) => {
                            const foundPriceMaterial = price?.filter(
                              (v: any) => v?.key == bd?.material
                            );
                            bd.materialObject =
                              foundPriceMaterial[
                                foundPriceMaterial?.length - 1
                              ];
                            if (
                              parseFloat(
                                bd.materialObject?.price
                              )?.toString() !== 'NaN' &&
                              parseFloat(bd?.number)?.toString() !== 'NaN'
                            ) {
                              bd.totalPrice =
                                parseFloat(bd.materialObject?.price) *
                                parseFloat(bd?.number);
                            }
                          });
                          billDataList.push(billData);
                          break;
                        case 'delete-bill':
                          let deletedBillData: any = <any>{};
                          deletedBillData = {
                            ...deletedBillData,
                            ...dr?.data,
                          };
                          deletedBillData.updatedBy = item?.updatedBy;
                          deletedBillData.logFrom = item?.logFrom;
                          deleteBill(deletedBillData);
                          break;
                        case 'delete-price':
                          let deletedPriceData: any = <any>{};
                          deletedPriceData = {
                            ...deletedPriceData,
                            ...dr?.data,
                          };
                          deletedPriceData.updatedBy = item?.updatedBy;
                          deletedPriceData.logFrom = item?.logFrom;
                          deletePrice(deletedPriceData);
                          break;
                        case 'update-price':
                          let updatedPriceData: any = <any>{};
                          updatedPriceData = {
                            ...updatedPriceData,
                            ...dr?.data,
                          };
                          updatedPriceData.updatedBy = item?.updatedBy;
                          updatedPriceData.logFrom = item?.logFrom;
                          updatePrice(updatedPriceData);
                          if (billDataList?.length > 0) {
                            billDataList[0].materials?.forEach((blm: any) => {
                              if (updatedPriceData?.key == blm.material) {
                                blm.materialObject = JSON.parse(
                                  JSON.stringify(updatedPriceData)
                                );
                              }

                              if (
                                parseFloat(
                                  blm.materialObject?.price
                                )?.toString() !== 'NaN' &&
                                parseFloat(blm?.number)?.toString() !== 'NaN'
                              ) {
                                blm.totalPrice =
                                  parseFloat(blm.materialObject?.price) *
                                  parseFloat(blm?.number);
                              }
                            });
                            addBill(billDataList[0]);
                          }
                          if (updatedBillDataList?.length > 0) {
                            updatedBillDataList[0].materials?.forEach(
                              (blm: any) => {
                                if (updatedPriceData?.key == blm.material) {
                                  blm.materialObject = JSON.parse(
                                    JSON.stringify(updatedPriceData)
                                  );
                                }
                              }
                            );
                            updateBill(updatedBillDataList[0]);
                          }
                          break;
                        case 'update-bill':
                          let updatedBillData: any = <any>{};
                          updatedBillData = {
                            ...updatedBillData,
                            ...dr?.data,
                          };
                          updatedBillData.updatedBy = item?.updatedBy;
                          updatedBillData.logFrom = item?.logFrom;
                          updatedBillDataList.push(updatedBillData);
                          break;
                      }
                    }
                  });
                }
              }
            });
            data = bill;

            response.status = 200;
            response.data = data;
            response.history = history;
            response.price = price;
            ref.dienThoPhatMauSetting = dienThoPhatMauSetting;
            ref.dienThoPhatMau = data;
            response.setting = dienThoPhatMauSetting;
            observable.next(response);
            observable.complete();
          });
      };
      if (!ref.dienThoPhatMauWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId).subscribe((res: any) => {
            if (res.status == 200) {
              if (res?.workbook) {
                ref.dienThoPhatMauWorkbook = res?.workbook;
                returnData();
              }
            }
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData();
      }
    });
  }

  exportToExcel(exportData: any): Observable<any> {
    console.log(exportData);

    return new Observable((observable: any) => {
      const dienThoPhatMauExportedWorkbook = new Workbook();
      this.materialImportSummaryReportWorkSheet(
        dienThoPhatMauExportedWorkbook,
        exportData
      );
      this.materialTypeSheet(dienThoPhatMauExportedWorkbook, exportData);

      // DOWNLOAD FILE
      dienThoPhatMauExportedWorkbook.xlsx.writeBuffer().then((data: any) => {
        const blob = new Blob([data], { type: this.EXCEL_TYPE });
        fs.saveAs(
          blob,
          `${this.datePipe.transform(
            exportData.dateFrom,
            'dd-MM-yy'
          )}_${this.datePipe.transform(exportData.dateTo, 'dd-MM-yy')}${
            this.EXCEL_EXTENSION
          }`
        );
        const response = {
          code: 200,
        };
        observable.next(response);
        observable.complete();
      });
    });
  }

  materialImportSummaryReportWorkSheet(
    dienThoPhatMauExportedWorkbook: Workbook,
    exportData: any
  ) {
    const sheetLabel = `CHI TIẾT (${this.datePipe.transform(
      exportData.dateFrom,
      'dd-MM-YY'
    )}-${this.datePipe.transform(exportData.dateTo, 'dd-MM-YY')})`;
    const startCol = `A`;
    const defaultFontSize = 14;
    const colCount = 6 - 1; // minus 1 because index from 0
    const endCol = String.fromCharCode(colCount + 'A'.charCodeAt(0));
    const dailyReportWorkSheet =
      dienThoPhatMauExportedWorkbook.addWorksheet(sheetLabel);
    // REPORT TITLE
    dailyReportWorkSheet.mergeCells(`${startCol}1:${endCol}1`);
    dailyReportWorkSheet.getCell('A1').value = 'BÁO CÁO NHẬP VẬT TƯ CHI TIẾT';
    dailyReportWorkSheet.getCell('A1').alignment = { horizontal: 'center' };
    dailyReportWorkSheet.getCell('A1').font = { size: 18, bold: true };
    // Date Range
    const lunarDateFrom = this.calendarService.getConvertedFullDate(
      exportData.dateFrom
    );
    dailyReportWorkSheet.getCell('A2').value = `Từ ngày: `;
    dailyReportWorkSheet.getCell('A2').font = {
      size: defaultFontSize,
      bold: true,
    };
    dailyReportWorkSheet.getCell('B2').value = `${this.datePipe.transform(
      exportData.dateFrom,
      'dd-MM-YYYY'
    )} (${lunarDateFrom.convertSolar2Lunar.lunarDay}-${
      lunarDateFrom.convertSolar2Lunar.lunarMonth
    }-${lunarDateFrom.convertSolar2Lunar.lunarYearName})`;
    dailyReportWorkSheet.getCell('B2').font = { size: defaultFontSize };
    const lunarDateTo = this.calendarService.getConvertedFullDate(
      exportData.dateTo
    );
    dailyReportWorkSheet.getCell('A3').value = `Đến ngày: `;
    dailyReportWorkSheet.getCell('A3').font = {
      size: defaultFontSize,
      bold: true,
    };
    dailyReportWorkSheet.getCell('B3').value = `${this.datePipe.transform(
      exportData.dateTo,
      'dd-MM-YYYY'
    )} (${lunarDateTo.convertSolar2Lunar.lunarDay}-${
      lunarDateTo.convertSolar2Lunar.lunarMonth
    }-${lunarDateTo.convertSolar2Lunar.lunarYearName})`;
    dailyReportWorkSheet.getCell('B3').font = { size: defaultFontSize };
    // Table Head
    const tableHeadSetting = [
      {
        label: 'Hoá đơn',
        width: 25,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Tên vật tư',
        width: 30,
        alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Số lượng',
        width: 15,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Đơn vị tính',
        width: 15,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Đơn giá',
        width: 15,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Thành tiền',
        width: 30,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
    ];
    const tableHeadRow = dailyReportWorkSheet.addRow(
      tableHeadSetting?.map((cell: any) => cell?.label)
    );
    tableHeadRow.eachCell((cell: any, colNumber: number) => {
      cell.font = { size: defaultFontSize, bold: true };
      cell.alignment = tableHeadSetting[colNumber - 1].alignment;
      cell.border = tableHeadSetting[colNumber - 1].border;
    });
    dailyReportWorkSheet.columns?.forEach((col: any, index: any) => {
      col.width = tableHeadSetting[index]?.width;
    });
    // Frozen from A row to E row
    dailyReportWorkSheet.views = [
      { state: 'frozen', ySplit: 4, activeCell: 'A1' },
    ];
    // GET DATA
    exportData?.materialImportSummarySheet?.materialImportSummaryData?.forEach(
      (item: any) => {
        // Date Row
        const rowLunarDate = this.calendarService.getConvertedFullDate(
          new Date(item?.logFrom)
        ).convertSolar2Lunar;
        const dateRow = dailyReportWorkSheet.addRow([
          `Ngày ${this.datePipe.transform(
            new Date(item?.logFrom),
            'dd/MM/YYYY'
          )} (${rowLunarDate.lunarDay}/${rowLunarDate.lunarMonth}/${
            rowLunarDate.lunarYearName
          })`,
        ]);
        if (dateRow?.findCell(1)?.address) {
          const rowNumber = parseInt(
            dateRow?.findCell(1)?.address?.replace(startCol, '') || '1'
          );
          dailyReportWorkSheet.mergeCells(
            `${dateRow?.findCell(1)?.address}`,
            `${endCol}${rowNumber}`
          );
          dailyReportWorkSheet.getCell(
            `${dateRow?.findCell(1)?.address}`
          ).font = { bold: true, size: defaultFontSize };
        }
        dateRow.eachCell((cell: any) => {
          cell.border = {
            top: {
              style: 'double',
              color: { argb: '000000' },
            },
            right: {
              style: 'double',
              color: { argb: '000000' },
            },
            bottom: {
              style: 'double',
              color: { argb: '000000' },
            },
            left: {
              style: 'double',
              color: { argb: '000000' },
            },
          };
        });
        // Date Details
        item?.bills?.forEach((billItem: any) => {
          let billRow: any;
          billItem?.materials?.forEach(
            (materialItem: any, materialIndex: any) => {
              const materialRow = dailyReportWorkSheet.addRow([
                '',
                materialItem?.material?.name,
                parseFloat(materialItem?.number),
                materialItem?.material?.unit,
                parseFloat(materialItem?.material?.price),
                parseFloat(materialItem?.totalPrice),
              ]);
              dailyReportWorkSheet.getColumn(3).numFmt = '#,##0.00';
              dailyReportWorkSheet.getColumn(5).numFmt = '[$-vi-VN]#,##0';
              dailyReportWorkSheet.getColumn(6).numFmt = '[$-vi-VN]#,##0';
              if (materialIndex === 0) {
                billRow = materialRow?.findCell(1);
              }
              materialRow.eachCell((cell: any, colNumber: number) => {
                cell.font = { size: defaultFontSize };
                cell.alignment = tableHeadSetting[colNumber - 1].alignment;
                cell.border = tableHeadSetting[colNumber - 1].border;
              });
            }
          );
          const billStartMaterialRow = `${billRow?.address?.match(/\d+/g)}`;
          dailyReportWorkSheet.mergeCells(
            billRow?.address,
            `${billRow?.address?.replace(billStartMaterialRow, '')}${
              parseInt(billStartMaterialRow) + billItem?.materials?.length - 1
            }`
          );
          dailyReportWorkSheet.getCell(billRow?.address).value = billItem?.id;
          dailyReportWorkSheet.getCell(billRow?.address).alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          dailyReportWorkSheet.getCell(billRow?.address).font = {
            size: defaultFontSize,
          };
        });
        const totalDateRow = dailyReportWorkSheet.addRow(['Tổng cộng:']);
        totalDateRow.font = { size: defaultFontSize, bold: true };
        totalDateRow.alignment = { horizontal: 'right' };
        dailyReportWorkSheet.mergeCells(
          `${totalDateRow.findCell(1)?.address}`,
          `${String.fromCharCode(
            colCount - 1 + 'A'.charCodeAt(0)
          )}${totalDateRow.findCell(1)?.address?.match(/\d+/g)}`
        );
        dailyReportWorkSheet.getCell(
          `${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${totalDateRow
            .findCell(1)
            ?.address?.match(/\d+/g)}`
        ).value = this.currencyPipe
          .transform(item.totalPriceDate, 'VND')
          ?.replace('₫', '');
        totalDateRow.eachCell((cell: any) => {
          cell.border = {
            top: {
              style: 'thin',
              color: { argb: '000000' },
            },
            right: {
              style: 'thin',
              color: { argb: '000000' },
            },
            bottom: {
              style: 'thin',
              color: { argb: '000000' },
            },
            left: {
              style: 'thin',
              color: { argb: '000000' },
            },
          };
        });
      }
    );
    const reportTotalPriceRow = dailyReportWorkSheet.addRow(['TỔNG CỘNG']);
    dailyReportWorkSheet.mergeCells(
      `${reportTotalPriceRow.findCell(1)?.address}`,
      `${String.fromCharCode(
        colCount - 1 + 'A'.charCodeAt(0)
      )}${reportTotalPriceRow.findCell(1)?.address?.match(/\d+/g)}`
    );
    dailyReportWorkSheet.getCell(
      `${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${reportTotalPriceRow
        .findCell(1)
        ?.address?.match(/\d+/g)}`
    ).value = this.currencyPipe
      .transform(
        exportData?.materialImportSummarySheet?.materialImportSummaryData
          ?.map((ed: any) => ed?.totalPriceDate)
          .reduce((a: any, b: any) => a + b, 0),
        'VND'
      )
      ?.replace('₫', '');
    reportTotalPriceRow.font = { bold: true, size: 18 };
    reportTotalPriceRow.alignment = { horizontal: 'right' };
    reportTotalPriceRow.eachCell((cell: any) => {
      cell.border = {
        top: {
          style: 'thin',
          color: { argb: '000000' },
        },
      };
    });
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
      },
    };
  }

  materialTypeSheet(dienThoPhatMauExportedWorkbook: Workbook, exportData: any) {
    const sheetLabel = `LOẠI VẬT TƯ (${this.datePipe.transform(
      exportData.dateFrom,
      'dd-MM-YY'
    )}-${this.datePipe.transform(exportData.dateTo, 'dd-MM-YY')})`;
    const startCol = `A`;
    const defaultFontSize = 14;
    const colCount = 5 - 1; // minus 1 because index from 0
    const endCol = String.fromCharCode(colCount + 'A'.charCodeAt(0));
    const materialReportWorkSheet =
      dienThoPhatMauExportedWorkbook.addWorksheet(sheetLabel);
    // REPORT TITLE
    materialReportWorkSheet.mergeCells(`${startCol}1:${endCol}1`);
    materialReportWorkSheet.getCell('A1').value = 'BÁO CÁO LOẠI VẬT TƯ';
    materialReportWorkSheet.getCell('A1').alignment = { horizontal: 'center' };
    materialReportWorkSheet.getCell('A1').font = { size: 18, bold: true };
    // Date Range
    const lunarDateFrom = this.calendarService.getConvertedFullDate(
      exportData.dateFrom
    );
    materialReportWorkSheet.getCell('A2').value = `Từ ngày: `;
    materialReportWorkSheet.getCell('A2').font = {
      size: defaultFontSize,
      bold: true,
    };
    materialReportWorkSheet.getCell('B2').value = `${this.datePipe.transform(
      exportData.dateFrom,
      'dd-MM-YYYY'
    )} (${lunarDateFrom.convertSolar2Lunar.lunarDay}-${
      lunarDateFrom.convertSolar2Lunar.lunarMonth
    }-${lunarDateFrom.convertSolar2Lunar.lunarYearName})`;
    materialReportWorkSheet.getCell('B2').font = { size: defaultFontSize };
    const lunarDateTo = this.calendarService.getConvertedFullDate(
      exportData.dateTo
    );
    materialReportWorkSheet.getCell('A3').value = `Đến ngày: `;
    materialReportWorkSheet.getCell('A3').font = {
      size: defaultFontSize,
      bold: true,
    };
    materialReportWorkSheet.getCell('B3').value = `${this.datePipe.transform(
      exportData.dateTo,
      'dd-MM-YYYY'
    )} (${lunarDateTo.convertSolar2Lunar.lunarDay}-${
      lunarDateTo.convertSolar2Lunar.lunarMonth
    }-${lunarDateTo.convertSolar2Lunar.lunarYearName})`;
    materialReportWorkSheet.getCell('B3').font = { size: defaultFontSize };
    // Table Head
    const tableHeadSetting = [
      {
        label: 'Hoá đơn',
        width: 25,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Ngày',
        width: 20,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Số lượng',
        width: 15,
        alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Đơn giá',
        width: 15,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
      {
        label: 'Thành tiền',
        width: 25,
        alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
        border: {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        },
      },
    ];
    const tableHeadRow = materialReportWorkSheet.addRow(
      tableHeadSetting?.map((cell: any) => cell?.label)
    );
    tableHeadRow.eachCell((cell: any, colNumber: number) => {
      cell.font = { size: defaultFontSize, bold: true };
      cell.alignment = tableHeadSetting[colNumber - 1].alignment;
      cell.border = tableHeadSetting[colNumber - 1].border;
    });
    materialReportWorkSheet.columns?.forEach((col: any, index: any) => {
      col.width = tableHeadSetting[index]?.width;
    });
    // Frozen from A row to E row
    materialReportWorkSheet.views = [
      { state: 'frozen', ySplit: 4, activeCell: 'A1' },
    ];
    // GET DATA
    exportData?.materialTypeSheet?.materialTypeData?.forEach((item: any) => {
      // Date Row
      const dateRow = materialReportWorkSheet.addRow([`${item?.name}`]);
      if (dateRow?.findCell(1)?.address) {
        const rowNumber = parseInt(
          dateRow?.findCell(1)?.address?.replace(startCol, '') || '1'
        );
        materialReportWorkSheet.mergeCells(
          `${dateRow?.findCell(1)?.address}`,
          `${String.fromCharCode(1 + 'A'.charCodeAt(0))}${rowNumber}`
        );
        materialReportWorkSheet.getCell(
          `${dateRow?.findCell(1)?.address}`
        ).font = { bold: true, size: defaultFontSize };
        materialReportWorkSheet.mergeCells(
          `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${rowNumber}`,
          `${endCol}${rowNumber}`
        );
        materialReportWorkSheet.getCell(
          `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${rowNumber}`
        ).value = `Đơn vị tính: ${item?.unit}`;
        materialReportWorkSheet.getCell(
          `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${rowNumber}`
        ).font = { size: 14 };
        materialReportWorkSheet.getCell(
          `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${rowNumber}`
        ).alignment = { vertical: 'middle' };
      }
      dateRow.eachCell((cell: any) => {
        cell.border = {
          top: {
            style: 'double',
            color: { argb: '000000' },
          },
          right: {
            style: 'double',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'double',
            color: { argb: '000000' },
          },
          left: {
            style: 'double',
            color: { argb: '000000' },
          },
        };
      });
      // Date Details
      item?.materialPrice?.forEach((materialPriceItem: any) => {
        const materialPriceRow = materialReportWorkSheet.addRow([
          materialPriceItem?.billId,
          this.datePipe.transform(materialPriceItem?.logFrom, 'dd/MM/YYYY'),
          parseFloat(materialPriceItem?.number),
          parseFloat(materialPriceItem?.material?.price),
          parseFloat(materialPriceItem?.totalPrice),
        ]);
        materialReportWorkSheet.getColumn(4).numFmt = '#,##0.00';
        materialReportWorkSheet.getColumn(4).numFmt = '[$-vi-VN]#,##0';
        materialReportWorkSheet.getColumn(5).numFmt = '[$-vi-VN]#,##0';
        materialPriceRow.eachCell((cell: any, colNumber: number) => {
          cell.font = { size: defaultFontSize };
          cell.alignment = tableHeadSetting[colNumber - 1].alignment;
          cell.border = tableHeadSetting[colNumber - 1].border;
        });
      });
      const totalDateRow = materialReportWorkSheet.addRow(['Tổng cộng:']);
      totalDateRow.font = { size: defaultFontSize, bold: true };
      totalDateRow.alignment = { horizontal: 'right' };
      materialReportWorkSheet.mergeCells(
        `${totalDateRow.findCell(1)?.address}`,
        `${String.fromCharCode(1 + 'A'.charCodeAt(0))}${totalDateRow
          .findCell(1)
          ?.address?.match(/\d+/g)}`
      );
      materialReportWorkSheet.getCell(
        `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${totalDateRow
          .findCell(1)
          ?.address?.match(/\d+/g)}`
      ).value = item.totalMaterialCount;
      materialReportWorkSheet.getCell(
        `${String.fromCharCode(2 + 'A'.charCodeAt(0))}${totalDateRow
          .findCell(1)
          ?.address?.match(/\d+/g)}`
      ).alignment = {
        horizontal: 'center',
      };
      materialReportWorkSheet.getCell(
        `${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${totalDateRow
          .findCell(1)
          ?.address?.match(/\d+/g)}`
      ).value = this.currencyPipe
        .transform(item.totalMaterialPrice, 'VND')
        ?.replace('₫', '');
      totalDateRow.eachCell((cell: any) => {
        cell.border = {
          top: {
            style: 'thin',
            color: { argb: '000000' },
          },
          right: {
            style: 'thin',
            color: { argb: '000000' },
          },
          bottom: {
            style: 'thin',
            color: { argb: '000000' },
          },
          left: {
            style: 'thin',
            color: { argb: '000000' },
          },
        };
      });
    });
    const reportTotalPriceRow = materialReportWorkSheet.addRow(['TỔNG CỘNG']);
    materialReportWorkSheet.mergeCells(
      `${reportTotalPriceRow.findCell(1)?.address}`,
      `${String.fromCharCode(
        colCount - 1 + 'A'.charCodeAt(0)
      )}${reportTotalPriceRow.findCell(1)?.address?.match(/\d+/g)}`
    );
    materialReportWorkSheet.getCell(
      `${String.fromCharCode(colCount + 'A'.charCodeAt(0))}${reportTotalPriceRow
        .findCell(1)
        ?.address?.match(/\d+/g)}`
    ).value = this.currencyPipe
      .transform(
        exportData?.materialImportSummarySheet?.materialImportSummaryData
          ?.map((ed: any) => ed?.totalPriceDate)
          .reduce((a: any, b: any) => a + b, 0),
        'VND'
      )
      ?.replace('₫', '');
    reportTotalPriceRow.font = { bold: true, size: 18 };
    reportTotalPriceRow.alignment = { horizontal: 'right' };
    reportTotalPriceRow.eachCell((cell: any) => {
      cell.border = {
        top: {
          style: 'thin',
          color: { argb: '000000' },
        },
      };
    });
    // pageSetup
    materialReportWorkSheet.pageSetup = {
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
      },
    };
  }
}
