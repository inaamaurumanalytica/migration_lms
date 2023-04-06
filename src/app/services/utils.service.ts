import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() { }

    formatToInr(value) {
        value = parseInt(value, 10);
        if (value >= 1000 && value < 100000) {
          return value / 1000 + ' K';
        } else if (value >= 100000 && value < 10000000) {
          return value / 100000 + ' L';
        } else if (value >= 10000000) {
          return value / 10000000 + ' Cr';
        }
    }

}