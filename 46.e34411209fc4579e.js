"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[46],{3046:(St,I,i)=>{i.r(I),i.d(I,{LibraryModule:()=>p});var l=i(6895),u=i(9299),t=i(4650),v=i(2289),U=i(529);class s{constructor(a){this.http=a}getStaticBooks(){return this.http.get("assets/documents/library/static-library.json")}getBookByKey(a){return this.http.get(`assets/documents/library/${a}.json`)}}s.\u0275fac=function(a){return new(a||s)(t.LFG(U.eN))},s.\u0275prov=t.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"});var q=i(6256),C=i(3848),T=i(3238);const E=["*"],$=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],j=["[mat-card-avatar], [matCardAvatar]","mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]","*"],z=new t.OlP("MAT_CARD_CONFIG");let Z=(()=>{class n{constructor(e){this.appearance=e?.appearance||"raised"}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(z,8))},n.\u0275cmp=t.Xpm({type:n,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:4,hostBindings:function(e,o){2&e&&t.ekj("mat-mdc-card-outlined","outlined"===o.appearance)("mdc-card--outlined","outlined"===o.appearance)},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:E,decls:1,vars:0,template:function(e,o){1&e&&(t.F$t(),t.Hsn(0))},styles:['.mdc-card{display:flex;flex-direction:column;box-sizing:border-box}.mdc-card::after{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid rgba(0,0,0,0);border-radius:inherit;content:"";pointer-events:none;pointer-events:none}@media screen and (forced-colors: active){.mdc-card::after{border-color:CanvasText}}.mdc-card--outlined::after{border:none}.mdc-card__content{border-radius:inherit;height:100%}.mdc-card__media{position:relative;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-size:cover}.mdc-card__media::before{display:block;content:""}.mdc-card__media:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__media:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mdc-card__media--square::before{margin-top:100%}.mdc-card__media--16-9::before{margin-top:56.25%}.mdc-card__media-content{position:absolute;top:0;right:0;bottom:0;left:0;box-sizing:border-box}.mdc-card__primary-action{display:flex;flex-direction:column;box-sizing:border-box;position:relative;outline:none;color:inherit;text-decoration:none;cursor:pointer;overflow:hidden}.mdc-card__primary-action:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__primary-action:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mdc-card__actions{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;min-height:52px;padding:8px}.mdc-card__actions--full-bleed{padding:0}.mdc-card__action-buttons,.mdc-card__action-icons{display:flex;flex-direction:row;align-items:center;box-sizing:border-box}.mdc-card__action-icons{flex-grow:1;justify-content:flex-end}.mdc-card__action-buttons+.mdc-card__action-icons{margin-left:16px;margin-right:0}[dir=rtl] .mdc-card__action-buttons+.mdc-card__action-icons,.mdc-card__action-buttons+.mdc-card__action-icons[dir=rtl]{margin-left:0;margin-right:16px}.mdc-card__action{display:inline-flex;flex-direction:row;align-items:center;box-sizing:border-box;justify-content:center;cursor:pointer;user-select:none}.mdc-card__action:focus{outline:none}.mdc-card__action--button{margin-left:0;margin-right:8px;padding:0 8px}[dir=rtl] .mdc-card__action--button,.mdc-card__action--button[dir=rtl]{margin-left:8px;margin-right:0}.mdc-card__action--button:last-child{margin-left:0;margin-right:0}[dir=rtl] .mdc-card__action--button:last-child,.mdc-card__action--button:last-child[dir=rtl]{margin-left:0;margin-right:0}.mdc-card__actions--full-bleed .mdc-card__action--button{justify-content:space-between;width:100%;height:auto;max-height:none;margin:0;padding:8px 16px;text-align:left}[dir=rtl] .mdc-card__actions--full-bleed .mdc-card__action--button,.mdc-card__actions--full-bleed .mdc-card__action--button[dir=rtl]{text-align:right}.mdc-card__action--icon{margin:-6px 0;padding:12px}.mat-mdc-card{position:relative;border-radius:var(--mdc-elevated-card-container-shape, var(--mdc-shape-medium, 4px));background-color:var(--mdc-elevated-card-container-color, transparent);border-width:0;border-style:solid;border-color:var(--mdc-elevated-card-container-color, transparent)}.mat-mdc-card .mdc-card::after{border-radius:var(--mdc-elevated-card-container-shape, var(--mdc-shape-medium, 4px))}.mat-mdc-card-outlined{border-width:var(--mdc-outlined-card-outline-width, 1px);border-style:solid;border-color:var(--mdc-outlined-card-outline-color, transparent)}.mat-mdc-card-title,.mat-mdc-card-subtitle{display:block;margin:0}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle{padding:16px 16px 0}.mat-mdc-card-header{display:flex;padding:16px 16px 0}.mat-mdc-card-content{display:block;padding:0 16px}.mat-mdc-card-content:first-child{padding-top:16px}.mat-mdc-card-content:last-child{padding-bottom:16px}.mat-mdc-card-title-group{display:flex;justify-content:space-between;width:100%}.mat-mdc-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;margin-bottom:16px;object-fit:cover}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title{line-height:normal}.mat-mdc-card-sm-image{width:80px;height:80px}.mat-mdc-card-md-image{width:112px;height:112px}.mat-mdc-card-lg-image{width:152px;height:152px}.mat-mdc-card-xl-image{width:240px;height:240px}.mat-mdc-card-subtitle~.mat-mdc-card-title,.mat-mdc-card-title~.mat-mdc-card-subtitle,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-title-group .mat-mdc-card-title,.mat-mdc-card-title-group .mat-mdc-card-subtitle{padding-top:0}.mat-mdc-card-content>:last-child:not(.mat-mdc-card-footer){margin-bottom:0}.mat-mdc-card-actions-align-end{justify-content:flex-end}'],encapsulation:2,changeDetection:0}),n})(),A=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=t.lG2({type:n,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]}),n})(),O=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=t.lG2({type:n,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]}),n})(),F=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=t.lG2({type:n,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-mdc-card-subtitle"]}),n})(),J=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=t.Xpm({type:n,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:j,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(e,o){1&e&&(t.F$t($),t.Hsn(0),t.TgZ(1,"div",0),t.Hsn(2,1),t.qZA(),t.Hsn(3,2))},encapsulation:2,changeDetection:0}),n})(),x=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275dir=t.lG2({type:n,selectors:[["","mat-card-image",""],["","matCardImage",""]],hostAttrs:[1,"mat-mdc-card-image","mdc-card__media"]}),n})(),ot=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[T.BQ,l.ez,T.BQ]}),n})();var S=i(7392),M=i(4859),_=i(3267),y=i(9549),B=i(284),b=i(4006),N=i(4850),L=i(6709),w=i(782);function rt(n,a){if(1&n&&(t.TgZ(0,"mat-grid-tile",6)(1,"div",11)(2,"mat-card-header")(3,"mat-card-title"),t._uU(4),t.qZA(),t.TgZ(5,"mat-card-subtitle"),t._uU(6),t.qZA()(),t.TgZ(7,"mat-card-content")(8,"div",12),t._uU(9),t.qZA()()()()),2&n){const e=t.oxw().$implicit,o=t.oxw();t.Q6J("colspan",2===o.gridForYouCols?3:1)("rowspan",1),t.xp6(4),t.Oqu(null==e?null:e.name),t.xp6(2),t.Oqu(null==e?null:e.subtitle),t.xp6(3),t.Oqu((null==e||null==e.description?null:e.description.length)>312?(null==e||null==e.description?null:e.description.substring(0,312))+"...":null==e?null:e.description)}}function it(n,a){if(1&n&&(t.TgZ(0,"mat-card-header")(1,"mat-card-title"),t._uU(2),t.qZA(),t.TgZ(3,"mat-card-subtitle"),t._uU(4),t.qZA()()),2&n){const e=t.oxw().$implicit;t.xp6(2),t.Oqu(null==e?null:e.name),t.xp6(2),t.Oqu(null==e?null:e.subtitle)}}function ct(n,a){if(1&n&&(t.TgZ(0,"mat-card-content")(1,"div",12),t._uU(2),t.qZA()()),2&n){const e=t.oxw().$implicit;t.xp6(2),t.Oqu((null==e||null==e.description?null:e.description.length)>312?(null==e||null==e.description?null:e.description.substring(0,312))+"...":null==e?null:e.description)}}const dt=function(){return{focused:!0}},lt=function(n){return{"card-image-wrapper":n}};function st(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"mat-grid-tile")(1,"mat-card",4),t.NdJ("click",function(){const d=t.CHM(e).$implicit,c=t.oxw();return t.KtG(c.onCardClick(d))}),t.TgZ(2,"mat-grid-list",5)(3,"mat-grid-tile",6)(4,"div",7),t._UZ(5,"img",8),t.qZA()(),t.YNc(6,rt,10,5,"mat-grid-tile",9),t.qZA(),t.YNc(7,it,5,2,"mat-card-header",10),t.YNc(8,ct,3,1,"mat-card-content",10),t.qZA()()}if(2&n){const e=a.$implicit,o=t.oxw();t.xp6(1),t.Q6J("ngClass",t.DdM(12,dt)),t.xp6(1),t.Q6J("cols",2===o.gridForYouCols?4:1)("gutterSize",2===o.gridForYouCols?"16":"0")("rowHeight",2===o.gridForYouCols?"100%":"2:1"),t.xp6(1),t.Q6J("colspan",1)("rowspan",1),t.xp6(1),t.Q6J("ngClass",t.VKq(13,lt,2==o.gridForYouCols)),t.xp6(1),t.Q6J("src",null==e?null:e.image,t.LSH)("alt",null==e?null:e.name),t.xp6(1),t.Q6J("ngIf",2===o.gridForYouCols),t.xp6(1),t.Q6J("ngIf",1==o.gridForYouCols),t.xp6(1),t.Q6J("ngIf",1==o.gridForYouCols)}}class h{constructor(a){this.breakpointObserver=a,this.gridForYouCols=2,this.forYouBooks=[],this.onItemFocus=new t.vpe}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(a=>{this.gridForYouCols=a.matches?1:2})}ngOnChanges(){this.getForYouBooks()}onCardClick(a){this.onItemFocus.emit(a)}getForYouBooks(){this.forYouBooks=this.books?.filter(a=>a?.published)}}function mt(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"div")(1,"div",21)(2,"div",22)(3,"mat-label"),t._uU(4,"Published"),t.qZA(),t.TgZ(5,"mat-checkbox",23),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.published=r)}),t.qZA()(),t.TgZ(6,"div",22)(7,"mat-form-field",24)(8,"mat-label"),t._uU(9,"Key"),t.qZA(),t.TgZ(10,"input",25),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.key=r)}),t.qZA()()(),t.TgZ(11,"div",22)(12,"mat-form-field",24)(13,"mat-label"),t._uU(14,"T\xean"),t.qZA(),t.TgZ(15,"input",25),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.name=r)}),t.qZA()()(),t.TgZ(16,"div",22)(17,"mat-form-field",24)(18,"mat-label"),t._uU(19,"Subtitle"),t.qZA(),t.TgZ(20,"input",25),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.subtitle=r)}),t.qZA()()(),t.TgZ(21,"div",22)(22,"mat-form-field",24)(23,"mat-label"),t._uU(24,"Path"),t.qZA(),t.TgZ(25,"input",25),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.path=r)}),t.qZA()()(),t.TgZ(26,"div",22)(27,"div",26),t._UZ(28,"img",27),t.TgZ(29,"div")(30,"mat-form-field",24)(31,"mat-label"),t._uU(32,"H\xecnh \u1ea3nh"),t.qZA(),t.TgZ(33,"input",25),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.image=r)}),t.qZA()()()()(),t.TgZ(34,"div",28)(35,"mat-form-field",29)(36,"mat-label"),t._uU(37,"M\xf4 t\u1ea3"),t.qZA(),t.TgZ(38,"textarea",30),t.NdJ("ngModelChange",function(r){const c=t.CHM(e).$implicit;return t.KtG(c.description=r)}),t.qZA()()()(),t._UZ(39,"mat-divider"),t.qZA()}if(2&n){const e=a.$implicit;t.xp6(5),t.Q6J("ngModel",e.published),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.key),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.name),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.subtitle),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.path),t.xp6(3),t.Q6J("src",e.image,t.LSH)("alt",e.name),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.image),t.xp6(2),t.Q6J("appearance","outline"),t.xp6(3),t.Q6J("ngModel",e.description)}}function gt(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"mat-tab",17)(1,"div",6)(2,"div",18)(3,"h2"),t._uU(4,"Settings"),t.qZA(),t.TgZ(5,"button",16),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.saveSettings())}),t._uU(6," Save "),t.qZA()(),t.YNc(7,mt,40,15,"div",19),t.TgZ(8,"button",20),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.addNewSettings())}),t._uU(9,"+ Add new"),t.qZA()()()}if(2&n){const e=t.oxw();t.xp6(5),t.Q6J("color","primary"),t.xp6(2),t.Q6J("ngForOf",e.staticBooks)}}function pt(n,a){if(1&n&&(t.TgZ(0,"div",31)(1,"h4"),t._uU(2,"M\xf4 t\u1ea3:"),t.qZA(),t.TgZ(3,"p"),t._uU(4),t.qZA(),t._UZ(5,"mat-divider"),t.qZA()),2&n){const e=t.oxw();t.xp6(4),t.Oqu(null==e.previewingItem?null:e.previewingItem.description)}}function ut(n,a){if(1&n&&(t.TgZ(0,"span"),t._uU(1," \u0111\u1ebfn \u0111o\u1ea1n: "),t._UZ(2,"br"),t._uU(3),t.qZA()),2&n){const e=t.oxw(2);t.xp6(3),t.hij(" ",null==e.previewingItem||null==e.previewingItem.reading?null:e.previewingItem.reading.stopAt," ")}}function ht(n,a){if(1&n&&(t.TgZ(0,"div",31)(1,"h4"),t._uU(2,"\u0110ang \u0111\u1ecdc:"),t.qZA(),t.TgZ(3,"p")(4,"strong"),t._uU(5),t.qZA(),t.YNc(6,ut,4,1,"span",32),t.qZA()()),2&n){const e=t.oxw();t.xp6(5),t.Oqu(null==e.previewingItem||null==e.previewingItem.reading?null:e.previewingItem.reading.name),t.xp6(1),t.Q6J("ngIf",null==e.previewingItem||null==e.previewingItem.reading?null:e.previewingItem.reading.stopAt)}}function ft(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"button",33),t.NdJ("click",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onRead(null==r.previewingItem||null==r.previewingItem.reading?null:r.previewingItem.reading.location))}),t._uU(1," \u0110\u1eccC TI\u1ebeP "),t.qZA()}2&n&&t.Q6J("color","primary")}h.\u0275fac=function(a){return new(a||h)(t.Y36(v.Yg))},h.\u0275cmp=t.Xpm({type:h,selectors:[["librarian-books"]],inputs:{books:"books"},outputs:{onItemFocus:"onItemFocus"},features:[t.TTD],decls:6,vars:3,consts:[[1,"container-fluid"],[1,"for-your-books"],["gutterSize","30",3,"cols","rowHeight"],[4,"ngFor","ngForOf"],[1,"card-grid",3,"ngClass","click"],[3,"cols","gutterSize","rowHeight"],[3,"colspan","rowspan"],[3,"ngClass"],["mat-card-image","",3,"src","alt"],[3,"colspan","rowspan",4,"ngIf"],[4,"ngIf"],[1,"h-100","w-100"],[1,"card-description"]],template:function(a,e){1&a&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h2"),t._uU(3,"D\xe0nh cho b\u1ea1n"),t.qZA(),t.TgZ(4,"mat-grid-list",2),t.YNc(5,st,9,15,"mat-grid-tile",3),t.qZA()()()),2&a&&(t.xp6(4),t.Q6J("cols",e.gridForYouCols)("rowHeight",2===e.gridForYouCols?"5:2":"4:5"),t.xp6(1),t.Q6J("ngForOf",e.forYouBooks))},dependencies:[l.mk,l.sg,l.O5,w.Il,w.DX,Z,O,J,x,F,A],styles:[".card-grid[_ngcontent-%COMP%]{width:calc(100% - 3px);height:calc(100% - 3px);overflow:hidden;border-radius:1rem;cursor:pointer}.card-grid.focused[_ngcontent-%COMP%]{background-color:#eaf1fb}.card-grid[_ngcontent-%COMP%]   .card-image-wrapper[_ngcontent-%COMP%]{width:100%;height:100%;overflow:hidden;padding:1rem 0 1rem 1rem}.card-grid[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:1rem;width:100%;height:100%;object-fit:cover}"]});class f{constructor(a,e,o,r,d){this.breakpointObserver=a,this.libraryService=e,this.changeDetector=o,this.authService=r,this.router=d,this.staticBooks=[],this.contentEditable=!1,this.contentEditable=this.authService.contentEditable}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(a=>{this.mode=a.matches?"over":"side"}),this.getBooks()}getBooks(){this.getStaticBooks()}getStaticBooks(){this.libraryService.getStaticBooks().subscribe(a=>{a.data&&(this.staticBooks=a.data,this.getReadingBooks(),this.changeDetector.detectChanges())})}getReadingBooks(){const a=JSON.parse(localStorage.getItem("reading")||"[]");this.staticBooks.forEach(e=>{const o=a.find(r=>r?.key===e?.key);o&&(e.reading=o)})}saveSettings(){const a={data:this.staticBooks.map(e=>({name:e?.name,image:e?.image,description:e?.description,key:e?.key,subtitle:e?.subtitle,path:e?.path,published:e?.published}))};navigator.clipboard.writeText(JSON.stringify(a))}onRead(a){this.router.navigateByUrl(a.replace(location.origin,""))}addNewSettings(){this.staticBooks.push({})}onItemFocus(a,e){this.previewingItem?.key===a.key?e.toggle():(this.previewingItem=a,e.open())}}f.\u0275fac=function(a){return new(a||f)(t.Y36(v.Yg),t.Y36(s),t.Y36(t.sBO),t.Y36(q.e),t.Y36(u.F0))},f.\u0275cmp=t.Xpm({type:f,selectors:[["app-librarian"]],decls:28,vars:13,consts:[[1,"librarian-container"],["label","S\xe1ch"],[3,"books","onItemFocus"],["label","Settings",4,"ngIf"],[3,"mode","position"],["libradianDrawer",""],[1,"container-fluid"],[1,"preview-area"],["mat-icon-button","",1,"preview-close",3,"click"],[1,"d-flex","align-items-center","flex-column"],[1,"text-center"],[1,"preview-image-wrapper"],["mat-card-image","",3,"src","alt"],["class","w-100",4,"ngIf"],[1,"read-now-button"],["mat-flat-button","","style","margin-bottom: 1rem;",3,"color","click",4,"ngIf"],["mat-flat-button","",3,"color","click"],["label","Settings"],[1,"w-100","d-flex","align-items-center","justify-content-between"],[4,"ngFor","ngForOf"],["mat-flat-button","",3,"click"],[1,"d-flex","flex-wrap"],[1,"form-group"],[3,"ngModel","ngModelChange"],[3,"appearance"],["type","text","matInput","",3,"ngModel","ngModelChange"],[1,"d-flex"],["width","150px",3,"src","alt"],[1,"form-group","w-100",2,"margin-top","1rem"],[1,"w-100",3,"appearance"],["matInput","","resize","",3,"ngModel","ngModelChange"],[1,"w-100"],[4,"ngIf"],["mat-flat-button","",2,"margin-bottom","1rem",3,"color","click"]],template:function(a,e){if(1&a){const o=t.EpF();t.TgZ(0,"mat-drawer-container",0)(1,"mat-drawer-content")(2,"mat-tab-group")(3,"mat-tab",1)(4,"librarian-books",2),t.NdJ("onItemFocus",function(d){t.CHM(o);const c=t.MAs(7);return t.KtG(e.onItemFocus(d,c))}),t.qZA()(),t.YNc(5,gt,10,2,"mat-tab",3),t.qZA()(),t.TgZ(6,"mat-drawer",4,5)(8,"div",6)(9,"div",7)(10,"button",8),t.NdJ("click",function(){t.CHM(o);const d=t.MAs(7);return t.KtG(d.close())}),t.TgZ(11,"mat-icon"),t._uU(12,"close"),t.qZA()(),t.TgZ(13,"div",9)(14,"h2",10),t._uU(15,"T\xf3m t\u1eaft"),t.qZA(),t.TgZ(16,"div",11),t._UZ(17,"img",12),t.qZA(),t.TgZ(18,"h3",10),t._uU(19),t.qZA(),t.TgZ(20,"p",10),t._uU(21),t.qZA(),t.YNc(22,pt,6,1,"div",13),t.YNc(23,ht,7,2,"div",13),t.qZA()()(),t.TgZ(24,"div",14),t.YNc(25,ft,2,1,"button",15),t.TgZ(26,"button",16),t.NdJ("click",function(){return e.onRead(null==e.previewingItem?null:e.previewingItem.path)}),t._uU(27),t.qZA()()()()}2&a&&(t.xp6(4),t.Q6J("books",e.staticBooks),t.xp6(1),t.Q6J("ngIf",e.contentEditable),t.xp6(1),t.Q6J("mode","side")("position","end"),t.xp6(11),t.Q6J("src",null==e.previewingItem?null:e.previewingItem.image,t.LSH)("alt",null==e.previewingItem?null:e.previewingItem.name),t.xp6(2),t.Oqu(null==e.previewingItem?null:e.previewingItem.name),t.xp6(2),t.Oqu(null==e.previewingItem?null:e.previewingItem.subtitle),t.xp6(1),t.Q6J("ngIf",!(null==e.previewingItem||!e.previewingItem.description)),t.xp6(1),t.Q6J("ngIf",!(null==e.previewingItem||null==e.previewingItem.reading||!e.previewingItem.reading.key)),t.xp6(2),t.Q6J("ngIf",!(null==e.previewingItem||null==e.previewingItem.reading||!e.previewingItem.reading.key)),t.xp6(1),t.Q6J("color","primary"),t.xp6(1),t.hij(" \u0110\u1eccC ",null!=e.previewingItem&&null!=e.previewingItem.reading&&e.previewingItem.reading.key?"T\u1eea \u0110\u1ea6U":""," "))},dependencies:[l.sg,l.O5,C.uX,C.SP,x,S.Hw,M.lW,M.RK,_.jA,_.kh,_.LW,y.KE,y.hX,B.Nt,b.Fj,b.JJ,b.On,N.d,L.oG,h],styles:[".librarian-container[_ngcontent-%COMP%]{background-color:#fff}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]{min-width:300px;width:100%;max-width:400px;background-color:#d3e3fd;border-left-color:#d3e3fd;border-top-left-radius:1rem}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]   .preview-close[_ngcontent-%COMP%]{position:absolute;top:1rem;left:1rem}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]   .preview-area[_ngcontent-%COMP%]{padding:1rem}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]   .preview-area[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]   .preview-area[_ngcontent-%COMP%]   .preview-image-wrapper[_ngcontent-%COMP%]{width:200px;height:300px;border-radius:1rem;margin:1rem 0}.librarian-container[_ngcontent-%COMP%]   mat-drawer[_ngcontent-%COMP%]   .preview-area[_ngcontent-%COMP%]   .preview-image-wrapper[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;object-fit:cover}.librarian-container[_ngcontent-%COMP%]   .read-now-button[_ngcontent-%COMP%]{width:100%;position:sticky;background-color:#d3e3fd;padding:1rem;bottom:0}.librarian-container[_ngcontent-%COMP%]   .read-now-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%;border-radius:50px}.librarian-container[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{padding:0 1rem}"]});var _t=i(1481),bt=i(3646),vt=i(8109),D=i(3162),Ct=i(8974),xt=i(1746);function Mt(n,a){1&n&&t._UZ(0,"mat-progress-bar",7)}function yt(n,a){if(1&n){const e=t.EpF();t.TgZ(0,"div",8)(1,"cp-content-creator",9),t.NdJ("save",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onSaveContent())})("nextContent",function(){t.CHM(e);const r=t.oxw();return t.KtG(r.onNextContent())}),t.qZA()()}if(2&n){const e=t.oxw();t.xp6(1),t.Q6J("data",e.content)("rootContent",e.rootContent)}}const Y=function(n){return{link:n}},wt=function(n){return{text:"Tr\u01b0\u1edbc \u0111\xf3",navigate:n}},kt=function(n){return{text:"Ti\u1ebfp theo",navigate:n}};function It(n,a){if(1&n&&t._UZ(0,"app-bottom-navigator",10),2&n){const e=t.oxw();t.Q6J("prev",t.VKq(4,wt,t.VKq(2,Y,e.navigate.prev.link)))("next",t.VKq(8,kt,t.VKq(6,Y,e.navigate.next.link)))}}const Tt=function(){return{link:"/trang-chu/thu-vien"}},Zt=function(n){return{navigate:n}};class m{constructor(a,e,o,r,d){this.router=a,this.route=e,this.breakpointObserver=o,this.libraryService=r,this.titleService=d,this.isLoading=!1,this.navigate={prev:{link:void 0},next:{link:void 0}}}ngOnInit(){this.route.params.subscribe(a=>{a.key&&!a.level&&this.getContent(a.key,a.level),a.key&&a.level&&this.getContent(a.key,a.level)})}getContent(a,e){this.isLoading=!0,this.libraryService.getBookByKey(a).subscribe(o=>{if(o.data){if(this.rootContent=o.data,0===this.rootContent?.content?.length&&this.rootContent?.content.push({type:"block",key:a.replaceAll("-",""),content:[],attrs:{hash:"",pathname:location.pathname}}),this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(c=>{c.matches?localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0})):localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!1,isHideBottomNavBar:!1}))}),e){const c=(Q,P)=>{let H;return Q.some(k=>H=k.key===P?k:c(k.content||[],P)),H};this.content=c(o.data.content,location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")),this.titleService.setTitle(`${this.content?.name} | ${this.rootContent?.name} | CaoDaiON`),this.isLoading=!1,this.getNavigateLink()}else this.content=o.data,this.titleService.setTitle(`${this.content.name} | ${this.rootContent.name} | CaoDaiON`),this.isLoading=!1,this.getNavigateLink();location.hash&&setTimeout(()=>{const c=document.getElementById(`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${location.hash.replace("#","")}`);c.style.color="#4285f4",document.getElementById("contentCreatorWrapper").scroll({top:c.offsetTop-(this.content.audio?60:0)})},0);let r=JSON.parse(localStorage.getItem("reading")||"[]");r||(r=[]);let d=r.find(c=>c.key==this.rootContent.key);d?d.content!==this.content.key&&(d.content=this.content.key,d.name=this.content.name,d.location=location.href):r.push({name:this.rootContent.name,content:this.content.key||this.rootContent.key,key:this.rootContent.key,location:location.href}),localStorage.setItem("reading",JSON.stringify(r))}})}onSaveContent(){console.log(this.rootContent),navigator.clipboard.writeText(JSON.stringify({data:this.rootContent}))}onNextContent(){this.router.navigate([this.navigate.next.link],{queryParams:{autoplay:!0}}).then(()=>{localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0}))})}getNavigateLink(){this.navigate.prev.link=this.rootContent.content[this.rootContent.content.findIndex(e=>e.key==this.content?.key)-1]?.attrs.pathname+this.rootContent.content[this.rootContent.content.findIndex(e=>e.key==this.content.key)-1]?.attrs.hash||"/",this.navigate.next.link=this.rootContent.content[this.rootContent.content.findIndex(e=>e.key==this.content?.key)+1]?.attrs.pathname+this.rootContent.content[this.rootContent.content.findIndex(e=>e.key==this.content.key)+1]?.attrs.hash||"/"}}m.\u0275fac=function(a){return new(a||m)(t.Y36(u.F0),t.Y36(u.gz),t.Y36(v.Yg),t.Y36(s),t.Y36(_t.Dx))},m.\u0275cmp=t.Xpm({type:m,selectors:[["app-book"]],decls:9,vars:8,consts:[[1,"wrapper-container","book-content-container"],[1,"header",3,"prevPage"],[1,"book-header"],["mode","indeterminate",4,"ngIf"],[1,"book-container-wrapper"],["class","h-100",4,"ngIf"],[3,"prev","next",4,"ngIf"],["mode","indeterminate"],[1,"h-100"],[3,"data","rootContent","save","nextContent"],[3,"prev","next"]],template:function(a,e){1&a&&(t.TgZ(0,"div",0)(1,"app-header",1)(2,"div",2)(3,"app-header-title"),t._uU(4),t.qZA()()(),t.YNc(5,Mt,1,0,"mat-progress-bar",3),t.TgZ(6,"div",4),t.YNc(7,yt,2,2,"div",5),t.qZA(),t.YNc(8,It,1,10,"app-bottom-navigator",6),t.qZA()),2&a&&(t.xp6(1),t.Q6J("prevPage",t.VKq(6,Zt,t.DdM(5,Tt))),t.xp6(3),t.Oqu(null==e.content?null:e.content.name),t.xp6(1),t.Q6J("ngIf",e.isLoading),t.xp6(2),t.Q6J("ngIf",e.content),t.xp6(1),t.Q6J("ngIf","block"==(null==e.content?null:e.content.type)))},dependencies:[l.O5,bt.G,vt.d,D.pW,Ct.S,xt.T],styles:["app-book{display:flex;flex-direction:column;height:100%;max-height:100%;overflow:hidden}  app-book .book-content-title{padding:2rem;margin:0}  app-book .book-container-wrapper{flex:1;overflow:hidden}  app-book .book-header{white-space:normal;overflow:hidden;width:100%}"]});const At=[{path:"",children:[{path:"",component:f},{path:":key",component:m},{path:":key/:level",component:m}]}];class g{}g.\u0275fac=function(a){return new(a||g)},g.\u0275mod=t.oAB({type:g}),g.\u0275inj=t.cJS({imports:[u.Bz.forChild(At),u.Bz]});var Ot=i(4546),Ft=i(6038),Jt=i(7726);class p{}p.\u0275fac=function(a){return new(a||p)},p.\u0275mod=t.oAB({type:p}),p.\u0275inj=t.cJS({imports:[l.ez,g,C.Nh,w.N6,ot,S.Ps,M.ot,_.SJ,y.lN,B.c,b.u5,N.t,L.p9,Ot.O,D.Cv,Ft.m,Jt.e]})}}]);