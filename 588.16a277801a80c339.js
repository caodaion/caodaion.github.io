"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[588],{588:(J,g,i)=>{i.r(g),i.d(g,{ActionModule:()=>u});var A=i(6895),w=i(4859),M=i(7392),h=i(6338),m=i(3267),r=i(9299),x=i(8286),F=i(4746),C=i(2516),t=i(4650),T=i(2289),p=i(6256),b=i(1481),O=i(6427);const G=["drawer"];function L(s,e){if(1&s){const n=t.EpF();t.TgZ(0,"a",5),t.NdJ("click",function(){t.CHM(n);const v=t.oxw();return t.KtG(v.onToggleDrawer())}),t.TgZ(1,"mat-icon",6),t._uU(2),t.qZA(),t.TgZ(3,"span",7),t._uU(4),t.qZA()()}if(2&s){const n=e.$implicit;t.Q6J("routerLink",null==n?null:n.url)("routerLinkActive","active"),t.xp6(2),t.Oqu(null==n?null:n.icon),t.xp6(2),t.Oqu(null==n?null:n.label)}}class d{constructor(e,n,o,v){this.breakpointObserver=e,this.authService=n,this.titleSerVice=o,this.viewMissionService=v,this.menu=[]}ngOnInit(){this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(e=>{e.matches?(this.viewMissionService.isDrawerOpened=!1,this.drawerMode="over"):(this.viewMissionService.isDrawerOpened=!0,this.drawerMode="side")}),this.menu=this.authService.getMenu(F.s.find(e=>"tac-vu"===e.key)?.children,this.authService.currentUser?.children?.find(e=>"tac-vu"===e.key)),this.titleSerVice.setTitle(`T\xe1c v\u1ee5 | ${C.s.page.name}`)}onToggleDrawer(){"over"===this.drawerMode&&(this.viewMissionService.isDrawerOpened=!this.viewMissionService.isDrawerOpened)}}d.\u0275fac=function(e){return new(e||d)(t.Y36(T.Yg),t.Y36(p.e),t.Y36(b.Dx),t.Y36(O.D))},d.\u0275cmp=t.Xpm({type:d,selectors:[["app-action"]],viewQuery:function(e,n){if(1&e&&t.Gf(G,5),2&e){let o;t.iGM(o=t.CRH())&&(n.drawer=o.first)}},decls:6,vars:3,consts:[["tosize","",1,"w-100"],["mode","side",1,"sub-sidenav",3,"opened","mode"],[1,"mat-list-sub-sidenav"],["mat-list-item","","class","icon-hover",3,"routerLink","routerLinkActive","click",4,"ngFor","ngForOf"],[1,"sub-sidenav-content"],["mat-list-item","",1,"icon-hover",3,"routerLink","routerLinkActive","click"],[1,"sub-sidenav-icon"],[1,"label-large"]],template:function(e,n){1&e&&(t.TgZ(0,"mat-sidenav-container",0)(1,"mat-sidenav",1)(2,"mat-nav-list",2),t.YNc(3,L,5,4,"a",3),t.qZA()(),t.TgZ(4,"mat-sidenav-content",4),t._UZ(5,"router-outlet"),t.qZA()()),2&e&&(t.xp6(1),t.Q6J("opened",n.viewMissionService.isDrawerOpened)("mode",n.drawerMode),t.xp6(2),t.Q6J("ngForOf",n.menu))},dependencies:[A.sg,M.Hw,m.JX,m.TM,m.Rh,h.Hk,h.Tg,r.lC,r.rH,r.Od],styles:[".sub-sidenav{display:flex;height:100%;width:298px;align-items:center;justify-content:center}  .sub-sidenav .mat-list-sub-sidenav{padding:12px}  .sub-sidenav .mat-list-sub-sidenav .mat-mdc-list-item-unscoped-content{display:flex;align-items:center}  .sub-sidenav .mat-mdc-list-item{border-radius:48px;transition:.3s}  .sub-sidenav .mat-mdc-list-item:hover{background-color:transparent}  .sub-sidenav .mat-mdc-list-item.active{background:#d3e3fd!important}  .sub-sidenav .sub-sidenav-item{height:56px;margin:0 12px}  .sub-sidenav .sub-sidenav-icon{margin:16px}"]});class a{constructor(e,n){this.authService=e,this.router=n}canActivate(e,n){const o=(D,y)=>{let S;return D.some(f=>S=f.key===y?f:o(f.children||[],y)),S};let v=n.url.slice(1,n.url.length)?.split("?")[0]?.replaceAll("/",".");return!!o(this.authService.currentUser?.children,v)||(this.router.navigate([`/${n.url.split("/")[1]}`]),!1)}}a.\u0275fac=function(e){return new(e||a)(t.LFG(p.e),t.LFG(r.F0))},a.\u0275prov=t.Yz7({token:a,factory:a.\u0275fac});class c{constructor(e,n){this.authService=e,this.router=n}canActivate(e,n){return!!this.authService.currentUser.voViWorker||(this.router.navigate([`/${n.url.split("/")[1]}`]),!1)}}c.\u0275fac=function(e){return new(e||c)(t.LFG(p.e),t.LFG(r.F0))},c.\u0275prov=t.Yz7({token:c,factory:c.\u0275fac});const Z=[{path:"",component:d,children:[{path:"cau-sieu-vo-vi",loadChildren:()=>Promise.all([i.e(637),i.e(592),i.e(243)]).then(i.bind(i,9243)).then(s=>s.CauSieuVoViModule),canActivate:[a,c]},{path:"**",pathMatch:"full",component:x.V}]}];class l{}l.\u0275fac=function(e){return new(e||l)},l.\u0275mod=t.oAB({type:l}),l.\u0275inj=t.cJS({imports:[r.Bz.forChild(Z),r.Bz]});class u{}u.\u0275fac=function(e){return new(e||u)},u.\u0275mod=t.oAB({type:u}),u.\u0275inj=t.cJS({providers:[a,c],imports:[A.ez,M.Ps,m.SJ,w.ot,h.ie,l]})}}]);