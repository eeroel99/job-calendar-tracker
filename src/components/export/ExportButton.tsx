import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJobApplications } from '@/hooks/useJobApplications';
import { STATUS_CONFIG } from '@/types/job-application';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function ExportButton() {
  const { applications } = useJobApplications();
  const { toast } = useToast();

  const handleExport = () => {
    if (applications.length === 0) {
      toast({
        title: 'Tidak ada data',
        description: 'Belum ada lamaran untuk di-export.',
        variant: 'destructive',
      });
      return;
    }

    const headers = ['No', 'Perusahaan', 'Apply Via', 'Status', 'Tanggal Apply', 'Catatan'];
    const rows = applications.map((app, idx) => [
      idx + 1,
      app.company_name,
      app.apply_via,
      STATUS_CONFIG[app.status].label,
      format(new Date(app.apply_date), 'dd/MM/yyyy'),
      app.notes || '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export berhasil!',
      description: `${applications.length} lamaran berhasil di-export.`,
    });
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
