import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private data: any={};

  setData(key: string, data: any) {
    this.data[key] = data;
    // console.log("setting data...")
  }

  getData(key: string): any {
    // console.log("getting data");
    return this.data[key];
  }
}