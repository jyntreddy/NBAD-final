import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-token-expiry',
  templateUrl: './token-expiry.component.html',
  styleUrl: './token-expiry.component.css'
})
export class TokenExpiryComponent {

  constructor(public dialogRef: MatDialogRef<TokenExpiryComponent>) {}

  onRefresh(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}

