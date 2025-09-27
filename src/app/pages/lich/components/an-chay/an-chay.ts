import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTooltipModule } from '@angular/material/tooltip';
import { KinhService } from 'src/app/shared/services/kinh/kinh.service';
import { SharedModule } from "../../../../shared/shared.module";
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from "src/app/components/icon/icon.component";

@Component({
  selector: 'app-an-chay',
  imports: [
    MatExpansionModule,
    MatTooltipModule,
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    IconComponent
],
  templateUrl: './an-chay.html',
  styleUrl: './an-chay.scss'
})
export class AnChay implements OnInit {

  private http: HttpClient = inject(HttpClient);
  private kinhService = inject(KinhService);
  currentLunarMonth: any;
  anChayVideos: any[] = [];
  randomVideo: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.fetchAnChayData();
  }

  fetchAnChayData() {
    this.kinhService.fetchKinhInformation().subscribe({
      next: (res) => {
        console.log(res);

        if (res?.status === 200) {
          this.anChayVideos = res.data?.filter((item: any) => item?.type?.includes('anChayVideo'));
          this.anChayVideos?.forEach((item: any) => {
            const tiktokMatch = item.content.match(/tiktok\.com\/@([\w.-]+)\/video\/(\d+)/);
            const youtubeMatch = item.content.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu(?:be\.com\/watch\?v=|\.be\/))([\w-]{11})/);

            if (tiktokMatch) {
              item.channelId = tiktokMatch[1];
              item.id = tiktokMatch[2];
              item.isTiktokLink = true;
              item.isYoutubeLink = false;
            } else if (youtubeMatch) {
              item.id = youtubeMatch[1];
              item.isYoutubeLink = true;
              item.isTiktokLink = false;
            } else {
              item.id = null;
              item.channelId = null;
              item.isYoutubeLink = false;
              item.isTiktokLink = false;
            }
          })
          if (this.anChayVideos.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.anChayVideos.length);
            this.randomVideo = this.anChayVideos[randomIndex];
          }
        }

      },
      error: (err) => {
        console.error('Error fetching Kinh Information:', err);
      },
      complete: () => {
      },
    })
  }
}
