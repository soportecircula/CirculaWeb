import { ChangeDetectionStrategy, ChangeDetectorRef, Component, AfterViewInit, computed, inject, input, output, signal } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { ContactService } from '../../../client/services/contact.service';
import { AvailableSlot } from '../../../client/models';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements AfterViewInit {
  private contactService = inject(ContactService);
  private cdr            = inject(ChangeDetectorRef);

  readonly requirementType = input.required<string>();
  readonly slotConfirmed   = output<AvailableSlot>();
  readonly closed          = output<void>();

  readonly selectedDate   = signal<string | null>(null);
  readonly availableSlots = signal<AvailableSlot[]>([]);
  readonly loadingSlots   = signal(false);
  readonly selectedSlot   = signal<AvailableSlot | null>(null);
  readonly currentMonth   = signal(new Date());

  readonly calendarDays = computed(() => {
    const ref         = this.currentMonth();
    const year        = ref.getFullYear();
    const month       = ref.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date(); today.setHours(0, 0, 0, 0);
    const offset      = firstDay === 0 ? 6 : firstDay - 1;
    const cells: { date: Date | null; enabled: boolean }[] = [];

    for (let i = 0; i < offset; i++) cells.push({ date: null, enabled: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d);
      cells.push({ date: dt, enabled: dt >= today && dt.getDay() !== 0 });
    }
    return cells;
  });

  ngAfterViewInit(): void {
    this.cdr.markForCheck();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDay = new Date(today);
    if (firstDay.getDay() === 0) firstDay.setDate(firstDay.getDate() + 1);
    this.onDateSelect(this.toDateStr(firstDay));
  }

  prevMonth(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() - 1);
    const min = new Date(); min.setDate(1); min.setHours(0, 0, 0, 0);
    if (d >= min) {
      this.currentMonth.set(d);
      this.selectedDate.set(null);
      this.availableSlots.set([]);
      this.selectedSlot.set(null);
      this.cdr.markForCheck();
    }
  }

  nextMonth(): void {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() + 1);
    const max = new Date(); max.setMonth(max.getMonth() + 2);
    if (d <= max) {
      this.currentMonth.set(d);
      this.selectedDate.set(null);
      this.availableSlots.set([]);
      this.selectedSlot.set(null);
      this.cdr.markForCheck();
    }
  }

  toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onDateSelect(dateStr: string): void {
    this.selectedDate.set(dateStr);
    this.selectedSlot.set(null);
    this.loadingSlots.set(true);
    this.cdr.markForCheck();
    this.contactService.contactGetSlots(dateStr, this.requirementType()).subscribe({
      next: (res) => {
        this.availableSlots.set(res.slots ?? []);
        this.loadingSlots.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  onSlotSelect(slot: AvailableSlot): void {
    this.selectedSlot.set(slot);
  }

  confirm(): void {
    const slot = this.selectedSlot();
    if (slot) this.slotConfirmed.emit(slot);
  }

  close(): void {
    this.closed.emit();
  }
}
