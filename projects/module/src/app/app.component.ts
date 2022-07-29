import {Component} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {ConcurrencyRelation, DropFile, FD_CONCURRENCY, FD_LOG, FD_PETRI_NET, Trace, XesLogParserService} from 'ilpn-components';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        // TODO base href
        {provide: APP_BASE_HREF, useValue: '/ilovepetrinets/'}
    ]
})
export class AppComponent {

    public FD_LOG = FD_LOG;
    public FD_CONCURRENCY = FD_CONCURRENCY;
    public FD_PN = FD_PETRI_NET;

    public log: Array<Trace> | undefined = undefined;
    public concurrency: ConcurrencyRelation | undefined = undefined;

    public result: Array<DropFile> | undefined = undefined;

    public fcAddStartStop: FormControl;
    public fcRemovePrefixes: FormControl;


    constructor(private _logParser: XesLogParserService) {
        this.fcAddStartStop = new FormControl(false);
        this.fcRemovePrefixes = new FormControl(false);
    }

    processLogUpload(files: Array<DropFile>) {

    }

    processConcurrencyUpload(files: Array<DropFile>) {

    }
}
