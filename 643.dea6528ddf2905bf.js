"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[643],{2065:(b,C,o)=>{o.d(C,{C:()=>S});var e=o(5879),T=o(2939),t=o(8005),d=o(7022),m=o(2787),p=o(4170),h=o(2032),B=o(2596),v=o(617),f=o(2296),Z=o(7742),M=o(6385),g=o(9038);const N=["shareBottomSheet"];function D(x,U){if(1&x){const u=e.EpF();e.TgZ(0,"h3"),e._uU(1),e.qZA(),e.TgZ(2,"div",1)(3,"h4",2),e._uU(4,"Sao ch\xe9p li\xean k\u1ebft chia s\u1ebb"),e.qZA(),e.TgZ(5,"mat-form-field",3)(6,"mat-label"),e._uU(7,"Li\xean k\u1ebft"),e.qZA(),e._UZ(8,"input",4),e.TgZ(9,"button",5),e.NdJ("click",function(){e.CHM(u);const c=e.oxw();return e.KtG(c.copyLink())}),e.TgZ(10,"mat-icon"),e._uU(11,"link"),e.qZA()()(),e.TgZ(12,"div",6),e._UZ(13,"qrcode",7,8),e.TgZ(15,"div",9)(16,"button",10),e.NdJ("click",function(){e.CHM(u);const c=e.MAs(14),_=e.oxw();return e.KtG(_.saveAsImage(c))}),e.TgZ(17,"mat-icon"),e._uU(18,"download"),e.qZA(),e._uU(19," T\u1ea3i M\xe3 QR chia s\u1ebb "),e.qZA()()(),e._UZ(20,"mat-divider"),e.TgZ(21,"mat-nav-list")(22,"a",11),e.NdJ("click",function(){e.CHM(u);const c=e.oxw();return e.KtG(c.shareTo("facebook"))}),e.TgZ(23,"span",12),e._uU(24,"Chia s\u1ebb l\xean Facebook"),e.qZA()()()()}if(2&x){const u=e.oxw();e.xp6(1),e.Oqu(u.title),e.xp6(7),e.Q6J("value",u.sharedUrl)("disabled",!0),e.xp6(1),e.Q6J("matTooltip","Sao ch\xe9p li\xean k\u1ebft"),e.xp6(4),e.Q6J("qrdata",u.sharedUrl)("width",300)("imageHeight",75)("imageWidth",75)("cssClass","flex justify-center")("errorCorrectionLevel","M")("colorDark","#000000ff")("colorLight","#ffffffff")("elementType","canvas")("margin",4)("scale",128)("imageSrc","assets/icons/assets/circle-logo.svg")}}const L=["*"];let S=(()=>{var x;class U{onClick(s){this.eRef&&this.eRef.nativeElement.contains(s.target)&&(this.shareBottomSheetRef=this.matBottomSheet.open(this.shareBottomSheet))}constructor(s,c,_,E,O){this._snackBar=s,this.matBottomSheet=c,this.eRef=_,this.commonService=E,this.router=O,this.url="",this.horizontalPosition="center",this.verticalPosition="bottom",this.durationInSeconds=3,this.sharedUrl=""}ngOnInit(){this.router.events.subscribe(s=>{this.sharedUrl=`${window.location.origin}${s.url||window.location.pathname}`}),this.url&&(this.sharedUrl=this.url)}ngAfterViewChecked(){this.url&&(this.sharedUrl=this.url)}copyLink(){navigator.clipboard.writeText(this.sharedUrl),this.shareBottomSheetRef.dismiss(),this._snackBar.open("\u0110\xe3 sao ch\xe9p li\xean k\u1ebft","\u0110\xf3ng",{duration:1e3*this.durationInSeconds,horizontalPosition:this.horizontalPosition,verticalPosition:this.verticalPosition})}shareTo(s){"facebook"===s?window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.sharedUrl)}`):this.copyLink()}convertBase64ToBlob(s){const c=s.split(";base64,"),_=c[0].split(":")[1],E=window.atob(c[1]),O=new Uint8Array(E.length);for(let y=0;y<E.length;++y)O[y]=E.charCodeAt(y);return new Blob([O],{type:_})}saveAsImage(s){let c=null;if(c=s.qrcElement.nativeElement.querySelector("canvas").toDataURL("image/png"),c){let _=this.convertBase64ToBlob(c);const E=new Blob([_],{type:"image/png"}),O=window.URL.createObjectURL(E),y=document.createElement("a");y.href=O,y.download=this.commonService.generatedSlug(this.title||"caodaion-qr"),y.click()}}}return(x=U).\u0275fac=function(s){return new(s||x)(e.Y36(T.ux),e.Y36(t.ch),e.Y36(e.SBq),e.Y36(d.v),e.Y36(m.F0))},x.\u0275cmp=e.Xpm({type:x,selectors:[["button-share"]],viewQuery:function(s,c){if(1&s&&e.Gf(N,5),2&s){let _;e.iGM(_=e.CRH())&&(c.shareBottomSheet=_.first)}},hostBindings:function(s,c){1&s&&e.NdJ("click",function(E){return c.onClick(E)},!1,e.evT)},inputs:{title:"title",url:"url"},ngContentSelectors:L,decls:3,vars:0,consts:[["shareBottomSheet",""],[1,"container-fluid"],[1,"text-2xl","my-2","font-semibold"],[1,"w-100"],["type","text","matInput","",3,"value","disabled"],["mat-icon-button","","matSuffix","",3,"matTooltip","click"],[1,"qr-area","text-center"],[3,"qrdata","width","imageHeight","imageWidth","cssClass","errorCorrectionLevel","colorDark","colorLight","elementType","margin","scale","imageSrc"],["parent",""],[1,"text-center"],["mat-raised-button","","color","primary",3,"click"],["mat-list-item","",3,"click"],["matListItemTitle",""]],template:function(s,c){1&s&&(e.F$t(),e.Hsn(0),e.YNc(1,D,25,16,"ng-template",null,0,e.W1O))},dependencies:[p.KE,p.hX,p.R9,h.Nt,B.gM,v.Hw,f.lW,f.RK,Z.V,M.d,g.Hk,g.Tg,g.sL],styles:[".qr-area[_ngcontent-%COMP%]{padding-bottom:1rem}"]}),U})()},5185:(b,C,o)=>{o.d(C,{d:()=>t});var e=o(5879);const T=["*"];let t=(()=>{var d;class m{}return(d=m).\u0275fac=function(h){return new(h||d)},d.\u0275cmp=e.Xpm({type:d,selectors:[["app-header-title"]],ngContentSelectors:T,decls:2,vars:0,template:function(h,B){1&h&&(e.F$t(),e.TgZ(0,"div"),e.Hsn(1),e.qZA())},styles:["app-header-title div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:20px}"]}),m})()},6471:(b,C,o)=>{o.d(C,{G:()=>v});var e=o(5879),T=o(2787),t=o(1274),d=o(617),m=o(2296),p=o(2065),h=o(2596);const B=["*"];let v=(()=>{var f;class Z{constructor(g){this.router=g,this.prevPage=".."}ngOnInit(){this.current={title:"Chia s\u1ebb ngay",location:location.href}}onClickBackButton(){if(this.prevPage?.navigate?.link)this.router.navigate([this.prevPage?.navigate?.link],{queryParams:this.prevPage?.navigate?.queryParams});else{const g=location.pathname.split("/");g.pop(),this.router.navigate([g.join("/")],{queryParams:this.prevPage?.navigate?.queryParams})}}}return(f=Z).\u0275fac=function(g){return new(g||f)(e.Y36(T.F0))},f.\u0275cmp=e.Xpm({type:f,selectors:[["app-header"]],inputs:{prevPage:"prevPage"},ngContentSelectors:B,decls:9,vars:3,consts:[["mat-icon-button","","aria-label","Back to previous page",1,"prev-icon",3,"click"],[3,"title"],["mat-icon-button","",3,"color","matTooltip"]],template:function(g,N){1&g&&(e.F$t(),e.TgZ(0,"mat-toolbar")(1,"button",0),e.NdJ("click",function(){return N.onClickBackButton()}),e.TgZ(2,"mat-icon"),e._uU(3,"arrow_back"),e.qZA()(),e.Hsn(4),e.TgZ(5,"button-share",1)(6,"button",2)(7,"mat-icon"),e._uU(8,"share"),e.qZA()()()()),2&g&&(e.xp6(5),e.Q6J("title",null==N.current?null:N.current.title),e.xp6(1),e.Q6J("color","primary")("matTooltip","Chia s\u1ebb ngay"))},dependencies:[t.Ye,d.Hw,m.RK,p.C,h.gM],styles:["app-header .mat-toolbar{justify-content:space-between;background-color:#f6f8fc;height:auto}"]}),Z})()},4085:(b,C,o)=>{o.d(C,{O:()=>B});var e=o(6814),T=o(1274),t=o(617),d=o(2296),m=o(813),p=o(2596),h=o(5879);let B=(()=>{var v;class f{}return(v=f).\u0275fac=function(M){return new(M||v)},v.\u0275mod=h.oAB({type:v}),v.\u0275inj=h.cJS({imports:[e.ez,T.g0,t.Ps,d.ot,m.S,p.AV]}),f})()},8643:(b,C,o)=>{o.r(C),o.d(C,{HanhLeModule:()=>G});var e=o(6814),T=o(2787),t=o(5879),d=o(1088),m=o(4104),p=o(3176),h=o(5195);const B=function(n){return[n]};function v(n,l){if(1&n&&(t.TgZ(0,"mat-grid-tile")(1,"mat-card",6)(2,"mat-card-header",7)(3,"mat-card-title",8),t._uU(4),t.qZA()()()()),2&n){const a=t.oxw().$implicit;t.xp6(1),t.Q6J("routerLink",t.VKq(2,B,null==a?null:a.key)),t.xp6(3),t.Oqu(null==a?null:a.name)}}function f(n,l){if(1&n&&(t.ynx(0),t.YNc(1,v,5,4,"mat-grid-tile",5),t.BQk()),2&n){const a=l.$implicit;t.xp6(1),t.Q6J("ngIf",null==a?null:a.published)}}let Z=(()=>{var n;class l{constructor(i){this.breakpointObserver=i,this.nghiTiet=[{key:"nghi-tiet-dai-va-trung-dan",name:"Nghi-ti\u1ebft \u0110\u1ea1i v\xe0 Trung \u0111\xe0n"},{key:"nghi-tiet-tay-thien-dien",name:"Nghi-ti\u1ebft T\xe2y Thi\xean \u0110i\u1ec7n"},{key:"nghi-ha-tho",name:"Nghi H\u1ea1 Th\u1ecd"},{key:"nghi-cao-tu-to",name:"Nghi c\xe1o t\u1eeb t\u1ed5"},{key:"nghi-thanh-phuc",name:"Nghi th\xe0nh ph\u1ee5c",published:!0},{key:"nghi-dieu-te",name:"Nghi \u0111i\u1ebfu t\u1ebf"},{key:"nghi-cao-minh-sanh",name:"Nghi c\xe1o minh sanh"},{key:"nghi-tien-biet",name:"Nghi ti\u1ec3n bi\u1ec7t",published:!0},{key:"nghi-phat-hanh",name:"Nghi ph\xe1t h\xe0nh"},{key:"nghi-so-ngu",name:"Nghi s\u01a1 ngu"},{key:"nghi-tuan-tu",name:"Nghi tu\u1ea7n t\u1ef1"}]}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(i=>{this.cols=i.matches?1:6})}}return(n=l).\u0275fac=function(i){return new(i||n)(t.Y36(d.Yg))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-hanh-le"]],decls:5,vars:4,consts:[[1,"h-full"],[3,"label"],[1,"p-4"],[3,"cols","gutterSize"],[4,"ngFor","ngForOf"],[4,"ngIf"],["appearance","outlined","matRipple","",1,"w-100","h-100","d-flex","flex-column","align-items-center","justify-content-center","cursor-pointer",3,"routerLink"],[1,"w-100"],[1,"w-100","text-center","!text-2xl","!mb-4","!font-bold"]],template:function(i,r){1&i&&(t.TgZ(0,"mat-tab-group",0)(1,"mat-tab",1)(2,"div",2)(3,"mat-grid-list",3),t.YNc(4,f,2,1,"ng-container",4),t.qZA()()()()),2&i&&(t.xp6(1),t.Q6J("label","Nghi ti\u1ebft"),t.xp6(2),t.Q6J("cols",r.cols)("gutterSize","1rem"),t.xp6(1),t.Q6J("ngForOf",r.nghiTiet))},dependencies:[e.sg,e.O5,T.rH,m.uX,m.SP,p.Il,p.DX,h.a8,h.dk,h.n5],styles:["app-hanh-le{height:100%;display:block}"]}),l})();var M=o(9862);let g=(()=>{var n;class l{constructor(i){this.http=i}getNghiTiet(i){return this.http.get(`assets/documents/nghi-tiet/${i}.json`)}}return(n=l).\u0275fac=function(i){return new(i||n)(t.LFG(M.eN))},n.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),l})();var N=o(617),D=o(2296),L=o(6471),S=o(5185),x=o(7466),U=o(6223),u=o(4170),s=o(8525),c=o(3680),_=o(6385);let E=(()=>{var n;class l{constructor(i){this.el=i}ngAfterViewInit(){Object.assign(this.el.nativeElement,this.config),this.el.nativeElement.initialize()}}return(n=l).\u0275fac=function(i){return new(i||n)(t.Y36(t.SBq))},n.\u0275dir=t.lG2({type:n,selectors:[["","appSwiper",""]],inputs:{config:"config"}}),l})();function O(n,l){if(1&n){const a=t.EpF();t.TgZ(0,"mat-radio-group",22),t.NdJ("ngModelChange",function(r){t.CHM(a);const P=t.oxw();return t.KtG(P.nghiTietToggle=r)})("change",function(){t.CHM(a);const r=t.oxw();return t.KtG(r.filterNghiTiet())}),t.TgZ(1,"mat-radio-button",23),t._uU(2,"L\u1ec5 sanh \u0111\u1ed5 xu\u1ed1ng"),t.qZA(),t.TgZ(3,"mat-radio-button",23),t._uU(4,"Tr\xean L\u1ec5 sanh"),t.qZA()()}if(2&n){const a=t.oxw();t.Q6J("ngModel",a.nghiTietToggle),t.xp6(1),t.Q6J("value","down"),t.xp6(2),t.Q6J("value","up")}}function y(n,l){if(1&n&&(t.ynx(0),t.TgZ(1,"div",28),t._uU(2),t.ALo(3,"number"),t.qZA(),t.TgZ(4,"div",29),t._uU(5),t.qZA(),t.TgZ(6,"mat-icon",30),t._uU(7,"expand_less"),t.qZA(),t.BQk()),2&n){const a=t.oxw().index,i=t.oxw();t.xp6(2),t.hij(" ",t.xi3(3,2,a-1,"2.0-0")," "),t.xp6(3),t.hij(" ",null==i.filteredNghiTiet||null==i.filteredNghiTiet.steps[a-1]?null:i.filteredNghiTiet.steps[a-1].xuong," ")}}function H(n,l){if(1&n&&(t.ynx(0),t.TgZ(1,"mat-icon",31),t._uU(2,"expand_more"),t.qZA(),t.TgZ(3,"div",32),t._uU(4),t.ALo(5,"number"),t.qZA(),t.TgZ(6,"div",33),t._uU(7),t.qZA(),t.BQk()),2&n){const a=t.oxw().index,i=t.oxw();t.xp6(4),t.hij(" ",t.xi3(5,2,a+2,"2.0-0")," "),t.xp6(3),t.hij(" ",null==i.filteredNghiTiet||null==i.filteredNghiTiet.steps[a+1]?null:i.filteredNghiTiet.steps[a+1].xuong," ")}}function R(n,l){if(1&n&&(t.ynx(0),t.TgZ(1,"mat-icon",34),t._uU(2,"expand_more"),t.qZA(),t.TgZ(3,"div",35),t._uU(4),t.ALo(5,"number"),t.qZA(),t.TgZ(6,"div",36),t._uU(7),t.qZA(),t.BQk()),2&n){const a=t.oxw().index,i=t.oxw();t.xp6(4),t.hij(" ",t.xi3(5,2,a+3,"2.0-0")," "),t.xp6(3),t.hij(" ",null==i.filteredNghiTiet||null==i.filteredNghiTiet.steps[a+2]?null:i.filteredNghiTiet.steps[a+2].xuong," ")}}function J(n,l){if(1&n&&(t.TgZ(0,"swiper-slide")(1,"div",24),t.YNc(2,y,8,5,"ng-container",25),t._UZ(3,"mat-divider",15),t.TgZ(4,"div",26),t._uU(5),t.ALo(6,"number"),t.ALo(7,"number"),t.qZA(),t.TgZ(8,"div",27),t._uU(9),t.qZA(),t._UZ(10,"mat-divider",15),t.YNc(11,H,8,5,"ng-container",25),t.YNc(12,R,8,5,"ng-container",25),t.qZA()()),2&n){const a=l.$implicit,i=l.index,r=t.oxw();t.xp6(2),t.Q6J("ngIf",null==r.filteredNghiTiet?null:r.filteredNghiTiet.steps[i-1]),t.xp6(3),t.AsE(" ",t.xi3(6,6,i+1,"2.0-0")," / ",t.xi3(7,9,null==r.filteredNghiTiet||null==r.filteredNghiTiet.steps?null:r.filteredNghiTiet.steps.length,"2.0-0")," "),t.xp6(4),t.hij(" ",null==a?null:a.xuong," "),t.xp6(2),t.Q6J("ngIf",null==r.filteredNghiTiet?null:r.filteredNghiTiet.steps[i+1]),t.xp6(1),t.Q6J("ngIf",null==r.filteredNghiTiet?null:r.filteredNghiTiet.steps[i+2])}}function K(n,l){if(1&n&&(t.TgZ(0,"mat-option",23),t._uU(1),t.qZA()),2&n){const a=l.$implicit;t.Q6J("value",a),t.xp6(1),t.hij("",a,"px")}}const k=function(n){return{fontSize:n}};function Q(n,l){if(1&n&&(t.TgZ(0,"p",37),t._uU(1),t.ALo(2,"number"),t.TgZ(3,"strong"),t._uU(4),t.qZA(),t._uU(5),t.qZA()),2&n){const a=l.$implicit,i=l.index,r=t.oxw();t.Q6J("ngStyle",t.VKq(7,k,r.fontSize?r.fontSize+"px":"16px")),t.xp6(1),t.hij(" ",t.xi3(2,4,i+1,"2.0-0"),". "),t.xp6(3),t.hij("",null==a?null:a.xuong,": "),t.xp6(1),t.hij(" ",null==a?null:a.description," ")}}const F=function(){return{link:"tac-vu/hanh-le"}},W=function(n){return{navigate:n}},I=function(n){return{"animate-bounce":n}},Y=function(){return{direction:"vertical"}},j=[{path:"",component:Z},{path:":nghiTietKey",component:(()=>{var n;class l{constructor(i,r,P,A){this.route=i,this.tacVuService=r,this.cd=P,this.breakpointObserver=A,this.fontSize=16,this.isShowGuide=!1,this.filteredNghiTiet={},this.nghiTietToggle="down",this.fontSizeRange=[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46]}ngOnInit(){this.route.params.subscribe(i=>{i.nghiTietKey&&(this.nghiTietKey=i.nghiTietKey,this.getNghiTiet())}),setTimeout(()=>{this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(i=>{i.matches?localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0})):localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!1,isHideBottomNavBar:!1}))})},0)}getNghiTiet(){this.tacVuService.getNghiTiet(this.nghiTietKey).subscribe(i=>{i.data&&(this.nghiTiet=i.data,this.filterNghiTiet(),this.cd.detectChanges())})}filterNghiTiet(){this.filteredNghiTiet.steps=[],this.filteredNghiTiet.steps=this.nghiTiet?.steps?.filter(i=>!i?.toggle||i?.toggle===this.nghiTietToggle),this.cd.detectChanges()}onPrint(i){let r=window.open("","PRINT",`width=${window.innerWidth},height=${window.innerHeight}`);r?.document.write("<html><head><title>"+document.title.toUpperCase()+" PRINTER</title>"),r?.document.write("</head><body >");const P=i,A=document.createElement("DIV");A&&(A.innerHTML=P?.outerHTML,A.childNodes[0].style.padding=0),r?.document.write(A?.outerHTML),r?.document.write("</body></html>"),r?.document.close(),r?.focus(),r?.print()}showGuide(){this.isShowGuide=!0,setTimeout(()=>{this.isShowGuide=!1},3e3)}}return(n=l).\u0275fac=function(i){return new(i||n)(t.Y36(T.gz),t.Y36(g),t.Y36(t.sBO),t.Y36(d.Yg))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-nghi-tiet"]],decls:46,vars:22,consts:[[1,"wrapper-container"],[1,"header",3,"prevPage"],[1,"kinh-header"],[1,"flex-1","max-h-full","overflow-hidden"],[1,"flex","flex-col","justify-center","items-center"],[3,"ngModel","ngModelChange","change",4,"ngIf"],[1,"flex-1","overflow-hidden"],[1,"h-full"],[3,"label"],[1,"h-full","wrapper-container"],[1,"flex","justify-center","items-center","p-4",3,"ngClass"],[1,"flex-1","overflow-hidden",3,"click"],["appSwiper","",1,"h-full",3,"config"],["swiper",""],[4,"ngFor","ngForOf"],[1,"w-full"],[3,"ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],["mat-flat-button","",1,"w-full",3,"color","click"],[1,"p-4"],["printArea",""],[3,"ngStyle",4,"ngFor","ngForOf"],[3,"ngModel","ngModelChange","change"],[3,"value"],[1,"h-full","w-full","flex","items-center","justify-center","flex-col","px-4"],[4,"ngIf"],[1,"text-center","mt-4"],[1,"text-5xl","text-center","mb-4"],[1,"text-center","text-gray-300"],[1,"text-lg","text-center","text-gray-300"],[1,"text-gray-300"],[1,"text-gray-500"],[1,"text-center","text-gray-500"],[1,"text-2xl","text-center","text-gray-500"],[1,"text-gray-400"],[1,"text-center","text-gray-400"],[1,"text-xl","text-center","text-gray-400"],[3,"ngStyle"]],template:function(i,r){if(1&i){const P=t.EpF();t.TgZ(0,"div",0)(1,"app-header",1)(2,"div",2)(3,"app-header-title"),t._uU(4),t.qZA()()(),t.TgZ(5,"div",3)(6,"div",0)(7,"div",4),t.YNc(8,O,5,3,"mat-radio-group",5),t.qZA(),t.TgZ(9,"div",6)(10,"mat-tab-group",7)(11,"mat-tab",8)(12,"div",9)(13,"div",10)(14,"mat-icon"),t._uU(15,"expand_less"),t.qZA(),t.TgZ(16,"span"),t._uU(17,"L\u01b0\u1edbt l\xean"),t.qZA(),t.TgZ(18,"mat-icon"),t._uU(19,"expand_less"),t.qZA()(),t.TgZ(20,"div",11),t.NdJ("click",function(){return r.showGuide()}),t.TgZ(21,"swiper-container",12,13),t.YNc(23,J,13,12,"swiper-slide",14),t.qZA()(),t.TgZ(24,"div",10)(25,"mat-icon"),t._uU(26,"expand_less"),t.qZA(),t.TgZ(27,"span"),t._uU(28,"L\u01b0\u1edbt l\xean"),t.qZA(),t.TgZ(29,"mat-icon"),t._uU(30,"expand_less"),t.qZA()()()(),t.TgZ(31,"mat-tab",8)(32,"mat-form-field",15)(33,"mat-label"),t._uU(34,"C\u1ee1 ch\u1eef"),t.qZA(),t.TgZ(35,"mat-select",16),t.NdJ("ngModelChange",function(w){return r.fontSize=w}),t.YNc(36,K,2,2,"mat-option",17),t.qZA()(),t.TgZ(37,"button",18),t.NdJ("click",function(){t.CHM(P);const w=t.MAs(42);return t.KtG(r.onPrint(w))}),t.TgZ(38,"mat-icon"),t._uU(39,"print"),t.qZA(),t._uU(40,"In "),t.qZA(),t.TgZ(41,"div",19,20)(43,"h1"),t._uU(44),t.qZA(),t.YNc(45,Q,6,9,"p",21),t.qZA()()()()()()()}2&i&&(t.xp6(1),t.Q6J("prevPage",t.VKq(15,W,t.DdM(14,F))),t.xp6(3),t.Oqu(null==r.nghiTiet?null:r.nghiTiet.name),t.xp6(4),t.Q6J("ngIf",null==r.nghiTiet?null:r.nghiTiet.activeToggle),t.xp6(3),t.Q6J("label","B\u1ed5n x\u01b0\u1edbng"),t.xp6(2),t.Q6J("ngClass",t.VKq(17,I,r.isShowGuide)),t.xp6(8),t.Q6J("config",t.DdM(19,Y)),t.xp6(2),t.Q6J("ngForOf",null==r.filteredNghiTiet?null:r.filteredNghiTiet.steps),t.xp6(1),t.Q6J("ngClass",t.VKq(20,I,r.isShowGuide)),t.xp6(7),t.Q6J("label","In"),t.xp6(4),t.Q6J("ngModel",r.fontSize),t.xp6(1),t.Q6J("ngForOf",r.fontSizeRange),t.xp6(1),t.Q6J("color","primary"),t.xp6(7),t.Oqu(null==r.nghiTiet?null:r.nghiTiet.name),t.xp6(1),t.Q6J("ngForOf",null==r.filteredNghiTiet?null:r.filteredNghiTiet.steps))},dependencies:[e.mk,e.sg,e.O5,e.PC,m.uX,m.SP,N.Hw,D.lW,L.G,S.d,x.VQ,x.U0,U.JJ,U.On,u.KE,u.hX,s.gD,c.ey,_.d,E,e.JJ],styles:["app-nghi-tiet{display:flex;flex-direction:column;height:100%;max-height:100%;overflow:hidden}  app-nghi-tiet .mat-mdc-tab-body-wrapper{height:100%}"]}),l})()}];let z=(()=>{var n;class l{}return(n=l).\u0275fac=function(i){return new(i||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[T.Bz.forChild(j),T.Bz]}),l})();var q=o(4085);let G=(()=>{var n;class l{}return(n=l).\u0275fac=function(i){return new(i||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[e.ez,z,m.Nh,N.Ps,D.ot,p.N6,h.QW,q.O,x.Fk,U.u5,u.lN,s.LD,_.t]}),l})()}}]);