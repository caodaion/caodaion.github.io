"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[638],{6638:(Z,c,t)=>{t.r(c),t.d(c,{MainModule:()=>a});var u=t(6895),d=t(9299),p=t(8286),M=t(4746),n=t(4650),g=t(2289),f=t(6256),y=t(6427),h=t(7392),m=t(3267),v=t(6338);const C=["drawer"];function T(e,i){if(1&e){const s=n.EpF();n.TgZ(0,"a",5),n.NdJ("click",function(){n.CHM(s);const S=n.oxw();return n.KtG(S.onToggleDrawer())}),n.TgZ(1,"mat-icon",6),n._uU(2),n.qZA(),n.TgZ(3,"span",7),n._uU(4),n.qZA()()}if(2&e){const s=i.$implicit;n.Q6J("routerLink",null==s?null:s.url)("routerLinkActive","active"),n.xp6(2),n.Oqu(null==s?null:s.icon),n.xp6(2),n.Oqu(null==s?null:s.label)}}class l{constructor(i,s,r){this.breakpointObserver=i,this.authService=s,this.viewMissionService=r,this.menu=[]}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(i=>{i.matches?(this.viewMissionService.isDrawerOpened=!1,this.drawerMode="over"):(this.viewMissionService.isDrawerOpened=!0,this.drawerMode="side")}),this.menu=this.authService.getMenu(M.s.find(i=>"trang-chu"===i.key)?.children)}onToggleDrawer(){"over"===this.drawerMode&&(this.viewMissionService.isDrawerOpened=!this.viewMissionService.isDrawerOpened)}}l.\u0275fac=function(i){return new(i||l)(n.Y36(g.Yg),n.Y36(f.e),n.Y36(y.D))},l.\u0275cmp=n.Xpm({type:l,selectors:[["app-main"]],viewQuery:function(i,s){if(1&i&&n.Gf(C,5),2&i){let r;n.iGM(r=n.CRH())&&(s.drawer=r.first)}},decls:6,vars:3,consts:[["tosize","",1,"w-100"],["mode","side",1,"sub-sidenav",3,"opened","mode"],[1,"mat-list-sub-sidenav"],["mat-list-item","","class","icon-hover",3,"routerLink","routerLinkActive","click",4,"ngFor","ngForOf"],["id","subSidenavContent",1,"sub-sidenav-content"],["mat-list-item","",1,"icon-hover",3,"routerLink","routerLinkActive","click"],[1,"sub-sidenav-icon"],[1,"label-large"]],template:function(i,s){1&i&&(n.TgZ(0,"mat-sidenav-container",0)(1,"mat-sidenav",1)(2,"mat-nav-list",2),n.YNc(3,T,5,4,"a",3),n.qZA()(),n.TgZ(4,"mat-sidenav-content",4),n._UZ(5,"router-outlet"),n.qZA()()),2&i&&(n.xp6(1),n.Q6J("opened",s.viewMissionService.isDrawerOpened)("mode",s.drawerMode),n.xp6(2),n.Q6J("ngForOf",s.menu))},dependencies:[u.sg,h.Hw,m.JX,m.TM,m.Rh,v.Hk,v.Tg,d.lC,d.rH,d.Od],styles:[".sub-sidenav{display:flex;height:100%;width:298px;align-items:center;justify-content:center}  .sub-sidenav .mat-list-sub-sidenav{padding:12px}  .sub-sidenav .mat-list-sub-sidenav .mat-mdc-list-item-unscoped-content{display:flex;align-items:center}  .sub-sidenav .mat-mdc-list-item{border-radius:48px;transition:.3s}  .sub-sidenav .mat-mdc-list-item:hover{background-color:transparent}  .sub-sidenav .mat-mdc-list-item.active{background:#d3e3fd!important}  .sub-sidenav .sub-sidenav-item{height:56px;margin:0 12px}  .sub-sidenav .sub-sidenav-icon{margin:16px}"]});const x=[{path:"",component:l,children:[{path:"kinh",loadChildren:()=>Promise.all([t.e(637),t.e(159),t.e(1),t.e(903)]).then(t.bind(t,903)).then(e=>e.KinhModule)},{path:"thu-vien",loadChildren:()=>Promise.all([t.e(637),t.e(159),t.e(1),t.e(950)]).then(t.bind(t,5950)).then(e=>e.LibraryModule)},{path:"thanh-ngon-hiep-tuyen",loadChildren:()=>Promise.all([t.e(159),t.e(1),t.e(327)]).then(t.bind(t,2327)).then(e=>e.ThanhNgonHiepTuyenModule)},{path:"**",pathMatch:"full",component:p.V}]}];class o{}o.\u0275fac=function(i){return new(i||o)},o.\u0275mod=n.oAB({type:o}),o.\u0275inj=n.cJS({imports:[d.Bz.forChild(x),d.Bz]});var O=t(4859);class a{}a.\u0275fac=function(i){return new(i||a)},a.\u0275mod=n.oAB({type:a}),a.\u0275inj=n.cJS({imports:[u.ez,h.Ps,m.SJ,O.ot,v.ie,o]})}}]);