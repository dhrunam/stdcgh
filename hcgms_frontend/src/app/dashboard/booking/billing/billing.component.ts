import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BillingService } from './billing.service';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent {
  property_id:number = 0;
  showData: boolean = false;
  showDetails: string = '';
  rooms: any = [];
  reservations: any = [];
  showResv: boolean = false;
  room_details:any = [];
  constructor(private billingService: BillingService, private localStorageService: LocalStorageService, private datePipe: DatePipe){
    this.property_id = this.localStorageService.getPropertyId();
  }
  ngOnInit(): void{
    this.billingService.get_rooms(this.property_id).then((d:any) => {
      this.showResv = d[0] ? true : false;
      this.rooms = d;
    })
  }
  onGetReservations(event:any){
    let room_no:string = event.target.value;
    this.billingService.get_reservations(room_no).then((d:any) => {
      this.showData = true;
      this.reservations = d;
    })
  }
  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
    
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
    
        var dataURL = canvas.toDataURL("image/png");
    
        resolve(dataURL);
      };
    
      img.onerror = error => {
        reject(error);
      };
    
      img.src = url;
    });
  }
  daysBetween(startDate: any, endDate: any) {
    const date_1 = new Date(startDate);
    const date_2 = new Date(endDate);
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
  }
  getRoomDetails(data:any){
    let days:number = this.daysBetween(data.checkin_date, data.checkout_date);
    this.room_details = [['Room No.','Category','Rate','Days','Total']];
    data.reservation_room_details.forEach((d:any) => {
      this.room_details.push([d.related_room.room_no,d.related_room.related_category.name,`₹ ${d.room_rate}`,days,`₹ ${d.room_rate*days}`]);
    })
    
    return this.room_details;
  }
  async printBill(data:any){
    let docDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../assets/images/hcs_logo.png" ),
          fit: [150,150],
          alignment: 'center',
        },
        {
          text: data.related_property.name,
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 3]
        }, 
        {
          text: data.related_property.address,
          alignment: 'center',
          margin: [0, 0, 0, 3]
        },
        {
          text: 'Invoice Tax',
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: [ '*', '*'],
            body: [
              [ `Bill No: ${data.reservation_no}`, `Date: ${this.datePipe.transform(data.checkout_date, 'dd-MM-YYYY')}`],
              [ `Guest Name: ${data.lead_guest_name}`, `Address: ${data.address}`],
              [ `Contact: ${data.contact_no}`, `No. of Persons: 2`],
              [ `Check-In: ${this.datePipe.transform(data.checkin_date, 'dd-MM-YYYY')}`, `Check-Out : ${this.datePipe.transform(data.checkout_date, 'dd-MM-YYYY')}`],
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*', '*','*'],
            body: this.getRoomDetails(data),
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: `Total: ₹ ${data.total_room_cost}`,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 50]
        },
        {
          text: 'Name & Signature',
        },
        {
          text: 'Booking Officer',
        },
      ],
      styles: {
        font_size: {
          fontSize: 9,
        }
      }
    }
    pdfMake.createPdf(docDefinition).open();
  }
}
