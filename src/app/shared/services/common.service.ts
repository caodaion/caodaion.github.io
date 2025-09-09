import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  
  /**
   * Converts a number to Vietnamese text representation
   * @param n - The number to convert
   * @param ignoreDeSe - Whether to ignore decimal separators for certain values
   * @param option - Additional options for conversion (e.g., type: 'month' or 'date')
   * @returns The Vietnamese text representation of the number
   */
  convertNumberToText(n: any, ignoreDeSe: boolean = false, option?: any) {
    const convertSplitToText = (num: any) => {
      let lunar = ''
      switch (num) {
        case 1:
          lunar = 'Nhất'
          break;
        case 2:
          lunar = 'Nhị'
          break;
        case 3:
          lunar = 'Tam'
          break;
        case 4:
          lunar = 'Tứ'
          break;
        case 5:
          lunar = 'Ngũ'
          break;
        case 6:
          lunar = 'Lục'
          break;
        case 7:
          lunar = 'Thất'
          break;
        case 8:
          lunar = 'Bát'
          break;
        case 9:
          lunar = 'Cửu'
          break;
        case 10:
          lunar = 'Thập'
          break;
        default:
          break;
      }
      return lunar
    }
    const convertNumber = (n: any) => {
      const decimalSeparator = ['ức', 'thập vạn', 'vạn', 'thiên', 'bá', 'thập']
      const splitValue = n.toString().trim().split('')
      let returnValue = ''
      for (let index = decimalSeparator.length - 1; index >= splitValue.length; index--) {
        decimalSeparator.shift()
      }
      if (splitValue?.length > 1) {
        for (let index = splitValue.length - 1; index >= 0; index--) {
          let item = splitValue[index]
          let value = convertSplitToText(parseInt(item))
          if (ignoreDeSe) {
            value = index < splitValue.length - 1 && item == 1 ? '' : convertSplitToText(parseInt(item)).toLowerCase()
          }
          const noNeedDeSe = !value && !convertSplitToText(parseInt(splitValue[index - 1]))
          returnValue = (index === 0 ? '' : noNeedDeSe ? '' : decimalSeparator[index]) + ' ' + value + ' ' + returnValue
        }
      } else {
        returnValue = option?.type == 'month' && parseInt(splitValue[0]) == 1 ? 'Chánh' : option?.type == 'date' && parseInt(splitValue[0]) < 10 ? 'sơ ' + convertSplitToText(parseInt(splitValue[0])) : convertSplitToText(parseInt(splitValue[0]))
      }
      return returnValue.split(/\s+/).join(' ').trim();
    }
    return convertNumber(n)
  }

  convertDay(day: any): any {
    switch (day.toLowerCase()) {
      case 'sun':
        return 'Chủ Nhật'
      case 'mon':
        return 'Thứ Hai'
      case 'tue':
        return 'Thứ Ba'
      case 'wed':
        return 'Thứ Tư'
      case 'thu':
        return 'Thứ Năm'
      case 'fri':
        return 'Thứ Sáu'
      case 'sat':
        return 'Thứ Bảy'
      default:
        return day
    }
  }

  public generatedSlug(text: any) {
    let slug;
    slug = text?.toString()?.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug?.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|ä|å|ā|ą|ă|ǎ/gi, 'a');
    slug = slug?.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ|ë|ē|ė|ę|ě/gi, 'e');
    slug = slug?.replace(/i|í|ì|ỉ|ĩ|ị|ï|ī|į|ı/gi, 'i');
    slug = slug?.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö|ø|ō|ő/gi, 'o');
    slug = slug?.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|ü|ū|ů|ű|ų/gi, 'u');
    slug = slug?.replace(/ý|ỳ|ỷ|ỹ|ỵ|ÿ/gi, 'y');
    slug = slug?.replace(/đ|ð/gi, 'd');
    slug = slug?.replace(/ñ/gi, 'n');
    slug = slug?.replace(/ç|ć|č/gi, 'c');
    slug = slug?.replace(/ş|š/gi, 's');
    slug = slug?.replace(/ž|ź|ż/gi, 'z');
    //Xóa các ký tự đặt biệt
    slug = slug?.replace(
      /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
      ''
    );
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug?.replace(/ /gi, '-');
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug?.replace(/\-\-\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-\-/gi, '-');
    slug = slug?.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug?.replace(/\@\-|\-\@|\@/gi, '');
    return slug
  }
}