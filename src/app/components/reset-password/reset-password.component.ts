import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  constructor(private service: ResetPasswordService) { }

  userEmail: string = ''

  generateOtp() {

    this.service.getOtp(this.userEmail).subscribe(res => {

      console.log(res.otp);


    })


  }

}
