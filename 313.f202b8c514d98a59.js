"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[313],{5313:(Xe,me,h)=>{h.d(me,{ev:()=>Q,Dz:()=>X,w1:()=>V,ge:()=>W,fO:()=>$,XQ:()=>fe,as:()=>de,Gk:()=>he,nj:()=>ue,BZ:()=>ce,p0:()=>Ue});var s=h(5879),ge=h(9388),x=h(2495),g=h(8337),pe=h(2831),J=h(9473),we=h(6814),ee=h(8645),ye=h(2459),De=h(5619),Re=h(2664),te=h(2096),v=h(9773),se=h(8180);const Ce=[[["caption"]],[["colgroup"],["col"]]],ve=["caption","colgroup, col"];function G(t){return class extends t{get sticky(){return this._sticky}set sticky(n){const a=this._sticky;this._sticky=(0,x.Ig)(n),this._hasStickyChanged=a!==this._sticky}hasStickyChanged(){const n=this._hasStickyChanged;return this._hasStickyChanged=!1,n}resetStickyChanged(){this._hasStickyChanged=!1}constructor(...n){super(...n),this._sticky=!1,this._hasStickyChanged=!1}}}const D=new s.OlP("CDK_TABLE");let R=(()=>{var t;class n{constructor(e){this.template=e}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkCellDef",""]]}),n})(),C=(()=>{var t;class n{constructor(e){this.template=e}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkHeaderCellDef",""]]}),n})(),M=(()=>{var t;class n{constructor(e){this.template=e}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkFooterCellDef",""]]}),n})();class xe{}const Me=G(xe);let p=(()=>{var t;class n extends Me{get name(){return this._name}set name(e){this._setNameInput(e)}get stickyEnd(){return this._stickyEnd}set stickyEnd(e){const o=this._stickyEnd;this._stickyEnd=(0,x.Ig)(e),this._hasStickyChanged=o!==this._stickyEnd}constructor(e){super(),this._table=e,this._stickyEnd=!1}_updateColumnCssClassName(){this._columnCssClassName=[`cdk-column-${this.cssClassFriendlyName}`]}_setNameInput(e){e&&(this._name=e,this.cssClassFriendlyName=e.replace(/[^a-z0-9_-]/gi,"-"),this._updateColumnCssClassName())}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(D,8))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkColumnDef",""]],contentQueries:function(e,o,r){if(1&e&&(s.Suo(r,R,5),s.Suo(r,C,5),s.Suo(r,M,5)),2&e){let i;s.iGM(i=s.CRH())&&(o.cell=i.first),s.iGM(i=s.CRH())&&(o.headerCell=i.first),s.iGM(i=s.CRH())&&(o.footerCell=i.first)}},inputs:{sticky:"sticky",name:["cdkColumnDef","name"],stickyEnd:"stickyEnd"},features:[s._Bn([{provide:"MAT_SORT_HEADER_COLUMN_DEF",useExisting:t}]),s.qOj]}),n})();class I{constructor(n,a){a.nativeElement.classList.add(...n._columnCssClassName)}}let L=(()=>{var t;class n extends I{constructor(e,o){super(e,o)}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(p),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["cdk-header-cell"],["th","cdk-header-cell",""]],hostAttrs:["role","columnheader",1,"cdk-header-cell"],features:[s.qOj]}),n})(),Y=(()=>{var t;class n extends I{constructor(e,o){if(super(e,o),1===e._table?._elementRef.nativeElement.nodeType){const r=e._table._elementRef.nativeElement.getAttribute("role");o.nativeElement.setAttribute("role","grid"===r||"treegrid"===r?"gridcell":"cell")}}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(p),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["cdk-cell"],["td","cdk-cell",""]],hostAttrs:[1,"cdk-cell"],features:[s.qOj]}),n})();class ne{constructor(){this.tasks=[],this.endTasks=[]}}const j=new s.OlP("_COALESCED_STYLE_SCHEDULER");let ae=(()=>{var t;class n{constructor(e){this._ngZone=e,this._currentSchedule=null,this._destroyed=new ee.x}schedule(e){this._createScheduleIfNeeded(),this._currentSchedule.tasks.push(e)}scheduleEnd(e){this._createScheduleIfNeeded(),this._currentSchedule.endTasks.push(e)}ngOnDestroy(){this._destroyed.next(),this._destroyed.complete()}_createScheduleIfNeeded(){this._currentSchedule||(this._currentSchedule=new ne,this._getScheduleObservable().pipe((0,v.R)(this._destroyed)).subscribe(()=>{for(;this._currentSchedule.tasks.length||this._currentSchedule.endTasks.length;){const e=this._currentSchedule;this._currentSchedule=new ne;for(const o of e.tasks)o();for(const o of e.endTasks)o()}this._currentSchedule=null}))}_getScheduleObservable(){return this._ngZone.isStable?(0,ye.D)(Promise.resolve(void 0)):this._ngZone.onStable.pipe((0,se.q)(1))}}return(t=n).\u0275fac=function(e){return new(e||t)(s.LFG(s.R0b))},t.\u0275prov=s.Yz7({token:t,factory:t.\u0275fac}),n})(),z=(()=>{var t;class n{constructor(e,o){this.template=e,this._differs=o}ngOnChanges(e){if(!this._columnsDiffer){const o=e.columns&&e.columns.currentValue||[];this._columnsDiffer=this._differs.find(o).create(),this._columnsDiffer.diff(o)}}getColumnsDiff(){return this._columnsDiffer.diff(this.columns)}extractCellTemplate(e){return this instanceof b?e.headerCell.template:this instanceof k?e.footerCell.template:e.cell.template}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc),s.Y36(s.ZZ4))},t.\u0275dir=s.lG2({type:t,features:[s.TTD]}),n})();class Oe extends z{}const Te=G(Oe);let b=(()=>{var t;class n extends Te{constructor(e,o,r){super(e,o),this._table=r}ngOnChanges(e){super.ngOnChanges(e)}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc),s.Y36(s.ZZ4),s.Y36(D,8))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkHeaderRowDef",""]],inputs:{columns:["cdkHeaderRowDef","columns"],sticky:["cdkHeaderRowDefSticky","sticky"]},features:[s.qOj,s.TTD]}),n})();class Ee extends z{}const Fe=G(Ee);let k=(()=>{var t;class n extends Fe{constructor(e,o,r){super(e,o),this._table=r}ngOnChanges(e){super.ngOnChanges(e)}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc),s.Y36(s.ZZ4),s.Y36(D,8))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkFooterRowDef",""]],inputs:{columns:["cdkFooterRowDef","columns"],sticky:["cdkFooterRowDefSticky","sticky"]},features:[s.qOj,s.TTD]}),n})(),O=(()=>{var t;class n extends z{constructor(e,o,r){super(e,o),this._table=r}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc),s.Y36(s.ZZ4),s.Y36(D,8))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkRowDef",""]],inputs:{columns:["cdkRowDefColumns","columns"],when:["cdkRowDefWhen","when"]},features:[s.qOj]}),n})(),w=(()=>{var t;class n{constructor(e){this._viewContainer=e,n.mostRecentCellOutlet=this}ngOnDestroy(){n.mostRecentCellOutlet===this&&(n.mostRecentCellOutlet=null)}}return(t=n).mostRecentCellOutlet=null,t.\u0275fac=function(e){return new(e||t)(s.Y36(s.s_b))},t.\u0275dir=s.lG2({type:t,selectors:[["","cdkCellOutlet",""]]}),n})(),P=(()=>{var t;class n{}return(t=n).\u0275fac=function(e){return new(e||t)},t.\u0275cmp=s.Xpm({type:t,selectors:[["cdk-header-row"],["tr","cdk-header-row",""]],hostAttrs:["role","row",1,"cdk-header-row"],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(e,o){1&e&&s.GkF(0,0)},dependencies:[w],encapsulation:2}),n})(),U=(()=>{var t;class n{}return(t=n).\u0275fac=function(e){return new(e||t)},t.\u0275cmp=s.Xpm({type:t,selectors:[["cdk-row"],["tr","cdk-row",""]],hostAttrs:["role","row",1,"cdk-row"],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(e,o){1&e&&s.GkF(0,0)},dependencies:[w],encapsulation:2}),n})(),T=(()=>{var t;class n{constructor(e){this.templateRef=e,this._contentClassName="cdk-no-data-row"}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.Rgc))},t.\u0275dir=s.lG2({type:t,selectors:[["ng-template","cdkNoDataRow",""]]}),n})();const re=["top","bottom","left","right"];class Ne{constructor(n,a,e,o,r=!0,i=!0,l){this._isNativeHtmlTable=n,this._stickCellCss=a,this.direction=e,this._coalescedStyleScheduler=o,this._isBrowser=r,this._needsPositionStickyOnElement=i,this._positionListener=l,this._cachedCellWidths=[],this._borderCellCss={top:`${a}-border-elem-top`,bottom:`${a}-border-elem-bottom`,left:`${a}-border-elem-left`,right:`${a}-border-elem-right`}}clearStickyPositioning(n,a){const e=[];for(const o of n)if(o.nodeType===o.ELEMENT_NODE){e.push(o);for(let r=0;r<o.children.length;r++)e.push(o.children[r])}this._coalescedStyleScheduler.schedule(()=>{for(const o of e)this._removeStickyStyle(o,a)})}updateStickyColumns(n,a,e,o=!0){if(!n.length||!this._isBrowser||!a.some(f=>f)&&!e.some(f=>f))return void(this._positionListener&&(this._positionListener.stickyColumnsUpdated({sizes:[]}),this._positionListener.stickyEndColumnsUpdated({sizes:[]})));const r=n[0],i=r.children.length,l=this._getCellWidths(r,o),c=this._getStickyStartColumnPositions(l,a),u=this._getStickyEndColumnPositions(l,e),d=a.lastIndexOf(!0),_=e.indexOf(!0);this._coalescedStyleScheduler.schedule(()=>{const f="rtl"===this.direction,y=f?"right":"left",K=f?"left":"right";for(const S of n)for(let m=0;m<i;m++){const _e=S.children[m];a[m]&&this._addStickyStyle(_e,y,c[m],m===d),e[m]&&this._addStickyStyle(_e,K,u[m],m===_)}this._positionListener&&(this._positionListener.stickyColumnsUpdated({sizes:-1===d?[]:l.slice(0,d+1).map((S,m)=>a[m]?S:null)}),this._positionListener.stickyEndColumnsUpdated({sizes:-1===_?[]:l.slice(_).map((S,m)=>e[m+_]?S:null).reverse()}))})}stickRows(n,a,e){if(!this._isBrowser)return;const o="bottom"===e?n.slice().reverse():n,r="bottom"===e?a.slice().reverse():a,i=[],l=[],c=[];for(let d=0,_=0;d<o.length;d++){if(!r[d])continue;i[d]=_;const f=o[d];c[d]=this._isNativeHtmlTable?Array.from(f.children):[f];const y=f.getBoundingClientRect().height;_+=y,l[d]=y}const u=r.lastIndexOf(!0);this._coalescedStyleScheduler.schedule(()=>{for(let d=0;d<o.length;d++){if(!r[d])continue;const _=i[d],f=d===u;for(const y of c[d])this._addStickyStyle(y,e,_,f)}"top"===e?this._positionListener?.stickyHeaderRowsUpdated({sizes:l,offsets:i,elements:c}):this._positionListener?.stickyFooterRowsUpdated({sizes:l,offsets:i,elements:c})})}updateStickyFooterContainer(n,a){if(!this._isNativeHtmlTable)return;const e=n.querySelector("tfoot");this._coalescedStyleScheduler.schedule(()=>{a.some(o=>!o)?this._removeStickyStyle(e,["bottom"]):this._addStickyStyle(e,"bottom",0,!1)})}_removeStickyStyle(n,a){for(const o of a)n.style[o]="",n.classList.remove(this._borderCellCss[o]);re.some(o=>-1===a.indexOf(o)&&n.style[o])?n.style.zIndex=this._getCalculatedZIndex(n):(n.style.zIndex="",this._needsPositionStickyOnElement&&(n.style.position=""),n.classList.remove(this._stickCellCss))}_addStickyStyle(n,a,e,o){n.classList.add(this._stickCellCss),o&&n.classList.add(this._borderCellCss[a]),n.style[a]=`${e}px`,n.style.zIndex=this._getCalculatedZIndex(n),this._needsPositionStickyOnElement&&(n.style.cssText+="position: -webkit-sticky; position: sticky; ")}_getCalculatedZIndex(n){const a={top:100,bottom:10,left:1,right:1};let e=0;for(const o of re)n.style[o]&&(e+=a[o]);return e?`${e}`:""}_getCellWidths(n,a=!0){if(!a&&this._cachedCellWidths.length)return this._cachedCellWidths;const e=[],o=n.children;for(let r=0;r<o.length;r++)e.push(o[r].getBoundingClientRect().width);return this._cachedCellWidths=e,e}_getStickyStartColumnPositions(n,a){const e=[];let o=0;for(let r=0;r<n.length;r++)a[r]&&(e[r]=o,o+=n[r]);return e}_getStickyEndColumnPositions(n,a){const e=[];let o=0;for(let r=n.length;r>0;r--)a[r]&&(e[r]=o,o+=n[r]);return e}}const q=new s.OlP("CDK_SPL");let E=(()=>{var t;class n{constructor(e,o){this.viewContainer=e,this.elementRef=o}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.s_b),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["","rowOutlet",""]]}),n})(),F=(()=>{var t;class n{constructor(e,o){this.viewContainer=e,this.elementRef=o}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.s_b),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["","headerRowOutlet",""]]}),n})(),N=(()=>{var t;class n{constructor(e,o){this.viewContainer=e,this.elementRef=o}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.s_b),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["","footerRowOutlet",""]]}),n})(),B=(()=>{var t;class n{constructor(e,o){this.viewContainer=e,this.elementRef=o}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.s_b),s.Y36(s.SBq))},t.\u0275dir=s.lG2({type:t,selectors:[["","noDataRowOutlet",""]]}),n})(),H=(()=>{var t;class n{get trackBy(){return this._trackByFn}set trackBy(e){this._trackByFn=e}get dataSource(){return this._dataSource}set dataSource(e){this._dataSource!==e&&this._switchDataSource(e)}get multiTemplateDataRows(){return this._multiTemplateDataRows}set multiTemplateDataRows(e){this._multiTemplateDataRows=(0,x.Ig)(e),this._rowOutlet&&this._rowOutlet.viewContainer.length&&(this._forceRenderDataRows(),this.updateStickyColumnStyles())}get fixedLayout(){return this._fixedLayout}set fixedLayout(e){this._fixedLayout=(0,x.Ig)(e),this._forceRecalculateCellWidths=!0,this._stickyColumnStylesNeedReset=!0}constructor(e,o,r,i,l,c,u,d,_,f,y,K){this._differs=e,this._changeDetectorRef=o,this._elementRef=r,this._dir=l,this._platform=u,this._viewRepeater=d,this._coalescedStyleScheduler=_,this._viewportRuler=f,this._stickyPositioningListener=y,this._ngZone=K,this._onDestroy=new ee.x,this._columnDefsByName=new Map,this._customColumnDefs=new Set,this._customRowDefs=new Set,this._customHeaderRowDefs=new Set,this._customFooterRowDefs=new Set,this._headerRowDefChanged=!0,this._footerRowDefChanged=!0,this._stickyColumnStylesNeedReset=!0,this._forceRecalculateCellWidths=!0,this._cachedRenderRowsMap=new Map,this.stickyCssClass="cdk-table-sticky",this.needsPositionStickyOnElement=!0,this._isShowingNoDataRow=!1,this._multiTemplateDataRows=!1,this._fixedLayout=!1,this.contentChanged=new s.vpe,this.viewChange=new De.X({start:0,end:Number.MAX_VALUE}),i||this._elementRef.nativeElement.setAttribute("role","table"),this._document=c,this._isNativeHtmlTable="TABLE"===this._elementRef.nativeElement.nodeName}ngOnInit(){this._setupStickyStyler(),this._isNativeHtmlTable&&this._applyNativeTableSections(),this._dataDiffer=this._differs.find([]).create((e,o)=>this.trackBy?this.trackBy(o.dataIndex,o.data):o),this._viewportRuler.change().pipe((0,v.R)(this._onDestroy)).subscribe(()=>{this._forceRecalculateCellWidths=!0})}ngAfterContentChecked(){this._cacheRowDefs(),this._cacheColumnDefs();const o=this._renderUpdatedColumns()||this._headerRowDefChanged||this._footerRowDefChanged;this._stickyColumnStylesNeedReset=this._stickyColumnStylesNeedReset||o,this._forceRecalculateCellWidths=o,this._headerRowDefChanged&&(this._forceRenderHeaderRows(),this._headerRowDefChanged=!1),this._footerRowDefChanged&&(this._forceRenderFooterRows(),this._footerRowDefChanged=!1),this.dataSource&&this._rowDefs.length>0&&!this._renderChangeSubscription?this._observeRenderChanges():this._stickyColumnStylesNeedReset&&this.updateStickyColumnStyles(),this._checkStickyStates()}ngOnDestroy(){[this._rowOutlet.viewContainer,this._headerRowOutlet.viewContainer,this._footerRowOutlet.viewContainer,this._cachedRenderRowsMap,this._customColumnDefs,this._customRowDefs,this._customHeaderRowDefs,this._customFooterRowDefs,this._columnDefsByName].forEach(e=>{e.clear()}),this._headerRowDefs=[],this._footerRowDefs=[],this._defaultRowDef=null,this._onDestroy.next(),this._onDestroy.complete(),(0,g.Z9)(this.dataSource)&&this.dataSource.disconnect(this)}renderRows(){this._renderRows=this._getAllRenderRows();const e=this._dataDiffer.diff(this._renderRows);if(!e)return this._updateNoDataRow(),void this.contentChanged.next();const o=this._rowOutlet.viewContainer;this._viewRepeater.applyChanges(e,o,(r,i,l)=>this._getEmbeddedViewArgs(r.item,l),r=>r.item.data,r=>{1===r.operation&&r.context&&this._renderCellTemplateForItem(r.record.item.rowDef,r.context)}),this._updateRowIndexContext(),e.forEachIdentityChange(r=>{o.get(r.currentIndex).context.$implicit=r.item.data}),this._updateNoDataRow(),this._ngZone&&s.R0b.isInAngularZone()?this._ngZone.onStable.pipe((0,se.q)(1),(0,v.R)(this._onDestroy)).subscribe(()=>{this.updateStickyColumnStyles()}):this.updateStickyColumnStyles(),this.contentChanged.next()}addColumnDef(e){this._customColumnDefs.add(e)}removeColumnDef(e){this._customColumnDefs.delete(e)}addRowDef(e){this._customRowDefs.add(e)}removeRowDef(e){this._customRowDefs.delete(e)}addHeaderRowDef(e){this._customHeaderRowDefs.add(e),this._headerRowDefChanged=!0}removeHeaderRowDef(e){this._customHeaderRowDefs.delete(e),this._headerRowDefChanged=!0}addFooterRowDef(e){this._customFooterRowDefs.add(e),this._footerRowDefChanged=!0}removeFooterRowDef(e){this._customFooterRowDefs.delete(e),this._footerRowDefChanged=!0}setNoDataRow(e){this._customNoDataRow=e}updateStickyHeaderRowStyles(){const e=this._getRenderedRows(this._headerRowOutlet),r=this._elementRef.nativeElement.querySelector("thead");r&&(r.style.display=e.length?"":"none");const i=this._headerRowDefs.map(l=>l.sticky);this._stickyStyler.clearStickyPositioning(e,["top"]),this._stickyStyler.stickRows(e,i,"top"),this._headerRowDefs.forEach(l=>l.resetStickyChanged())}updateStickyFooterRowStyles(){const e=this._getRenderedRows(this._footerRowOutlet),r=this._elementRef.nativeElement.querySelector("tfoot");r&&(r.style.display=e.length?"":"none");const i=this._footerRowDefs.map(l=>l.sticky);this._stickyStyler.clearStickyPositioning(e,["bottom"]),this._stickyStyler.stickRows(e,i,"bottom"),this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement,i),this._footerRowDefs.forEach(l=>l.resetStickyChanged())}updateStickyColumnStyles(){const e=this._getRenderedRows(this._headerRowOutlet),o=this._getRenderedRows(this._rowOutlet),r=this._getRenderedRows(this._footerRowOutlet);(this._isNativeHtmlTable&&!this._fixedLayout||this._stickyColumnStylesNeedReset)&&(this._stickyStyler.clearStickyPositioning([...e,...o,...r],["left","right"]),this._stickyColumnStylesNeedReset=!1),e.forEach((i,l)=>{this._addStickyColumnStyles([i],this._headerRowDefs[l])}),this._rowDefs.forEach(i=>{const l=[];for(let c=0;c<o.length;c++)this._renderRows[c].rowDef===i&&l.push(o[c]);this._addStickyColumnStyles(l,i)}),r.forEach((i,l)=>{this._addStickyColumnStyles([i],this._footerRowDefs[l])}),Array.from(this._columnDefsByName.values()).forEach(i=>i.resetStickyChanged())}_getAllRenderRows(){const e=[],o=this._cachedRenderRowsMap;this._cachedRenderRowsMap=new Map;for(let r=0;r<this._data.length;r++){let i=this._data[r];const l=this._getRenderRowsForData(i,r,o.get(i));this._cachedRenderRowsMap.has(i)||this._cachedRenderRowsMap.set(i,new WeakMap);for(let c=0;c<l.length;c++){let u=l[c];const d=this._cachedRenderRowsMap.get(u.data);d.has(u.rowDef)?d.get(u.rowDef).push(u):d.set(u.rowDef,[u]),e.push(u)}}return e}_getRenderRowsForData(e,o,r){return this._getRowDefs(e,o).map(l=>{const c=r&&r.has(l)?r.get(l):[];if(c.length){const u=c.shift();return u.dataIndex=o,u}return{data:e,rowDef:l,dataIndex:o}})}_cacheColumnDefs(){this._columnDefsByName.clear(),A(this._getOwnDefs(this._contentColumnDefs),this._customColumnDefs).forEach(o=>{this._columnDefsByName.has(o.name),this._columnDefsByName.set(o.name,o)})}_cacheRowDefs(){this._headerRowDefs=A(this._getOwnDefs(this._contentHeaderRowDefs),this._customHeaderRowDefs),this._footerRowDefs=A(this._getOwnDefs(this._contentFooterRowDefs),this._customFooterRowDefs),this._rowDefs=A(this._getOwnDefs(this._contentRowDefs),this._customRowDefs);const e=this._rowDefs.filter(o=>!o.when);this._defaultRowDef=e[0]}_renderUpdatedColumns(){const e=(l,c)=>l||!!c.getColumnsDiff(),o=this._rowDefs.reduce(e,!1);o&&this._forceRenderDataRows();const r=this._headerRowDefs.reduce(e,!1);r&&this._forceRenderHeaderRows();const i=this._footerRowDefs.reduce(e,!1);return i&&this._forceRenderFooterRows(),o||r||i}_switchDataSource(e){this._data=[],(0,g.Z9)(this.dataSource)&&this.dataSource.disconnect(this),this._renderChangeSubscription&&(this._renderChangeSubscription.unsubscribe(),this._renderChangeSubscription=null),e||(this._dataDiffer&&this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear()),this._dataSource=e}_observeRenderChanges(){if(!this.dataSource)return;let e;(0,g.Z9)(this.dataSource)?e=this.dataSource.connect(this):(0,Re.b)(this.dataSource)?e=this.dataSource:Array.isArray(this.dataSource)&&(e=(0,te.of)(this.dataSource)),this._renderChangeSubscription=e.pipe((0,v.R)(this._onDestroy)).subscribe(o=>{this._data=o||[],this.renderRows()})}_forceRenderHeaderRows(){this._headerRowOutlet.viewContainer.length>0&&this._headerRowOutlet.viewContainer.clear(),this._headerRowDefs.forEach((e,o)=>this._renderRow(this._headerRowOutlet,e,o)),this.updateStickyHeaderRowStyles()}_forceRenderFooterRows(){this._footerRowOutlet.viewContainer.length>0&&this._footerRowOutlet.viewContainer.clear(),this._footerRowDefs.forEach((e,o)=>this._renderRow(this._footerRowOutlet,e,o)),this.updateStickyFooterRowStyles()}_addStickyColumnStyles(e,o){const r=Array.from(o.columns||[]).map(c=>this._columnDefsByName.get(c)),i=r.map(c=>c.sticky),l=r.map(c=>c.stickyEnd);this._stickyStyler.updateStickyColumns(e,i,l,!this._fixedLayout||this._forceRecalculateCellWidths)}_getRenderedRows(e){const o=[];for(let r=0;r<e.viewContainer.length;r++){const i=e.viewContainer.get(r);o.push(i.rootNodes[0])}return o}_getRowDefs(e,o){if(1==this._rowDefs.length)return[this._rowDefs[0]];let r=[];if(this.multiTemplateDataRows)r=this._rowDefs.filter(i=>!i.when||i.when(o,e));else{let i=this._rowDefs.find(l=>l.when&&l.when(o,e))||this._defaultRowDef;i&&r.push(i)}return r}_getEmbeddedViewArgs(e,o){return{templateRef:e.rowDef.template,context:{$implicit:e.data},index:o}}_renderRow(e,o,r,i={}){const l=e.viewContainer.createEmbeddedView(o.template,i,r);return this._renderCellTemplateForItem(o,i),l}_renderCellTemplateForItem(e,o){for(let r of this._getCellTemplates(e))w.mostRecentCellOutlet&&w.mostRecentCellOutlet._viewContainer.createEmbeddedView(r,o);this._changeDetectorRef.markForCheck()}_updateRowIndexContext(){const e=this._rowOutlet.viewContainer;for(let o=0,r=e.length;o<r;o++){const l=e.get(o).context;l.count=r,l.first=0===o,l.last=o===r-1,l.even=o%2==0,l.odd=!l.even,this.multiTemplateDataRows?(l.dataIndex=this._renderRows[o].dataIndex,l.renderIndex=o):l.index=this._renderRows[o].dataIndex}}_getCellTemplates(e){return e&&e.columns?Array.from(e.columns,o=>{const r=this._columnDefsByName.get(o);return e.extractCellTemplate(r)}):[]}_applyNativeTableSections(){const e=this._document.createDocumentFragment(),o=[{tag:"thead",outlets:[this._headerRowOutlet]},{tag:"tbody",outlets:[this._rowOutlet,this._noDataRowOutlet]},{tag:"tfoot",outlets:[this._footerRowOutlet]}];for(const r of o){const i=this._document.createElement(r.tag);i.setAttribute("role","rowgroup");for(const l of r.outlets)i.appendChild(l.elementRef.nativeElement);e.appendChild(i)}this._elementRef.nativeElement.appendChild(e)}_forceRenderDataRows(){this._dataDiffer.diff([]),this._rowOutlet.viewContainer.clear(),this.renderRows()}_checkStickyStates(){const e=(o,r)=>o||r.hasStickyChanged();this._headerRowDefs.reduce(e,!1)&&this.updateStickyHeaderRowStyles(),this._footerRowDefs.reduce(e,!1)&&this.updateStickyFooterRowStyles(),Array.from(this._columnDefsByName.values()).reduce(e,!1)&&(this._stickyColumnStylesNeedReset=!0,this.updateStickyColumnStyles())}_setupStickyStyler(){this._stickyStyler=new Ne(this._isNativeHtmlTable,this.stickyCssClass,this._dir?this._dir.value:"ltr",this._coalescedStyleScheduler,this._platform.isBrowser,this.needsPositionStickyOnElement,this._stickyPositioningListener),(this._dir?this._dir.change:(0,te.of)()).pipe((0,v.R)(this._onDestroy)).subscribe(o=>{this._stickyStyler.direction=o,this.updateStickyColumnStyles()})}_getOwnDefs(e){return e.filter(o=>!o._table||o._table===this)}_updateNoDataRow(){const e=this._customNoDataRow||this._noDataRow;if(!e)return;const o=0===this._rowOutlet.viewContainer.length;if(o===this._isShowingNoDataRow)return;const r=this._noDataRowOutlet.viewContainer;if(o){const i=r.createEmbeddedView(e.templateRef),l=i.rootNodes[0];1===i.rootNodes.length&&l?.nodeType===this._document.ELEMENT_NODE&&(l.setAttribute("role","row"),l.classList.add(e._contentClassName))}else r.clear();this._isShowingNoDataRow=o,this._changeDetectorRef.markForCheck()}}return(t=n).\u0275fac=function(e){return new(e||t)(s.Y36(s.ZZ4),s.Y36(s.sBO),s.Y36(s.SBq),s.$8M("role"),s.Y36(ge.Is,8),s.Y36(we.K0),s.Y36(pe.t4),s.Y36(g.k),s.Y36(j),s.Y36(J.rL),s.Y36(q,12),s.Y36(s.R0b,8))},t.\u0275cmp=s.Xpm({type:t,selectors:[["cdk-table"],["table","cdk-table",""]],contentQueries:function(e,o,r){if(1&e&&(s.Suo(r,T,5),s.Suo(r,p,5),s.Suo(r,O,5),s.Suo(r,b,5),s.Suo(r,k,5)),2&e){let i;s.iGM(i=s.CRH())&&(o._noDataRow=i.first),s.iGM(i=s.CRH())&&(o._contentColumnDefs=i),s.iGM(i=s.CRH())&&(o._contentRowDefs=i),s.iGM(i=s.CRH())&&(o._contentHeaderRowDefs=i),s.iGM(i=s.CRH())&&(o._contentFooterRowDefs=i)}},viewQuery:function(e,o){if(1&e&&(s.Gf(E,7),s.Gf(F,7),s.Gf(N,7),s.Gf(B,7)),2&e){let r;s.iGM(r=s.CRH())&&(o._rowOutlet=r.first),s.iGM(r=s.CRH())&&(o._headerRowOutlet=r.first),s.iGM(r=s.CRH())&&(o._footerRowOutlet=r.first),s.iGM(r=s.CRH())&&(o._noDataRowOutlet=r.first)}},hostAttrs:["ngSkipHydration","",1,"cdk-table"],hostVars:2,hostBindings:function(e,o){2&e&&s.ekj("cdk-table-fixed-layout",o.fixedLayout)},inputs:{trackBy:"trackBy",dataSource:"dataSource",multiTemplateDataRows:"multiTemplateDataRows",fixedLayout:"fixedLayout"},outputs:{contentChanged:"contentChanged"},exportAs:["cdkTable"],features:[s._Bn([{provide:D,useExisting:t},{provide:g.k,useClass:g.yy},{provide:j,useClass:ae},{provide:q,useValue:null}])],ngContentSelectors:ve,decls:6,vars:0,consts:[["headerRowOutlet",""],["rowOutlet",""],["noDataRowOutlet",""],["footerRowOutlet",""]],template:function(e,o){1&e&&(s.F$t(Ce),s.Hsn(0),s.Hsn(1,1),s.GkF(2,0)(3,1)(4,2)(5,3))},dependencies:[E,F,N,B],styles:[".cdk-table-fixed-layout{table-layout:fixed}"],encapsulation:2}),n})();function A(t,n){return t.concat(Array.from(n))}let He=(()=>{var t;class n{}return(t=n).\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.oAB({type:t}),t.\u0275inj=s.cJS({imports:[J.Cl]}),n})();var le=h(3680);const Ae=[[["caption"]],[["colgroup"],["col"]]],Ge=["caption","colgroup, col"];let ce=(()=>{var t;class n extends H{constructor(){super(...arguments),this.stickyCssClass="mat-mdc-table-sticky",this.needsPositionStickyOnElement=!1}ngOnInit(){super.ngOnInit(),this._isNativeHtmlTable&&this._elementRef.nativeElement.querySelector("tbody").classList.add("mdc-data-table__content")}}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275cmp=s.Xpm({type:t,selectors:[["mat-table"],["table","mat-table",""]],hostAttrs:["ngSkipHydration","",1,"mat-mdc-table","mdc-data-table__table"],hostVars:2,hostBindings:function(e,o){2&e&&s.ekj("mdc-table-fixed-layout",o.fixedLayout)},exportAs:["matTable"],features:[s._Bn([{provide:H,useExisting:t},{provide:D,useExisting:t},{provide:j,useClass:ae},{provide:g.k,useClass:g.yy},{provide:q,useValue:null}]),s.qOj],ngContentSelectors:Ge,decls:6,vars:0,consts:[["headerRowOutlet",""],["rowOutlet",""],["noDataRowOutlet",""],["footerRowOutlet",""]],template:function(e,o){1&e&&(s.F$t(Ae),s.Hsn(0),s.Hsn(1,1),s.GkF(2,0)(3,1)(4,2)(5,3))},dependencies:[E,F,N,B],styles:[".mat-mdc-table-sticky{position:sticky !important}.mdc-data-table{-webkit-overflow-scrolling:touch;display:inline-flex;flex-direction:column;box-sizing:border-box;position:relative}.mdc-data-table__table-container{-webkit-overflow-scrolling:touch;overflow-x:auto;width:100%}.mdc-data-table__table{min-width:100%;border:0;white-space:nowrap;border-spacing:0;table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell,.mdc-data-table__cell[dir=rtl]{text-align:right}.mdc-data-table__cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__cell--numeric,.mdc-data-table__cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell{box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mdc-data-table__header-cell,.mdc-data-table__header-cell[dir=rtl]{text-align:right}.mdc-data-table__header-cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell-wrapper{align-items:center;display:inline-flex;vertical-align:middle}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px 0 16px}.mdc-data-table__header-cell--checkbox,.mdc-data-table__cell--checkbox{padding-left:4px;padding-right:0}[dir=rtl] .mdc-data-table__header-cell--checkbox,[dir=rtl] .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox[dir=rtl],.mdc-data-table__cell--checkbox[dir=rtl]{padding-left:0;padding-right:4px}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{--mat-table-row-item-outline-width:1px;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color)}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-header-headline-font, Roboto, sans-serif);line-height:var(--mat-table-header-headline-line-height);font-size:var(--mat-table-header-headline-size, 14px);font-weight:var(--mat-table-header-headline-weight, 500)}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, Roboto, sans-serif);line-height:var(--mat-table-row-item-label-text-line-height);font-size:var(--mat-table-row-item-label-text-size, 14px);font-weight:var(--mat-table-row-item-label-text-weight)}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-footer-supporting-text-font, Roboto, sans-serif);line-height:var(--mat-table-footer-supporting-text-line-height);font-size:var(--mat-table-footer-supporting-text-size, 14px);font-weight:var(--mat-table-footer-supporting-text-weight);letter-spacing:var(--mat-table-footer-supporting-text-tracking)}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking);font-weight:inherit;line-height:inherit}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking);line-height:inherit}.mdc-data-table__row:last-child .mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking)}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"],encapsulation:2}),n})(),X=(()=>{var t;class n extends R{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["","matCellDef",""]],features:[s._Bn([{provide:R,useExisting:t}]),s.qOj]}),n})(),$=(()=>{var t;class n extends C{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["","matHeaderCellDef",""]],features:[s._Bn([{provide:C,useExisting:t}]),s.qOj]}),n})(),V=(()=>{var t;class n extends p{get name(){return this._name}set name(e){this._setNameInput(e)}_updateColumnCssClassName(){super._updateColumnCssClassName(),this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`)}}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["","matColumnDef",""]],inputs:{sticky:"sticky",name:["matColumnDef","name"]},features:[s._Bn([{provide:p,useExisting:t},{provide:"MAT_SORT_HEADER_COLUMN_DEF",useExisting:t}]),s.qOj]}),n})(),W=(()=>{var t;class n extends L{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["mat-header-cell"],["th","mat-header-cell",""]],hostAttrs:["role","columnheader",1,"mat-mdc-header-cell","mdc-data-table__header-cell"],features:[s.qOj]}),n})(),Q=(()=>{var t;class n extends Y{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["mat-cell"],["td","mat-cell",""]],hostAttrs:[1,"mat-mdc-cell","mdc-data-table__cell"],features:[s.qOj]}),n})(),de=(()=>{var t;class n extends b{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["","matHeaderRowDef",""]],inputs:{columns:["matHeaderRowDef","columns"],sticky:["matHeaderRowDefSticky","sticky"]},features:[s._Bn([{provide:b,useExisting:t}]),s.qOj]}),n})(),ue=(()=>{var t;class n extends O{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275dir=s.lG2({type:t,selectors:[["","matRowDef",""]],inputs:{columns:["matRowDefColumns","columns"],when:["matRowDefWhen","when"]},features:[s._Bn([{provide:O,useExisting:t}]),s.qOj]}),n})(),fe=(()=>{var t;class n extends P{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275cmp=s.Xpm({type:t,selectors:[["mat-header-row"],["tr","mat-header-row",""]],hostAttrs:["role","row",1,"mat-mdc-header-row","mdc-data-table__header-row"],exportAs:["matHeaderRow"],features:[s._Bn([{provide:P,useExisting:t}]),s.qOj],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(e,o){1&e&&s.GkF(0,0)},dependencies:[w],encapsulation:2}),n})(),he=(()=>{var t;class n extends U{}return(t=n).\u0275fac=function(){let a;return function(o){return(a||(a=s.n5z(t)))(o||t)}}(),t.\u0275cmp=s.Xpm({type:t,selectors:[["mat-row"],["tr","mat-row",""]],hostAttrs:["role","row",1,"mat-mdc-row","mdc-data-table__row"],exportAs:["matRow"],features:[s._Bn([{provide:U,useExisting:t}]),s.qOj],decls:1,vars:0,consts:[["cdkCellOutlet",""]],template:function(e,o){1&e&&s.GkF(0,0)},dependencies:[w],encapsulation:2}),n})(),Ue=(()=>{var t;class n{}return(t=n).\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.oAB({type:t}),t.\u0275inj=s.cJS({imports:[le.BQ,He,le.BQ]}),n})()}}]);