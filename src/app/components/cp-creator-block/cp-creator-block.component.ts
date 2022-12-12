import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output} from '@angular/core';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
  MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition
} from "@angular/material/legacy-snack-bar";
import { Router } from '@angular/router';
import {AuthService} from "../../shared/services/auth/auth.service";

@Component({
  selector: 'cp-creator-block',
  templateUrl: './cp-creator-block.component.html',
  styleUrls: ['./cp-creator-block.component.scss']
})
export class CpCreatorBlockComponent implements OnChanges {
  @Input() data: any;
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @Output() focusedBlock = new EventEmitter()

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.authService.contentEditable && !!this.eRef.nativeElement.contains(event.target)) {
      this.data.focused = true;
      this.focusedBlock.emit(this.data)
    } else {
      this.data.focused = false;
    }
  }

  constructor(
    private _snackBar: MatSnackBar,
    private eRef: ElementRef,
    public authService: AuthService,
    private router: Router
    ) {
  }

  ngOnChanges() {
  }

  getId(block: any) {
    return block.key.replaceAll('-', '')
  }

  getLink(data: any, redirect: boolean = false) {
    if (redirect) {
      if (data?.attrs?.hash?.includes('#')) {
        this.router.navigate([data?.attrs?.pathname], {fragment: data?.attrs?.hash.replace('#', '')})
      } else {
        this.router.navigate([`${data?.attrs?.pathname}${data?.attrs?.hash || ''}`])
      }
    } else {
      navigator.clipboard.writeText(`${location.origin}${data?.attrs?.pathname}${data?.attrs?.hash}`)
      this._snackBar.open('Đã sao chép liên kết đến đoạn kinh này', 'Đóng', {
        duration: this.durationInSeconds * 200,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  changeValue(event: any) {
    this.data.name = event.target.innerText
    event.target.innerText = event.target.innerHTML
  }
}
