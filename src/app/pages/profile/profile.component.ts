import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from "../../shared/services/auth/auth.service";
import { CommonService } from "../../shared/services/common/common.service";
import * as CryptoJS from "crypto-js";
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TinyUrlService } from 'src/app/shared/services/tiny-url/tiny-url.service';
import * as QRCode from 'qrcode'
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewChecked {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 3;
  currentUser = <any>{};
  qrData: any;
  qrUrl: any;
  caodaiTitle = CAODAI_TITLE.data
  roles = <any>[]
  colors = <any>[
    {
      key: 'thai',
      name: 'Thái',
      color: '#fbbc05'
    },
    {
      key: 'thuong',
      name: 'Thượng',
      color: '#4285f4'
    },
    {
      key: 'ngoc',
      name: 'Ngọc',
      color: '#ea4335'
    }
  ]
  userNameRequired: boolean = false
  isHolyNameRequired: boolean = false
  isInvalidSyncData: boolean = false
  confirmPassword: any = ''
  provinces = <any>[];
  districts = <any>[];
  wards = <any>[];

  @ViewChild('passwordDialog') passwordDialog!: any;
  @ViewChild('syncDialog') syncDialog!: any;
  @ViewChild('syncRegistrationDialog') syncRegistrationDialog!: any;

  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private matDiaLog: MatDialog,
    private route: ActivatedRoute,
    private tinyUrlService: TinyUrlService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    const token = localStorage.getItem('token')
    if (token) {
      this.getAllDivisions()
      this.getCurrentUser()
      this.getRoles()
      this.updateUserProfile()
    } else {
      this.route.params.subscribe((param: any) => {
        if (param?.username) {
          this.route.queryParams.subscribe((query: any) => {
            if (query['t']) {
              localStorage.setItem('token', query['t'])
              location.href = location.href.split('?')[0]
            }
          })
        }
      })
    }
  }

  ngAfterViewChecked(): void {
    this.isInvalidSyncData = this.authService.isInvalidSyncData;
    this.cd.detectChanges();
  }

  getRoles() {
    this.roles = []
    this.roles = this.caodaiTitle
      ?.find((item: any) => item.key === 'chuc-viec')?.subTitle
  }

  getCurrentUser() {
    const getSharedDataPromise = new Promise<void>((resolve, rejects) => {
      this.userSetting = <any>{};
      this.authService.getCurrentUser().subscribe((res: any) => {
        this.currentUser = res;
        this.userSetting.googleFormsId = this.currentUser?.googleFormsId;
        this.userSetting.sheetId = this.currentUser?.sheetId;
        this.userSetting.data = this.currentUser?.setting?.data;
        if (this.currentUser?.googleFormsId && this.currentUser?.setting?.data) {
          this.currentUser.isCloudSynced = true;
        }
        let qrData = `${location.href}?t=${this.generaToken(this.currentUser)}`
        if (typeof this.currentUser?.role === 'string') {
          this.currentUser.role = JSON.parse(this.currentUser?.role)
        }
        if (this.currentUser?.role?.length === 1) {
          if (this.currentUser?.role[0] === 'kids') {
            qrData = `${location.origin}@${this.currentUser?.userName}`
          }
        }
        if (qrData?.length >= 350) {
          try {
            this.tinyUrlService.shortenUrl(qrData)
              .subscribe((res: any) => {
                if (res.code === 0) {
                  this.qrData = res?.data?.tiny_url
                  resolve()
                }
              })
          } catch (e) {
            console.log(e)
            rejects()
          }
        } else {
          this.qrData = qrData
          resolve()
        }
        this.qrData = qrData
      })
    })
    getSharedDataPromise.then(() => {
      QRCode.toDataURL(this.qrData)
        .then(url => {
          this.qrUrl = url;
        })
        .catch(err => {
          console.error(err);
        });
    })
  }

  saveAsImage(parent: any) {
    let parentElement = null
    parentElement = parent.qrcElement.nativeElement
      .querySelector("canvas")
      .toDataURL("image/png")
    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = this.commonService.generatedSlug(`caodaion-qr-${this.currentUser.userName}`)
      link.click()
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }

  syncRegistrationGoogleFormPath: String = '';
  generaToken(data: any) {
    const base64url = (source: any) => {
      let encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }
    const header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encodedData = base64url(stringifiedData);
    const signature = CryptoJS.HmacSHA512("caodaiondata", "caodaionkey").toString();
    const encodedSignature = btoa(signature);
    const token = `${encodedHeader}.${encodedData}.${encodedSignature}`;
    return token
  }

  updateUserProfile() {
    this.isHolyNameRequired = this.caodaiTitle.find((item: any) => item.key === this.currentUser.title)?.isHolyNameRequired || false
    let selectedTitle: any = this.caodaiTitle.find((item: any) => item.key === this.currentUser.title);
    if (selectedTitle?.subTitle) {
      this.roles = selectedTitle?.subTitle
    }
    if (this.currentUser.name) {
      if (this.isHolyNameRequired) {
        if (this.currentUser.sex === 'male') {
          if (this.currentUser.color) {
            this.currentUser.holyName = `${this.colors.find((item: any) => item.key === this.currentUser.color)?.name} ${this.currentUser.name?.split(' ')[this.currentUser.name?.split(' ').length - 1]} Thanh`
          }
        }
        if (this.currentUser.sex === 'female') {
          this.currentUser.holyName = `Hương ${this.currentUser.name?.split(' ')[this.currentUser.name?.split(' ').length - 1]}`
        }
      }
    }
    if (!this.currentUser?.isCloudSynced) {
      if (this.currentUser?.phone?.replaceAll(' ', '').trim()?.length === 10) {
        this.syncRegistrationGoogleFormPath = `https://docs.google.com/forms/d/e/${this.userSetting?.googleFormsId}/viewform`
        this.syncRegistrationGoogleFormPath += `?${this.userSetting?.userName}=${encodeURIComponent(this.currentUser.userName)}`;
        this.syncRegistrationGoogleFormPath += `&${this.userSetting?.data}=${encodeURIComponent(this.generaToken({
          phone: this.currentUser.phone,
          name: this.currentUser.name,
          password: this.currentUser.password,
        }))}`
      }
    }
    if (!this.currentUser.isGuest && new Date(parseInt(this.currentUser.userName)).toString() === 'Invalid Date') {
      let localStorageUsers = <any>{}
      localStorageUsers = JSON.parse(localStorage.getItem('users') || '{}')
      const userToken = this.generaToken(this.currentUser)
      localStorageUsers[this.currentUser.userName] = userToken
      localStorage.setItem('users', JSON.stringify(localStorageUsers))
      localStorage.setItem('token', userToken)
      this.getCurrentUser()
      this._snackBar.open('Đã cập nhật thông tin', 'Đóng', {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      })
    }
    if (this.currentUser.isGuest) {
      const name = this.currentUser?.name?.trim()?.split(' ')
      let userName = ''
      if (name?.length > 1) {
        userName = this.commonService.generatedSlug(name[name.length - 1])
        name.forEach((item: any, index: any) => {
          if (index < name.length - 1) {
            userName += `${this.commonService.generatedSlug(item)[0]}`
          }
        })
        if (this.currentUser?.birthday?.getFullYear()) {
          userName += this.currentUser?.birthday?.getFullYear()?.toString()?.split('')?.splice(2, 2)?.join('')
        }
        this.currentUser.userName = userName
      }
    }
  }

  activeAccount() {
    if (this.currentUser.userName) {
      if (new Date(parseInt(this.currentUser.userName)).toString() === 'Invalid Date') {
        if (this.currentUser.password) {
          delete this.currentUser.isGuest;
          this.updateUserProfile()
          this._snackBar.open(`Bạn đã làm rất tốt ${this.currentUser.name}`, 'Đóng', {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          })
          location.reload()
          location.href = ''
        } else {
          this.currentUser.password = ''
          const passworddialog = this.matDiaLog.open(this.passwordDialog, {
            disableClose: true
          })
        }
      } else {
        this.userNameRequired = true
      }
    }
  }
  userSetting: any;
  admin: boolean = false;
  users: any;
  selectedUser: any;
  syncData = <any>[];

  onStartSyncDatawithRemote() {
    const openModal = () => {
      if (this.currentUser?.isCloudSynced) {
        const syncdialog = this.matDiaLog.open(this.syncDialog, {
          disableClose: true
        })
      } else {
        const syncRegistrationDialog = this.matDiaLog.open(this.syncRegistrationDialog, {
          disableClose: true
        })
      }
    }
    if (!this.userSetting?.googleFormsId) {
      this.authService.fetchUsers().subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.userSetting = res.setting;
            this.updateUserProfile();
            openModal();
            this.admin = res?.setting?.admin?.includes(this.currentUser.userName);
            if (this.admin) {
              this.users = res.users?.map((item: any) => {
                const jwtHelper = new JwtHelperService()
                const decodedToken = jwtHelper.decodeToken(item?.data)
                item.password = decodedToken?.password
                item.phone = decodedToken?.phone
                item.userName = item?.userName
                item.name = decodedToken?.name
                item.sheetId = decodedToken?.sheetId || ''
                item.googleFormsId = decodedToken?.googleFormsId || ''
                return item;
              })
            }
          }
        },
        error(err) {
          console.log(err);
        },
        complete() {
          console.info('completed');
        },
      })
    } else {
      this.authService.compareData().subscribe({
        next: (res: any) => {
          if (res?.data?.length > 0) {
            this.syncData = res.data;
            openModal();
          }
        },
        error(err) {
          console.log(err);
        },
        complete() {
          console.info('completed');
        },
      })
    }
  }

  selectedToken: any;
  onChangeSelectedUser() {
    this.selectedToken = this.generaToken({
      password: this.selectedUser?.password,
      phone: this.selectedUser?.phone,
      name: this.selectedUser?.name,
      sheetId: this.selectedUser?.sheetId || '',
      googleFormsId: this.selectedUser?.googleFormsId || '',
    });
  }

  copyToken() {
    navigator.clipboard.writeText(this.selectedToken);
    this._snackBar.open('Đã sao chép Token', 'Đóng', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  syncGoogleFormPath: any;
  startSync() {
    const syncToken = this.syncData?.map((item: any) => { return { key: item?.key, data: item?.data } });
    this.syncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.userSetting?.googleFormsId}/viewform`
    this.syncGoogleFormPath += `?${this.userSetting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }

  getAllDivisions() {
    if (this.commonService.provinces?.length === 0) {
      this.commonService.fetchProvinceData()
        .subscribe((res: any) => {
          if (res?.status == 200) {
            this.provinces = res.provinces
            this.districts = res.districts
            this.wards = res.wards
          }
        })
    } else {
      this.provinces = this.commonService.provinces
      this.districts = this.commonService.districts
      this.wards = this.commonService.wards
    }
  }

  onPress(event: any) {
    if (event?.keyCode == 32) {
      event['target']['value'] = event['target']['value'] + ' '
    }
  }
}

