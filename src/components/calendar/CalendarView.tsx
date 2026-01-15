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
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getApplicationCountByDate } = useJobApplications();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    allDays.push(day);
    day = addDays(day, 1);
  }

  // On mobile, limit to 4 rows (28 days)
  const days = isMobile ? allDays.slice(0, 28) : allDays;

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
    <div className="bg-card rounded-2xl shadow-lg border p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm">
            Hari ini
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPrevMonth} className="h-8 w-8 sm:h-10 sm:w-10">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8 sm:h-10 sm:w-10">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {weekDays.map((weekDay) => (
          <div 
            key={weekDay} 
            className="text-center text-xs sm:text-sm font-semibold text-muted-foreground py-1 sm:py-2"
          >
            {weekDay}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((dayDate, idx) => {
          const appCount = getApplicationCountByDate(dayDate);
          const isCurrentMonth = isSameMonth(dayDate, currentMonth);
          const isTodayDate = isToday(dayDate);

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(dayDate)}
              className={cn(
                "relative min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 border",
                "flex flex-col items-center justify-start gap-0.5 sm:gap-1",
                "hover:border-primary hover:shadow-md",
                !isCurrentMonth && "opacity-30 bg-muted/30",
                isCurrentMonth && "bg-card",
                isTodayDate && "border-secondary bg-secondary/10"
              )}
            >
              {/* Date number */}
              <span className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold",
                isTodayDate && "bg-primary text-primary-foreground"
              )}>
                {format(dayDate, 'd')}
              </span>
              
              {/* Job count indicator */}
              {appCount > 0 && (
                <div className={cn(
                  "flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold",
                  "bg-accent text-accent-foreground"
                )}>
                  <Briefcase className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">{appCount} job</span>
                  <span className="sm:hidden">{appCount}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
