"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[578],{782:(H,C,c)=>{c.d(C,{DX:()=>y,Il:()=>n,N6:()=>d});var i=c(4650),m=c(3238),u=c(1281),v=c(445);const p=["*"];class x{constructor(){this.columnIndex=0,this.rowIndex=0}get rowCount(){return this.rowIndex+1}get rowspan(){const e=Math.max(...this.tracker);return e>1?this.rowCount+e-1:this.rowCount}update(e,t){this.columnIndex=0,this.rowIndex=0,this.tracker=new Array(e),this.tracker.fill(0,0,this.tracker.length),this.positions=t.map(r=>this._trackTile(r))}_trackTile(e){const t=this._findMatchingGap(e.colspan);return this._markTilePosition(t,e),this.columnIndex=t+e.colspan,new T(this.rowIndex,t)}_findMatchingGap(e){let t=-1,r=-1;do{this.columnIndex+e>this.tracker.length?(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),r=this._findGapEndIndex(t)):(t=this.tracker.indexOf(0,this.columnIndex),-1!=t?(r=this._findGapEndIndex(t),this.columnIndex=t+1):(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),r=this._findGapEndIndex(t)))}while(r-t<e||0==r);return Math.max(t,0)}_nextRow(){this.columnIndex=0,this.rowIndex++;for(let e=0;e<this.tracker.length;e++)this.tracker[e]=Math.max(0,this.tracker[e]-1)}_findGapEndIndex(e){for(let t=e+1;t<this.tracker.length;t++)if(0!=this.tracker[t])return t;return this.tracker.length}_markTilePosition(e,t){for(let r=0;r<t.colspan;r++)this.tracker[e+r]=t.rowspan}}class T{constructor(e,t){this.row=e,this.col=t}}const f=new i.OlP("MAT_GRID_LIST");let y=(()=>{class o{constructor(t,r){this._element=t,this._gridList=r,this._rowspan=1,this._colspan=1}get rowspan(){return this._rowspan}set rowspan(t){this._rowspan=Math.round((0,u.su)(t))}get colspan(){return this._colspan}set colspan(t){this._colspan=Math.round((0,u.su)(t))}_setStyle(t,r){this._element.nativeElement.style[t]=r}}return o.\u0275fac=function(t){return new(t||o)(i.Y36(i.SBq),i.Y36(f,8))},o.\u0275cmp=i.Xpm({type:o,selectors:[["mat-grid-tile"]],hostAttrs:[1,"mat-grid-tile"],hostVars:2,hostBindings:function(t,r){2&t&&i.uIk("rowspan",r.rowspan)("colspan",r.colspan)},inputs:{rowspan:"rowspan",colspan:"colspan"},exportAs:["matGridTile"],ngContentSelectors:p,decls:2,vars:0,consts:[[1,"mat-grid-tile-content"]],template:function(t,r){1&t&&(i.F$t(),i.TgZ(0,"div",0),i.Hsn(1),i.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"],encapsulation:2,changeDetection:0}),o})();const D=/^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;class M{constructor(){this._rows=0,this._rowspan=0}init(e,t,r,l){this._gutterSize=_(e),this._rows=t.rowCount,this._rowspan=t.rowspan,this._cols=r,this._direction=l}getBaseTileSize(e,t){return`(${e}% - (${this._gutterSize} * ${t}))`}getTilePosition(e,t){return 0===t?"0":g(`(${e} + ${this._gutterSize}) * ${t}`)}getTileSize(e,t){return`(${e} * ${t}) + (${t-1} * ${this._gutterSize})`}setStyle(e,t,r){let l=100/this._cols,s=(this._cols-1)/this._cols;this.setColStyles(e,r,l,s),this.setRowStyles(e,t,l,s)}setColStyles(e,t,r,l){let s=this.getBaseTileSize(r,l);e._setStyle("rtl"===this._direction?"right":"left",this.getTilePosition(s,t)),e._setStyle("width",g(this.getTileSize(s,e.colspan)))}getGutterSpan(){return`${this._gutterSize} * (${this._rowspan} - 1)`}getTileSpan(e){return`${this._rowspan} * ${this.getTileSize(e,1)}`}getComputedHeight(){return null}}class G extends M{constructor(e){super(),this.fixedRowHeight=e}init(e,t,r,l){super.init(e,t,r,l),this.fixedRowHeight=_(this.fixedRowHeight),D.test(this.fixedRowHeight)}setRowStyles(e,t){e._setStyle("top",this.getTilePosition(this.fixedRowHeight,t)),e._setStyle("height",g(this.getTileSize(this.fixedRowHeight,e.rowspan)))}getComputedHeight(){return["height",g(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["height",null]),e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}class L extends M{constructor(e){super(),this._parseRatio(e)}setRowStyles(e,t,r,l){this.baseTileHeight=this.getBaseTileSize(r/this.rowHeightRatio,l),e._setStyle("marginTop",this.getTilePosition(this.baseTileHeight,t)),e._setStyle("paddingTop",g(this.getTileSize(this.baseTileHeight,e.rowspan)))}getComputedHeight(){return["paddingBottom",g(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["paddingBottom",null]),e._tiles.forEach(t=>{t._setStyle("marginTop",null),t._setStyle("paddingTop",null)})}_parseRatio(e){const t=e.split(":");this.rowHeightRatio=parseFloat(t[0])/parseFloat(t[1])}}class w extends M{setRowStyles(e,t){let s=this.getBaseTileSize(100/this._rowspan,(this._rows-1)/this._rows);e._setStyle("top",this.getTilePosition(s,t)),e._setStyle("height",g(this.getTileSize(s,e.rowspan)))}reset(e){e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}function g(o){return`calc(${o})`}function _(o){return o.match(/([A-Za-z%]+)$/)?o:`${o}px`}let n=(()=>{class o{constructor(t,r){this._element=t,this._dir=r,this._gutter="1px"}get cols(){return this._cols}set cols(t){this._cols=Math.max(1,Math.round((0,u.su)(t)))}get gutterSize(){return this._gutter}set gutterSize(t){this._gutter=`${t??""}`}get rowHeight(){return this._rowHeight}set rowHeight(t){const r=`${t??""}`;r!==this._rowHeight&&(this._rowHeight=r,this._setTileStyler(this._rowHeight))}ngOnInit(){this._checkCols(),this._checkRowHeight()}ngAfterContentChecked(){this._layoutTiles()}_checkCols(){}_checkRowHeight(){this._rowHeight||this._setTileStyler("1:1")}_setTileStyler(t){this._tileStyler&&this._tileStyler.reset(this),this._tileStyler="fit"===t?new w:t&&t.indexOf(":")>-1?new L(t):new G(t)}_layoutTiles(){this._tileCoordinator||(this._tileCoordinator=new x);const t=this._tileCoordinator,r=this._tiles.filter(s=>!s._gridList||s._gridList===this),l=this._dir?this._dir.value:"ltr";this._tileCoordinator.update(this.cols,r),this._tileStyler.init(this.gutterSize,t,this.cols,l),r.forEach((s,S)=>{const A=t.positions[S];this._tileStyler.setStyle(s,A.row,A.col)}),this._setListStyle(this._tileStyler.getComputedHeight())}_setListStyle(t){t&&(this._element.nativeElement.style[t[0]]=t[1])}}return o.\u0275fac=function(t){return new(t||o)(i.Y36(i.SBq),i.Y36(v.Is,8))},o.\u0275cmp=i.Xpm({type:o,selectors:[["mat-grid-list"]],contentQueries:function(t,r,l){if(1&t&&i.Suo(l,y,5),2&t){let s;i.iGM(s=i.CRH())&&(r._tiles=s)}},hostAttrs:[1,"mat-grid-list"],hostVars:1,hostBindings:function(t,r){2&t&&i.uIk("cols",r.cols)},inputs:{cols:"cols",gutterSize:"gutterSize",rowHeight:"rowHeight"},exportAs:["matGridList"],features:[i._Bn([{provide:f,useExisting:o}])],ngContentSelectors:p,decls:2,vars:0,template:function(t,r){1&t&&(i.F$t(),i.TgZ(0,"div"),i.Hsn(1),i.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"],encapsulation:2,changeDetection:0}),o})(),d=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=i.oAB({type:o}),o.\u0275inj=i.cJS({imports:[m.uc,m.BQ,m.uc,m.BQ]}),o})()},8377:(H,C,c)=>{c.d(C,{Fx:()=>y,IF:()=>_,Qi:()=>x,S$:()=>L,_K:()=>f,mi:()=>T,u7:()=>w});var i=c(4650),m=c(3238);const u=["*",[["mat-card-footer"]]],v=["*","mat-card-footer"],p=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],b=["[mat-card-avatar], [matCardAvatar]","mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]","*"];let x=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-content"],["","mat-card-content",""],["","matCardContent",""]],hostAttrs:[1,"mat-card-content"]}),a})(),T=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-card-title"]}),a})(),f=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-subtitle"],["","mat-card-subtitle",""],["","matCardSubtitle",""]],hostAttrs:[1,"mat-card-subtitle"]}),a})(),y=(()=>{class a{constructor(){this.align="start"}}return a.\u0275fac=function(d){return new(d||a)},a.\u0275dir=i.lG2({type:a,selectors:[["mat-card-actions"]],hostAttrs:[1,"mat-card-actions"],hostVars:2,hostBindings:function(d,h){2&d&&i.ekj("mat-card-actions-align-end","end"===h.align)},inputs:{align:"align"},exportAs:["matCardActions"]}),a})(),L=(()=>{class a{constructor(d){this._animationMode=d}}return a.\u0275fac=function(d){return new(d||a)(i.Y36(i.QbO,8))},a.\u0275cmp=i.Xpm({type:a,selectors:[["mat-card"]],hostAttrs:[1,"mat-card","mat-focus-indicator"],hostVars:2,hostBindings:function(d,h){2&d&&i.ekj("_mat-animation-noopable","NoopAnimations"===h._animationMode)},exportAs:["matCard"],ngContentSelectors:v,decls:2,vars:0,template:function(d,h){1&d&&(i.F$t(u),i.Hsn(0),i.Hsn(1,1))},styles:[".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}.mat-card._mat-animation-noopable{transition:none !important;animation:none !important}.mat-card>.mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card>.mat-divider-horizontal{left:auto;right:0}.mat-card>.mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card>.mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],encapsulation:2,changeDetection:0}),a})(),w=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275cmp=i.Xpm({type:a,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-card-header"],ngContentSelectors:b,decls:4,vars:0,consts:[[1,"mat-card-header-text"]],template:function(d,h){1&d&&(i.F$t(p),i.Hsn(0),i.TgZ(1,"div",0),i.Hsn(2,1),i.qZA(),i.Hsn(3,2))},encapsulation:2,changeDetection:0}),a})(),_=(()=>{class a{}return a.\u0275fac=function(d){return new(d||a)},a.\u0275mod=i.oAB({type:a}),a.\u0275inj=i.cJS({imports:[m.BQ,m.BQ]}),a})()}}]);