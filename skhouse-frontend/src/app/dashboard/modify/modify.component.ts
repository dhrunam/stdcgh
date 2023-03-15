import { Component } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent {
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
  async generatePDF(){
    let docDefinition: any = {
      content: [
        {
          image: await this.getBase64ImageFromURL("../../../assets/images/stdc1.png" ),
          fit: [150,150],
          alignment: 'center',
        },
        {
          text: 'Sikkim House',
          alignment: 'center',
          bold: true,
          margin: [0, 20, 0, 3]
        }, 
        {
          text: '( A unit of Sikkim Tourism Development Corporation )',
          alignment: 'center',
          bold: true,
          margin: [0, 0, 0, 3]
        },
        {
          text: '( Government of Sikkim Undertaking )',
          alignment: 'center',
          bold: true,
          margin: [0, 0, 0, 10]
        },
        {
          text: '4/1 Middleton Street,Kolkata-700071',
          alignment: 'center',
          margin: [0, 0, 0, 3]
        },
        {
          text: 'Ph. No.: 033-22902278',
          alignment: 'center',
          margin: [0, 0, 0, 3]
        },
        {
          text: 'GSTIN : 19AAMCS4608P1ZK',
          alignment: 'center',
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
              [ 'Bill No : 2648/MDL', 'Date : 18-Jan-2023'],
              [ 'Name : Karthoong Biyali', 'Period of stay : 07-Jan-2023 to 07-Jan-2023'],
              [ 'Contact No. : 9800871278', 'No. of Nights : 1'],
              [ 'Checkin Time : 1:00PM', 'Checkout Time : 12:00 Noon'],
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: [ '*', 70, 70, 70, 70, 70],
            body: [
              [ 'Room No.', 'Rate Per Day', 'Net Amount', 'CGST', 'SGST', 'Total'],
              ['STND AC-502', '1700', '1700', '102', '102', '1904']
            ]
          },
          margin: [0, 0, 0, 20]
        },
        {
          text: 'Note: ',
          bold: true,
          margin: [0,0,0,5],
          style: 'font_size',
        },
        {
          text: '1. Visitor must produce valid ID card at the time of Check-In',
          style: 'font_size',
        },
        {
          text: '2. Check-In Time 1PM, Check-Out Time : 12 Noon',
          style: 'font_size',
        },
        {
          text: '3. Copy of booking slip has to be submitted at the time of Check-In',
          margin: [0,0,0,13],
          style: 'font_size',
        },
        { 
          text: '*** Cancellation Rules ****',
          style: 'font_size',
          alignment: 'center',
          margin: [0,0,0,7],
        },
        {
          text: '1. 95% of the total amount deposited shall be deducted in case booking is cancelled the same day.',
          style: 'font_size',
        },
        {
          text: '2. 75% of the total amount deposited shall be deducted in case booking is cancelled one day in advance.',
          style: 'font_size',
        },
        {
          text: '3. 50% of the total amount deposited shall be deducted in case booking is cancelled two days in advance.',
          style: 'font_size',
        },
        {
          text: '4. 25% of the total amount deposited shall be deducted in case booking is cancelled three days in advance. (The tariff does not include meals)',
          style: 'font_size',
          margin: [0,0,0,10]
        },
        {
          text: '(The tariff does not include meals)',
          alignment: 'center',
          style: 'font_size',
          margin: [0,0,0,80],
        },
        {
          text: 'Name & Signature',
        },
        {
          text: 'Booking Officer',
        },
        {
          text: 'STDC,03592-203960',
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

