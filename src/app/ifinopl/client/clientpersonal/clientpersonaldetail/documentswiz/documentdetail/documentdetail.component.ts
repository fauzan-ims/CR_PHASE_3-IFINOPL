import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';


// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './documentdetail.component.html'
})

export class DocumentdetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');

  private RoleAccessCode = 'R00022550000010A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // variable
  public isType: Boolean = false;
  public tampType: String;

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    // this.callGetRole('');
    $('#tabplafonddoc .nav-link').addClass('active');
    if (this.type === 'PERSONAL') {
      $('#tabplafondnotarial').remove();
      $('#shareholder').remove();
    }
    this.documentwiz();
  }

  //#region List tabs
  documentwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/documentdetail/' + this.param + '/' + this.type + '/doclist/', this.param], { skipLocationChange: true });
  }

  notarialwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/documentdetail/' + this.param + '/' + this.type + '/notariallist/', this.param], { skipLocationChange: true });
  }
  //#endregion List tabs
}