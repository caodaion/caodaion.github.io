"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[262],{4855:(M,C,i)=>{i.r(C),i.d(C,{ThanhNgonHiepTuyenModule:()=>u});var f=i(6895),d=i(9299),t=i(4650),N=i(529);class l{constructor(e){this.http=e}getTNHTByPath(e){return this.http.get(`assets/documents/thanh-ngon-hiep-tuyen/${e}.json`)}static#t=this.\u0275fac=function(n){return new(n||l)(t.LFG(N.eN))};static#n=this.\u0275prov=t.Yz7({token:l,factory:l.\u0275fac,providedIn:"root"})}var p=i(7084),v=i(9982),T=i(9818);function Z(a,e){if(1&a){const n=t.EpF();t.TgZ(0,"mat-list-item")(1,"div",12)(2,"div",6),t._uU(3),t.qZA(),t.TgZ(4,"div",7)(5,"button",8),t.NdJ("click",function(){const c=t.CHM(n).$implicit,r=t.oxw(3);return t.KtG(r.readTNHTContent(c))}),t._uU(6,"\u0110\u1ecdc"),t.qZA()()()()}if(2&a){const n=e.$implicit,o=t.oxw(3);t.xp6(3),t.Oqu(o.getContentName(n))}}function F(a,e){if(1&a){const n=t.EpF();t.TgZ(0,"mat-expansion-panel",10)(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"h3",6),t._uU(4),t.qZA()(),t.TgZ(5,"div",7)(6,"button",8),t.NdJ("click",function(){const c=t.CHM(n).$implicit,r=t.oxw(2);return t.KtG(r.readTNHTContent(c))}),t._uU(7,"\u0110\u1ecdc"),t.qZA()()(),t.TgZ(8,"div")(9,"mat-list"),t.YNc(10,Z,7,1,"mat-list-item",11),t.qZA()()()}if(2&a){const n=e.$implicit,o=t.oxw(2);t.Q6J("expanded",!1)("disabled",!n.content),t.xp6(4),t.Oqu(o.getContentName(n)),t.xp6(6),t.Q6J("ngForOf",n.content)}}function k(a,e){if(1&a){const n=t.EpF();t.TgZ(0,"mat-expansion-panel",5)(1,"mat-expansion-panel-header")(2,"mat-panel-title")(3,"h2",6),t._uU(4),t.qZA()(),t.TgZ(5,"div",7)(6,"button",8),t.NdJ("click",function(){const c=t.CHM(n).$implicit,r=t.oxw();return t.KtG(r.readTNHTContent(c))}),t._uU(7,"\u0110\u1ecdc"),t.qZA()()(),t.TgZ(8,"div")(9,"mat-accordion",3),t.YNc(10,F,11,4,"mat-expansion-panel",9),t.qZA()()()}if(2&a){const n=e.$implicit,o=t.oxw();t.Q6J("expanded",!0),t.xp6(4),t.Oqu(o.getContentName(n)),t.xp6(6),t.Q6J("ngForOf",null==n?null:n.content)}}class m{constructor(e,n){this.tnhtService=e,this.router=n,this.tableContent=[]}ngOnInit(){this.getTableContent()}getTableContent(){this.tnhtService.getTNHTByPath("quyen-1").subscribe(e=>{e.data&&(this.tableContent.push(e.data),console.log(this.tableContent))})}readTNHTContent(e){e?.attrs?.hash?.includes("#")?this.router.navigate([e?.attrs?.pathname],{fragment:e?.attrs?.hash.replace("#","")}):this.router.navigate([`${e?.attrs?.pathname}${e?.attrs?.hash||""}`])}getContentName(e){if(!e?.name){let n="";return e?.content[0]?.content.forEach(o=>{"text"==o.type&&(n+=o?.text)}),n}return e?.name}static#t=this.\u0275fac=function(n){return new(n||m)(t.Y36(l),t.Y36(d.F0))};static#n=this.\u0275cmp=t.Xpm({type:m,selectors:[["app-tnht-table-content"]],decls:6,vars:1,consts:[[1,"tnht-table-content"],[1,"text-center","tnht-title"],[1,"table-content-wrapper"],["multi",""],["disabled","","hideToggle","",3,"expanded",4,"ngFor","ngForOf"],["disabled","","hideToggle","",3,"expanded"],[1,"content-name"],[1,"d-flex","align-items-center"],["mat-stroked-button","",3,"click"],["hideToggle","",3,"expanded","disabled",4,"ngFor","ngForOf"],["hideToggle","",3,"expanded","disabled"],[4,"ngFor","ngForOf"],[1,"w-100","d-flex","justify-content-between","align-items-center"]],template:function(n,o){1&n&&(t.TgZ(0,"div",0)(1,"h1",1),t._uU(2,"Th\xe1nh-Ng\xf4n Hi\u1ec7p-Tuy\u1ec3n"),t.qZA(),t.TgZ(3,"div",2)(4,"mat-accordion",3),t.YNc(5,k,11,3,"mat-expansion-panel",4),t.qZA()()()),2&n&&(t.xp6(5),t.Q6J("ngForOf",o.tableContent))},dependencies:[f.sg,p.pp,p.ib,p.yz,p.yK,v.Zj,v.oh,T.eB],styles:[".tnht-table-content .tnht-title{margin:2rem 0}  .tnht-table-content .mat-expansion-panel-header[aria-disabled=true]{color:unset}  .tnht-table-content .mat-expansion-panel-header{height:auto}  .tnht-table-content .mat-expansion-panel-header .mat-expansion-panel-header-title,   .tnht-table-content .mat-expansion-panel-header .mat-expansion-panel-header .mat-expansion-panel-header-description,   .tnht-table-content .mat-expansion-panel-header .content-name{white-space:normal;margin-right:1rem}  .tnht-table-content .content-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}  .tnht-table-content a{color:unset;text-decoration:none}"]})}var O=i(6256),J=i(2289),A=i(1481),B=i(8974),H=i(3646),I=i(8109),_=i(3162),S=i(1746);function E(a,e){1&a&&t._UZ(0,"mat-progress-bar",7)}function Y(a,e){if(1&a){const n=t.EpF();t.TgZ(0,"div",8)(1,"cp-content-creator",9),t.NdJ("save",function(){t.CHM(n);const s=t.oxw();return t.KtG(s.onSaveContent())}),t.qZA()()}if(2&a){const n=t.oxw();t.xp6(1),t.Q6J("data",n.content)}}const b=function(a){return{link:a}},$=function(a){return{text:"Tr\u01b0\u1edbc \u0111\xf3",navigate:a}},w=function(a){return{text:"Ti\u1ebfp theo",navigate:a}};function L(a,e){if(1&a&&t._UZ(0,"app-bottom-navigator",10),2&a){const n=t.oxw();t.Q6J("prev",t.VKq(4,$,t.VKq(2,b,n.navigate.prev.link)))("next",t.VKq(8,w,t.VKq(6,b,n.navigate.next.link)))}}const Q=function(){return{link:"/trang-chu/thanh-ngon-hiep-tuyen"}},K=function(a){return{navigate:a}};class h{constructor(e,n,o,s,c){this.tnhtService=e,this.route=n,this.authService=o,this.breakpointObserver=s,this.titleService=c,this.isLoading=!1,this.navigate={prev:{link:void 0},next:{link:void 0}}}ngOnInit(){this.route.params.subscribe(e=>{e.key&&!e.level&&this.getContent(e.key,e.level),e.key&&e.level&&this.getContent(e.key,e.level)})}getContent(e,n){this.isLoading=!0,this.tnhtService.getTNHTByPath(e).subscribe(o=>{if(o.data){if(this.rootContent=o.data,this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe(s=>{s.matches?localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!0,isHideBottomNavBar:!0})):localStorage.setItem("currentLayout",JSON.stringify({isHideToolbar:!1,isHideBottomNavBar:!1}))}),n){const s=(c,r)=>{let y;return c.some(x=>y=x.key===r?x:s(x.content||[],r)),y};this.content=s(o.data.content,location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")),this.titleService.setTitle(`${this.content.name} | ${this.rootContent.name} | CaoDaiON`),this.isLoading=!1,this.getNavigateLink()}else this.content=o.data,this.titleService.setTitle(`${this.content.name} | ${this.rootContent.name} | CaoDaiON`),this.isLoading=!1,this.getNavigateLink();location.hash&&location.pathname.includes("thanh-ngon-hiep-tuyen")&&setTimeout(()=>{const s=document.getElementById(`${location.pathname.slice(1,location.pathname.length).split("/").slice(1).join("-").replaceAll("-","")}${location.hash.replace("#","")}`);s.style.color="#4285f4",document.getElementById("contentCreatorWrapper").scroll({top:s.offsetTop})},0)}})}onSaveContent(){console.log(this.rootContent),navigator.clipboard.writeText(JSON.stringify({data:this.rootContent}))}getNavigateLink(){this.navigate.prev.link=this.rootContent.content[this.rootContent.content.findIndex(n=>n.key==this.content.key)-1]?.attrs.pathname+this.rootContent.content[this.rootContent.content.findIndex(n=>n.key==this.content.key)-1]?.attrs.hash||"/",this.navigate.next.link=this.rootContent.content[this.rootContent.content.findIndex(n=>n.key==this.content.key)+1]?.attrs.pathname+this.rootContent.content[this.rootContent.content.findIndex(n=>n.key==this.content.key)+1]?.attrs.hash||"/"}static#t=this.\u0275fac=function(n){return new(n||h)(t.Y36(l),t.Y36(d.gz),t.Y36(O.e),t.Y36(J.Yg),t.Y36(A.Dx))};static#n=this.\u0275cmp=t.Xpm({type:h,selectors:[["app-tnht-content"]],decls:9,vars:8,consts:[[1,"wrapper-container","tnht-content-container"],[1,"header",3,"prevPage"],[1,"kinh-header"],["mode","indeterminate",4,"ngIf"],[1,"tnht-container-wrapper"],["class","h-100",4,"ngIf"],[3,"prev","next",4,"ngIf"],["mode","indeterminate"],[1,"h-100"],[3,"data","save"],[3,"prev","next"]],template:function(n,o){1&n&&(t.TgZ(0,"div",0)(1,"app-header",1)(2,"div",2)(3,"app-header-title"),t._uU(4),t.qZA()()(),t.YNc(5,E,1,0,"mat-progress-bar",3),t.TgZ(6,"div",4),t.YNc(7,Y,2,1,"div",5),t.qZA(),t.YNc(8,L,1,10,"app-bottom-navigator",6),t.qZA()),2&n&&(t.xp6(1),t.Q6J("prevPage",t.VKq(6,K,t.DdM(5,Q))),t.xp6(3),t.Oqu(null==o.content?null:o.content.name),t.xp6(1),t.Q6J("ngIf",o.isLoading),t.xp6(2),t.Q6J("ngIf",o.content),t.xp6(1),t.Q6J("ngIf","block"==(null==o.content?null:o.content.type)))},dependencies:[f.O5,B.S,H.G,I.d,_.pW,S.T],styles:["app-tnht-content{display:flex;flex-direction:column;height:100%;max-height:100%;overflow:hidden}  app-tnht-content .tnht-content-title{padding:2rem;margin:0}  app-tnht-content .tnht-container-wrapper{flex:1;overflow:hidden}"]})}const U=[{path:"",children:[{path:"",component:m},{path:":key",component:h},{path:":key/:level",component:h}]}];class g{static#t=this.\u0275fac=function(n){return new(n||g)};static#n=this.\u0275mod=t.oAB({type:g});static#e=this.\u0275inj=t.cJS({imports:[d.Bz.forChild(U),d.Bz]})}var D=i(6038),j=i(1113),z=i(4546),G=i(7726);class u{static#t=this.\u0275fac=function(n){return new(n||u)};static#n=this.\u0275mod=t.oAB({type:u});static#e=this.\u0275inj=t.cJS({imports:[f.ez,g,p.To,v.gR,T.yu,D.m,j.x,z.O,_.Cv,G.e]})}}}]);