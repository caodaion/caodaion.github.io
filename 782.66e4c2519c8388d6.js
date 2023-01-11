"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[782],{782:(k,M,l)=>{l.d(M,{DX:()=>m,Il:()=>D,N6:()=>I});var s=l(4650),d=l(3238),h=l(1281),y=l(445);const u=["*"];class S{constructor(){this.columnIndex=0,this.rowIndex=0}get rowCount(){return this.rowIndex+1}get rowspan(){const e=Math.max(...this.tracker);return e>1?this.rowCount+e-1:this.rowCount}update(e,t){this.columnIndex=0,this.rowIndex=0,this.tracker=new Array(e),this.tracker.fill(0,0,this.tracker.length),this.positions=t.map(i=>this._trackTile(i))}_trackTile(e){const t=this._findMatchingGap(e.colspan);return this._markTilePosition(t,e),this.columnIndex=t+e.colspan,new w(this.rowIndex,t)}_findMatchingGap(e){let t=-1,i=-1;do{this.columnIndex+e>this.tracker.length?(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),i=this._findGapEndIndex(t)):(t=this.tracker.indexOf(0,this.columnIndex),-1!=t?(i=this._findGapEndIndex(t),this.columnIndex=t+1):(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),i=this._findGapEndIndex(t)))}while(i-t<e||0==i);return Math.max(t,0)}_nextRow(){this.columnIndex=0,this.rowIndex++;for(let e=0;e<this.tracker.length;e++)this.tracker[e]=Math.max(0,this.tracker[e]-1)}_findGapEndIndex(e){for(let t=e+1;t<this.tracker.length;t++)if(0!=this.tracker[t])return t;return this.tracker.length}_markTilePosition(e,t){for(let i=0;i<t.colspan;i++)this.tracker[e+i]=t.rowspan}}class w{constructor(e,t){this.row=e,this.col=t}}const p=new s.OlP("MAT_GRID_LIST");let m=(()=>{class r{constructor(t,i){this._element=t,this._gridList=i,this._rowspan=1,this._colspan=1}get rowspan(){return this._rowspan}set rowspan(t){this._rowspan=Math.round((0,h.su)(t))}get colspan(){return this._colspan}set colspan(t){this._colspan=Math.round((0,h.su)(t))}_setStyle(t,i){this._element.nativeElement.style[t]=i}}return r.\u0275fac=function(t){return new(t||r)(s.Y36(s.SBq),s.Y36(p,8))},r.\u0275cmp=s.Xpm({type:r,selectors:[["mat-grid-tile"]],hostAttrs:[1,"mat-grid-tile"],hostVars:2,hostBindings:function(t,i){2&t&&s.uIk("rowspan",i.rowspan)("colspan",i.colspan)},inputs:{rowspan:"rowspan",colspan:"colspan"},exportAs:["matGridTile"],ngContentSelectors:u,decls:2,vars:0,consts:[[1,"mat-grid-tile-content"]],template:function(t,i){1&t&&(s.F$t(),s.TgZ(0,"div",0),s.Hsn(1),s.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"],encapsulation:2,changeDetection:0}),r})();const x=/^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;class g{constructor(){this._rows=0,this._rowspan=0}init(e,t,i,a){this._gutterSize=_(e),this._rows=t.rowCount,this._rowspan=t.rowspan,this._cols=i,this._direction=a}getBaseTileSize(e,t){return`(${e}% - (${this._gutterSize} * ${t}))`}getTilePosition(e,t){return 0===t?"0":o(`(${e} + ${this._gutterSize}) * ${t}`)}getTileSize(e,t){return`(${e} * ${t}) + (${t-1} * ${this._gutterSize})`}setStyle(e,t,i){let a=100/this._cols,n=(this._cols-1)/this._cols;this.setColStyles(e,i,a,n),this.setRowStyles(e,t,a,n)}setColStyles(e,t,i,a){let n=this.getBaseTileSize(i,a);e._setStyle("rtl"===this._direction?"right":"left",this.getTilePosition(n,t)),e._setStyle("width",o(this.getTileSize(n,e.colspan)))}getGutterSpan(){return`${this._gutterSize} * (${this._rowspan} - 1)`}getTileSpan(e){return`${this._rowspan} * ${this.getTileSize(e,1)}`}getComputedHeight(){return null}}class v extends g{constructor(e){super(),this.fixedRowHeight=e}init(e,t,i,a){super.init(e,t,i,a),this.fixedRowHeight=_(this.fixedRowHeight),x.test(this.fixedRowHeight)}setRowStyles(e,t){e._setStyle("top",this.getTilePosition(this.fixedRowHeight,t)),e._setStyle("height",o(this.getTileSize(this.fixedRowHeight,e.rowspan)))}getComputedHeight(){return["height",o(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["height",null]),e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}class G extends g{constructor(e){super(),this._parseRatio(e)}setRowStyles(e,t,i,a){this.baseTileHeight=this.getBaseTileSize(i/this.rowHeightRatio,a),e._setStyle("marginTop",this.getTilePosition(this.baseTileHeight,t)),e._setStyle("paddingTop",o(this.getTileSize(this.baseTileHeight,e.rowspan)))}getComputedHeight(){return["paddingBottom",o(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["paddingBottom",null]),e._tiles.forEach(t=>{t._setStyle("marginTop",null),t._setStyle("paddingTop",null)})}_parseRatio(e){const t=e.split(":");this.rowHeightRatio=parseFloat(t[0])/parseFloat(t[1])}}class C extends g{setRowStyles(e,t){let n=this.getBaseTileSize(100/this._rowspan,(this._rows-1)/this._rows);e._setStyle("top",this.getTilePosition(n,t)),e._setStyle("height",o(this.getTileSize(n,e.rowspan)))}reset(e){e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}function o(r){return`calc(${r})`}function _(r){return r.match(/([A-Za-z%]+)$/)?r:`${r}px`}let D=(()=>{class r{constructor(t,i){this._element=t,this._dir=i,this._gutter="1px"}get cols(){return this._cols}set cols(t){this._cols=Math.max(1,Math.round((0,h.su)(t)))}get gutterSize(){return this._gutter}set gutterSize(t){this._gutter=`${t??""}`}get rowHeight(){return this._rowHeight}set rowHeight(t){const i=`${t??""}`;i!==this._rowHeight&&(this._rowHeight=i,this._setTileStyler(this._rowHeight))}ngOnInit(){this._checkCols(),this._checkRowHeight()}ngAfterContentChecked(){this._layoutTiles()}_checkCols(){}_checkRowHeight(){this._rowHeight||this._setTileStyler("1:1")}_setTileStyler(t){this._tileStyler&&this._tileStyler.reset(this),this._tileStyler="fit"===t?new C:t&&t.indexOf(":")>-1?new G(t):new v(t)}_layoutTiles(){this._tileCoordinator||(this._tileCoordinator=new S);const t=this._tileCoordinator,i=this._tiles.filter(n=>!n._gridList||n._gridList===this),a=this._dir?this._dir.value:"ltr";this._tileCoordinator.update(this.cols,i),this._tileStyler.init(this.gutterSize,t,this.cols,a),i.forEach((n,c)=>{const f=t.positions[c];this._tileStyler.setStyle(n,f.row,f.col)}),this._setListStyle(this._tileStyler.getComputedHeight())}_setListStyle(t){t&&(this._element.nativeElement.style[t[0]]=t[1])}}return r.\u0275fac=function(t){return new(t||r)(s.Y36(s.SBq),s.Y36(y.Is,8))},r.\u0275cmp=s.Xpm({type:r,selectors:[["mat-grid-list"]],contentQueries:function(t,i,a){if(1&t&&s.Suo(a,m,5),2&t){let n;s.iGM(n=s.CRH())&&(i._tiles=n)}},hostAttrs:[1,"mat-grid-list"],hostVars:1,hostBindings:function(t,i){2&t&&s.uIk("cols",i.cols)},inputs:{cols:"cols",gutterSize:"gutterSize",rowHeight:"rowHeight"},exportAs:["matGridList"],features:[s._Bn([{provide:p,useExisting:r}])],ngContentSelectors:u,decls:2,vars:0,template:function(t,i){1&t&&(s.F$t(),s.TgZ(0,"div"),s.Hsn(1),s.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"],encapsulation:2,changeDetection:0}),r})(),I=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=s.oAB({type:r}),r.\u0275inj=s.cJS({imports:[d.uc,d.BQ,d.uc,d.BQ]}),r})()}}]);