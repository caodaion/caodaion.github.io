"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[826],{1746:(P,x,r)=>{r.d(x,{T:()=>T});var t=r(4650),v=r(9299),h=r(2289),k=r(6895),d=r(2112),g=r(4850),p=r(7392);function m(C,b){if(1&C){const _=t.EpF();t.TgZ(0,"a",2),t.NdJ("click",function(){t.CHM(_);const Z=t.oxw();return t.KtG(Z.onNavigate(Z.prev))}),t.TgZ(1,"div",3)(2,"mat-icon"),t._uU(3,"arrow_back"),t.qZA(),t.TgZ(4,"span"),t._uU(5),t.qZA()()()}if(2&C){const _=t.oxw();t.xp6(5),t.Oqu(null==_.prev?null:_.prev.text)}}function c(C,b){if(1&C){const _=t.EpF();t.TgZ(0,"a",2),t.NdJ("click",function(){t.CHM(_);const Z=t.oxw();return t.KtG(Z.onNavigate(Z.next))}),t.TgZ(1,"div",3)(2,"span"),t._uU(3),t.qZA(),t.TgZ(4,"mat-icon"),t._uU(5,"arrow_forward"),t.qZA()()()}if(2&C){const _=t.oxw();t.xp6(3),t.Oqu(null==_.next?null:_.next.text)}}class T{constructor(b,_,M){this.router=b,this.route=_,this.breakpointObserver=M,this.then=new t.vpe,this.isRequiredHide=!1}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(b=>{this.isRequiredHide=!!b.matches})}onNavigate(b){this.router.navigate([b?.navigate?.link],{queryParams:b?.navigate?.queryParams}).then(()=>{this.isRequiredHide&&localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0})),this.then?.emit()})}}T.\u0275fac=function(b){return new(b||T)(t.Y36(v.F0),t.Y36(v.gz),t.Y36(h.Yg))},T.\u0275cmp=t.Xpm({type:T,selectors:[["app-bottom-navigator"]],inputs:{prev:"prev",next:"next"},outputs:{then:"then"},decls:4,vars:2,consts:[[1,"bottom-navbar","d-flex"],["mat-list-item","",3,"click",4,"ngIf"],["mat-list-item","",3,"click"],[1,"w-100","d-flex","justify-content-center","align-items-center"]],template:function(b,_){1&b&&(t._UZ(0,"mat-divider"),t.TgZ(1,"mat-nav-list",0),t.YNc(2,m,6,1,"a",1),t.YNc(3,c,6,1,"a",1),t.qZA()),2&b&&(t.xp6(2),t.Q6J("ngIf","/"!==(null==_.prev||null==_.prev.navigate?null:_.prev.navigate.link)),t.xp6(1),t.Q6J("ngIf","/"!==(null==_.next||null==_.next.navigate?null:_.next.navigate.link)))},dependencies:[k.O5,d.U,d.oh,g.d,p.Hw],styles:[".bottom-navbar{background-color:#f6f8fc;display:flex;padding-top:0}  .bottom-navbar .mat-list-item{width:100%}"]})},7726:(P,x,r)=>{r.d(x,{e:()=>g});var t=r(6895),v=r(2112),h=r(7392),k=r(4850),d=r(4650);class g{}g.\u0275fac=function(m){return new(m||g)},g.\u0275mod=d.oAB({type:g}),g.\u0275inj=d.cJS({imports:[t.ez,v.gR,k.t,h.Ps]})},8974:(P,x,r)=>{r.d(x,{S:()=>G});var t=r(4650),v=r(2289),h=r(6256),k=r(9299),d=r(6895),g=r(2972),p=r(7392),m=r(4859),c=r(266),T=r(9549),C=r(284),b=r(4850),_=r(8255),M=r(4006);function Z(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"div",5)(1,"button",2),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.formatContent({fontWeight:"bold"}))}),t.TgZ(2,"mat-icon"),t._uU(3,"format_bold"),t.qZA()(),t._UZ(4,"mat-divider",4),t.qZA()}2&l&&(t.xp6(4),t.Q6J("vertical",!0))}function D(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"div",5)(1,"button",6)(2,"mat-icon"),t._uU(3),t.qZA()(),t.TgZ(4,"mat-menu",null,7)(6,"button",8),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.formatContent({textAlign:"left"}))}),t.TgZ(7,"mat-icon"),t._uU(8,"format_align_left"),t.qZA()(),t.TgZ(9,"button",8),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.formatContent({textAlign:"center"}))}),t.TgZ(10,"mat-icon"),t._uU(11,"format_align_center"),t.qZA()(),t.TgZ(12,"button",8),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.formatContent({textAlign:"right"}))}),t.TgZ(13,"mat-icon"),t._uU(14,"format_align_right"),t.qZA()(),t.TgZ(15,"button",8),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.formatContent({textAlign:"justify"}))}),t.TgZ(16,"mat-icon"),t._uU(17,"format_align_justify"),t.qZA()()(),t._UZ(18,"mat-divider",4),t.qZA()}if(2&l){const e=t.MAs(5),a=t.oxw();t.xp6(1),t.Q6J("matMenuTriggerFor",e),t.xp6(2),t.hij("format_align_",a.textAlign,""),t.xp6(3),t.Q6J("disabled","left"==a.textAlign),t.xp6(3),t.Q6J("disabled","center"==a.textAlign),t.xp6(3),t.Q6J("disabled","right"==a.textAlign),t.xp6(3),t.Q6J("disabled","justify"==a.textAlign),t.xp6(3),t.Q6J("vertical",!0)}}function w(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"div",0)(1,"mat-form-field",9)(2,"mat-label"),t._uU(3,"M\xe3 \u0111\u1ecbnh danh"),t.qZA(),t.TgZ(4,"input",10),t.NdJ("blur",function(o){t.CHM(e);const u=t.oxw();return t.KtG(u.changeKey(o))}),t.qZA()(),t.TgZ(5,"mat-form-field",9)(6,"mat-label"),t._uU(7,"Li\xean k\u1ebft \u0111\u1ecbnh danh"),t.qZA(),t.TgZ(8,"input",10),t.NdJ("blur",function(o){t.CHM(e);const u=t.oxw();return t.KtG(u.changeHash(o))}),t.qZA()()()}if(2&l){const e=t.oxw();t.xp6(4),t.Q6J("value",e.data.key),t.xp6(4),t.Q6J("value",e.data.attrs.hash)}}function N(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"div",0)(1,"mat-form-field",9)(2,"mat-label"),t._uU(3,"B\u1eaft \u0111\u1ea7u"),t.qZA(),t.TgZ(4,"input",11),t.NdJ("ngModelChange",function(o){t.CHM(e);const u=t.oxw();return t.KtG(u.data.audio.start=o)}),t.qZA()(),t.TgZ(5,"mat-form-field",9)(6,"mat-label"),t._uU(7,"K\u1ebft th\xfac"),t.qZA(),t.TgZ(8,"input",11),t.NdJ("ngModelChange",function(o){t.CHM(e);const u=t.oxw();return t.KtG(u.data.audio.end=o)}),t.qZA()()()}if(2&l){const e=t.oxw();t.xp6(4),t.Q6J("ngModel",e.data.audio.start),t.xp6(4),t.Q6J("ngModel",e.data.audio.end)}}class A{constructor(){this.isShowSetting=!1,this.isShowAudioTimeStamp=!1,this.textAlign="justify"}ngOnInit(){const n=(a,o)=>{let u;return a.some(y=>u=y.key===o?y:n(y.content||[],o)),u},e=document.getSelection();if("contentBlock"==this.data.type&&e){const a=n(this.data.content,e?.focusNode?.parentNode?.id);a?.attrs&&(this.textAlign=a.attrs.textAlign||"justify")}}formatContent(n){const e=(a,o)=>{let u;return a.some(y=>u=y.key===o?y:e(y.content||[],o)),u};if("bold"==n.fontWeight&&document.execCommand("bold"),n.textAlign){const a=document.getSelection();"contentBlock"==this.data.type&&a&&a.focusNode?.parentNode&&e(this.data.content,a?.focusNode?.parentNode?.id)&&(e(this.data.content,a?.focusNode?.parentNode?.id).attrs||(e(this.data.content,a?.focusNode?.parentNode?.id).attrs={}),e(this.data.content,a?.focusNode?.parentNode?.id).attrs.textAlign=n.textAlign,document.getElementById(a?.focusNode?.parentNode?.id).style.textAlign=n.textAlign||"justify")}}changeKey(n){this.data.key=n.target.value}changeHash(n){this.data.attrs.hash=n.target.value}showAudioTimeStamp(){this.data.audio||(this.data.audio={start:"",end:""}),this.isShowAudioTimeStamp=!this.isShowAudioTimeStamp}changetime(n,e){console.log(n),console.log(e),console.log(this.data.audio)}}function O(l,n){if(1&l&&(t.ynx(0),t._uU(1),t.BQk()),2&l){const e=t.oxw().$implicit;t.xp6(1),t.Oqu(e.text)}}A.\u0275fac=function(n){return new(n||A)},A.\u0275cmp=t.Xpm({type:A,selectors:[["cp-creator-block-toolbar"]],inputs:{data:"data"},decls:12,vars:5,consts:[[1,"d-flex"],["class","text-setting-group d-flex",4,"ngIf"],["mat-icon-button","",3,"click"],["class","d-flex",4,"ngIf"],[3,"vertical"],[1,"text-setting-group","d-flex"],["mat-icon-button","",3,"matMenuTriggerFor"],["alignContentMenu","matMenu"],["mat-menu-item","",3,"disabled","click"],["appearance","fill",1,"setting-form-field"],["matInput","",3,"value","blur"],["matInput","",3,"ngModel","ngModelChange"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t.YNc(1,Z,5,1,"div",1),t.YNc(2,D,19,7,"div",1),t.TgZ(3,"button",2),t.NdJ("click",function(){return e.isShowSetting=!e.isShowSetting}),t.TgZ(4,"mat-icon"),t._uU(5,"settings"),t.qZA()(),t.YNc(6,w,9,2,"div",3),t._UZ(7,"mat-divider",4),t.TgZ(8,"button",2),t.NdJ("click",function(){return e.showAudioTimeStamp()}),t.TgZ(9,"mat-icon"),t._uU(10,"music_note"),t.qZA()(),t.YNc(11,N,9,2,"div",3),t.qZA()),2&n&&(t.xp6(1),t.Q6J("ngIf","contentBlock"==e.data.type),t.xp6(1),t.Q6J("ngIf","contentBlock"==e.data.type),t.xp6(4),t.Q6J("ngIf",e.isShowSetting),t.xp6(1),t.Q6J("vertical",!0),t.xp6(4),t.Q6J("ngIf",e.isShowAudioTimeStamp))},dependencies:[d.O5,m.RK,p.Hw,T.KE,T.hX,C.Nt,b.d,_.VK,_.OP,_.p6,M.Fj,M.JJ,M.On],styles:["cp-creator-block-toolbar{position:absolute;bottom:100%;left:0;background:white;border-radius:4px;box-shadow:0 2px 2px #00000024,0 3px 1px -2px #0000001f,0 1px 5px #0003;padding:.5rem 0}  cp-creator-block-toolbar *{color:#000}  cp-creator-block-toolbar .mat-mdc-form-field-subscript-wrapper{display:none}  cp-creator-block-toolbar .setting-form-field{margin-right:.5rem}  cp-creator-block-toolbar .mat-mdc-icon-button{height:24px;width:24px;padding:0}  cp-creator-block-toolbar .mat-mdc-icon-button .mat-mdc-button-touch-target{height:24px;width:24px}"]});const R=function(l,n,e,a,o,u,y){return{textAlign:l,color:n,fontWeight:e,fontStyle:a,fontSize:o,textDecoration:u,textIndent:y}};function L(l,n){if(1&l&&(t.TgZ(0,"span",8),t._uU(1),t.qZA()),2&l){const e=t.oxw().$implicit;t.Q6J("ngStyle",t.Hh0(2,R,null!=e&&null!=e.attrs&&e.attrs.textAlign?null==e||null==e.attrs?null:e.attrs.textAlign:"jusify",null==e||null==e.attrs?null:e.attrs.color,null==e||null==e.attrs?null:e.attrs.fontWeight,null==e||null==e.attrs?null:e.attrs.fontStyle,null==e||null==e.attrs?null:e.attrs.fontSize,null==e||null==e.attrs?null:e.attrs.textDecoration,null==e||null==e.attrs?null:e.attrs.textIndent)),t.xp6(1),t.Oqu(e.text)}}function $(l,n){if(1&l&&(t.ynx(0),t.YNc(1,O,2,1,"ng-container",6),t.YNc(2,L,2,10,"span",7),t.BQk()),2&l){const e=n.$implicit;t.xp6(1),t.Q6J("ngIf","text"==e.type&&!e.attrs),t.xp6(1),t.Q6J("ngIf","text"==e.type&&e.attrs)}}const Y=function(l,n,e,a,o,u,y){return{textAlign:l,color:n,fontWeight:e,fontStyle:a,fontSize:o,textDecoration:u,textIndent:y,margin:0}};function S(l,n){if(1&l&&(t.TgZ(0,"p",5),t.YNc(1,$,3,2,"ng-container",1),t.qZA()),2&l){const e=t.oxw().$implicit;t.Q6J("id",e.key)("ngStyle",t.Hh0(3,Y,null!=e&&null!=e.attrs&&e.attrs.textAlign?null==e||null==e.attrs?null:e.attrs.textAlign:"jusify",null==e||null==e.attrs?null:e.attrs.color,null==e||null==e.attrs?null:e.attrs.fontWeight,null==e||null==e.attrs?null:e.attrs.fontStyle,null==e||null==e.attrs?null:e.attrs.fontSize,null==e||null==e.attrs?null:e.attrs.textDecoration,null==e||null==e.attrs?null:e.attrs.textIndent)),t.xp6(1),t.Q6J("ngForOf",e.content)}}function f(l,n){if(1&l&&(t.ynx(0),t.YNc(1,S,2,11,"p",4),t.BQk()),2&l){const e=n.$implicit;t.xp6(1),t.Q6J("ngIf","paragraph"==e.type)}}function E(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"button",9),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.getLink(o.data))}),t.TgZ(1,"mat-icon"),t._uU(2,"link"),t.qZA()()}}function i(l,n){if(1&l&&t._UZ(0,"cp-creator-block-toolbar",10),2&l){const e=t.oxw();t.Q6J("data",e.data)}}class s{constructor(n,e,a){this._snackBar=n,this.eRef=e,this.authService=a,this.durationInSeconds=3,this.horizontalPosition="start",this.verticalPosition="bottom",this.focusedBlock=new t.vpe,this.contentToContent=new t.vpe,this.updated=!1}click(n){this.eRef.nativeElement.contains(n.target)?this.authService.contentEditable?this.data.focused=!0:this.data.attrs.pathname&&this.data.attrs.hash&&(this.eRef.nativeElement.style.color="#4285f4",this.contentToContent.emit(this.data)):(this.eRef.nativeElement.style.color="unset",this.data.focused=!1,this.focusedBlock.emit(this.data))}onKeyControlS(n){n.preventDefault(),this.onBlur(n)}onKeyControlEnterDown(){this.data.focused=!1}ngOnChanges(){(!this.data.content||0==this.data.content.length)&&"contentBlock"==this.data.type&&(this.data.content=[{key:`${this.data.key}p0`,type:"paragraph",content:[{type:"text",text:"\n"}]}])}getLink(n){n?.attrs?.pathname&&n?.attrs?.hash&&(navigator.clipboard.writeText(`${location.origin}${n?.attrs?.pathname}${n?.attrs?.hash}`),this._snackBar.open("\u0110\xe3 sao ch\xe9p li\xean k\u1ebft \u0111\u1ebfn \u0111o\u1ea1n kinh n\xe0y","\u0110\xf3ng",{duration:200*this.durationInSeconds,horizontalPosition:this.horizontalPosition,verticalPosition:this.verticalPosition}))}onTab(n){n.preventDefault();const a=document.getSelection()?.getRangeAt(0),u=document.createTextNode("\t");a?.insertNode(u),a?.setStartAfter(u),a?.setEndAfter(u)}onEnter(n){document.execCommand("insertLineBreak"),n.preventDefault()}onBlur(n){this.updated&&[...n?.target?.children].forEach(e=>{const a=(o,u)=>{let y;return o.some(J=>y=J.key===u?J:a(J.content||[],u)),y};a(this.data.content,e.id)&&(a(this.data.content,e.id).content=[],e.children&&0!=e.children.length?e.childNodes&&e.childNodes.length>0&&([...e.childNodes].filter(o=>"#comment"!==o?.nodeName)?.forEach(o=>{"#text"==o.nodeName&&a(this.data.content,e.id).content.push({type:"text",text:o.data}),("B"==o.nodeName||"STRONG"==o.nodeName)&&a(this.data.content,e.id).content.push({type:"text",text:o.innerHTML,attrs:{fontWeight:"bold"}})}),e.innerHTML=a(this.data.content,e.id).content.map(o=>"bold"===o?.attrs?.fontWeight?`<b>${o.text}</b>`:o.text).join(""),this.updated=!1):(a(this.data.content,e.id).content.push({type:"text",text:e.innerText}),e.innerHTML=e.innerText,this.updated=!1))})}}s.\u0275fac=function(n){return new(n||s)(t.Y36(g.pl),t.Y36(t.SBq),t.Y36(h.e))},s.\u0275cmp=t.Xpm({type:s,selectors:[["cp-creator-content"]],hostBindings:function(n,e){1&n&&t.NdJ("click",function(o){return e.click(o)},!1,t.evT)("keydown.control.s",function(o){return e.onKeyControlS(o)},!1,t.evT)("keydown.control.enter",function(){return e.onKeyControlEnterDown()},!1,t.evT)},inputs:{data:"data"},outputs:{focusedBlock:"focusedBlock",contentToContent:"contentToContent"},features:[t.TTD],decls:4,vars:4,consts:[[1,"creator-content-editable",2,"box-sizing","border-box","cursor","text","line-height","1.42","outline","none","overflow-y","auto","tab-size","6","-moz-tab-size","6","white-space","pre-wrap","text-align","jutify","word-wrap","break-word","font-size","18px","overflow","hidden","text-align","justify","user-select","text",3,"contentEditable","blur","input","keydown.enter","keydown.tab"],[4,"ngFor","ngForOf"],["mat-icon-button","","class","targetButton","matTooltip","Sao ch\xe9p li\xean k\u1ebft",3,"click",4,"ngIf"],[3,"data",4,"ngIf"],[3,"id","ngStyle",4,"ngIf"],[3,"id","ngStyle"],[4,"ngIf"],[3,"ngStyle",4,"ngIf"],[3,"ngStyle"],["mat-icon-button","","matTooltip","Sao ch\xe9p li\xean k\u1ebft",1,"targetButton",3,"click"],[3,"data"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t.NdJ("blur",function(o){return e.onBlur(o)})("input",function(){return e.updated=!0})("keydown.enter",function(o){return e.onEnter(o)})("keydown.tab",function(o){return e.onTab(o)}),t.YNc(1,f,2,1,"ng-container",1),t.qZA(),t.YNc(2,E,3,0,"button",2),t.YNc(3,i,1,1,"cp-creator-block-toolbar",3)),2&n&&(t.Q6J("contentEditable",e.authService.contentEditable),t.xp6(1),t.Q6J("ngForOf",e.data.content),t.xp6(1),t.Q6J("ngIf",e.data.attrs.pathname&&e.data.attrs.hash),t.xp6(1),t.Q6J("ngIf",e.data.focused))},dependencies:[d.sg,d.O5,d.PC,p.Hw,m.RK,c.gM,A],styles:["cp-creator-content{display:block;position:relative}  cp-creator-content [contenteditable][placeholder]:empty:before{content:attr(placeholder);position:absolute;color:gray;background-color:transparent}  cp-creator-content .creator-content-editable{padding:.5rem}@media only screen and (max-width: 600px){  cp-creator-content .creator-content-editable{tab-size:2!important}}  cp-creator-content .targetButton{position:absolute;right:calc(100% - 20px);top:0;visibility:hidden;opacity:0;transition:.5s}  cp-creator-content:hover .targetButton{visibility:visible;opacity:1}"]});const B=["audioPlayer"];function I(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"button",11),t.NdJ("click",function(){t.CHM(e);const o=t.oxw(),u=t.MAs(5);return t.KtG(o.toggleAudioPlayer(u))}),t.TgZ(1,"mat-icon"),t._uU(2),t.qZA()()}if(2&l){const e=t.oxw();t.xp6(2),t.Oqu(e.playerIcon)}}const W=function(l){return{targetBlock:l}};function U(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"cp-creator-content",13),t.NdJ("contentToContent",function(o){t.CHM(e);const u=t.oxw(2);return t.KtG(u.contentToContent(o))}),t.qZA()}if(2&l){const e=t.oxw().$implicit,a=t.oxw();t.Q6J("data",e)("id",a.getId(e))("ngClass",t.VKq(3,W,"contentBlock"==e.type))}}function F(l,n){if(1&l&&(t.ynx(0),t.YNc(1,U,1,5,"cp-creator-content",12),t.BQk()),2&l){const e=n.$implicit;t.xp6(1),t.Q6J("ngIf","contentBlock"==e.type)}}function X(l,n){if(1&l&&t._UZ(0,"cp-creator-block-toolbar",14),2&l){const e=t.oxw();t.Q6J("data",e.data)}}class Q{constructor(n,e,a,o){this._snackBar=n,this.eRef=e,this.authService=a,this.router=o,this.durationInSeconds=3,this.horizontalPosition="start",this.verticalPosition="bottom",this.playerIcon="play_circle",this.focusedBlock=new t.vpe}clickout(n){this.authService.contentEditable&&this.eRef.nativeElement.contains(n.target)?(this.data.focused=!0,this.focusedBlock.emit(this.data)):this.data.focused=!1}ngAfterViewInit(){this.audioTracking()}ngOnChanges(){}getId(n){return n.key.replaceAll("-","")}getLink(n,e=!1){e?n?.attrs?.hash?.includes("#")?this.router.navigate([n?.attrs?.pathname],{fragment:n?.attrs?.hash.replace("#","")}):this.router.navigate([`${n?.attrs?.pathname}${n?.attrs?.hash||""}`]):(navigator.clipboard.writeText(`${location.origin}${n?.attrs?.pathname}${n?.attrs?.hash}`),this._snackBar.open("\u0110\xe3 sao ch\xe9p li\xean k\u1ebft \u0111\u1ebfn \u0111o\u1ea1n kinh n\xe0y","\u0110\xf3ng",{duration:200*this.durationInSeconds,horizontalPosition:this.horizontalPosition,verticalPosition:this.verticalPosition}))}changeValue(n){this.data.name=n.target.innerText,n.target.innerText=n.target.innerHTML}toggleAudioPlayer(n){n.paused?(n.play(),n.controls=!0,this.playerIcon="pause_circle",localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:n.currentTime}))):(n.pause(),n.controls=!1,this.playerIcon="play_circle",localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:n.currentTime})))}contentToContent(n){n?.audio?.start&&(this.audioPlayer.nativeElement.currentTime=n.audio.start)}audioTracking(){"block"==this.data.type&&(this.authService.contentEditable?this.audioPlayer.nativeElement.addEventListener("pause",n=>{const e=this.audioPlayer.nativeElement.currentTime;navigator.clipboard.writeText(e),navigator.clipboard.writeText(e)}):(this.audioPlayer.nativeElement.addEventListener("timeupdate",n=>{const e=this.audioPlayer.nativeElement.currentTime;let a=this.data.content.find(o=>e>o?.audio?.start&&e<o?.audio?.end);if(a){const o=document.getElementById(a.key);if(o&&(!o.style.color||"unset"==o.style.color)){const u=document.getElementsByTagName("cp-creator-content");Array.from({length:u.length},(y,J)=>{u[J].setAttribute("style","color: unset")}),o.style.color="#4285f4"}}}),this.audioPlayer.nativeElement.addEventListener("pause",n=>{localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:this.audioPlayer.nativeElement.currentTime}))})))}}Q.\u0275fac=function(n){return new(n||Q)(t.Y36(g.pl),t.Y36(t.SBq),t.Y36(h.e),t.Y36(k.F0))},Q.\u0275cmp=t.Xpm({type:Q,selectors:[["cp-creator-block"]],viewQuery:function(n,e){if(1&n&&t.Gf(B,5),2&n){let a;t.iGM(a=t.CRH())&&(e.audioPlayer=a.first)}},hostBindings:function(n,e){1&n&&t.NdJ("click",function(o){return e.clickout(o)},!1,t.evT)},inputs:{data:"data"},outputs:{focusedBlock:"focusedBlock"},features:[t.TTD],decls:16,vars:6,consts:[[1,"creator-block-title","position-relative"],[1,"d-flex","align-items-center","justify-content-between"],[1,"w-100",3,"contentEditable","blur"],[1,"w-100",3,"src"],["audioPlayer",""],[1,"d-flex","redirectButton"],["mat-icon-button","","matTooltip","Nghe ri\xeang b\xe0i n\xe0y",3,"click",4,"ngIf"],["mat-icon-button","","matTooltip","\u0110\u1ecdc ri\xeang b\xe0i n\xe0y",3,"click"],["mat-icon-button","","matTooltip","Sao ch\xe9p li\xean k\u1ebft",1,"targetButton",3,"click"],[4,"ngFor","ngForOf"],[3,"data",4,"ngIf"],["mat-icon-button","","matTooltip","Nghe ri\xeang b\xe0i n\xe0y",3,"click"],[3,"data","id","ngClass","contentToContent",4,"ngIf"],[3,"data","id","ngClass","contentToContent"],[3,"data"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h2",2),t.NdJ("blur",function(o){return e.changeValue(o)}),t._uU(3),t.qZA(),t._UZ(4,"audio",3,4),t.TgZ(6,"div",5),t.YNc(7,I,3,1,"button",6),t.TgZ(8,"button",7),t.NdJ("click",function(){return e.getLink(e.data,!0)}),t.TgZ(9,"mat-icon"),t._uU(10,"local_library"),t.qZA()()()(),t.TgZ(11,"button",8),t.NdJ("click",function(){return e.getLink(e.data)}),t.TgZ(12,"mat-icon"),t._uU(13,"link"),t.qZA()()(),t.YNc(14,F,2,1,"ng-container",9),t.YNc(15,X,1,1,"cp-creator-block-toolbar",10)),2&n&&(t.xp6(2),t.Q6J("contentEditable",e.authService.contentEditable),t.xp6(1),t.Oqu(e.data.name),t.xp6(1),t.Q6J("src",null==e.data||null==e.data.audio?null:e.data.audio.src,t.LSH),t.xp6(3),t.Q6J("ngIf",null==e.data||null==e.data.audio?null:e.data.audio.src),t.xp6(7),t.Q6J("ngForOf",e.data.content),t.xp6(1),t.Q6J("ngIf",e.data.focused))},dependencies:[d.mk,d.sg,d.O5,s,m.RK,p.Hw,c.gM,A],styles:["cp-creator-block{padding:0 3rem 2rem;display:block;border-bottom:1px solid #e0e0e0;position:relative}@media only screen and (max-width: 600px){  cp-creator-block{padding:0}}  cp-creator-block .creator-block-title .targetButton{position:absolute;right:calc(100% - 20px);top:calc(0% - 10px);visibility:hidden;opacity:0;transition:.5s}  cp-creator-block .creator-block-title .redirectButton{position:absolute;right:-20px;top:calc(0% - 10px);visibility:hidden;opacity:0;transition:.5s}  cp-creator-block .creator-block-title:hover .targetButton,   cp-creator-block .creator-block-title:hover .redirectButton{visibility:visible;opacity:1}"]});var j=r(3267),H=r(6325),V=r(3848),z=r(1948);const q=["audioDialog"];function tt(l,n){if(1&l&&(t.TgZ(0,"mat-radio-button",17),t._uU(1),t.qZA()),2&l){const e=n.$implicit;t.Q6J("value",e),t.xp6(1),t.Oqu(e)}}function et(l,n){if(1&l){const e=t.EpF();t.ynx(0),t.TgZ(1,"div",14)(2,"mat-label"),t._uU(3),t.qZA()(),t.TgZ(4,"mat-radio-group",15),t.NdJ("ngModelChange",function(o){t.CHM(e);const u=t.oxw().$implicit;return t.KtG(u.value=o)}),t.YNc(5,tt,2,2,"mat-radio-button",16),t.qZA(),t.BQk()}if(2&l){const e=t.oxw().$implicit;t.xp6(3),t.Oqu(null==e?null:e.label),t.xp6(1),t.Q6J("ngModel",e.value),t.xp6(1),t.Q6J("ngForOf",null==e?null:e.data)}}function nt(l,n){if(1&l){const e=t.EpF();t.ynx(0),t.TgZ(1,"mat-form-field",5)(2,"mat-label"),t._uU(3),t.qZA(),t.TgZ(4,"input",7),t.NdJ("ngModelChange",function(o){t.CHM(e);const u=t.oxw().$implicit;return t.KtG(u.value=o)}),t.qZA()(),t.BQk()}if(2&l){const e=t.oxw().$implicit;t.xp6(3),t.Oqu(null==e?null:e.label),t.xp6(1),t.Q6J("ngModel",e.value)}}function ot(l,n){if(1&l&&(t.ynx(0),t.YNc(1,et,6,3,"ng-container",13),t.YNc(2,nt,5,2,"ng-container",13),t.BQk()),2&l){const e=n.$implicit;t.xp6(1),t.Q6J("ngIf","radio"==(null==e?null:e.type)),t.xp6(1),t.Q6J("ngIf","shortText"==(null==e?null:e.type))}}function at(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"div",18),t._uU(1,"Ch\u1ec9nh s\u1eeda \xe2m thanh"),t.qZA(),t.TgZ(2,"mat-dialog-content")(3,"mat-form-field")(4,"mat-label"),t._uU(5,"Ngu\u1ed3n"),t.qZA(),t.TgZ(6,"input",19),t.NdJ("ngModelChange",function(o){t.CHM(e);const u=t.oxw();return t.KtG(u.data.audio.src=o)}),t.qZA()()(),t.TgZ(7,"mat-dialog-actions")(8,"button",20),t._uU(9,"\u0110\xf3ng"),t.qZA(),t.TgZ(10,"button",21),t.NdJ("click",function(){t.CHM(e);const o=t.oxw();return t.KtG(o.addContentAudio())}),t._uU(11," L\u01b0u "),t.qZA()()}if(2&l){const e=t.oxw();t.xp6(6),t.Q6J("ngModel",e.data.audio.src),t.xp6(4),t.Q6J("color","primary")("mat-dialog-close",!0)}}class K{constructor(n){this.dialog=n,this.save=new t.vpe}onKeyControlEnterDown(){this.addNewContentBlock()}onKeyControlS(n){n.preventDefault(),this.saveData()}ngOnInit(){this.data=={}&&(this.data={name:"",key:""})}saveData(){const n=(a,o)=>{let u;return a.some(y=>u=y.focused===o?y:n(y.content||[],o)),u},e=()=>{n(this.data.content,!0)?(n(this.data.content,!0).focused=!1,e()):this.save.emit()};setTimeout(()=>{e()},0)}addNewContentBlock(){"contentBlock"==this.focusedBlock?.type&&(this.data.content.push({key:`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${this.data.content.length||0}`,attrs:{pathname:location.pathname,hash:`#${this.data.content.length}`},type:"contentBlock",focused:!0}),setTimeout(()=>{const e=document.getElementById(`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${this.data.content.length-1||0}p0`);e?.parentElement&&e?.parentElement.focus()},0)),"block"==this.focusedBlock?.type&&(this.focusedBlock.content.push({key:`${(location.pathname+this.focusedBlock.attrs.hash).slice(1,(location.pathname+this.focusedBlock.attrs.hash).length).split("/").slice(1).join("-").replaceAll("-","")}${this.focusedBlock.content.length||0}`,attrs:{pathname:location.pathname+this.focusedBlock.attrs.hash,hash:`#${this.focusedBlock.content.length||0}`},type:"contentBlock",focused:!0}),setTimeout(()=>{const n=document.getElementById(`${(location.pathname+this.focusedBlock.attrs.hash).slice(1,(location.pathname+this.focusedBlock.attrs.hash).length).split("/").slice(1).join("-").replaceAll("-","")}${this.focusedBlock.content.length-1||0}p0`);n?.parentElement&&n?.parentElement.focus()},0))}addNewBlock(){(!this.data.content||0==this.data.content.length)&&(this.data.content=[]),"block"==this.focusedBlock?.type&&this.data.content.push({key:`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}b${this.data.content.length||0}`,attrs:{pathname:location.pathname,hash:`/b${this.data.content.length}`},content:[{key:`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}b${this.data.content.length||0}`,attrs:{pathname:`${location.pathname}/b${this.data.content.length}`,hash:"#0"},type:"contentBlock",focused:!0}],type:"block",focused:!0})}addContentAudio(){console.log(this.data)}openAudioDialog(n){this.data.audio||(this.data.audio={src:""}),this.dialog.open(n)}}K.\u0275fac=function(n){return new(n||K)(t.Y36(H.uw))},K.\u0275cmp=t.Xpm({type:K,selectors:[["cp-content-creator-toolbar"]],viewQuery:function(n,e){if(1&n&&t.Gf(q,5),2&n){let a;t.iGM(a=t.CRH())&&(e.audioDialog=a.first)}},hostBindings:function(n,e){1&n&&t.NdJ("keydown.control.enter",function(){return e.onKeyControlEnterDown()},!1,t.evT)("keydown.control.s",function(o){return e.onKeyControlS(o)},!1,t.evT)},inputs:{data:"data",focusedBlock:"focusedBlock"},outputs:{save:"save"},decls:30,vars:4,consts:[[1,"cp-creator-toolbar"],["mat-raised-button","","color","primary",3,"click"],[1,"toolbar-content"],["label","C\xe0i \u0111\u1eb7t"],[1,"w-100","form-group"],["appearance","fill",1,"w-100"],["matInput","","disabled","",3,"ngModel","ngModelChange"],["matInput","",3,"ngModel","ngModelChange"],[4,"ngFor","ngForOf"],["label","Ch\xe8n"],["mat-icon-button","",3,"disabled","click"],["mat-icon-button","",3,"click"],["audioDialog",""],[4,"ngIf"],[1,"w-100"],[3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],["mat-dialog-title",""],["type","text","matInput","",3,"ngModel","ngModelChange"],["mat-button","","mat-dialog-close",""],["mat-flat-button","",3,"color","mat-dialog-close","click"]],template:function(n,e){if(1&n){const a=t.EpF();t.TgZ(0,"div",0)(1,"div")(2,"button",1),t.NdJ("click",function(){return e.saveData()}),t._uU(3," L\u01b0u "),t.qZA()(),t.TgZ(4,"div",2)(5,"mat-tab-group")(6,"mat-tab",3)(7,"div",4)(8,"mat-form-field",5)(9,"mat-label"),t._uU(10,"M\xe3 \u0111\u1ecbnh danh"),t.qZA(),t.TgZ(11,"input",6),t.NdJ("ngModelChange",function(u){return e.data.key=u}),t.qZA()(),t.TgZ(12,"mat-form-field",5)(13,"mat-label"),t._uU(14,"T\xean"),t.qZA(),t.TgZ(15,"input",7),t.NdJ("ngModelChange",function(u){return e.data.name=u}),t.qZA()(),t.YNc(16,ot,3,2,"ng-container",8),t.qZA()(),t.TgZ(17,"mat-tab",9)(18,"div",4)(19,"button",10),t.NdJ("click",function(){return e.addNewBlock()}),t.TgZ(20,"mat-icon"),t._uU(21,"add"),t.qZA()(),t.TgZ(22,"button",11),t.NdJ("click",function(){return e.addNewContentBlock()}),t.TgZ(23,"mat-icon"),t._uU(24,"text_fields"),t.qZA()(),t.TgZ(25,"button",11),t.NdJ("click",function(){t.CHM(a);const u=t.MAs(29);return t.KtG(e.openAudioDialog(u))}),t.TgZ(26,"mat-icon"),t._uU(27,"music_note"),t.qZA()()()()()()(),t.YNc(28,at,12,3,"ng-template",null,12,t.W1O)}2&n&&(t.xp6(11),t.Q6J("ngModel",e.data.key),t.xp6(4),t.Q6J("ngModel",e.data.name),t.xp6(1),t.Q6J("ngForOf",null==e.data?null:e.data.formGroup),t.xp6(3),t.Q6J("disabled",!e.focusedBlock||"contentBlock"==(null==e.focusedBlock?null:e.focusedBlock.type)))},dependencies:[d.sg,d.O5,m.lW,m.RK,p.Hw,V.uX,V.SP,T.KE,T.hX,C.Nt,M.Fj,M.JJ,M.On,z.VQ,z.U0,H.ZT,H.uh,H.xY,H.H8],styles:[".cp-creator-toolbar{display:flex;flex-direction:column;height:100%}  .cp-creator-toolbar .toolbar-content{flex:1}  .cp-creator-toolbar .toolbar-content .form-group{padding:1rem}"]});const it=["audioPlayer"];function lt(l,n){if(1&l&&t._UZ(0,"audio",7,8),2&l){const e=t.oxw();t.Q6J("src",null==e.data||null==e.data.audio?null:e.data.audio.src,t.LSH)}}function rt(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"cp-creator-block",11),t.NdJ("focusedBlock",function(o){t.CHM(e);const u=t.oxw(2);return t.KtG(u.focusedBlock=o)}),t.qZA()}if(2&l){const e=t.oxw().$implicit,a=t.oxw();t.Q6J("data",e)("id",a.getId(e))}}const ct=function(l){return{targetBlock:l}};function st(l,n){if(1&l){const e=t.EpF();t.TgZ(0,"cp-creator-content",12),t.NdJ("focusedBlock",function(o){t.CHM(e);const u=t.oxw(2);return t.KtG(u.focusedBlock=o)})("contentToContent",function(o){t.CHM(e);const u=t.oxw(2);return t.KtG(u.contentToContent(o))}),t.qZA()}if(2&l){const e=t.oxw().$implicit,a=t.oxw();t.Q6J("data",e)("id",a.getId(e))("ngClass",t.VKq(3,ct,"contentBlock"==e.type))}}function ut(l,n){if(1&l&&(t.ynx(0),t.YNc(1,rt,1,2,"cp-creator-block",9),t.YNc(2,st,1,5,"cp-creator-content",10),t.BQk()),2&l){const e=n.$implicit;t.xp6(1),t.Q6J("ngIf","block"==(null==e?null:e.type)),t.xp6(1),t.Q6J("ngIf","contentBlock"==(null==e?null:e.type))}}const dt=function(l){return{contentEditable:l}};class G{constructor(n,e,a){this.breakpointObserver=n,this.authService=e,this.route=a,this.save=new t.vpe,this.nextContent=new t.vpe,this.isShowController=!1,this.isAutoPlay=!1,this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(o=>{this.isShowController=!o.matches&&this.authService.contentEditable})}ngAfterViewInit(){this.audioTracking()}ngOnChanges(){(!this.data.content||0==this.data.content.length)&&"block"==this.data.type&&(this.data.content=[{key:`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${this.data.content.length-1||0}`,attrs:{pathname:location.pathname,hash:"#"+(this.data.content.length-1)},type:"contentBlock"}]),this.data.key||(this.data.content=[{key:`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${this.data.content?.length-1||0}`,attrs:{pathname:location.pathname,hash:`#${this.data.content?.length-1||0}`},type:"contentBlock"}])}getId(n){return n.key.replaceAll("-","")}saveData(){this.save.emit()}contentToContent(n){if(this.audioPlayer&&n?.audio?.start){this.audioPlayer.nativeElement.currentTime=n.audio.start;const e=this.audioPlayer.nativeElement.currentTime;navigator.clipboard.writeText(e),localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:e}))}}audioTracking(){"block"==this.data.type&&this.audioPlayer&&(this.route.queryParams.subscribe(n=>{n.autoplay&&(this.audioPlayer.nativeElement.autoplay=!0)}),this.authService.contentEditable?this.audioPlayer.nativeElement.addEventListener("pause",n=>{const e=this.audioPlayer.nativeElement.currentTime;navigator.clipboard.writeText(e),localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:e}))}):(this.audioPlayer.nativeElement.addEventListener("timeupdate",n=>{const e=this.audioPlayer.nativeElement.currentTime;let a=this.data.content.find(o=>e>o?.audio?.start&&e<o?.audio?.end);if(a){const o=document.getElementById(a.key);if(o&&(!o.style.color||"unset"==o.style.color)){const u=document.getElementsByTagName("cp-creator-content");Array.from({length:u.length},(y,J)=>{u[J].setAttribute("style","color: unset")}),o.style.color="#4285f4",localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:e}))}}}),this.audioPlayer.nativeElement.addEventListener("pause",n=>{localStorage.setItem("audio",JSON.stringify({content:this.data.key,currentTime:this.audioPlayer.nativeElement.currentTime})),JSON.parse(localStorage.getItem("audio")||"").currentTime==this.data.content[this.data.content.length-1].audio.end&&this.nextContent.emit()})))}}G.\u0275fac=function(n){return new(n||G)(t.Y36(v.Yg),t.Y36(h.e),t.Y36(k.gz))},G.\u0275cmp=t.Xpm({type:G,selectors:[["cp-content-creator"]],viewQuery:function(n,e){if(1&n&&t.Gf(it,5),2&n){let a;t.iGM(a=t.CRH())&&(e.audioPlayer=a.first)}},inputs:{data:"data"},outputs:{save:"save",nextContent:"nextContent"},features:[t.TTD],decls:7,vars:9,consts:[["autosize","",1,"cp-content-creator-mat-drawer"],["id","contentCreatorWrapper"],["class","w-100 block-audio-player","controls","",3,"src",4,"ngIf"],[1,"cp-creator-block-group",3,"ngClass"],[4,"ngFor","ngForOf"],["mode","side","opened","",3,"position","opened"],[3,"focusedBlock","data","save"],["controls","",1,"w-100","block-audio-player",3,"src"],["audioPlayer",""],[3,"data","id","focusedBlock",4,"ngIf"],[3,"data","id","ngClass","focusedBlock","contentToContent",4,"ngIf"],[3,"data","id","focusedBlock"],[3,"data","id","ngClass","focusedBlock","contentToContent"]],template:function(n,e){1&n&&(t.TgZ(0,"mat-drawer-container",0)(1,"mat-drawer-content",1),t.YNc(2,lt,2,1,"audio",2),t.TgZ(3,"div",3),t.YNc(4,ut,3,2,"ng-container",4),t.qZA()(),t.TgZ(5,"mat-drawer",5)(6,"cp-content-creator-toolbar",6),t.NdJ("save",function(){return e.saveData()}),t.qZA()()()),2&n&&(t.xp6(2),t.Q6J("ngIf","block"===(null==e.data?null:e.data.type)&&(null==e.data||null==e.data.audio?null:e.data.audio.src)),t.xp6(1),t.Q6J("ngClass",t.VKq(7,dt,e.isShowController)),t.xp6(1),t.Q6J("ngForOf",e.data.content),t.xp6(1),t.Q6J("position","end")("opened",e.isShowController),t.xp6(1),t.Q6J("focusedBlock",e.focusedBlock)("data",e.data))},dependencies:[d.mk,d.sg,d.O5,Q,s,j.jA,j.kh,j.LW,K],styles:["cp-content-creator{width:100%;height:100%;display:flex}  cp-content-creator .mat-drawer-container{background:white;width:100%}  cp-content-creator mat-drawer{min-width:300px;width:300px;background-color:#fff;box-shadow:0 1px 2px #0000004d,0 1px 3px 1px #00000026}  cp-content-creator .mat-drawer-content{overflow-y:auto;overflow-x:hidden}  cp-content-creator .mat-drawer-content .block-audio-player{position:sticky;top:0;z-index:2}  cp-content-creator .cp-creator-block-group{flex:1;padding:3rem 3rem 1rem}  cp-content-creator .cp-creator-block-group.contentEditable{padding-top:5rem}@media only screen and (max-width: 600px){  cp-content-creator .cp-creator-block-group{padding:1rem}}"]})},6038:(P,x,r)=>{r.d(x,{m:()=>N});var t=r(6895),v=r(1113),h=r(4859),k=r(7392),d=r(266),g=r(4171),p=r(4650);class m{}m.\u0275fac=function(O){return new(O||m)},m.\u0275mod=p.oAB({type:m}),m.\u0275inj=p.cJS({imports:[t.ez,v.x,h.ot,k.Ps,d.AV,g.h]});var c=r(3267),T=r(3683),C=r(3848),b=r(9549),_=r(284),M=r(4006),Z=r(1948),D=r(6325);class w{}w.\u0275fac=function(O){return new(O||w)},w.\u0275mod=p.oAB({type:w}),w.\u0275inj=p.cJS({imports:[t.ez,h.ot,k.Ps,C.Nh,b.lN,_.c,M.u5,Z.Fk,D.Is]});class N{}N.\u0275fac=function(O){return new(O||N)},N.\u0275mod=p.oAB({type:N}),N.\u0275inj=p.cJS({imports:[t.ez,m,v.x,h.ot,c.SJ,T.g0,w]})},4171:(P,x,r)=>{r.d(x,{h:()=>S});var t=r(6895),v=r(4859),h=r(7392),k=r(9549),d=r(284),c=(r(2687),r(1281),r(5017),r(4650)),T=r(4006),C=r(3238);let L=(()=>{class f{}return f.\u0275fac=function(i){return new(i||f)},f.\u0275mod=c.oAB({type:f}),f.\u0275inj=c.cJS({imports:[C.BQ,C.si,C.BQ]}),f})();var $=r(4850),Y=r(8255);class S{}S.\u0275fac=function(E){return new(E||S)},S.\u0275mod=c.oAB({type:S}),S.\u0275inj=c.cJS({imports:[t.ez,v.ot,h.Ps,k.lN,d.c,L,$.t,Y.Tx,T.u5]})},1113:(P,x,r)=>{r.d(x,{x:()=>p});var t=r(6895),v=r(7392),h=r(4859),k=r(266),d=r(4171),g=r(4650);class p{}p.\u0275fac=function(c){return new(c||p)},p.\u0275mod=g.oAB({type:p}),p.\u0275inj=g.cJS({imports:[t.ez,v.Ps,h.ot,k.AV,d.h]})},8109:(P,x,r)=>{r.d(x,{d:()=>h});var t=r(4650);class h{}h.\u0275fac=function(d){return new(d||h)},h.\u0275cmp=t.Xpm({type:h,selectors:[["app-header-title"]],ngContentSelectors:["*"],decls:2,vars:0,template:function(d,g){1&d&&(t.F$t(),t.TgZ(0,"div"),t.Hsn(1),t.qZA())},styles:["app-header-title div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:20px}"]})},3646:(P,x,r)=>{r.d(x,{G:()=>m});var t=r(4650),v=r(9299),h=r(6895),k=r(3683),d=r(7392),g=r(4859);class m{constructor(T,C,b){this.router=T,this.route=C,this.location=b,this.prevPage=".."}ngOnInit(){}onClickBackButton(){this.prevPage?.navigate?.link?this.router.navigate([this.prevPage?.navigate?.link],{relativeTo:this.route,queryParams:this.prevPage?.navigate?.queryParams}):this.location.back()}}m.\u0275fac=function(T){return new(T||m)(t.Y36(v.F0),t.Y36(v.gz),t.Y36(h.Ye))},m.\u0275cmp=t.Xpm({type:m,selectors:[["app-header"]],inputs:{prevPage:"prevPage"},ngContentSelectors:["*"],decls:6,vars:0,consts:[["mat-icon-button","","aria-label","Back to previous page",1,"prev-icon",3,"click"],["mat-icon-button","","aria-label","Back to previous page",1,"prev-icon"]],template:function(T,C){1&T&&(t.F$t(),t.TgZ(0,"mat-toolbar")(1,"button",0),t.NdJ("click",function(){return C.onClickBackButton()}),t.TgZ(2,"mat-icon"),t._uU(3,"arrow_back"),t.qZA()(),t.Hsn(4),t._UZ(5,"button",1),t.qZA())},dependencies:[k.Ye,d.Hw,g.RK],styles:["app-header .mat-toolbar{justify-content:space-between;background-color:#f6f8fc;height:auto}"]})},4546:(P,x,r)=>{r.d(x,{O:()=>g});var t=r(6895),v=r(3683),h=r(7392),k=r(4859),d=r(4650);class g{}g.\u0275fac=function(m){return new(m||g)},g.\u0275mod=d.oAB({type:g}),g.\u0275inj=d.cJS({imports:[t.ez,v.g0,h.Ps,k.ot]})}}]);