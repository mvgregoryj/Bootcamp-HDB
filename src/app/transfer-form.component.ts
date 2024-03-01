import { Component, EventEmitter, Output, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TransferFormModel {
  memo: string | null;
  receiver: string | null;
  amount: number | null;
  token: {
    address: string;
    balance: number;
    info: { name: string; symbol: string; image: string };
  } | null;
}

export interface TransferFormPayload {
  memo: string;
  receiver: string;
  amount: number;
  mintAddress: string;
}

@Component({
  selector: 'bootcamp-hdb-transfer-form',
  template: `
    <form class="w-[400px]" #form="ngForm" (ngSubmit)="onSubmit(form)">
      <mat-form-field class="w-full mb-4">
        <mat-label>Moneda</mat-label>
        <mat-select
          [(ngModel)]="model.token"
          name="token"
          required
          [disabled]="disabled()"
          #tokenControl="ngModel"
        >
          @for (token of tokens(); track token) {
            <mat-option [value]="token">
              <div class="flex items-center gap-2">
                <img [src]="token.info.image" class="rounded-full w-8 h-8" />
                <span>{{ token.info.symbol }}</span>
              </div>
            </mat-option>
          }
        </mat-select>

        @if (form.submitted && tokenControl.errors) {
          <mat-error>
            @if (tokenControl.errors['required']) {
              La moneda es obligatoria.
            }
          </mat-error>
        } @else {
          <mat-hint>La moneda que deseas transferir.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Concepto</mat-label>
        <input
          name="memo"
          matInput
          placeholder="Ejemplo: Pagar el recibo de luz."
          type="text"
          [(ngModel)]="model.memo"
          #memoControl="ngModel"
          required
          [disabled]="disabled()"
        />
        <mat-icon matSuffix>description</mat-icon>

        @if (form.submitted && memoControl.errors) {
          <mat-error>
            @if (memoControl.errors['required']) {
              El motivo es obligatorio.
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser el motivo de la transferencia.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Destino</mat-label>
        <input
          name="receiver"
          matInput
          placeholder="Public Key de la cuenta destino."
          type="text"
          [(ngModel)]="model.receiver"
          #receiverControl="ngModel"
          required
          [disabled]="disabled()"
        />
        <mat-icon matSuffix>key</mat-icon>

        @if (form.submitted && receiverControl.errors) {
          <mat-error>
            @if (receiverControl.errors['required']) {
              El destino es obligatorio.
            }
          </mat-error>
        } @else {
          <mat-hint>Debe ser el motivo de la transferencia.</mat-hint>
        }
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-full mb-4">
        <mat-label>Monto</mat-label>
        <input
          name="amount"
          matInput
          placeholder="Ingresa el monto acá"
          type="number"
          min="0"
          [(ngModel)]="model.amount"
          #amountControl="ngModel"
          required
          [disabled]="disabled()"
          [max]="tokenControl.value?.balance ?? undefined"
        />
        <mat-icon matSuffix>attach_money</mat-icon>

        @if (form.submitted && amountControl.errors) {
          <mat-error>
            @if (amountControl.errors['required']) {
              El monto es obligatorio.
            } @else if (amountControl.errors['min']) {
              El monto debe ser mayor a cero.
            } @else if (amountControl.errors['max']) {
              El monto debe ser menor a {{ tokenControl.value.balance }}.
            }
          </mat-error>
        } @else {
          <mat-hint>Ingresa el monto a enviar.</mat-hint>
        }
      </mat-form-field>

      <footer class="flex justify-center gap-4">
        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="disabled()"
        >
          Enviar
        </button>
        <button
          type="button"
          mat-raised-button
          color="warn"
          (click)="onCancel()"
          [disabled]="disabled()"
        >
          Cancelar
        </button>
      </footer>
    </form>
  `,
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatInput,
    MatIcon,
  ],
})
export class TransferFormComponent {
  private readonly _matSnackBar = inject(MatSnackBar);

  readonly tokens = input<
    {
      address: string;
      balance: number;
      info: { name: string; symbol: string; image: string };
    }[]
  >([]);
  readonly disabled = input<boolean>(false);

  @Output() readonly sendTransfer = new EventEmitter<TransferFormPayload>();
  @Output() readonly cancelTransfer = new EventEmitter();

  readonly model: TransferFormModel = {
    memo: null,
    receiver: null,
    amount: null,
    token: null,
  };

  onSubmit(form: NgForm) {
    if (
      form.invalid ||
      this.model.memo === null ||
      this.model.receiver === null ||
      this.model.amount === null ||
      this.model.token === null
    ) {
      this._matSnackBar.open('⚠️ El formulario es inválido.', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'end',
      });
    } else {
      this.sendTransfer.emit({
        amount: this.model.amount * 10 ** 9,
        receiver: this.model.receiver,
        memo: this.model.memo,
        mintAddress: this.model.token.address,
      });
    }
  }

  onCancel() {
    this.cancelTransfer.emit();
  }
}