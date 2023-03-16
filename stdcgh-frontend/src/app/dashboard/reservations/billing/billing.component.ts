import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BillingService } from './billing.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
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
  fb_details: any = [];
  constructor(private billingService: BillingService, private localStorageService: LocalStorageService, private datePipe: DatePipe){
    this.property_id = this.localStorageService.getPropertyId();
  }
  ngOnInit(): void{
    this.billingService.get_rooms(this.property_id).subscribe({
      next: data => {
        this.rooms = data;
      }
    })
  }
  onGetReservations(event:any){
    let room_no:string = event.target.value;
    this.billingService.get_reservations(room_no).subscribe({
      next: data => {
        this.showData = true;
        this.showResv = data[0] ? true : false;
        this.reservations = data;
      }
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
  serviceCostCalculator(data:any){
    let totalServiceCost: number = 0;
    if(data[0]){
      this.fb_details = [['Particular','Amount']]
      data.forEach((d: any) => {
        this.fb_details.push([d.particular, `₹ ${d.cost}`]);
        totalServiceCost += parseInt(d.cost);
      })
    }
    else{
      this.fb_details = [['N/A']];
    }
    return totalServiceCost;
  }
  async printBill(data:any){
    let service_cost = this.serviceCostCalculator(data.related_services);
    let docDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../assets/images/stdc1.png" ),
          fit: [150,150],
          alignment: 'center',
        },
        {
          text: 'Sikkim Tourism Development Corporation',
          alignment: 'center',
          bold: true,
          margin: [0, 15, 0, 0]
        },
        {
          text: 'GANGTOK',
          alignment: 'center',
          bold: true,
          margin: [0, 0, 0, 10]
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
              [ `Contact: ${data.contact_no}`, `Guest House: ${data.related_property.name}`],
              [ `Check-In: ${this.datePipe.transform(data.checkin_date, 'dd-MM-YYYY')}`, `Check-Out : ${this.datePipe.transform(data.checkout_date, 'dd-MM-YYYY')}`],
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Room(s)',
          bold: true,
          margin: [0, 0, 0, 0]
        },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }], margin: [0, 0, 0, 10]},
        {
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*', '*','*'],
            body: this.getRoomDetails(data),
          },
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Miscellaneous',
          bold: true,
          margin: [0, 0, 0, 0]
        },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 1 }], margin: [0, 0, 0, 10]},
        {
          table: {
            headerRows: 1,
            widths: data.related_services[0] ? ['*','*'] : ['*'],
            body: this.fb_details,
          },
          layout: data.related_services[0] ? '' : 'noBorders',
          margin: [0, 0, 0, 20],
        },
        {
          text: `Total: ₹ ${parseInt(data.total_room_cost) + service_cost}`,
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
