import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { TaxService } from '../tax.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  private subscription!: Subscription;
  showLoader: boolean = false;
  status: string = '';
  editMode: boolean = false;
  id:number = 0;
  upper_limit:string = '';
  lower_limit:string = '';
  start_date: string = '';
  end_date: string = '';
  other_taxes: string = '';
  c_gst:string = '';
  s_gst:string = '';
  constructor(private taxService: TaxService, private router: Router, private route: ActivatedRoute){}
  ngOnInit():void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.editMode = data['id'] != null;
      if(this.editMode){
        this.showLoader = true;
        this.taxService.getTax(data['id']).subscribe({
          next: data => {
            this.showLoader = false;
            this.upper_limit = data.upper_limit;
            this.lower_limit = data.lower_limit;
            this.start_date = data.start_date;
            this.end_date = data.end_date;
            this.other_taxes = data.service_tax_percentage;
            this.c_gst = data.cgst_percentage;
            this.s_gst = data.sgst_percentage;
          }
        })
      }
    })
  }
  onSubmit(data: NgForm){
    this.status = '';
    let observable: Observable<any>;
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      let fd = new FormData();
        fd.append('lower_limit', data.value.lower);
        fd.append('upper_limit', data.value.upper);
        fd.append('cgst_percentage', data.value.cgst);
        fd.append('sgst_percentage', data.value.sgst);
        fd.append('service_tax_percentage', data.value.otaxes);
        fd.append('start_date', data.value.start);
        fd.append('end_date', data.value.end);
        if(this.editMode){
          fd.append('id', this.id.toString());
          observable = this.taxService.updateTax(fd)
        }
        else{
          fd.append('is_applicable', 'true');
          observable = this.taxService.addTax(fd)
        }
        this.subscription = observable.subscribe({
          next: data => {
            this.showLoader = false;
            this.status = 'success';
          },
          error: err => {
            this.showLoader = false;
            this.status = err;
          }
        })
    }
  }
  onGoBack(){
    this.editMode ? this.router.navigate(['../../'], {relativeTo: this.route}) : this.router.navigate(['../'], {relativeTo: this.route});
  }
  ngOnDestroy(): void{
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
