import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobApplications } from '@/hooks/useJobApplications';
import { ApplicationStatus, STATUS_CONFIG, APPLY_VIA_OPTIONS, JobApplication } from '@/types/job-application';
import { cn } from '@/lib/utils';

interface ApplicationListProps {
  selectedDate: Date;
  onClose: () => void;
}

export function ApplicationList({ selectedDate, onClose }: ApplicationListProps) {
  const { 
    getApplicationsByDate, 
    createApplication, 
    updateApplication, 
    deleteApplication 
  } = useJobApplications();
  
  const applications = getApplicationsByDate(selectedDate);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newCompany, setNewCompany] = useState('');
  const [newApplyVia, setNewApplyVia] = useState('LinkedIn');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('applied');

  const [editCompany, setEditCompany] = useState('');
  const [editApplyVia, setEditApplyVia] = useState('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('applied');

  const handleAdd = async () => {
    if (!newCompany.trim()) return;
    
    await createApplication.mutateAsync({
      company_name: newCompany.trim(),
      apply_via: newApplyVia,
      status: newStatus,
      apply_date: format(selectedDate, 'yyyy-MM-dd'),
    });

    setNewCompany('');
    setNewApplyVia('LinkedIn');
    setNewStatus('applied');
    setIsAdding(false);
  };

  const startEditing = (app: JobApplication) => {
    setEditingId(app.id);
    setEditCompany(app.company_name);
    setEditApplyVia(app.apply_via);
    setEditStatus(app.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCompany('');
    setEditApplyVia('');
    setEditStatus('applied');
  };

  const saveEdit = async (id: string) => {
    await updateApplication.mutateAsync({
      id,
      company_name: editCompany,
      apply_via: editApplyVia,
      status: editStatus,
    });
    cancelEditing();
  };

  const handleDelete = async (id: string) => {
    await deleteApplication.mutateAsync(id);
  };

  const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const config = STATUS_CONFIG[status];
    return (
      <Badge 
        className={cn(
          "text-white font-medium",
          config.bgClass
        )}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 font-semibold">No</TableHead>
                <TableHead className="font-semibold">Perusahaan</TableHead>
                <TableHead className="font-semibold">Apply Via</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-24 text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app, idx) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{idx + 1}</TableCell>
                  <TableCell>
                    {editingId === app.id ? (
                      <Input
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      app.company_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === app.id ? (
                      <Select value={editApplyVia} onValueChange={setEditApplyVia}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {APPLY_VIA_OPTIONS.map((via) => (
                            <SelectItem key={via} value={via}>{via}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      app.apply_via
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === app.id ? (
                      <Select value={editStatus} onValueChange={(v) => setEditStatus(v as ApplicationStatus)}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={app.status} />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === app.id ? (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(app.id)}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditing}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(app)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(app.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new row */}
              {isAdding && (
                <TableRow>
                  <TableCell className="font-medium">{applications.length + 1}</TableCell>
                  <TableCell>
                    <Input
                      placeholder="Nama perusahaan"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="h-8"
                      autoFocus
                    />
                  </TableCell>
                  <TableCell>
                    <Select value={newApplyVia} onValueChange={setNewApplyVia}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLY_VIA_OPTIONS.map((via) => (
                          <SelectItem key={via} value={via}>{via}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ApplicationStatus)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleAdd}
                        disabled={!newCompany.trim()}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {applications.length === 0 && !isAdding && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Belum ada lamaran di tanggal ini
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="mt-4 w-full gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Lamaran
          </Button>
        )}
    </div>
  );
}
