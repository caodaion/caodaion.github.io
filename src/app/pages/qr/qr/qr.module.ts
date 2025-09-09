import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrComponent } from './qr.component';
import { QRRoutingModule } from './qr-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { ActionModule } from "../../home/action/action.module";
import { WelcomeModule } from "../../home/welcome/welcome.module";
import { BaiThuongYeuModule } from '../../home/bai-thuong-yeu/bai-thuong-yeu.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
    declarations: [
        QrComponent
    ],
    imports: [
        CommonModule,
        QRRoutingModule,
        MatButtonModule,
        ActionModule,
        WelcomeModule,
        BaiThuongYeuModule,
        MatProgressBarModule
    ]
})
export class QrModule { }
