import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

// Register Auth
import { AuthenticationService } from '../../core/services/auth.service';
import { UserProfileService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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

  valid1 = "nav-link disabled";
  valid2 = "nav-link disabled";
  valid3 = "nav-link disabled";
  valid4 = "nav-link disabled";

  constructor(private formBuilder: UntypedFormBuilder, 
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserProfileService) { }

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

  nextStep(id: number): void {
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
    }
  }


  

}
