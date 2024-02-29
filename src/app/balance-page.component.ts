import { Component } from '@angular/core';
import { BalanceSectionComponent } from './balance-section.component';
import { TransactionsSectionComponent } from './transactions-section.component';

@Component({
  selector: 'bootcamp-hdb-balance-page',
  template: `
    <div class="flex justify-center gap-4">
      <bootcamp-hdb-balance-section></bootcamp-hdb-balance-section>

      <bootcamp-hdb-transactions-section></bootcamp-hdb-transactions-section>
    </div>
  `,
  standalone: true,
  imports: [BalanceSectionComponent, TransactionsSectionComponent],
})
export class BalancePageComponent {}