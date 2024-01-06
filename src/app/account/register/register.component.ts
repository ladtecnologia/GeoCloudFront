import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Account } from 'src/app/models/Account';
import { Profile } from 'src/app/models/Profile';
import { User } from 'src/app/models/User';

import { AccountService } from 'src/app/services/account.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AccountService, ProfileService, UserService]
})

/**
 * Register Component
 */
export class RegisterComponent implements OnInit {

  @ViewChild("customNav")
  customNav: any;

  // Login Form
  signupForm!: UntypedFormGroup;
  submitted = false;
  successmsg = false;
  error = '';
  year: number = new Date().getFullYear();

  public account = {} as Account;
  public profile = {} as Profile;
  public user    = {} as User;

  valid1 = "nav-link disabled";
  valid2 = "nav-link disabled";
  valid3 = "nav-link disabled";
  valid4 = "nav-link disabled";

  constructor(private formBuilder: UntypedFormBuilder, 
              private accountService : AccountService,
              private profileService : ProfileService,
              private userService : UserService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      //Step 1 - User
      firstName : ['xxxx', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      lastName  : ['xxxx', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      phone     : ['xxxx', [Validators.maxLength(40)]],
      email     : ['xxxx@xxxx', [Validators.required, Validators.maxLength(60), Validators.email]],
      password  : ['xxxxxxxx', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
      //Step 2 - Location
      country   : ['1', [Validators.required]],
      state     : ['xxxx', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      city      : ['xxxx', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      //Step 3 - Account
      account   : ['xxxx', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      company   : ['xxxx', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      employyes : ['1-5', [Validators.required]],
    });
  }

  get f(): any { return this.signupForm.controls; }

  public nextStep(id: number): void {
    this.customNav.select(id);
    if (id == 1) { 
      this.valid1 = "nav-link disabled"; 
    }
    if (id == 2) { 
      this.valid1 = "nav-link disabled done"; 
      this.valid2 = "nav-link disabled"; 
    }
    if (id == 3) { 
      this.valid2 = "nav-link disabled done"; 
    }
    if (id == 4) { 
      this.valid3 = "nav-link disabled done"; 
      this.valid4 = "nav-link disabled done";
      this.save();
    }
  }

  public save(): void {
    if (this.signupForm.valid){
      //Account
      this.account.id                   = 0;
      this.account.name                 = this.signupForm.controls['account'].value;
      this.account.company              = this.signupForm.controls['company'].value;
      this.account.acessMaxAttempts     = 5;
      this.account.validityUserPassword = 30;
      this.account.validInviteUser      = 15;
      this.account.validInviteProject   = 15;
      this.accountService.post(this.account).subscribe({
        next: (resAccount: Account) => {
          console.log('Account Id = ' + resAccount.id);
          //Profile
          this.profile.id      = 0;
          this.profile.account = resAccount;
          this.profile.name    = 'Administrator';
          this.profileService.post(this.profile).subscribe({
            next: (resProfile: Profile) => {
              console.log('Profile Id = ' + resProfile.id);


              //User
              this.user.id        = 0;
              //this.user.profile   = resProfile;
              this.user.firstName = this.signupForm.controls['firstName'].value;
              this.user.lastName  = this.signupForm.controls['lastName'].value;
              this.user.email     = this.signupForm.controls['email'].value;
              this.user.company   = 'xxxxx';
              this.userService.post(this.user).subscribe({
                
                next: (resUser: User) => {
                  console.log('User Id = ' + resUser.id);
                },
                error: (error: any) => {
                  this.msg('saveUser error');
                }
              })

            },
            error: (error: any) => {
              this.msg('saveProfile error');
            }
          })
        },
        error: (error: any) => {
          this.msg('saveAccount error');
        }
      })
    }  
  }

  public msg(msg: string){
    let timerInterval: any;
    Swal.fire({
      title: msg,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
  }

          


 }


  


