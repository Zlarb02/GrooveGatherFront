import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  name = '';
  email = '';
  picture = '';
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleCredentialResponse(response: any) {

    // Parse the JSON response
    const data = JSON.parse(response.credential);
    console.table(data)
    // Extract the user information
    // this.name = data.name;
    // this.email = data.email;
    // this.picture = data.picture;
  }

}

/*   can get user info from token

var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzYWJlNDEzYjIyNjhhZTk3NjQ1OGM4MmMxNTE3OTU0N2U5NzUyN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2NzQwMTE2NjEwNzItbXZzMWhhZHQwamdwcGtmdjc2YjV0a2Vyb29ocXRiaWouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2NzQwMTE2NjEwNzItbXZzMWhhZHQwamdwcGtmdjc2YjV0a2Vyb29ocXRiaWouYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDg5MjE0OTMzODgxNTE0MjQ3NTAiLCJlbWFpbCI6InBvZ29kYS5ldGllbm5lQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MTg3MDY4MzYsIm5hbWUiOiJFdGllbm5lIFBvZ29kYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMOHl1ckJ2TVJZV05oTXVnSTlKZ0YwTzdoNUFGME1mLWE3dUotdUxlR2p4NW5hQ1dBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkV0aWVubmUiLCJmYW1pbHlfbmFtZSI6IlBvZ29kYSIsImlhdCI6MTcxODcwNzEzNiwiZXhwIjoxNzE4NzEwNzM2LCJqdGkiOiJkN2M4MDZhNTU3N2U0Mzc2OWQyMWU4MTU4YzFiYjhhZGM0ZmNkMGYwIn0.gJyv9JGJpxzUhompihiZPv4SPpt-xVIrYYPwIm9nPWccU2mGvAT3QwYUd4ST6tv9wBWRPFZnwKGF8iBXg9wwFrx13n6AHWtMBsDLdldKRWRoVH1UJXzsmW60VuKy23TbYll8czMqh6eNEaBbuTLoYsQ9nnDOwUYOvy8AoHZJA9dRSXw5EIf2zbh7lwbve2yVmG4Trj8CvGxW3qGaffcVtuVFiz5rhoWQ2zFi2y0UoBketNmGoGsERKrWHwxqTm3S-0hK4NwZJKdu-gSWfNKZhcM1daLggXU6x0Z2T8-2hm_vPYaty8G_weadvfPNpynBZbvdPcA3sVtDp-nK43Vnuw';
var base64Url = token.split('.')[1];
var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  console.log(JSON.parse(jsonPayload));
  
  */