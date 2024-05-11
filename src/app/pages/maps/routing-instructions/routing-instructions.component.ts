import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { INSTRUCTIONS_VI } from './instruction.vi';

@Component({
  selector: 'app-routing-instructions',
  templateUrl: './routing-instructions.component.html',
  styleUrls: ['./routing-instructions.component.scss']
})
export class RoutingInstructionsComponent implements AfterViewChecked {
  @Input('route') route: any = <any>{};
  @Input('infoDrawer') infoDrawer: any;
  @Output('removeWayRouting') removeWayRouting = new EventEmitter();
  @Output('viewInstruction') viewInstruction = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {

  }

  ngAfterViewChecked(): void {
    this.translate()
  }

  translate() {
    this.route?.instructions?.forEach((item: any) => {
      if (!item.translatedText || !item?.icon) {        
        item.translatedText = item.text?.split(' ')
          ?.filter((text: any) => !!text)
          ?.map((text: any) => {
            return !!INSTRUCTIONS_VI[text?.trim()?.toLowerCase()] ? INSTRUCTIONS_VI[text?.trim()?.toLowerCase()] : text?.trim()
          })
          ?.filter((text: any) => !!text)
          ?.join(' ')?.trim(),
          item.icon = INSTRUCTIONS_VI?.icons[item?.type?.trim()?.toLowerCase()]
        switch (item?.type) {
          case 'Straight':
          case 'Head':
          case 'Continue':
            item.icon = INSTRUCTIONS_VI?.icons['straight']
            break;
          case 'EndOfRoad':
            item.icon = INSTRUCTIONS_VI?.icons[item?.modifier?.trim()?.toLowerCase()]
            break;
          case 'Fork':
            item.icon = INSTRUCTIONS_VI?.icons[`fork_${item?.modifier?.trim()?.toLowerCase()}`]
            break;
          case 'SlightRight':
            item.icon = INSTRUCTIONS_VI?.icons[`turn_slight_right`]
            break;
          case 'SlightLeft':
            item.icon = INSTRUCTIONS_VI?.icons[`turn_slight_left`]
            break;
          case 'SharpRight':
            item.icon = INSTRUCTIONS_VI?.icons[`turn_sharp_right`]
            break;
          case 'SharpLeft':
            item.icon = INSTRUCTIONS_VI?.icons[`turn_sharp_left`]
            break;
          case 'Roundabout':
            item.icon = INSTRUCTIONS_VI?.icons[`roundabout_${item?.modifier?.trim()?.toLowerCase()}`]
            if (!item.icon) {
              switch (item?.modifier) {
                case 'SlightRight':
                  item.icon = INSTRUCTIONS_VI?.icons[`turn_slight_right`]
                  break;
                case 'SlightLeft':
                  item.icon = INSTRUCTIONS_VI?.icons[`turn_slight_left`]
                  break;
                case 'Straight':
                  item.icon = INSTRUCTIONS_VI?.icons[`straight`]
                  break;
                default: break;
              }
            }
            break;
          case 'OffRamp':
            item.icon = INSTRUCTIONS_VI?.icons[`ramp_${item?.modifier?.trim()?.toLowerCase()}`]
            break;
          case 'DestinationReached':
            item.icon = INSTRUCTIONS_VI?.icons[`sports_score`]
            break;
          default:
            item.icon = INSTRUCTIONS_VI?.icons[item?.type?.trim()?.toLowerCase()]
            break;
        }
        this.cd.detectChanges()
      }
    })
  }

  onRemoveWayRouting() {
    this.removeWayRouting.emit()
  }

  onViewInstruction(instruction: any) {
    this.viewInstruction.emit(instruction)
  }

  openWithGoogleMaps() {
    window.open(this.route?.googleMapsUrl, '_blank')
  }
}
