import {Component} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {
    ConcurrencyParserService, ConcurrencyRelation, DropFile, FD_CONCURRENCY, FD_LOG, FD_PETRI_NET,
    IncrementingCounter,
    LogToPartialOrderTransformerService, PetriNetSerialisationService, Trace, XesLogParserService
} from 'ilpn-components';
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

    public fcCleanLog: FormControl;
    public fcAddStartStop: FormControl;
    public fcRemovePrefixes: FormControl;


    constructor(
        private _logParser: XesLogParserService,
        private _concurrencyParser: ConcurrencyParserService,
        private _logToPartialOrderConverter: LogToPartialOrderTransformerService,
        private _pnSerialiser: PetriNetSerialisationService
    ) {
        this.fcCleanLog = new FormControl(true);
        this.fcAddStartStop = new FormControl(false);
        this.fcRemovePrefixes = new FormControl(false);
    }

    processLogUpload(files: Array<DropFile>) {
        this.log = this._logParser.parse(files[0].content);
        this.convertLog();
    }

    processConcurrencyUpload(files: Array<DropFile>) {
        this.concurrency = this._concurrencyParser.parse(files[0].content);
        console.debug(this.concurrency);
        this.convertLog();
    }

    private convertLog() {
        if (!this.log || !this.concurrency) {
            return;
        }

        const counter = new IncrementingCounter();

        this.result = this._logToPartialOrderConverter.transformToPartialOrders(this.log, this.concurrency, {
            cleanLog: this.fcCleanLog.value,
            addStartStopEvent: this.fcAddStartStop.value,
            discardPrefixes: this.fcRemovePrefixes.value
        })
            .sort((a, b) => b.frequency! - a.frequency!)
            .map(pn => {
                return new DropFile(`po${counter.next()}.pn`, this._pnSerialiser.serialise(pn));
            });
    }
}
