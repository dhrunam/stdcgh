import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { MiscellaneousService } from '../miscellaneous.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  @ViewChild('parForm') parForm!: NgForm;
  showParticulars: boolean = false;
  particulars: any = [];
  id:string = '';
  todayDate:any;
  constructor(private route: ActivatedRoute, private miscellaneousService: MiscellaneousService, private datePipe: DatePipe){
    this.todayDate = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  }
  ngOnInit():void{
    this.route.params.subscribe((data:Params) => {
      this.id = data['id'];
      this.getParticulars(data['id']);
    })
  }
  onSubmit(){
    if(!this.parForm.valid){
      this.parForm.control.markAllAsTouched();
    }
    else{
      let fd = new FormData();
      fd.append('reservation', this.id);
      fd.append('particular', this.parForm.value.particular);
      fd.append('cost', this.parForm.value.amount);
      fd.append('remarks', this.parForm.value.remarks);
      fd.append('start_date', this.parForm.value.from_date);
      fd.append('end_date', this.parForm.value.to_date);
      this.miscellaneousService.on_miscellaneous_service_save(fd).subscribe({
        next: data => this.getParticulars(this.id),
      })
      this.parForm.reset();
    }
  }
  getParticulars(id:any){
    this.miscellaneousService.get_miscellaneous_service_of_reservation(id).subscribe({
      next: (data:any) => {
        this.showParticulars = data[0] ? true : false;
        this.particulars = data;
      }
    })
  }
}
