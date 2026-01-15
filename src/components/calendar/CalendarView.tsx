import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getApplicationCountByDate } = useJobApplications();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    onDateSelect(new Date());
  };

  return (
    <div className="bg-card rounded-2xl shadow-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hari ini
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((weekDay) => (
          <div 
            key={weekDay} 
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {weekDay}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayDate, idx) => {
          const appCount = getApplicationCountByDate(dayDate);
          const isCurrentMonth = isSameMonth(dayDate, currentMonth);
          const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
          const isTodayDate = isToday(dayDate);

          return (
            <button
              key={idx}
              onClick={() => onDateSelect(dayDate)}
              className={cn(
                "relative aspect-square p-1 rounded-xl transition-all duration-200 hover:bg-muted",
                "flex flex-col items-center justify-start",
                !isCurrentMonth && "opacity-30",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                isTodayDate && !isSelected && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                isSelected && "text-primary-foreground"
              )}>
                {format(dayDate, 'd')}
              </span>
              {appCount > 0 && (
                <div className={cn(
                  "mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  isSelected 
                    ? "bg-primary-foreground text-primary" 
                    : "bg-secondary text-secondary-foreground"
                )}>
                  {appCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
