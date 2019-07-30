import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table, TableDescription } from '@ng-holistic/clr-list';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SWAPIService } from './swapi.service';

// Provide table UI definition in js object
const definition: Table.Definition = {
    cols: [
        {
            id: 'name',
            title: 'Name',
            sort: true
        },
        {
            id: 'population',
            title: 'Population',
            sort: false
        }
    ],
    aggregateRow: {
  population: (vals: number[]) => vals.reduce((acc, v) => acc + (v || 0), 0)
}

};

@Component({
    selector: 'my-planets-table',
    template: '<hlc-clr-table [definition]="definition" [dataProvider]="dataProvider"></hlc-clr-table>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
    readonly defintion = definition;
    readonly dataProvider: Table.Data.DataProvider;    

    constructor(swapi: SWAPIService) {
        this.dataProvider = {
            load(state: any) {
                return swapi.planets(state).pipe(
                    tap(console.log),
                    catchError(err => {
                        return throwError('SWAPI return error');
                    })
                );
            }
        };
    }
}
