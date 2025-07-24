import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// const this.httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };

@Injectable()
export class DALService extends BaseService {

  constructor(private _http: HttpClient, public getRouteparam: ActivatedRoute) {
    super();
  }

  //#region getJsonCnv
  public getJSON(): Observable<any> {
    return this._http.get("./assets/js/" + "configEnv" + ".json");
  }
  //#endregion getJsonCnv 

  protected urlAddr = this.AllModUrl('urlAddressOpl');
  protected urlAddrSys = this.AllModUrl('urlAddressSys');
  // protected urlAddrCore = this.AllModUrl('urlAddressCore');
  // protected urlAddrPdc = this.AllModUrl('urlAddressPdc');
  // protected urlAddrColl = this.AllModUrl('urlAddressColl');
  // protected urlAddrIns = this.AllModUrl('urlAddressIns');
  protected urlAddrBase = this.AllModUrl('urlAddressBase');
  protected urlAddrApv = this.AllModUrl('urlAddressApv');
  // protected urlAddrSvy = this.AllModUrl('urlAddressSvy');
  protected urlAddrScr = this.AllModUrl('urlAddressScr');
  protected urlAddrLgl = this.AllModUrl('urlAddressLgl');
  protected urlAddrDoc = this.AllModUrl('urlAddressDoc');
  protected urlAddrAms = this.AllModUrl('urlAddressAms');
  protected urlAddrProc = this.AllModUrl('urlAddressProc');
  protected urlAddrBam = this.AllModUrl('urlAddressBam');
  protected urlAddrFin = this.AllModUrl('urlAddressFin');
  protected urlReport = this.AllModUrl('urlReportOpl');

  protected _urlAddress = this.urlAddr;
  protected _urlAddressSys = this.urlAddrSys;
  // protected _urlAddressPdc = this.urlAddrPdc;
  // protected _urlAddressCore = this.urlAddrCore;
  // protected _urlAddressColl = this.urlAddrColl;
  // protected _urlAddressIns = this.urlAddrIns;
  protected _urlAddressBase = this.urlAddrBase;
  protected _urlAddressApv = this.urlAddrApv;
  // protected _urlAddressSvy = this.urlAddrSvy;
  protected _urlAddressScr = this.urlAddrScr;
  protected _urlAddressLgl = this.urlAddrLgl;
  protected _urlAddressDoc = this.urlAddrDoc;
  protected _urlAddressAms = this.urlAddrAms;
  protected _urlAddressProc = this.urlAddrProc;
  protected _urlAddressBam = this.urlAddrBam;
  protected _urlAddressFin = this.urlAddrFin;
  protected _urlReport = this.urlReport;


  //#region RefreshToken 
  RefreshToken(jsonContent: any): Observable<any> {
    return this._http.post<any[]>(this.AllModUrl('urlRefreshToken'), jsonContent, this.httpOptionsRefreshToken).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }
  //#endregion RefreshToken

  Getrows(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  Refresh(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  Getrow(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowSys(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressSys + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  Insert(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  Update(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }
  UpdateAms(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddressAms + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  Delete(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpAll(data: any, urlAddress: String): Observable<any> {
    let splitUrlAddress = [];
    splitUrlAddress = urlAddress.split("/api/");
    const url = `${urlAddress}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(splitUrlAddress[splitUrlAddress.length - 1]))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpApv(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressApv + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpProc(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressProc + controller + '/' + route}`;
    this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }


  UpdateApv(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddressApv + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpScr(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressScr + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSp(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  UploadFile(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`inserted success code=${data[0].p_code}`)),
      catchError(this.handleError)
    );
  }

  PriviewFile(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`priview image=${data[0].p_file_name}`)),
      catchError(this.handleError)
    );
  }

  DeleteFile(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`deleted image=${data[0].p_code}`)),
      catchError(this.handleError)
    );
  }

  DownloadFile(controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptionsDownload.headers = this.httpOptionsDownload.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.get(url, this.httpOptionsDownload).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsSys(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressSys + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpSys(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressSys + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpFin(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressFin + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsApv(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressApv + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowApv(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressApv + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpBase(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressBase + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsBase(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressBase + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsLgl(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressLgl + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsAms(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressAms + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  DownloadFileWithData(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptionsDownload.headers = this.httpOptionsDownload.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptionsDownload).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  //mailmerge
  DownloadFileWithParam(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptionsDownload.headers = this.httpOptionsDownload.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptionsDownload).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }
  //end mail merge

  //report non core
  ReportFile(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlReport + controller + '/' + route}`;
    // this.httpOptionsReport.headers = this.httpOptionsReport.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptionsReport).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );

  }

  DownloadTemplate(controller: String, route: String): Observable<any> {
    const url = `${this._urlAddress + controller + '/' + route}`;
    // this.httpOptionsDownload.headers = this.httpOptionsDownload.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.get(url, this.httpOptionsDownload).pipe(
      tap(data => data),
      catchError(this.handleError)
    );
  }

  GetrowsBam(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressBam + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  ExecSpBam(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressBam + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  GetrowsProc(data: any, controller: String, route: String): Observable<any> {
    const url = `${this._urlAddressProc + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, data, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }

  UpdateProc(data: any, controller: String, route: String): Observable<any> {
    const result = JSON.stringify(data);
    const url = `${this._urlAddressProc + controller + '/' + route}`;
    // this.httpOptions.headers = this.httpOptions.headers.set('imskey', this.encryptAPIKey(controller + '/' + route))
    return this._http.post<any[]>(url, result, this.httpOptions).pipe(
      tap(_ => console.log(`Success!`)),
      catchError(this.handleError)
    );
  }
}
