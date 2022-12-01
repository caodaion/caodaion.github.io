import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CaodaionEditorService {
  renderedDocumentContent: any;
  savedDocument!: DocumentModel;

  constructor(private http: HttpClient) {}

  public getJSON(path: any): Observable<any> {
    return this.http.get(`assets/documents/${path}.json`);
  }

  public onChangeContent(event: any) {
    this.renderedDocumentContent = undefined;
    let renderDocumentContent: ContentModel[] = [];
    let sourceDocumentContent: ContentModel[] = [];
    let focusedDocumentKey = '';
    let focusedContentKey = '';
    let sourceDocumentKey = '';
    let backupSourceDocumentKey = '';
    let sourceIds = <any>[];
    let breakSource = 0;
    const getNode = (insertedNode: any) => {
      let childNodes = insertedNode?.childNodes;
      childNodes?.forEach((node: any, index: any) => {
        if (node?.nodeName !== '#comment') {
          if (node?.nodeName === 'CP-CONTENT-EDITOR') {
            focusedDocumentKey = node?.parentNode?.id;
            getNode(node);
          }
          if (node?.nodeName === 'P') {
            focusedContentKey = `${focusedDocumentKey}-${index}`;
            insertParagraph(node);
          }

          if (node?.nodeName === 'SPAN') {
            insertSpan(node);
          }
          if (node?.nodeName === '#text') {
            insertText(node);
          }
          if (
            node?.nodeName === 'DIV' &&
            node?.classList?.contains('targetContent')
          ) {
            insertSourceBlock(node, index);
          }
          if (
            node?.nodeName === 'DIV' &&
            node?.classList?.contains('sourceContent')
          ) {
            insertSouceContent(node);
            sourceDocumentKey = '';
            breakSource = [...new Set(node?.parentNode?.childNodes)]?.filter(
              (item: any) =>
                item?.nodeName !== '#comment' && item?.nodeName !== 'DIV'
            )?.length;
          }
        }
      });
    };

    const insertSouceContent = (node: any) => {
      getNode(node);
    };

    const insertSourceBlock = (node: any, index: number) => {
      let ids = node?.id?.split('_');
      let newSourceContent = new ContentModel();
      newSourceContent.key = `${ids[0]}-${index}`;
      newSourceContent.type = 'sourceCotnent';
      newSourceContent.targetDocumentKey = ids[0];
      newSourceContent.targetContentKey = ids[1];
      renderDocumentContent.push(newSourceContent);
      sourceDocumentKey = newSourceContent.key;
      backupSourceDocumentKey = newSourceContent.key;
      getNode(node);
    };

    const insertParagraph = (node: any) => {
      let newParagraph = new ContentModel();
      newParagraph.key = focusedContentKey;
      newParagraph.type = 'paragraph';
      let validStyle = !Object.values(node?.style).every(
        (style: any) => !style
      );
      if (validStyle) {
        newParagraph.attrs = getNodeStyle(node);
      }
      if (node?.parentNode?.parentNode?.classList?.contains('targetContent')) {
        sourceDocumentContent.push(newParagraph);
      } else {
        if (!sourceDocumentKey && !backupSourceDocumentKey) {
          renderDocumentContent.push(newParagraph);
        } else {
          renderDocumentContent
            ?.find((item: any) => item?.key === sourceDocumentKey)
            ?.content?.push(newParagraph);
        }
      }
      getNode(node);
    };

    const insertSpan = (node: any) => {
      let insertedContent = renderDocumentContent?.find(
        (item: any) => item?.key === focusedContentKey
      );
      let newSpan = new ContentModel();
      newSpan.type = 'text';
      newSpan.text = node?.innerHTML;
      let validStyle = !Object.values(node?.style).every(
        (style: any) => !style
      );
      if (validStyle) {
        newSpan.attrs = getNodeStyle(node);
      }
      if (!sourceDocumentKey && !backupSourceDocumentKey) {
        insertedContent?.content?.push(clearObject(newSpan));
      } else {
        if (
          sourceDocumentContent?.find(
            (item: any) => item?.key === focusedContentKey
          )
        ) {
          sourceIds.push(focusedContentKey);
        }
        renderDocumentContent
          ?.find((item: any) => item?.key === sourceDocumentKey)
          ?.content?.find((item: any) => item?.key === focusedContentKey)
          ?.content?.push(clearObject(newSpan));
        sourceDocumentContent
          ?.find((item: any) => item?.key === focusedContentKey)
          ?.content?.push(clearObject(newSpan));
        if ([...new Set(sourceIds)].length === breakSource) {
          backupSourceDocumentKey = '';
        }
      }
    };

    const insertText = (node: any) => {
      let insertedContent = renderDocumentContent?.find(
        (item: any) => item?.key === focusedContentKey
      );
      let textContent = new ContentModel();
      textContent.type = 'text';
      textContent.text = node?.data;
      if (!sourceDocumentKey && !backupSourceDocumentKey) {
        insertedContent?.content?.push(clearObject(textContent));
      } else {
        if (
          sourceDocumentContent?.find(
            (item: any) => item?.key === focusedContentKey
          )
        ) {
          sourceIds.push(focusedContentKey);
        }
        renderDocumentContent
          ?.find((item: any) => item?.key === sourceDocumentKey)
          ?.content?.find((item: any) => item?.key === focusedContentKey)
          ?.content?.push(clearObject(textContent));
        sourceDocumentContent
          ?.find((item: any) => item?.key === focusedContentKey)
          ?.content?.push(clearObject(textContent));
        if ([...new Set(sourceIds)].length === breakSource) {
          backupSourceDocumentKey = '';
        }
      }
    };

    const getNodeStyle = (node: any) => {
      let style = new StyleModel();
      style.color = node?.style?.color;
      style.fontSize = node?.style?.fontSize;
      style.fontStyle = node?.style?.fontStyle;
      style.fontWeight = node?.style?.fontWeight;
      style.textDecoration = node?.style?.textDecoration;
      style.textIndent = node?.style?.textIndent;
      style.textAlign = node?.style?.textAlign;
      return clearObject(style);
    };

    const clearObject = (object: any) => {
      for (let propertyName in object) {
        let property = object[propertyName];
        if (!property || property?.length === 0) {
          delete object[propertyName];
        }
      }
      return object;
    };
    getNode(event?.target);
    this.renderedDocumentContent = renderDocumentContent;
  }

  public onChangeStyle(attrs: any) {
    if (!!window.getSelection) {
      let windowSelected = null;
      windowSelected = window.getSelection();
      let range;
      let parentNode = windowSelected?.focusNode?.parentElement;
      let selectedText = window.getSelection()?.toString();
      let allSelectedText = '';
      parentNode?.childNodes?.forEach((childNode: any) => {
        if (childNode?.nodeName !== '#comment') {
          if (childNode?.nodeName === '#text') {
            allSelectedText = allSelectedText + childNode?.data;
          } else {
            allSelectedText = allSelectedText + childNode?.outerHTML;
          }
        }
      });
      let newSelectedPrevContent = document.createElement('SPAN');
      let newSelectedContent = document.createElement('SPAN');
      let newSelectedBackContent = document.createElement('SPAN');
      let newParagraph = document.createElement('P');
      let newSelectedText = `${selectedText}`;
      let newSelectedPrevText: any;
      let newSelectedBackText: any;
      if (selectedText) {
        newSelectedPrevText = `${allSelectedText?.split(selectedText)[0]}`;
        newSelectedBackText = `${allSelectedText?.split(selectedText)[1]}`;
      }
      const applyOldStyle = (element: any) => {
        if (!!parentNode?.style?.fontWeight) {
          element.style.fontWeight = parentNode?.style?.fontWeight;
        }
        if (!!parentNode?.style?.color) {
          element.style.color = parentNode?.style?.color;
        }
        if (!!parentNode?.style?.textIndent) {
          element.style.textIndent = parentNode?.style?.textIndent;
        }
        if (!!parentNode?.style?.textAlign) {
          element.style.textAlign = parentNode?.style?.textAlign;
        }
        if (!!parentNode?.style?.textDecoration) {
          element.style.textDecoration = parentNode?.style?.textDecoration;
        }
        if (!!parentNode?.style?.fontSize) {
          element.style.fontSize = parentNode?.style?.fontSize;
        }
        if (!!parentNode?.style?.fontStyle) {
          element.style.fontStyle = parentNode?.style?.fontStyle;
        }
      };
      applyOldStyle(newSelectedPrevContent);
      applyOldStyle(newSelectedContent);
      applyOldStyle(newSelectedBackContent);
      applyOldStyle(newParagraph);

      const applyBold = (element: any) => {
        if (
          Number(element?.style?.fontWeight) > 400 ||
          element?.style?.fontWeight === 'bold' ||
          element?.style?.fontWeight === 'bolder'
        ) {
          newSelectedContent.style.removeProperty('font-weight');
        } else {
          newSelectedContent.style.fontWeight = 'bold';
        }
      };

      const applyStyle = (element: any) => {
        if (element?.style?.fontStyle === 'italic') {
          newSelectedContent.style.removeProperty('font-style');
        } else {
          newSelectedContent.style.fontStyle = 'italic';
        }
      };
      const applyDecoration = (element: any) => {
        if (element?.style?.textDecoration === 'underline') {
          newSelectedContent.style.removeProperty('text-decoration');
        } else {
          newSelectedContent.style.textDecoration = 'underline';
        }
      };

      if (windowSelected?.rangeCount) {
        range = windowSelected.getRangeAt(0);
        switch (attrs?.type) {
          case 'fontWeight':
            applyBold(parentNode);
            break;
          case 'fontStyle':
            applyStyle(parentNode);
            break;
          case 'textDecoration':
            applyDecoration(parentNode);
            break;
        }
        let outerHTML = '';
        if (!!newSelectedPrevText) {
          if (/<\/?[a-z][\s\S]*>/i.test(newSelectedPrevText)) {
            outerHTML += newSelectedPrevContent;
          } else {
            newSelectedPrevContent.appendChild(
              document.createTextNode(newSelectedPrevText)
            );
            outerHTML += newSelectedPrevContent?.outerHTML;
          }
        }
        if (!!newSelectedText) {
          if (/<\/?[a-z][\s\S]*>/i.test(newSelectedText)) {
            outerHTML += newSelectedContent;
          } else {
            newSelectedContent.appendChild(
              document.createTextNode(newSelectedText)
            );
            outerHTML += newSelectedContent?.outerHTML;
          }
        }
        if (!!newSelectedBackText) {
          if (/<\/?[a-z][\s\S]*>/i.test(newSelectedBackText)) {
            outerHTML += newSelectedBackText;
          } else {
            newSelectedBackContent.appendChild(
              document.createTextNode(newSelectedBackText)
            );
            outerHTML += newSelectedBackContent?.outerHTML;
          }
        }
        newParagraph.innerHTML = outerHTML;
        if (parentNode) {
          if (parentNode?.nodeName === 'SPAN') parentNode.outerHTML = outerHTML;
          else if (parentNode?.nodeName !== 'DIV')
            parentNode.outerHTML = newParagraph.outerHTML;
        }
      }
    }
  }

  public onSaveDocument(renderDocument: any) {
    this.savedDocument = new DocumentModel();
    this.savedDocument._id = renderDocument?._id;
    this.savedDocument.key = renderDocument?.key;
    this.savedDocument.content = this.renderedDocumentContent;
    this.savedDocument.formGroup = renderDocument?.formGroup;
    this.savedDocument.documentKey = renderDocument?.documentKey;
    return this.savedDocument;
  }

  public generatedSlug(text: any) {
    let slug;
    slug = text?.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug?.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug?.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug?.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug?.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug?.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug?.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug?.replace(/đ/gi, 'd');
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

export class DocumentModel {
  _id?: any;
  key?: any;
  content?: any;
  documentKey?: any;
  formGroup?: any;
  printedAt?: any;
}

export class ContentModel {
  key?: any;
  type?: any;
  content?: ContentModel[] = [];
  targetDocumentKey?: any;
  targetContentKey?: any;
  attrs?: any;
  text?: any;
}

export class StyleModel {
  color?: any;
  fontSize?: any;
  fontStyle?: any;
  fontWeight?: any;
  textDecoration?: any;
  textIndent?: any;
  textAlign?: any;
}
