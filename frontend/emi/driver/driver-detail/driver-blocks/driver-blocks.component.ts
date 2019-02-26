////////// ANGULAR //////////
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

////////// RXJS ///////////
import {
  map,
  mergeMap,
  switchMap,
  toArray,
  filter,
  tap,
  takeUntil,
  startWith,
  debounceTime,
  distinctUntilChanged,
  take
} from 'rxjs/operators';

import { Subject, fromEvent, of, forkJoin, Observable, concat, combineLatest } from 'rxjs';

//////////// ANGULAR MATERIAL ///////////
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from '@angular/material';

//////////// i18n ////////////
import {
  TranslateService
} from '@ngx-translate/core';
import { locale as english } from '../../i18n/en';
import { locale as spanish } from '../../i18n/es';
import { FuseTranslationLoaderService } from '../../../../../core/services/translation-loader.service';

//////////// Others ////////////
import { KeycloakService } from 'keycloak-angular';
import { DriverDetailService } from '../driver-detail.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { ToolbarService } from '../../../../toolbar/toolbar.service';
import { ManualBlockDialogComponent } from './manual-block/manual-block.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'driver-blocks',
  templateUrl: './driver-blocks.component.html',
  styleUrls: ['./driver-blocks.component.scss']
})
// tslint:disable-next-line:class-name
export class DriverBlocksComponent implements OnInit, OnDestroy {
  // Subject to unsubscribe
  private ngUnsubscribe = new Subject();

  @Input('driver') driver: any;

  driverblocksForm: any;

  /////// TABLE /////////

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  tableSize: number;
  tablePage = 0;
  tableCount = 25;

  // Columns to show in the table
  displayedColumns = [
    'key',
    'startTime',
    'endTime',
    'user',
    'actions'
  ];


  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private translate: TranslateService,
    public snackBar: MatSnackBar,
    private DriverDetailservice: DriverDetailService,
    private dialog: MatDialog,
  ) {
      this.translationLoader.loadTranslations(english, spanish);
  }


  ngOnInit() {

    this.driverblocksForm = new FormGroup({
      fuel: new FormControl(this.driver ? (this.driver.blocks || {}).fuel : ''),
      capacity: new FormControl(this.driver ? (this.driver.blocks || {}).capacity : '')
    });

    this.DriverDetailservice.getDriverDriverBlocks$(this.driver._id)
      .pipe(
        map(r => JSON.parse(JSON.stringify(r.data.DriverDriverBlocks))),
        tap(blocks => {
          console.log('getDriverDriverBlocks$', blocks);
          this.dataSource.data = blocks;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => { }, err => console.log(err), () => console.log('COMPLETADO'));




    this.DriverDetailservice.listenDriverBlockAdded$(this.driver._id)
      .pipe(
        map(res => res.data.DriverDriverBlockAddedSubscription),
        tap(r => console.log(' listenDriverBlockAdded SUSBCRIPTION ==> ', r)),
        tap(r => this.dataSource.data = [...this.dataSource.data, r] ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(OK => console.log(OK), err => console.log(err), () => console.log('COMPLETED'));

  }




  showConfirmationDialog$(dialogMessage, dialogTitle) {
    return this.dialog
      // Opens confirm dialog
      .open(DialogComponent, {
        data: {
          dialogMessage,
          dialogTitle
        }
      })
      .afterClosed()
      .pipe(
        filter(okButton => okButton),
      );
  }

  showSnackBar(message) {
    this.snackBar.open(this.translationLoader.getTranslate().instant(message),
      this.translationLoader.getTranslate().instant('DRIVER.CLOSE'), {
        duration: 6000
      });
  }

  graphQlAlarmsErrorHandler$(response) {
    return of(JSON.parse(JSON.stringify(response)))
      .pipe(
        tap((resp: any) => {
          this.showSnackBarError(resp);

          return resp;
        })
      );
  }

  /**
   * Shows an error snackbar
   * @param response
   */
  showSnackBarError(response) {
    if (response.errors) {

      if (Array.isArray(response.errors)) {
        response.errors.forEach(error => {
          if (Array.isArray(error)) {
            error.forEach(errorDetail => {
              this.showMessageSnackbar('ERRORS.' + errorDetail.message.code);
            });
          } else {
            response.errors.forEach( err => {
              this.showMessageSnackbar('ERRORS.' + err.message.code);
            });
          }
        });
      }
    }
  }

  /**
   * Shows a message snackbar on the bottom of the page
   * @param messageKey Key of the message to i18n
   * @param detailMessageKey Key of the detail message to i18n
   */
  showMessageSnackbar(messageKey, detailMessageKey?) {
    const translationData = [];
    if (messageKey) {
      translationData.push(messageKey);
    }

    if (detailMessageKey) {
      translationData.push(detailMessageKey);
    }

    this.translate.get(translationData)
      .subscribe(data => {
        this.snackBar.open(
          messageKey ? data[messageKey] : '',
          detailMessageKey ? data[detailMessageKey] : '',
          {
            duration: 4000
          }
        );
      });
  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  removeBlock(block){
    console.log('REMOVING ...', block);
    this.DriverDetailservice.removeDriverBlock$(this.driver._id, block.key)
    .pipe(
      tap(r => console.log('RESULTADO DE LA MUTACION', r)),
      tap(() => {
        this.dataSource.data = this.dataSource.data.filter((e: any) => e.key !== block.key);
      })
    )
    .subscribe(() => {}, err => console.log(err), () => console.log('TERMINADO'));

  }



  createBlock(){
    return this.dialog
      // Opens confirm dialog
      .open(ManualBlockDialogComponent, {
        width: '70%',
        height: '80%',
        data: {
          forbidddenBlockKeys: this.dataSource.data.map((e: any) => e.key )
        }
      })
      .afterClosed()
      .pipe(
        filter(okButton => okButton),
        tap(response => console.log('DIALOG RESPONSE ===>', response)),
        mergeMap(r => this.DriverDetailservice.InsertDriverBlock$(this.driver._id, r) ),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();


  }

}
