"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[592],{5484:(M,P,g)=>{g.d(P,{T:()=>h,TB:()=>p});var w=g(4650),v=g(529);class p{constructor(a){this.http=a}getJSON(a){return this.http.get(`assets/documents/${a}.json`)}onChangeContent(a){this.renderedDocumentContent=void 0;let t=[],S=[],o="",i="",c="",d="",r=[],m=0;const f=e=>{e?.childNodes?.forEach((n,s)=>{"#comment"!==n?.nodeName&&("CP-CONTENT-EDITOR"===n?.nodeName&&(o=n?.parentNode?.id,f(n)),"P"===n?.nodeName&&(i=`${o}-${s}`,C(n)),"SPAN"===n?.nodeName&&N(n),"#text"===n?.nodeName&&E(n),"DIV"===n?.nodeName&&n?.classList?.contains("targetContent")&&D(n,s),"DIV"===n?.nodeName&&n?.classList?.contains("sourceContent")&&(x(n),c="",m=[...new Set(n?.parentNode?.childNodes)].filter(y=>"#comment"!==y?.nodeName&&"DIV"!==y?.nodeName)?.length))})},x=e=>{f(e)},D=(e,l)=>{let n=e?.id?.split("_"),s=new k;s.key=`${n[0]}-${l}`,s.type="sourceCotnent",s.targetDocumentKey=n[0],s.targetContentKey=n[1],t.push(s),c=s.key,d=s.key,f(e)},C=e=>{let l=new k;l.key=i,l.type="paragraph",!Object.values(e?.style).every(s=>!s)&&(l.attrs=_(e)),e?.parentNode?.parentNode?.classList?.contains("targetContent")?S.push(l):c||d?t?.find(s=>s?.key===c)?.content?.push(l):t.push(l),f(e)},N=e=>{let l=t?.find(y=>y?.key===i),n=new k;n.type="text",n.text=e?.innerHTML,!Object.values(e?.style).every(y=>!y)&&(n.attrs=_(e)),c||d?(S?.find(y=>y?.key===i)&&r.push(i),t?.find(y=>y?.key===c)?.content?.find(y=>y?.key===i)?.content?.push(u(n)),S?.find(y=>y?.key===i)?.content?.push(u(n)),[...new Set(r)].length===m&&(d="")):l?.content?.push(u(n))},E=e=>{let l=t?.find(s=>s?.key===i),n=new k;n.type="text",n.text=e?.data,c||d?(S?.find(s=>s?.key===i)&&r.push(i),t?.find(s=>s?.key===c)?.content?.find(s=>s?.key===i)?.content?.push(u(n)),S?.find(s=>s?.key===i)?.content?.push(u(n)),[...new Set(r)].length===m&&(d="")):l?.content?.push(u(n))},_=e=>{let l=new L;return l.color=e?.style?.color,l.fontSize=e?.style?.fontSize,l.fontStyle=e?.style?.fontStyle,l.fontWeight=e?.style?.fontWeight,l.textDecoration=e?.style?.textDecoration,l.textIndent=e?.style?.textIndent,l.textAlign=e?.style?.textAlign,u(l)},u=e=>{for(let l in e){let n=e[l];(!n||0===n?.length)&&delete e[l]}return e};f(a?.target),this.renderedDocumentContent=t}onChangeStyle(a){if(window.getSelection){let t=null;t=window.getSelection();let S,o=t?.focusNode?.parentElement,i=window.getSelection()?.toString(),c="";o?.childNodes?.forEach(e=>{"#comment"!==e?.nodeName&&(c+="#text"===e?.nodeName?e?.data:e?.outerHTML)});let D,C,d=document.createElement("SPAN"),r=document.createElement("SPAN"),m=document.createElement("SPAN"),f=document.createElement("P"),x=`${i}`;i&&(D=`${c?.split(i)[0]}`,C=`${c?.split(i)[1]}`);const N=e=>{o?.style?.fontWeight&&(e.style.fontWeight=o?.style?.fontWeight),o?.style?.color&&(e.style.color=o?.style?.color),o?.style?.textIndent&&(e.style.textIndent=o?.style?.textIndent),o?.style?.textAlign&&(e.style.textAlign=o?.style?.textAlign),o?.style?.textDecoration&&(e.style.textDecoration=o?.style?.textDecoration),o?.style?.fontSize&&(e.style.fontSize=o?.style?.fontSize),o?.style?.fontStyle&&(e.style.fontStyle=o?.style?.fontStyle)};N(d),N(r),N(m),N(f);const E=e=>{Number(e?.style?.fontWeight)>400||"bold"===e?.style?.fontWeight||"bolder"===e?.style?.fontWeight?r.style.removeProperty("font-weight"):r.style.fontWeight="bold"},_=e=>{"italic"===e?.style?.fontStyle?r.style.removeProperty("font-style"):r.style.fontStyle="italic"},u=e=>{"underline"===e?.style?.textDecoration?r.style.removeProperty("text-decoration"):r.style.textDecoration="underline"};if(t?.rangeCount){switch(S=t.getRangeAt(0),a?.type){case"fontWeight":E(o);break;case"fontStyle":_(o);break;case"textDecoration":u(o)}let e="";D&&(/<\/?[a-z][\s\S]*>/i.test(D)?e+=d:(d.appendChild(document.createTextNode(D)),e+=d?.outerHTML)),x&&(/<\/?[a-z][\s\S]*>/i.test(x)?e+=r:(r.appendChild(document.createTextNode(x)),e+=r?.outerHTML)),C&&(/<\/?[a-z][\s\S]*>/i.test(C)?e+=C:(m.appendChild(document.createTextNode(C)),e+=m?.outerHTML)),f.innerHTML=e,o&&("SPAN"===o?.nodeName?o.outerHTML=e:"DIV"!==o?.nodeName&&(o.outerHTML=f.outerHTML))}}}onSaveDocument(a){return this.savedDocument=new h,this.savedDocument._id=a?._id,this.savedDocument.key=a?.key,this.savedDocument.content=this.renderedDocumentContent,this.savedDocument.formGroup=a?.formGroup,this.savedDocument.documentKey=a?.documentKey,this.savedDocument}generatedSlug(a){let t;return t=a?.toLowerCase(),t=t?.replace(/\xe1|\xe0|\u1ea3|\u1ea1|\xe3|\u0103|\u1eaf|\u1eb1|\u1eb3|\u1eb5|\u1eb7|\xe2|\u1ea5|\u1ea7|\u1ea9|\u1eab|\u1ead/gi,"a"),t=t?.replace(/\xe9|\xe8|\u1ebb|\u1ebd|\u1eb9|\xea|\u1ebf|\u1ec1|\u1ec3|\u1ec5|\u1ec7/gi,"e"),t=t?.replace(/i|\xed|\xec|\u1ec9|\u0129|\u1ecb/gi,"i"),t=t?.replace(/\xf3|\xf2|\u1ecf|\xf5|\u1ecd|\xf4|\u1ed1|\u1ed3|\u1ed5|\u1ed7|\u1ed9|\u01a1|\u1edb|\u1edd|\u1edf|\u1ee1|\u1ee3/gi,"o"),t=t?.replace(/\xfa|\xf9|\u1ee7|\u0169|\u1ee5|\u01b0|\u1ee9|\u1eeb|\u1eed|\u1eef|\u1ef1/gi,"u"),t=t?.replace(/\xfd|\u1ef3|\u1ef7|\u1ef9|\u1ef5/gi,"y"),t=t?.replace(/\u0111/gi,"d"),t=t?.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,""),t=t?.replace(/ /gi,"-"),t=t?.replace(/\-\-\-\-\-/gi,"-"),t=t?.replace(/\-\-\-\-/gi,"-"),t=t?.replace(/\-\-\-/gi,"-"),t=t?.replace(/\-\-/gi,"-"),t="@"+t+"@",t=t?.replace(/\@\-|\-\@|\@/gi,""),t}}p.\u0275fac=function(a){return new(a||p)(w.LFG(v.eN))},p.\u0275prov=w.Yz7({token:p,factory:p.\u0275fac,providedIn:"root"});class h{}class k{constructor(){this.content=[]}}class L{}},5191:(M,P,g)=>{g.d(P,{b:()=>p});var w=g(9751),v=g(576);function p(h){return!!h&&(h instanceof w.y||(0,v.m)(h.lift)&&(0,v.m)(h.subscribe))}}}]);