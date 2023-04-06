import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-cpl-calculator',
  templateUrl: './cpl-calculator.component.html',
  styleUrls: ['./cpl-calculator.component.scss']
})
export class CplCalculatorComponent implements OnInit {
  cplForm:FormGroup;
  calculateTable:any=false;
  Budgetvalues:any='';
  valuesInWord :any;
  num:any;
  numInWords:any='';
  result = null;
  valuesWithComma:any='';
  valuesWithCommaSystem:any;
  formattedNumber:any;
  output=false;
  outputValue:any;
  constructor(
    private fb:FormBuilder,
    private serverservice:ServerService,
    private router :Router,
    private decimalPipe:DecimalPipe,
   
  ) { }
  authToken = localStorage.getItem('token');
  cplValue:any;
  ngOnInit() {
    this.authToken = localStorage.getItem('token');
    if(this.authToken != null){
    this.cplForm = this.fb.group({
      years : ['',Validators.required] ,
      budget : ['',Validators.required], 
      matrix_type:['',Validators.required],
      matrix:['',Validators.required],
    })
  }
  else{
    this.router.navigate([''])
  }

  }
  calculate(){
    this.authToken = localStorage.getItem('token');
    if(this.authToken != null){
      this.calculateTable = true;
      this.output = true;
      // this.outputValue = 342
      let body = {
        "price":this.cplForm.value.budget,
        "possession":this.cplForm.value.years,
        "matrix":this.cplForm.value.matrix,
        "matrix_type":this.cplForm.value.matrix_type
      }
      this.serverservice.calculateCPL(body,this.authToken).subscribe((data)=>{
      // this.cplValue = [data];
      this.outputValue = Math.round(data.value);
      // console.log(data)
     
    })
  }
    else{
      this.router.navigate([''])
    }
}
valueInWords(event){
  
  let values = Number(event.target.value)
  this.valuesWithCommaSystem = values.toLocaleString('en-IN');
  var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
  this.valuesWithComma = event.target.value;
  if ((this.valuesWithComma = this.valuesWithComma.toString()).length > 9) return 'overflow';
  this.valuesWithComma = ('000000000' + this.valuesWithComma).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!this.valuesWithComma) return; var str = '';
    str += (this.valuesWithComma[1] != 0) ? (a[Number(this.valuesWithComma[1])] || b[this.valuesWithComma[1][0]] + ' ' + a[this.valuesWithComma[1][1]]) + 'crore ' : '';
    str += (this.valuesWithComma[2] != 0) ? (a[Number(this.valuesWithComma[2])] || b[this.valuesWithComma[2][0]] + ' ' + a[this.valuesWithComma[2][1]]) + 'lakh ' : '';
    str += (this.valuesWithComma[3] != 0) ? (a[Number(this.valuesWithComma[3])] || b[this.valuesWithComma[3][0]] + ' ' + a[this.valuesWithComma[3][1]]) + 'thousand ' : '';
    str += (this.valuesWithComma[4] != 0) ? (a[Number(this.valuesWithComma[4])] || b[this.valuesWithComma[4][0]] + ' ' + a[this.valuesWithComma[4][1]]) + 'hundred ' : '';
    str += (this.valuesWithComma[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(this.valuesWithComma[5])] || b[this.valuesWithComma[5][0]] + ' ' + a[this.valuesWithComma[5][1]]) + 'only ' : '';
    this.numInWords = str;
  }
}
