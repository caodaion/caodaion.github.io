"use strict";(self.webpackChunkpwa=self.webpackChunkpwa||[]).push([[702],{6702:(O,b,s)=>{s.r(b),s.d(b,{NotificationsModule:()=>m});var f=s(6895),v=s(9299),e=s(4650),C=s(2213),x=s(2729),w=s(9549),y=s(4144),n=s(7084),h=s(6338),o=s(4006),S=s(2687),l=s(3238),k=s(1281);const A=["switch"],Z=["*"],D=new e.OlP("mat-slide-toggle-default-options",{providedIn:"root",factory:()=>({disableToggleValue:!1})}),N={provide:o.JU,useExisting:(0,e.Gpc)(()=>M),multi:!0};class T{constructor(d,t){this.source=d,this.checked=t}}let I=0;const q=(0,l.sb)((0,l.pj)((0,l.Kr)((0,l.Id)(class{constructor(i){this._elementRef=i}}))));let B=(()=>{class i extends q{get required(){return this._required}set required(t){this._required=(0,k.Ig)(t)}get checked(){return this._checked}set checked(t){this._checked=(0,k.Ig)(t),this._changeDetectorRef.markForCheck()}get inputId(){return`${this.id||this._uniqueId}-input`}constructor(t,c,a,u,p,_,Q){super(t),this._focusMonitor=c,this._changeDetectorRef=a,this.defaults=p,this._onChange=G=>{},this._onTouched=()=>{},this._required=!1,this._checked=!1,this.name=null,this.labelPosition="after",this.ariaLabel=null,this.ariaLabelledby=null,this.change=new e.vpe,this.toggleChange=new e.vpe,this.tabIndex=parseInt(u)||0,this.color=this.defaultColor=p.color||"accent",this._noopAnimations="NoopAnimations"===_,this.id=this._uniqueId=`${Q}${++I}`}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(t=>{"keyboard"===t||"program"===t?(this._focused=!0,this._changeDetectorRef.markForCheck()):t||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(t){this.checked=!!t}registerOnChange(t){this._onChange=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}}return i.\u0275fac=function(t){e.$Z()},i.\u0275dir=e.lG2({type:i,inputs:{name:"name",id:"id",labelPosition:"labelPosition",ariaLabel:["aria-label","ariaLabel"],ariaLabelledby:["aria-labelledby","ariaLabelledby"],ariaDescribedby:["aria-describedby","ariaDescribedby"],required:"required",checked:"checked"},outputs:{change:"change",toggleChange:"toggleChange"},features:[e.qOj]}),i})(),M=(()=>{class i extends B{get buttonId(){return`${this.id||this._uniqueId}-button`}constructor(t,c,a,u,p,_){super(t,c,a,u,p,_,"mat-mdc-slide-toggle-"),this._labelId=this._uniqueId+"-label"}_handleClick(){this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new T(this,this.checked)))}focus(){this._switchElement.nativeElement.focus()}_createChangeEvent(t){return new T(this,t)}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}}return i.\u0275fac=function(t){return new(t||i)(e.Y36(e.SBq),e.Y36(S.tE),e.Y36(e.sBO),e.$8M("tabindex"),e.Y36(D),e.Y36(e.QbO,8))},i.\u0275cmp=e.Xpm({type:i,selectors:[["mat-slide-toggle"]],viewQuery:function(t,c){if(1&t&&e.Gf(A,5),2&t){let a;e.iGM(a=e.CRH())&&(c._switchElement=a.first)}},hostAttrs:[1,"mat-mdc-slide-toggle"],hostVars:11,hostBindings:function(t,c){2&t&&(e.Ikx("id",c.id),e.uIk("tabindex",null)("aria-label",null)("name",null)("aria-labelledby",null),e.ekj("mat-mdc-slide-toggle-focused",c._focused)("mat-mdc-slide-toggle-checked",c.checked)("_mat-animation-noopable",c._noopAnimations))},inputs:{disabled:"disabled",disableRipple:"disableRipple",color:"color",tabIndex:"tabIndex"},exportAs:["matSlideToggle"],features:[e._Bn([N]),e.qOj],ngContentSelectors:Z,decls:17,vars:24,consts:[[1,"mdc-form-field"],["role","switch","type","button",1,"mdc-switch",3,"tabIndex","disabled","click"],["switch",""],[1,"mdc-switch__track"],[1,"mdc-switch__handle-track"],[1,"mdc-switch__handle"],[1,"mdc-switch__shadow"],[1,"mdc-elevation-overlay"],[1,"mdc-switch__ripple"],["mat-ripple","",1,"mat-mdc-slide-toggle-ripple","mat-mdc-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mdc-switch__icons"],["viewBox","0 0 24 24",1,"mdc-switch__icon","mdc-switch__icon--on"],["d","M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"],["viewBox","0 0 24 24",1,"mdc-switch__icon","mdc-switch__icon--off"],["d","M20 13H4v-2h16v2z"],[3,"for","click"]],template:function(t,c){if(1&t&&(e.F$t(),e.TgZ(0,"div",0)(1,"button",1,2),e.NdJ("click",function(){return c._handleClick()}),e._UZ(3,"div",3),e.TgZ(4,"div",4)(5,"div",5)(6,"div",6),e._UZ(7,"div",7),e.qZA(),e.TgZ(8,"div",8),e._UZ(9,"div",9),e.qZA(),e.TgZ(10,"div",10),e.O4$(),e.TgZ(11,"svg",11),e._UZ(12,"path",12),e.qZA(),e.TgZ(13,"svg",13),e._UZ(14,"path",14),e.qZA()()()()(),e.kcU(),e.TgZ(15,"label",15),e.NdJ("click",function(u){return u.stopPropagation()}),e.Hsn(16),e.qZA()()),2&t){const a=e.MAs(2);e.ekj("mdc-form-field--align-end","before"==c.labelPosition),e.xp6(1),e.ekj("mdc-switch--selected",c.checked)("mdc-switch--unselected",!c.checked)("mdc-switch--checked",c.checked)("mdc-switch--disabled",c.disabled),e.Q6J("tabIndex",c.tabIndex)("disabled",c.disabled),e.uIk("id",c.buttonId)("name",c.name)("aria-label",c.ariaLabel)("aria-labelledby",c._getAriaLabelledBy())("aria-describedby",c.ariaDescribedby)("aria-required",c.required||null)("aria-checked",c.checked),e.xp6(8),e.Q6J("matRippleTrigger",a)("matRippleDisabled",c.disableRipple||c.disabled)("matRippleCentered",!0),e.xp6(6),e.Q6J("for",c.buttonId),e.uIk("id",c._labelId)}},dependencies:[l.wG],styles:['.mdc-form-field{display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field[hidden]{display:none}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{margin-left:auto;margin-right:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}[dir=rtl] .mdc-form-field--space-between>label,.mdc-form-field--space-between>label[dir=rtl]{margin:0}.mdc-elevation-overlay{position:absolute;border-radius:inherit;pointer-events:none;opacity:var(--mdc-elevation-overlay-opacity, 0);transition:opacity 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:var(--mdc-elevation-overlay-color, #fff)}.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative}.mdc-switch[hidden]{display:none}.mdc-switch:disabled{cursor:default;pointer-events:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%}@media screen and (forced-colors: active){.mdc-switch__track::before,.mdc-switch__track::after{border-color:currentColor}}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(-100%)}[dir=rtl] .mdc-switch__track::after,.mdc-switch__track[dir=rtl]::after{transform:translateX(100%)}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track[dir=rtl]::before{transform:translateX(-100%)}.mdc-switch--selected .mdc-switch__track::after{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0)}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0)}[dir=rtl] .mdc-switch__handle-track,.mdc-switch__handle-track[dir=rtl]{left:auto;right:0}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track,.mdc-switch--selected .mdc-switch__handle-track[dir=rtl]{transform:translateX(-100%)}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto}[dir=rtl] .mdc-switch__handle,.mdc-switch__handle[dir=rtl]{left:auto;right:0}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1),border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}@media screen and (forced-colors: active){.mdc-switch__handle::before,.mdc-switch__handle::after{border-color:currentColor}}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-elevation-overlay{bottom:0;left:0;right:0;top:0}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1}.mdc-switch:disabled .mdc-switch__ripple{display:none}.mdc-switch__icons{height:100%;position:relative;width:100%;z-index:1}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle{display:inline-block;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.mat-mdc-slide-toggle .mdc-switch{width:var(--mdc-switch-track-width, 36px)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-selected-handle-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-hover-handle-color, #310077)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-selected-focus-handle-color, #310077)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-selected-pressed-handle-color, #310077)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-selected-handle-color, #424242)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:var(--mdc-switch-unselected-handle-color, #616161)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-hover-handle-color, #212121)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mdc-switch-unselected-focus-handle-color, #212121)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:var(--mdc-switch-unselected-pressed-handle-color, #212121)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:disabled .mdc-switch__handle::after{background:var(--mdc-switch-disabled-unselected-handle-color, #424242)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__handle::before{background:var(--mdc-switch-handle-surface-color, var(--mdc-theme-surface, #fff))}.mat-mdc-slide-toggle .mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-handle-elevation, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slide-toggle .mdc-switch:disabled .mdc-switch__shadow{box-shadow:var(--mdc-switch-disabled-handle-elevation, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12))}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__focus-ring-wrapper,.mat-mdc-slide-toggle .mdc-switch .mdc-switch__handle{height:var(--mdc-switch-handle-height, 20px)}.mat-mdc-slide-toggle .mdc-switch:disabled .mdc-switch__handle::after{opacity:var(--mdc-switch-disabled-handle-opacity, 0.38)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__handle{border-radius:var(--mdc-switch-handle-shape, 10px)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__handle{width:var(--mdc-switch-handle-width, 20px)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__handle-track{width:calc(100% - var(--mdc-switch-handle-width, 20px))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled .mdc-switch__icon{fill:var(--mdc-switch-selected-icon-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-selected-icon-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled .mdc-switch__icon{fill:var(--mdc-switch-unselected-icon-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icon{fill:var(--mdc-switch-disabled-unselected-icon-color, var(--mdc-theme-on-primary, #fff))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-selected-icon-opacity, 0.38)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:disabled .mdc-switch__icons{opacity:var(--mdc-switch-disabled-unselected-icon-opacity, 0.38)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected .mdc-switch__icon{width:var(--mdc-switch-selected-icon-size, 18px);height:var(--mdc-switch-selected-icon-size, 18px)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected .mdc-switch__icon{width:var(--mdc-switch-unselected-icon-size, 18px);height:var(--mdc-switch-unselected-icon-size, 18px)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-hover-state-layer-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-focus-state-layer-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-selected-pressed-state-layer-color, var(--mdc-theme-primary, #6200ee))}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-hover-state-layer-color, #424242)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-focus-state-layer-color, #424242)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background-color:var(--mdc-switch-unselected-pressed-state-layer-color, #424242)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-selected-hover-state-layer-opacity, 0.04)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-selected-focus-state-layer-opacity, 0.12)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-selected-pressed-state-layer-opacity, 0.1)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--selected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-selected-pressed-state-layer-opacity, 0.1)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus):hover .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:hover:not(:focus).mdc-ripple-surface--hover .mdc-switch__ripple::before{opacity:var(--mdc-switch-unselected-hover-state-layer-opacity, 0.04)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:focus.mdc-ripple-upgraded--background-focused .mdc-switch__ripple::before,.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:focus:not(.mdc-ripple-upgraded):focus .mdc-switch__ripple::before{transition-duration:75ms;opacity:var(--mdc-switch-unselected-focus-state-layer-opacity, 0.12)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded) .mdc-switch__ripple::after{transition:opacity 150ms linear}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active:not(.mdc-ripple-upgraded):active .mdc-switch__ripple::after{transition-duration:75ms;opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity, 0.1)}.mat-mdc-slide-toggle .mdc-switch.mdc-switch--unselected:enabled:active.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-switch-unselected-pressed-state-layer-opacity, 0.1)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__ripple{height:var(--mdc-switch-state-layer-size, 48px);width:var(--mdc-switch-state-layer-size, 48px)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__track{height:var(--mdc-switch-track-height, 14px)}.mat-mdc-slide-toggle .mdc-switch:disabled .mdc-switch__track{opacity:var(--mdc-switch-disabled-track-opacity, 0.12)}.mat-mdc-slide-toggle .mdc-switch:enabled .mdc-switch__track::after{background:var(--mdc-switch-selected-track-color, #d7bbff)}.mat-mdc-slide-toggle .mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-hover-track-color, #d7bbff)}.mat-mdc-slide-toggle .mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:var(--mdc-switch-selected-focus-track-color, #d7bbff)}.mat-mdc-slide-toggle .mdc-switch:enabled:active .mdc-switch__track::after{background:var(--mdc-switch-selected-pressed-track-color, #d7bbff)}.mat-mdc-slide-toggle .mdc-switch:disabled .mdc-switch__track::after{background:var(--mdc-switch-disabled-selected-track-color, #424242)}.mat-mdc-slide-toggle .mdc-switch:enabled .mdc-switch__track::before{background:var(--mdc-switch-unselected-track-color, #e0e0e0)}.mat-mdc-slide-toggle .mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-hover-track-color, #e0e0e0)}.mat-mdc-slide-toggle .mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:var(--mdc-switch-unselected-focus-track-color, #e0e0e0)}.mat-mdc-slide-toggle .mdc-switch:enabled:active .mdc-switch__track::before{background:var(--mdc-switch-unselected-pressed-track-color, #e0e0e0)}.mat-mdc-slide-toggle .mdc-switch:disabled .mdc-switch__track::before{background:var(--mdc-switch-disabled-unselected-track-color, #424242)}.mat-mdc-slide-toggle .mdc-switch .mdc-switch__track{border-radius:var(--mdc-switch-track-shape, 7px)}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,.mat-mdc-slide-toggle .mdc-switch__ripple::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty){transform:translateZ(0)}.mat-mdc-slide-toggle .mdc-switch__ripple::after{content:"";opacity:0}.mat-mdc-slide-toggle .mdc-switch:hover .mdc-switch__ripple::after{opacity:.04;transition:opacity 75ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mdc-switch .mdc-switch__ripple::after{opacity:.12}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-mdc-focus-indicator::before{content:""}.mat-mdc-slide-toggle .mat-ripple-element{opacity:.12}.mat-mdc-slide-toggle .mat-mdc-focus-indicator::before{border-radius:50%}.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-elevation-overlay,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after{transition:none}'],encapsulation:2,changeDetection:0}),i})(),E=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({}),i})(),z=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=e.oAB({type:i}),i.\u0275inj=e.cJS({imports:[E,l.BQ,l.si,f.ez,E,l.BQ]}),i})();function L(i,d){if(1&i&&(e.TgZ(0,"mat-list-option",14)(1,"span",15),e._uU(2),e.qZA(),e.TgZ(3,"span",16),e._uU(4),e.qZA()()),2&i){const t=d.$implicit;e.Q6J("value",null==t?null:t.key),e.xp6(2),e.Oqu(null==t?null:t.name),e.xp6(2),e.AsE("",null==t?null:t.startTime," - ",null==t?null:t.endTime,"")}}class g{constructor(d,t){this.notificationsService=d,this.eventService=t,this.tuThoiEvents=[]}ngOnInit(){this.tuThoiEvents=this.eventService.eventList.find(d=>"cung-tu-thoi"===d.key)?.event?.filter(d=>"cung-tu-thoi"!==d.key),this.tuThoiEvents?.forEach(d=>{d.startTime=`${d.time[0].split("-")[1]?.slice(0,2)}:00`,d.endTime=`${d.time[0].split("-")[1]?.slice(2,4)}:00`}),this.pushNotificationsSettings=this.notificationsService.pushNotificationsSettings}changeSetting(){this.notificationsService.updatePushSettings(this.pushNotificationsSettings)}}g.\u0275fac=function(d){return new(d||g)(e.Y36(C.T),e.Y36(x.P))},g.\u0275cmp=e.Xpm({type:g,selectors:[["app-notifications"]],decls:41,vars:13,consts:[[1,"container-fluid"],["multi",""],[3,"expanded"],[3,"appearance"],["type","number","matInput","",3,"ngModel","ngModelChange","change"],[3,"ngModel","ngModelChange","selectionChange"],[3,"value",4,"ngFor","ngForOf"],[1,"d-flex","flex-wrap"],[1,"form-group",2,"margin","22px 0"],[3,"ngModel","ngModelChange"],[1,"form-group"],["type","time","matInput","",3,"ngModel","disabled","ngModelChange","change"],["timeInput",""],["type","number","matInput","",3,"ngModel","disabled","ngModelChange","change"],[3,"value"],["matListItemTitle",""],["matListItemLine",""]],template:function(d,t){1&d&&(e.TgZ(0,"div",0)(1,"h1"),e._uU(2,"C\xe0i \u0111\u1eb7t th\xf4ng b\xe1o"),e.qZA(),e.TgZ(3,"p"),e._uU(4,"H\xe3y \u0111\u1ea3m b\u1ea3o r\u1eb1ng b\u1ea1n lu\xf4n m\u1edf \u1ee9ng d\u1ee5ng \u0111\u1ec3 t\xednh n\u0103ng th\xf4ng b\xe1o ho\u1ea1t \u0111\u1ed9ng \u0111\u01b0\u1ee3c t\u1ed1t nh\u1ea5t"),e.qZA(),e.TgZ(5,"mat-accordion",1)(6,"mat-expansion-panel",2)(7,"mat-expansion-panel-header")(8,"mat-panel-title"),e._uU(9,"C\xfang t\u1ee9 th\u1eddi"),e.qZA(),e.TgZ(10,"mat-panel-description"),e._uU(11,"C\xe0i \u0111\u1eb7t th\xf4ng b\xe1o c\xfang t\u1ee9 th\u1eddi"),e.qZA()(),e.TgZ(12,"div")(13,"mat-form-field",3)(14,"mat-label"),e._uU(15,"B\xe1o tr\u01b0\u1edbc (ph\xfat)"),e.qZA(),e.TgZ(16,"input",4),e.NdJ("ngModelChange",function(a){return t.pushNotificationsSettings.tuThoi.duration=a})("change",function(){return t.changeSetting()}),e.qZA()(),e.TgZ(17,"mat-selection-list",5),e.NdJ("ngModelChange",function(a){return t.pushNotificationsSettings.tuThoi.pushed=a})("selectionChange",function(){return t.changeSetting()}),e.YNc(18,L,5,4,"mat-list-option",6),e.qZA()()(),e.TgZ(19,"mat-expansion-panel",2)(20,"mat-expansion-panel-header")(21,"mat-panel-title"),e._uU(22,"T\u1ef1 h\u1ecdc \u0111\u1ea1o"),e.qZA(),e.TgZ(23,"mat-panel-description"),e._uU(24,"Th\xf4ng b\xe1o th\u1eddi gian thu\u1eadn l\u1ee3i \u0111\u1ec3 h\u1ecdc h\u1ecfi th\xeam ki\u1ebfn th\u1ee9c m\u1edbi"),e.qZA()(),e.TgZ(25,"div")(26,"div",7)(27,"div",8)(28,"mat-slide-toggle",9),e.NdJ("ngModelChange",function(a){return t.pushNotificationsSettings.study.active=a})("ngModelChange",function(){return t.changeSetting()}),e._uU(29,"K\xedch ho\u1ea1t"),e.qZA()(),e.TgZ(30,"div",10)(31,"mat-form-field",3)(32,"mat-label"),e._uU(33,"Gi\u1edd b\xe1o"),e.qZA(),e.TgZ(34,"input",11,12),e.NdJ("ngModelChange",function(a){return t.pushNotificationsSettings.study.time=a})("change",function(){return t.changeSetting()}),e.qZA()()(),e.TgZ(36,"div",10)(37,"mat-form-field",3)(38,"mat-label"),e._uU(39,"B\xe1o tr\u01b0\u1edbc (ph\xfat)"),e.qZA(),e.TgZ(40,"input",13),e.NdJ("ngModelChange",function(a){return t.pushNotificationsSettings.study.duration=a})("change",function(){return t.changeSetting()}),e.qZA()()()()()()()()),2&d&&(e.xp6(6),e.Q6J("expanded",!0),e.xp6(7),e.Q6J("appearance","outline"),e.xp6(3),e.Q6J("ngModel",t.pushNotificationsSettings.tuThoi.duration),e.xp6(1),e.Q6J("ngModel",t.pushNotificationsSettings.tuThoi.pushed),e.xp6(1),e.Q6J("ngForOf",t.tuThoiEvents),e.xp6(1),e.Q6J("expanded",!0),e.xp6(9),e.Q6J("ngModel",t.pushNotificationsSettings.study.active),e.xp6(3),e.Q6J("appearance","outline"),e.xp6(3),e.Q6J("ngModel",t.pushNotificationsSettings.study.time)("disabled",!t.pushNotificationsSettings.study.active),e.xp6(3),e.Q6J("appearance","outline"),e.xp6(3),e.Q6J("ngModel",t.pushNotificationsSettings.study.duration)("disabled",!t.pushNotificationsSettings.study.active))},dependencies:[f.sg,w.KE,w.hX,y.Nt,n.pp,n.ib,n.yz,n.yK,n.u4,h.Ub,h.vS,h.WW,h.sL,o.Fj,o.wV,o.JJ,o.On,M],styles:[".form-group{padding:0 1rem}@media only screen and (max-width: 600px){  .form-group{width:100%}}"]});const J=[{path:"",children:[{path:"",component:g}]}];class r{}r.\u0275fac=function(d){return new(d||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[v.Bz.forChild(J),v.Bz]});var U=s(7392);class m{}m.\u0275fac=function(d){return new(d||m)},m.\u0275mod=e.oAB({type:m}),m.\u0275inj=e.cJS({imports:[f.ez,r,w.lN,y.c,n.To,h.ie,o.u5,U.Ps,z]})}}]);