import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutPage } from './about.page';


import { SkyhookDndModule, DRAG_DROP_BACKEND } from '@angular-skyhook/core';

import { BasicSortableComponent } from '../basic-sortable/basic-sortable.component';
import { ContainerComponent } from '../container/container.component';
import { CardComponent, CardInnerDirective } from '../card/card.component';

import { SkyhookMultiBackendModule } from '@angular-skyhook/multi-backend';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyhookDndService } from "@angular-skyhook/core";

import { customMultiBackend } from '../customMultiBackend';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SkyhookMultiBackendModule,
    SkyhookDndModule.forRoot({ backendFactory: customMultiBackend }),
    RouterModule.forChild([{ path: '', component: AboutPage }])
  ],
  declarations: [AboutPage,
    ContainerComponent,
    CardComponent,
    CardInnerDirective,
    BasicSortableComponent
  ],
  providers: [SkyhookDndService]
})
export class AboutPageModule { }
