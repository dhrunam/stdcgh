import { Component, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReservationService } from '../reservation.service';
import { DatePipe } from '@angular/common';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-acknowledgment',
  templateUrl: './acknowledgment.component.html',
  styleUrls: ['./acknowledgment.component.css']
})
export class AcknowledgmentComponent {
  acknowledge: any = [];
  details = {
    booking_id: '',
    checkin_date: '',
    checkout_date: '',
    contact_no: '',
    guest_name: '',
    booking_date: '',
    address: '',
    property: '',
  }
  room_details:any = [];
  days:any = [];
  totalCost: number = 0;
  rooms: any = [];
  private subscription!: Subscription;
  constructor(private reservationService: ReservationService, private cdr: ChangeDetectorRef, private datePipe: DatePipe){}
  ngOnInit(): void{
  }
  ngAfterViewInit(){
    this.reservationService.acknowledgement.subscribe((d:any) => {
      this.details.booking_id = d.reservation_no;
      this.details.checkin_date = d.checkin_date;
      this.details.checkout_date = d.checkout_date;
      this.details.contact_no = d.contact_no;
      this.details.guest_name = d.guest_name;
      this.details.booking_date = d.created_at;
      this.details.address = d.address;
      this.details.property = d.property;
      this.rooms = d.reservation_room_details;
      this.totalCost = d.totalCost;
      this.days = d.days;
    });
  }
  getRoomDetails(data:any){
    this.room_details = [['Room No', 'Room Category', 'No. of Days', 'Room Rate', 'Total Cost']];
    for(var i=0; i<data.length;i++){
      this.room_details.push([data[i].related_room.room_no,data[i].related_room.related_category.name, this.days[i].days, `₹ ${data[i].room_rate}`,`₹ ${data[i].room_rate * this.days[i].days}`]);
    }
    return this.room_details;
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
  async onPrintAck(){
    let docDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../assets/images/hcs_logo.png" ),
          fit: [150,150],
          alignment: 'center',
        },
        {
          text: this.details.property,
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 3]
        }, 
        {
          text: this.details.address,
          alignment: 'center',
          margin: [0, 0, 0, 3]
        },
        {
          text: 'Acknowledgement Receipt',
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: [ '*', '*'],
            body: [
              [ `Bill No: ${this.details.booking_id}`, `Date: ${this.datePipe.transform(this.details.booking_date, 'dd-MM-YYYY')}`],
              [ `Guest Name: ${this.details.guest_name}`, `Address: ${this.details.address}`],
              [ `Check-In: ${this.datePipe.transform(this.details.checkin_date, 'dd-MM-YYYY')}`, `Check-Out : ${this.datePipe.transform(this.details.checkout_date, 'dd-MM-YYYY')}`],
              [ `Contact: ${this.details.contact_no}`, ''],
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: [ '*', '*', '*', '*','*'],
            body: this.getRoomDetails(this.rooms),
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: `Total: ${this.totalCost}`,
          bold: true,
          alignment: 'right',
          margin: [0, 0, 0, 10]
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
