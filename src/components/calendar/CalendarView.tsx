import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  isToday
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getApplicationCountByDate } = useJobApplications();
  const navigate = useNavigate();

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
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate(`/applications/${dateStr}`);
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
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((weekDay) => (
          <div 
            key={weekDay} 
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {weekDay}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((dayDate, idx) => {
          const appCount = getApplicationCountByDate(dayDate);
          const isCurrentMonth = isSameMonth(dayDate, currentMonth);
          const isTodayDate = isToday(dayDate);

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(dayDate)}
              className={cn(
                "relative min-h-[80px] p-2 rounded-xl transition-all duration-200 border",
                "flex flex-col items-center justify-start gap-1",
                "hover:border-primary hover:shadow-md",
                !isCurrentMonth && "opacity-30 bg-muted/30",
                isCurrentMonth && "bg-card",
                isTodayDate && "border-secondary bg-secondary/10"
              )}
            >
              {/* Date number */}
              <span className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                isTodayDate && "bg-primary text-primary-foreground"
              )}>
                {format(dayDate, 'd')}
              </span>
              
              {/* Job count indicator */}
              {appCount > 0 && (
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                  "bg-accent text-accent-foreground"
                )}>
                  <Briefcase className="w-3 h-3" />
                  <span>{appCount} job</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
