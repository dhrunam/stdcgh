import { Component ,OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import { OtherServicesService } from '../other-services.service';
import { FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  property: string= '';
  todayDate: string = '';
  date = new Date();
  showData:boolean = false;
  reservation_data: any=[];
  
  other_services:any = [];
  reservation: number=0;
  reservation_no: string='';
  total_cost: number=0;

  entryForm = this.formBuilder.group({
    id: new FormControl(),
    reservation: new FormControl(),
    particular: new FormControl(),
    cost: new FormControl(),
    remarks: new FormControl(),
    start_date: new FormControl(),
    end_date: new FormControl(),

  });

  isSuccessful: boolean = false;
  isFail: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  isCompleted = true;
  account_head_list: any = [];
  //name : any = [];
  isShowTable: boolean = true;
  submitted: boolean = false

  constructor(private formBuilder:FormBuilder, private localStorageService: LocalStorageService, private otherServices: OtherServicesService){
    this.property = localStorageService.getPropertyId();
  }

  ngOnInit():void{
    this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-${this.date.getDate()< 10 ? '0':''}${this.date.getDate()}`;
   // this.todayDate = `${this.date.getFullYear()}-${this.date.getMonth()< 10 ? '0':''}${this.date.getMonth()+1}-05`;
    this.otherServices.get_other_services_reservations().then((d:any) => {
    this.showData = d[0] ? true : false;
    this.reservation_data=d;
    this.other_services=d.related_services;
   });
   this.initialize_entry_form();
 }

 onGetOtherServices(reservation: number, reservation_no: string,related_services:any )
 {
    this.reservation=reservation;
    this.reservation_no=reservation_no
    this.otherServices.get_miscellaneous_service_of_reservation({'reservation':reservation}).then((d:any) => {
        this.other_services=d
        this.set_total_cost(d);
       });
    this.initialize_entry_form();
 }

 onSubmit(){
  console.log('this form is submitted..');
  const id = this.entryForm.get('id')?.value?.id ?? 0;
 
  console.log('id:' + id)
  this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }
    console.log('Form is submitted..')
    if (this.entryForm?.value?.id <= 0) {
      this.insert();
    }
    else {
      this.update();
    }
 }

 insert() {

  console.log(this.entryForm.value.particular);
  this.otherServices.on_miscellaneous_service_save(this.entryForm.value).then((d:any) => {
    this.other_services=d
    this.set_total_cost(d);
   });
  this.entryForm.reset();
}
update() {
  // this.service.put(this.entryForm.value).subscribe({
  //   next: data => {

  //     //this.route.navigateByUrl('/config/fy');
  //     this.switchSuccessFailureStatus(true)
  //     this.entryForm.reset();
  //     this.showTable();

  //   },
  //   error: err => {
  //     this.errorMessage = err.error.message;
  //     this.switchSuccessFailureStatus(false)

  //   }
  // });
  // console.warn('Your order has been submitted', this.entryForm.value.name);
  // this.entryForm.reset();
}

initialize_entry_form()
{
  this.entryForm = this.formBuilder.group({
    id: 0,
    reservation: this.reservation,
    particular: ['', [Validators.required, Validators.maxLength(512)]],
    cost:0,
    remarks:'',
    start_date:'',
    end_date: ''


  });
}

set_total_cost(data: any){
  this.total_cost=0;
  console.log(data);
  data.forEach((element:any )=> {
    this.total_cost +=  parseFloat(element.cost);
  });
  
}



}
