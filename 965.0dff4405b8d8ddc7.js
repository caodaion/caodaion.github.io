"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[965],{8109:(J,C,r)=>{r.d(C,{d:()=>p});var c=r(4650);class p{}p.\u0275fac=function(g){return new(g||p)},p.\u0275cmp=c.Xpm({type:p,selectors:[["app-header-title"]],ngContentSelectors:["*"],decls:2,vars:0,template:function(g,v){1&g&&(c.F$t(),c.TgZ(0,"div"),c.Hsn(1),c.qZA())},styles:["app-header-title div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:20px}"]})},3646:(J,C,r)=>{r.d(C,{G:()=>h});var c=r(4650),d=r(9299),p=r(6895),t=r(3683),g=r(7392),v=r(4859);class h{constructor(f,_,m){this.router=f,this.route=_,this.location=m,this.prevPage=".."}ngOnInit(){}onClickBackButton(){this.prevPage?.navigate?.link?this.router.navigate([this.prevPage?.navigate?.link],{relativeTo:this.route,queryParams:this.prevPage?.navigate?.queryParams}):this.location.back()}}h.\u0275fac=function(f){return new(f||h)(c.Y36(d.F0),c.Y36(d.gz),c.Y36(p.Ye))},h.\u0275cmp=c.Xpm({type:h,selectors:[["app-header"]],inputs:{prevPage:"prevPage"},ngContentSelectors:["*"],decls:6,vars:0,consts:[["mat-icon-button","","aria-label","Back to previous page",1,"prev-icon",3,"click"],["mat-icon-button","","aria-label","Back to previous page",1,"prev-icon"]],template:function(f,_){1&f&&(c.F$t(),c.TgZ(0,"mat-toolbar")(1,"button",0),c.NdJ("click",function(){return _.onClickBackButton()}),c.TgZ(2,"mat-icon"),c._uU(3,"arrow_back"),c.qZA()(),c.Hsn(4),c._UZ(5,"button",1),c.qZA())},dependencies:[t.Ye,g.Hw,v.RK],styles:["app-header .mat-toolbar{justify-content:space-between;background-color:#f6f8fc;height:auto}"]})},4546:(J,C,r)=>{r.d(C,{O:()=>v});var c=r(6895),d=r(3683),p=r(7392),t=r(4859),g=r(4650);class v{}v.\u0275fac=function(h){return new(h||v)},v.\u0275mod=g.oAB({type:v}),v.\u0275inj=g.cJS({imports:[c.ez,d.g0,p.Ps,t.ot]})},965:(J,C,r)=>{r.r(C),r.d(C,{EventModule:()=>Z});var c=r(6895),d=r(9299),p=r(2516),t=r(4650),g=r(6256),v=r(2289),T=r(2729),h=r(1481),x=r(5604),f=r(5754),_=r(782),m=r(8377),w=r(4850),U=r(2362),E=r(7084),F=r(9818),O=r(3238);function G(o,n){1&o&&t._UZ(0,"mat-progress-bar",8)}function j(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"button",16),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.upcomingEvents.showFullList=!i.upcomingEvents.showFullList)}),t._uU(1),t.qZA()}if(2&o){const e=t.oxw(2);t.xp6(1),t.hij(" ",e.upcomingEvents.showFullList?"\u1ea8n b\u1edbt":"Xem th\xeam"," ")}}const N=function(o){return{"position-absolute":o}},I=function(o,n,e,a,i,l){return{transform:o,color:n,background:e,width:a,zIndex:i,opacity:l}};function R(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",17),t.NdJ("click",function(){const i=t.CHM(e),l=i.$implicit,s=i.index,u=t.oxw(2);return t.KtG(u.viewEvent(l,s))}),t.TgZ(1,"div",18),t._UZ(2,"div",19),t.TgZ(3,"div",20),t._uU(4),t.qZA(),t.TgZ(5,"div",21),t._uU(6),t.qZA(),t.TgZ(7,"div",22),t._uU(8),t.qZA()()()}if(2&o){const e=n.$implicit,a=n.index,i=t.oxw(2);t.Q6J("ngClass",t.VKq(6,N,!i.upcomingEvents.showFullList&&0!==a))("ngStyle",t.HTZ(8,I,"translateY("+(i.upcomingEvents.showFullList?"":.5*a+"rem")+")",e.color||"rgba(0, 0, 0, 0.87)",e.backgroundColor,i.upcomingEvents.showFullList?"":100-5*a+"%",i.upcomingEvents.showFullList?"":i.upcomingEvents.event.length-a,i.upcomingEvents.showFullList?"":100-5*a<100?"0."+(100-5*a-30):1)),t.xp6(4),t.Oqu(null==e?null:e.name),t.xp6(2),t.AsE("",null==e?null:e.startTime,"-",null==e?null:e.endTime,""),t.xp6(2),t.Oqu(null==e?null:e.location)}}const Y=function(o){return{marginTop:o}};function z(o,n){if(1&o&&(t.TgZ(0,"div",9)(1,"div",10)(2,"h1",11),t._uU(3,"S\u1eaeP T\u1edaI"),t.qZA(),t.YNc(4,j,2,1,"button",12),t.qZA(),t.TgZ(5,"div",13),t.YNc(6,R,9,15,"div",14),t.qZA(),t._UZ(7,"mat-divider",15),t.qZA()),2&o){const e=t.oxw();t.xp6(4),t.Q6J("ngIf",e.upcomingEvents.event.length>1),t.xp6(2),t.Q6J("ngForOf",e.upcomingEvents.event),t.xp6(1),t.Q6J("ngStyle",t.VKq(3,Y,.75*e.upcomingEvents.event.length+"rem"))}}function X(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"button",16),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.todayEvents.showFullList=!i.todayEvents.showFullList)}),t._uU(1),t.qZA()}if(2&o){const e=t.oxw(2);t.xp6(1),t.hij(" ",e.todayEvents.showFullList?"\u1ea8n b\u1edbt":"Xem th\xeam"," ")}}function V(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",17),t.NdJ("click",function(){const i=t.CHM(e),l=i.$implicit,s=i.index,u=t.oxw(2);return t.KtG(u.viewEvent(l,s))}),t.TgZ(1,"div",18),t._UZ(2,"div",19),t.TgZ(3,"div",20),t._uU(4),t.qZA(),t.TgZ(5,"div",21),t._uU(6),t.qZA(),t.TgZ(7,"div",22),t._uU(8),t.qZA()()()}if(2&o){const e=n.$implicit,a=n.index,i=t.oxw(2);t.Q6J("ngClass",t.VKq(6,N,!i.todayEvents.showFullList&&0!==a))("ngStyle",t.HTZ(8,I,"translateY("+(i.todayEvents.showFullList?"":.5*a+"rem")+")",e.color||"rgba(0, 0, 0, 0.87)",e.backgroundColor,i.todayEvents.showFullList?"":100-5*a+"%",i.todayEvents.showFullList?"":i.todayEvents.event.length-a,i.todayEvents.showFullList?"":100-5*a<100?"0."+(100-5*a-30):1)),t.xp6(4),t.Oqu((null==e?null:e.name)||(null==e?null:e.eventName)),t.xp6(2),t.AsE("",null==e?null:e.startTime,"-",null==e?null:e.endTime,""),t.xp6(2),t.Oqu(null==e?null:e.location)}}function W(o,n){if(1&o&&(t.TgZ(0,"div",9)(1,"div",10)(2,"h1",11),t._uU(3,"H\xd4M NAY"),t.qZA(),t.YNc(4,X,2,1,"button",12),t.qZA(),t.TgZ(5,"div",13),t.YNc(6,V,9,15,"div",14),t.qZA(),t._UZ(7,"mat-divider",15),t.qZA()),2&o){const e=t.oxw();t.xp6(4),t.Q6J("ngIf",e.todayEvents.event.length>1),t.xp6(2),t.Q6J("ngForOf",e.todayEvents.event),t.xp6(1),t.Q6J("ngStyle",t.VKq(3,Y,.75*e.todayEvents.event.length+"rem"))}}function tt(o,n){if(1&o&&(t.TgZ(0,"mat-grid-tile")(1,"mat-card",28)(2,"mat-card-header")(3,"mat-card-title"),t._uU(4),t.qZA(),t.TgZ(5,"mat-card-subtitle"),t._uU(6),t.qZA()(),t.TgZ(7,"mat-card-content")(8,"p"),t._uU(9),t.qZA()()()()),2&o){const e=n.$implicit;t.xp6(1),t.Q6J("routerLink","chinh-sua/"+(null==e?null:e.key)),t.xp6(3),t.Oqu(null==e?null:e.name),t.xp6(2),t.Oqu(null==e?null:e.key),t.xp6(3),t.Oqu(null==e?null:e.description)}}function et(o,n){1&o&&(t.TgZ(0,"mat-grid-tile")(1,"mat-card",28)(2,"mat-card-header")(3,"mat-card-title"),t._uU(4,"+ Th\xeam m\u1edbi"),t.qZA(),t.TgZ(5,"mat-card-subtitle"),t._uU(6,"Th\xeam m\u1edbi s\u1ef1 ki\u1ec7n"),t.qZA()()()()),2&o&&(t.xp6(1),t.Q6J("routerLink","them-moi"))}function nt(o,n){if(1&o&&(t.TgZ(0,"mat-tab",3,4)(2,"mat-accordion",23)(3,"mat-expansion-panel",24)(4,"mat-expansion-panel-header")(5,"mat-panel-title"),t._uU(6," S\u1ef1 ki\u1ec7n"),t.qZA()(),t.TgZ(7,"mat-grid-list",25),t.YNc(8,tt,10,4,"mat-grid-tile",26),t.YNc(9,et,7,1,"mat-grid-tile",27),t.qZA()()()()),2&o){const e=t.oxw();t.Q6J("label","C\xc0I \u0110\u1eb6T"),t.xp6(3),t.Q6J("expanded",!0),t.xp6(4),t.Q6J("cols",e.cols),t.xp6(1),t.Q6J("ngForOf",e.eventList),t.xp6(1),t.Q6J("ngIf",e.contentEditable)}}class b{constructor(n,e,a,i,l,s,u){this.router=n,this.route=e,this.authService=a,this.breakpointObserver=i,this.eventService=l,this.titleSerVice=s,this.commonService=u,this.selectedIndex=0,this.isLoading=!1,this.cols=1,this.eventList=[],this.happeningEvents={event:[],showFullList:!1},this.upcomingEvents={event:[],showFullList:!1},this.todayEvents={event:[],showFullList:!1},this.time=this.commonService.time}ngOnInit(){this.getEvents(),this.route.queryParams.subscribe(n=>{this.selectedIndex=n.t?parseInt(n.t):this.authService.contentEditable?3:0}),this.titleSerVice.setTitle(`S\u1ef1 ki\u1ec7n | ${p.s.page.name}`),this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(n=>{this.cols=n.matches?2:6}),this.contentEditable=this.authService.contentEditable}selectedTabChange(n){this.router.navigate([],{relativeTo:this.route,queryParams:{t:n.index},queryParamsHandling:"merge"})}getEvents(){this.eventService.getEventList().subscribe(n=>{n&&(this.eventList=n.data,this.getHappeningTuThoiEvents(),this.getTodayTuThoiEvents(),this.getLocalStorageEvents())})}getLocalStorageEvents(){const n=new Date;JSON.parse(localStorage.getItem("tuanCuu")||"[]").forEach(a=>{const i=a.event.find(l=>new Date(l?.solar).getDate()==n.getDate()&&new Date(l?.solar).getMonth()==n.getMonth()&&new Date(l?.solar).getFullYear()==n.getFullYear());i&&(i.eventName=`C\u1ea7u si\xeau ${i.eventName} cho ${a?.details?.name}`,this.todayEvents.event.push(i))})}getHappeningTuThoiEvents(){switch(this.happeningEvents.event=[],this.time?.commonTime?.current?.key){case"ty-2301":case"meo-0507":case"ngo-1113":case"dau-1719":this.happeningEvents.event=[this.eventList.find(n=>"cung-tu-thoi"===n.key)?.event?.find(n=>1==n?.time?.length&&n?.time.find(e=>e===this.time?.commonTime?.current?.key))],this.happeningEvents.event[0]&&(this.happeningEvents.event[0].startTime=`${this.happeningEvents.event[0]?.time[0].split("-")[1]?.slice(0,2)}:00`,this.happeningEvents.event[0].endTime=`${this.happeningEvents.event[0]?.time[0].split("-")[1]?.slice(2,4)}:00`)}}getTodayTuThoiEvents(){this.upcomingEvents.event=[],this.upcomingEvents.event=this.eventList.find(n=>"cung-tu-thoi"===n.key)?.event?.filter(n=>"cung-tu-thoi"!==n.key),this.upcomingEvents.event.forEach(n=>{if(n.location="all"===n?.locationType[0]?"\u0110i\u1ec7n th\u1edd \u0110\u1ee9c Ch\xed T\xf4n":"",n?.time)switch(n.startTime=`${n?.time[0].split("-")[1]?.slice(0,2)}:00`,n.endTime=`${n?.time[0].split("-")[1]?.slice(2,4)}:00`,n?.time[0]){case"ty-2301":n.color="#ffffff",n.backgroundColor="linear-gradient(#221f23, #19386d)";break;case"meo-0507":n.backgroundColor="linear-gradient(#f1a2c4, #f9f2ec)";break;case"ngo-1113":n.backgroundColor="linear-gradient(#daf4d7, #07b4ff)";break;case"dau-1719":n.color="#ffffff",n.backgroundColor="linear-gradient(#b87059, #7a019e)";break;default:n.backgroundColor="black",n.color="white"}}),this.upcomingEvents.event=this.upcomingEvents?.event?.filter(n=>new Date(`${(new Date).getFullYear()}-${(new Date).getMonth()+1}-${(new Date).getDate()} ${n.endTime}:00`)>new Date)}viewEvent(n,e){n?.key&&(!this.upcomingEvents.showFullList&&(!n&&!e||n&&0!==e)?this.upcomingEvents.showFullList=!this.upcomingEvents.showFullList:this.router.navigate([n?.key],{relativeTo:this.route}))}}b.\u0275fac=function(n){return new(n||b)(t.Y36(d.F0),t.Y36(d.gz),t.Y36(g.e),t.Y36(v.Yg),t.Y36(T.P),t.Y36(h.Dx),t.Y36(x.v))},b.\u0275cmp=t.Xpm({type:b,selectors:[["app-event-list"]],decls:9,vars:6,consts:[[1,"event-list-container"],["mode","indeterminate",4,"ngIf"],[3,"selectedIndex","selectedTabChange"],[3,"label"],["tabGroup",""],[1,"main-event-list"],["class","event-group happenning-event",4,"ngIf"],[3,"label",4,"ngIf"],["mode","indeterminate"],[1,"event-group","happenning-event"],[1,"event-group-header","d-flex","justify-content-between","align-items-center"],[1,"event-group-title"],["mat-button","","class","event-group-action",3,"click",4,"ngIf"],[1,"event-group-list","d-flex","flex-column","align-items-center"],["class","event-card d-flex",3,"ngClass","ngStyle","click",4,"ngFor","ngForOf"],[3,"ngStyle"],["mat-button","",1,"event-group-action",3,"click"],[1,"event-card","d-flex",3,"ngClass","ngStyle","click"],[1,"event-information"],[1,"notification-subscribe"],[1,"event-name"],[1,"event-time"],[1,"event-location"],["multi",""],[3,"expanded"],["rowHeight","1:1",3,"cols"],[4,"ngFor","ngForOf"],[4,"ngIf"],["matRipple","",1,"h-100","w-100",3,"routerLink"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t.YNc(1,G,1,0,"mat-progress-bar",1),t.TgZ(2,"mat-tab-group",2),t.NdJ("selectedTabChange",function(i){return e.selectedTabChange(i)}),t.TgZ(3,"mat-tab",3,4)(5,"div",5),t.YNc(6,z,8,5,"div",6),t.YNc(7,W,8,5,"div",6),t.qZA()(),t.YNc(8,nt,10,5,"mat-tab",7),t.qZA()()),2&n&&(t.xp6(1),t.Q6J("ngIf",e.isLoading),t.xp6(1),t.Q6J("selectedIndex",e.selectedIndex),t.xp6(1),t.Q6J("label","S\u1ef0 KI\u1ec6N"),t.xp6(3),t.Q6J("ngIf",e.upcomingEvents.event.length>0),t.xp6(1),t.Q6J("ngIf",e.todayEvents.event.length>0),t.xp6(1),t.Q6J("ngIf",e.contentEditable))},dependencies:[c.mk,c.sg,c.O5,c.PC,d.rH,f.SK,f.R7,_.Il,_.DX,m.S$,m.u7,m.Qi,m.mi,m._K,w.d,U.eI,E.pp,E.ib,E.yz,E.yK,F.eB,O.wG],styles:[".event-list-container .mat-grid-tile-content{padding:.5rem!important}  .event-list-container .mat-card{cursor:pointer}  .event-list-container .mat-tab-body-content{padding:.5rem}  .event-list-container .mat-tab-body-wrapper{flex:1}  .event-list-container .mat-tab-group{flex:1;height:100%;overflow:hidden;background-color:#fff}  .event-list-container .main-event-list .event-group{padding-bottom:2rem}  .event-list-container .main-event-list .event-group .event-group-header{margin:1rem 0;color:#000000de}  .event-list-container .main-event-list .event-group .event-group-header .event-group-action{text-decoration:underline}  .event-list-container .main-event-list .event-group .event-group-list{position:relative}  .event-list-container .main-event-list .event-group .event-group-list .event-card{border-radius:1rem;padding:1rem;color:#fff;margin-bottom:1rem;width:100%;position:relative;transition:all 1s;cursor:pointer}  .event-list-container .main-event-list .event-group .event-group-list .event-card.position-absolute{position:absolute;top:0}  .event-list-container .main-event-list .event-group .event-group-list .event-card .notification-subscribe-btn{background:rgba(255,255,255,.5);margin-bottom:.5rem}  .event-list-container .main-event-list .event-group .event-group-list .event-card .event-name{margin-bottom:.5rem}  .event-list-container .main-event-list .event-group .event-group-list .event-card .event-time{font-size:30px;font-weight:700;margin-bottom:.5rem}  .event-list-container .main-event-list .event-group .event-group-list .event-card .event-location{font-weight:300}"]});class q{}var it=r(2972),H=r(7671),ot=r(5484),K=r(7392),M=r(4006),D=r(9549),at=r(8455),$=r(9203),Q=r(9982),B=r(6289),lt=r(4363),S=r(8256);function rt(o,n){1&o&&t._UZ(0,"mat-progress-bar",3)}function st(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"button",19),t.NdJ("click",function(){t.CHM(e);const i=t.oxw(2);return t.KtG(i.onSave())}),t._uU(1," L\u01b0u "),t.qZA()}2&o&&t.Q6J("color","primary")}function ct(o,n){if(1&o&&(t.TgZ(0,"mat-option",24),t._uU(1),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",e.name," ")}}function mt(o,n){if(1&o&&(t.TgZ(0,"mat-option",24),t._uU(1),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",e.name," ")}}function dt(o,n){if(1&o&&(t.TgZ(0,"mat-option",24),t._uU(1),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",e.name," ")}}function ut(o,n){if(1&o&&(t.TgZ(0,"mat-option",24),t._uU(1),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",e.name," ")}}function vt(o,n){if(1&o&&(t.TgZ(0,"mat-option",24),t._uU(1),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",e.name," ")}}function pt(o,n){if(1&o&&(t.TgZ(0,"mat-list-option",24),t._uU(1),t._UZ(2,"mat-divider"),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",null==e?null:e.name," ")}}function gt(o,n){if(1&o&&(t.TgZ(0,"mat-list-option",24),t._uU(1),t._UZ(2,"mat-divider"),t.qZA()),2&o){const e=n.$implicit;t.Q6J("value",null==e?null:e.key),t.xp6(1),t.hij(" ",null==e?null:e.name," ")}}function _t(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"mat-card",20)(1,"mat-card-header")(2,"mat-card-title"),t._uU(3),t.qZA()(),t.TgZ(4,"mat-card-content")(5,"div",11)(6,"div",12)(7,"mat-form-field",13)(8,"mat-label"),t._uU(9,"T\xean s\u1ef1 ki\u1ec7n"),t.qZA(),t.TgZ(10,"input",21),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.name=i)})("input",function(){const l=t.CHM(e).$implicit,s=t.oxw(2);return t.KtG(s.onChangeEventName(l))}),t.qZA()(),t.TgZ(11,"div",22)(12,"mat-radio-group",23),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.dateType=i)}),t.TgZ(13,"mat-radio-button",24)(14,"mat-label"),t._uU(15,"\xc2m l\u1ecbch"),t.qZA()(),t.TgZ(16,"mat-radio-button",24)(17,"mat-label"),t._uU(18,"D\u01b0\u01a1ng l\u1ecbch"),t.qZA()()(),t.TgZ(19,"mat-form-field",13)(20,"mat-label"),t._uU(21,"N\u0103m"),t.qZA(),t.TgZ(22,"input",25),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.year=i)}),t.qZA(),t.TgZ(23,"mat-select",26),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.year=i)}),t.YNc(24,ct,2,2,"mat-option",27),t.qZA()(),t.TgZ(25,"mat-form-field",13)(26,"mat-label"),t._uU(27,"Th\xe1ng"),t.qZA(),t.TgZ(28,"mat-select",28),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.month=i)}),t.YNc(29,mt,2,2,"mat-option",27),t.qZA()(),t.TgZ(30,"mat-form-field",13)(31,"mat-label"),t._uU(32,"Ng\xe0y"),t.qZA(),t.TgZ(33,"mat-select",28),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.selectedDate=i)}),t.YNc(34,dt,2,2,"mat-option",27),t.qZA()()(),t.TgZ(35,"mat-form-field",13)(36,"mat-label"),t._uU(37,"Th\u1eddi gian"),t.qZA(),t.TgZ(38,"mat-select",29),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.time=i)})("selectionChange",function(){const l=t.CHM(e).$implicit,s=t.oxw(2);return t.KtG(s.onChangeCommonTime(l))}),t.YNc(39,ut,2,2,"mat-option",27),t.qZA()(),t.TgZ(40,"mat-form-field",13)(41,"mat-label"),t._uU(42,"\u0110\u1ecba \u0111i\u1ec3m"),t.qZA(),t.TgZ(43,"mat-select",29),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.locationType=i)})("selectionChange",function(){const l=t.CHM(e).$implicit,s=t.oxw(2);return t.KtG(s.onChangeCommonLocationTypeValue(l))}),t.YNc(44,vt,2,2,"mat-option",27),t.qZA()()()(),t._UZ(45,"mat-divider"),t.TgZ(46,"div",11)(47,"mat-grid-list",30)(48,"mat-grid-tile",31)(49,"mat-card",32)(50,"mat-card-header")(51,"mat-card-title"),t._uU(52,"NGU\u1ed2N"),t.qZA()(),t.TgZ(53,"mat-card-content",33),t._UZ(54,"mat-divider"),t.TgZ(55,"mat-selection-list",34,35),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.kinh=i)})("selectionChange",function(){const l=t.CHM(e).$implicit,s=t.MAs(56),u=t.MAs(66),L=t.oxw(2);return t.KtG(L.onChangeSelectedKinhOption("stock",l,s,u))}),t.YNc(57,pt,3,2,"mat-list-option",27),t.qZA()()()(),t.TgZ(58,"mat-grid-tile",31)(59,"mat-card",32)(60,"mat-card-header")(61,"mat-card-title"),t._uU(62),t.qZA()(),t.TgZ(63,"mat-card-content",33),t._UZ(64,"mat-divider"),t.TgZ(65,"mat-selection-list",34,36),t.NdJ("ngModelChange",function(i){const s=t.CHM(e).$implicit;return t.KtG(s.kinh=i)})("selectionChange",function(){const l=t.CHM(e).$implicit,s=t.MAs(56),u=t.MAs(66),L=t.oxw(2);return t.KtG(L.onChangeSelectedKinhOption("filter",l,s,u))}),t.YNc(67,gt,3,2,"mat-list-option",27),t.qZA()()()()()()(),t.TgZ(68,"mat-card-actions",37)(69,"button",38)(70,"mat-icon"),t._uU(71,"delete"),t.qZA(),t._uU(72," X\xf3a "),t.qZA(),t.TgZ(73,"button",19),t.NdJ("click",function(){const l=t.CHM(e).$implicit,s=t.oxw(2);return t.KtG(s.onAddNewEvent(l))}),t.TgZ(74,"mat-icon"),t._uU(75,"add"),t.qZA(),t._uU(76," TH\xcaM S\u1ef0 KI\u1ec6N M\u1edaI "),t.qZA()()()}if(2&o){const e=n.$implicit,a=t.oxw(2);t.xp6(3),t.AsE("S\u1ef1 ki\u1ec7n ",e.name," (",e.key,")"),t.xp6(4),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.name),t.xp6(2),t.Q6J("ngModel",e.dateType),t.xp6(1),t.Q6J("value","lunar"),t.xp6(3),t.Q6J("value","solar"),t.xp6(3),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.year)("autocomplete","off"),t.xp6(1),t.Q6J("multiple",!0)("ngModel",e.year),t.xp6(1),t.Q6J("ngForOf",null==a.commonDates?null:a.commonDates.year),t.xp6(1),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.month),t.xp6(1),t.Q6J("ngForOf",null==a.commonDates?null:a.commonDates.month),t.xp6(1),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.selectedDate),t.xp6(1),t.Q6J("ngForOf",null==a.commonDates?null:a.commonDates.date),t.xp6(1),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.time)("multiple",!0),t.xp6(1),t.Q6J("ngForOf",a.commonTimes),t.xp6(1),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.locationType)("multiple",!0),t.xp6(1),t.Q6J("ngForOf",a.commonLocationTypes),t.xp6(3),t.Q6J("cols",2)("rowHeight","2:1"),t.xp6(8),t.Q6J("ngModel",e.kinh),t.xp6(2),t.Q6J("ngForOf",a.kinhList),t.xp6(5),t.hij("Danh s\xe1ch kinh: ",null==e?null:e.name,""),t.xp6(3),t.Q6J("ngModel",e.kinh),t.xp6(2),t.Q6J("ngForOf",e.kinhList),t.xp6(1),t.Q6J("align","end"),t.xp6(1),t.Q6J("color","warn"),t.xp6(4),t.Q6J("color","primary")}}function ht(o,n){if(1&o){const e=t.EpF();t.TgZ(0,"div",4)(1,"div",5)(2,"div",6)(3,"div",7)(4,"div")(5,"h1"),t._uU(6),t.qZA()(),t.TgZ(7,"div"),t.YNc(8,st,2,1,"button",8),t.TgZ(9,"button",9),t.NdJ("click",function(){t.CHM(e);const i=t.oxw();return t.KtG(i.onBack())}),t._uU(10,"Tho\xe1t"),t.qZA()()(),t._UZ(11,"mat-divider"),t.qZA(),t.TgZ(12,"div",10)(13,"div",11)(14,"div",12)(15,"mat-form-field",13)(16,"mat-label"),t._uU(17,"T\xean s\u1ef1 ki\u1ec7n"),t.qZA(),t.TgZ(18,"input",14),t.NdJ("ngModelChange",function(i){t.CHM(e);const l=t.oxw();return t.KtG(l.currentEvent.name=i)})("change",function(){t.CHM(e);const i=t.oxw();return t.KtG(i.onChangeName())}),t.qZA()(),t.TgZ(19,"mat-form-field",13)(20,"mat-label"),t._uU(21,"Key/Slug"),t.qZA(),t.TgZ(22,"input",15),t.NdJ("ngModelChange",function(i){t.CHM(e);const l=t.oxw();return t.KtG(l.currentEvent.key=i)}),t.qZA()()()(),t.TgZ(23,"div",11)(24,"mat-form-field",13)(25,"mat-label"),t._uU(26,"M\xf4 t\u1ea3"),t.qZA(),t.TgZ(27,"textarea",16),t.NdJ("ngModelChange",function(i){t.CHM(e);const l=t.oxw();return t.KtG(l.currentEvent.description=i)}),t.qZA()()(),t._UZ(28,"mat-divider"),t.TgZ(29,"div",17),t.YNc(30,_t,77,37,"mat-card",18),t.qZA()()()()}if(2&o){const e=t.oxw();t.xp6(6),t.hij("S\u1ef1 ki\u1ec7n - ",e.currentEvent.name,""),t.xp6(2),t.Q6J("ngIf",e.contentEditable),t.xp6(7),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.currentEvent.name),t.xp6(1),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.currentEvent.key)("disabled","them-moi"!==e.eventKey),t.xp6(2),t.Q6J("appearance","fill"),t.xp6(3),t.Q6J("ngModel",e.currentEvent.description),t.xp6(3),t.Q6J("ngForOf",e.currentEvent.event)}}class k{constructor(n,e,a,i,l,s,u,L,bt){this.route=n,this._snackBar=e,this.breakpointObserver=a,this.authService=i,this.location=l,this.eventService=s,this.kinhService=u,this.caodaionEditorService=L,this.commonService=bt,this.currentEvent=new q,this.contentEditable=!1,this.isLoading=!1,this.isShowBackButton=!1,this.horizontalPosition="center",this.verticalPosition="bottom",this.eventList=this.eventService.eventList,this.kinhList=this.kinhService.kinhList,this.commonTimes=this.commonService.commonTimes,this.commonDates=this.commonService.commonDates,this.commonLocationTypes=this.commonService.commonLocationTypes}ngOnInit(){this.route.params.subscribe(n=>{this.eventKey=n.eventKey}),this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(n=>{n.matches?(this.contentEditable=!1,this.isShowBackButton=!1,localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0}))):(this.contentEditable=this.authService.contentEditable,this.isShowBackButton=!0,localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!1,isHideBottomNavBar:!1})))}),this.getEvent()}getEvent(){let n=this.eventList.find(e=>e.key===this.eventKey);if(this.currentEvent=n||new q,this.currentEvent.event&&0!==this.currentEvent.event.length)this.currentEvent.event.forEach(e=>{e.selectedDate=e.date.split("-")[2],e.month=e.date.split("-")[1],e.year=[e.date.split("-")[0]],e.kinhList=[],e.kinh.forEach(a=>{let i=this.kinhList?.find(l=>l.key===a);e.kinhList.push(i)})});else{this.currentEvent.event=[];const e=new P;this.currentEvent.event.push(e)}}onChangeSelectedKinhOption(n,e,a,i){e.kinhList=[],"stock"===n&&a.selectedOptions.selected&&a.selectedOptions.selected.forEach(l=>{let s=this.kinhList?.find(u=>u.key===l.value);e.kinhList.push(s)}),"filter"===n&&i.selectedOptions.selected&&i.selectedOptions.selected.forEach(l=>{let s=this.kinhList?.find(u=>u.key===l.value);e.kinhList.push(s)}),e.kinh=e.kinhList.map(l=>l.key)}onChangeCommonTime(n){n.time=this.commonService.getCommonTimeValue(n.time)}onChangeCommonLocationTypeValue(n){n.locationType=this.commonService.getCommonLocationTypeValue(n.locationType)}onAddNewEvent(n){const e=new P;n?n.name&&n.time&&n.locationType&&n.kinh&&0!==n.kinh.length?this.currentEvent.event.push(e):console.log(n):this.currentEvent.event.push(e)}onChangeName(){this.currentEvent.key=this.currentEvent.name?this.getSlug(this.currentEvent.name):""}onChangeEventName(n){n.key=n.name?this.getSlug(n.name):""}getSlug(n){return this.caodaionEditorService.generatedSlug(n)}onSave(){let n=[];"them-moi"===this.eventKey&&this.eventList.push(this.currentEvent),this.eventList.forEach(e=>{let a=[];a=e.event.map(i=>({key:i.key,name:i.name,dateType:i.dateType,date:i.year&&i.month&&i.selectedDate?`${i.year}-${i.month}-${i.selectedDate}`:i.date,time:i.time,locationType:i.locationType,kinh:i.kinh})),n.push({name:e.name,description:e.description,key:e.key,event:a})}),console.log({data:n})}onBack(){this.location.back()}}k.\u0275fac=function(n){return new(n||k)(t.Y36(d.gz),t.Y36(it.pl),t.Y36(v.Yg),t.Y36(g.e),t.Y36(c.Ye),t.Y36(T.P),t.Y36(H.c),t.Y36(ot.TB),t.Y36(x.v))},k.\u0275cmp=t.Xpm({type:k,selectors:[["app-event-content"]],decls:3,vars:2,consts:[[1,"wrapper-container","event-content-container"],["mode","indeterminate",4,"ngIf"],["class","wrapper-container event-container-wrapper",4,"ngIf"],["mode","indeterminate"],[1,"wrapper-container","event-container-wrapper"],[1,"flex-1","wrapper-container","event-container"],[1,"top-pannel"],[1,"top-pannel-content","d-flex","justify-content-between"],["mat-flat-button","",3,"color","click",4,"ngIf"],["mat-stroked-button","",3,"click"],[1,"flex-1","event-content-form"],[1,"form-group"],[1,"d-flex"],[1,"w-100",3,"appearance"],["type","text","matInput","",3,"ngModel","ngModelChange","change"],["type","text","matInput","",3,"ngModel","disabled","ngModelChange"],["rows","3","matInput","",3,"ngModel","ngModelChange"],[1,"form-group","event-form-group"],["class","event-details",4,"ngFor","ngForOf"],["mat-flat-button","",3,"color","click"],[1,"event-details"],["type","text","matInput","","required","",3,"ngModel","ngModelChange","input"],[1,"w-100","d-flex"],[3,"ngModel","ngModelChange"],[3,"value"],["matInput","",3,"ngModel","autocomplete","ngModelChange"],["required","",3,"multiple","ngModel","ngModelChange"],[3,"value",4,"ngFor","ngForOf"],["required","",3,"ngModel","ngModelChange"],["required","",3,"ngModel","multiple","ngModelChange","selectionChange"],[3,"cols","rowHeight"],[1,"kinh-list-wrapper"],[1,"w-100","h-100","wrapper-container"],[1,"flex-1","kinh-list","w-100","h-100"],[3,"ngModel","ngModelChange","selectionChange"],["stock",""],["filter",""],[3,"align"],["mat-button","",3,"color"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0),t.YNc(1,rt,1,0,"mat-progress-bar",1),t.YNc(2,ht,31,10,"div",2),t.qZA()),2&n&&(t.xp6(1),t.Q6J("ngIf",e.isLoading),t.xp6(1),t.Q6J("ngIf",e.currentEvent))},dependencies:[c.sg,c.O5,_.Il,_.DX,m.S$,m.u7,m.Qi,m.mi,m.Fx,w.d,U.eI,F.eB,K.Hw,M.Fj,M.JJ,M.Q7,M.On,D.KE,D.hX,at.$V,$.k0,Q.kh,Q.O$,B.x8,lt.CK,S.OY,S.vy],styles:[".event-content-container{background-color:#fff}  .event-content-container .top-pannel-content button{margin-left:1rem}  .event-content-container .form-group{padding:1rem}  .event-content-container .form-group mat-card{margin-bottom:1rem}  .event-content-container .form-group mat-card .kinh-list{overflow:auto}  .event-content-container .kinh-list-wrapper .mat-grid-tile-content{padding:.5rem}  .event-content-container .event-content-form{overflow:auto}"]});class P{constructor(){this.dateType="lunar"}}var ft=r(3646),Et=r(8109);function Ct(o,n){if(1&o&&(t.TgZ(0,"mat-grid-tile")(1,"mat-card",11)(2,"mat-card-header")(3,"mat-card-title"),t._uU(4),t.qZA()()()()),2&o){const e=n.$implicit;t.xp6(1),t.Q6J("routerLink","/trang-chu/kinh/"+(null==e?null:e.key)),t.xp6(3),t.Oqu(null==e?null:e.name)}}const Tt=function(){return{link:"/lich/su-kien"}},xt=function(o){return{navigate:o}};class A{constructor(n,e,a,i,l){this.route=n,this.eventService=e,this.kinhService=a,this.commonService=i,this.breakpointObserver=l,this.eventList=[],this.kinhList=[],this.currentKinhList=[],this.cols=0}ngOnInit(){this.getEvents(),this.route.params.subscribe(n=>{n.eventKey&&(this.eventKey=n.eventKey)}),this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(n=>{this.cols=n.matches?2:6})}getEvents(){this.eventService.getEventList().subscribe(n=>{n&&(this.eventList=n.data,this.getKinhs())})}getKinhs(){this.kinhService.getKinhList().subscribe(n=>{n&&(this.kinhList=n.data,this.getEventDetails())})}getEventDetails(){const n=(e,a)=>{let i;return e.some(l=>i=l.key===a?l:n(l.event||[],a)),i};this.event=n(this.eventList,this.eventKey),this.event.time&&(this.event.time=this.commonService.commonTimes.find(e=>e.key===this.event.time[0])?.name),this.event.kinh.forEach(e=>{let a=this.kinhList.find(i=>i.key===e);a&&this.currentKinhList.push(a)})}}A.\u0275fac=function(n){return new(n||A)(t.Y36(d.gz),t.Y36(T.P),t.Y36(H.c),t.Y36(x.v),t.Y36(v.Yg))},A.\u0275cmp=t.Xpm({type:A,selectors:[["app-event-details"]],decls:25,vars:11,consts:[[1,"wrapper-container","event-content-container"],[1,"header",3,"prevPage"],[1,"kinh-header"],[1,"wrapper-container","event-container-wrapper"],[1,"flex-1","wrapper-container","event-container"],[1,"event-accordion"],[1,"d-flex","align-items-center","information-data"],["multi","",1,"event-accordion"],[3,"expanded"],["rowHeight","1:1",3,"cols"],[4,"ngFor","ngForOf"],["matRipple","",1,"h-100","w-100",3,"routerLink"]],template:function(n,e){1&n&&(t.TgZ(0,"div",0)(1,"app-header",1)(2,"div",2)(3,"app-header-title"),t._uU(4),t.qZA()()(),t.TgZ(5,"div",3)(6,"div",4)(7,"div",5)(8,"h1"),t._uU(9),t.qZA(),t.TgZ(10,"div",6)(11,"mat-icon"),t._uU(12,"event"),t.qZA(),t._uU(13),t.qZA(),t.TgZ(14,"div",6)(15,"mat-icon"),t._uU(16,"schedule"),t.qZA(),t._uU(17),t.qZA()(),t.TgZ(18,"mat-accordion",7)(19,"mat-expansion-panel",8)(20,"mat-expansion-panel-header")(21,"mat-panel-title"),t._uU(22," \xc1p d\u1ee5ng kinh"),t.qZA()(),t.TgZ(23,"mat-grid-list",9),t.YNc(24,Ct,5,2,"mat-grid-tile",10),t.qZA()()()()()()),2&n&&(t.xp6(1),t.Q6J("prevPage",t.VKq(9,xt,t.DdM(8,Tt))),t.xp6(3),t.Oqu(null==e.event?null:e.event.name),t.xp6(5),t.Oqu(null==e.event?null:e.event.name),t.xp6(4),t.hij(" ","yearly-monthly-daily"===(null==e.event?null:e.event.date)?"M\u1ed7i ng\xe0y":"yearly-monthly-daily"!==(null==e.event?null:e.event.date)&&null!=e.event&&e.event.date.includes("yearly-monthly-")?"Ng\xe0y "+(null==e.event?null:e.event.date.split("-")[2])+" m\u1ed7i th\xe1ng":"yearly-monthly-daily"===(null==e.event?null:e.event.date)||null!=e.event&&e.event.date.includes("yearly-monthly-")||null==e.event||!e.event.date.includes("yearly-")?"yearly-monthly-daily"===(null==e.event?null:e.event.date)||null!=e.event&&e.event.date.includes("yearly-monthly-")||null==e.event||!e.event.date.includes("yearly-")?"":"Ng\xe0y "+(null==e.event?null:e.event.date.split("-")[2])+" th\xe1ng "+(null==e.event?null:e.event.date.split("-")[1])+" n\u0103m"+(null==e.event?null:e.event.date.split("-")[0]):"Ng\xe0y "+(null==e.event?null:e.event.date.split("-")[2])+" th\xe1ng "+(null==e.event?null:e.event.date.split("-")[1])+" m\u1ed7i n\u0103m"," "),t.xp6(4),t.hij(" ",null==e.event?null:e.event.time," "),t.xp6(2),t.Q6J("expanded",!0),t.xp6(4),t.Q6J("cols",e.cols),t.xp6(1),t.Q6J("ngForOf",e.currentKinhList))},dependencies:[c.sg,d.rH,_.Il,_.DX,m.S$,m.u7,m.mi,ft.G,Et.d,E.pp,E.ib,E.yz,E.yK,O.wG,K.Hw],styles:[".event-content-container{background-color:#fff}  .event-content-container .event-accordion{padding:.5rem!important}  .event-content-container .mat-grid-tile-content{padding:.5rem!important}  .event-content-container .mat-card{cursor:pointer}  .event-content-container .information-data{margin-bottom:.5rem}  .event-content-container .information-data mat-icon{margin-right:.5rem}"]});const yt=[{path:"",children:[{path:"",component:b},{path:"chinh-sua/:eventKey",component:k},{path:":eventKey",component:A}]}];class y{}y.\u0275fac=function(n){return new(n||y)},y.\u0275mod=t.oAB({type:y}),y.\u0275inj=t.cJS({imports:[d.Bz.forChild(yt),d.Bz]});var Zt=r(4546);class Z{}Z.\u0275fac=function(n){return new(n||Z)},Z.\u0275mod=t.oAB({type:Z}),Z.\u0275inj=t.cJS({imports:[c.ez,y,f.Nn,_.N6,m.IF,w.t,U.jc,Zt.O,E.To,F.yu,O.si,K.Ps,M.u5,D.lN,$.x4,Q.gR,B.uw,S.Xo]})}}]);