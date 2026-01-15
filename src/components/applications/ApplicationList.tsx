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
  const [newPosition, setNewPosition] = useState('');
  const [newApplyVia, setNewApplyVia] = useState('LinkedIn');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('applied');

  const [editCompany, setEditCompany] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editApplyVia, setEditApplyVia] = useState('');
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('applied');

  const handleAdd = async () => {
    if (!newCompany.trim()) return;
    
    await createApplication.mutateAsync({
      company_name: newCompany.trim(),
      position: newPosition.trim() || undefined,
      apply_via: newApplyVia,
      status: newStatus,
      apply_date: format(selectedDate, 'yyyy-MM-dd'),
    });

    setNewCompany('');
    setNewPosition('');
    setNewApplyVia('LinkedIn');
    setNewStatus('applied');
    setIsAdding(false);
  };

  const startEditing = (app: JobApplication) => {
    setEditingId(app.id);
    setEditCompany(app.company_name);
    setEditPosition(app.position || '');
    setEditApplyVia(app.apply_via);
    setEditStatus(app.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCompany('');
    setEditPosition('');
    setEditApplyVia('');
    setEditStatus('applied');
  };

  const saveEdit = async (id: string) => {
    await updateApplication.mutateAsync({
      id,
      company_name: editCompany,
      position: editPosition.trim() || undefined,
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

  // Mobile card view for each application
  const MobileApplicationCard = ({ app, idx }: { app: JobApplication; idx: number }) => (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="text-xs text-muted-foreground">#{idx + 1}</div>
          {editingId === app.id ? (
            <div className="space-y-2">
              <Input
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                className="h-8 text-sm"
                placeholder="Nama perusahaan"
              />
              <Input
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="h-8 text-sm"
                placeholder="Posisi"
              />
            </div>
          ) : (
            <>
              <div className="font-semibold text-sm">{app.company_name}</div>
              {app.position && (
                <div className="text-xs text-muted-foreground">{app.position}</div>
              )}
            </>
          )}
        </div>
        <div className="flex gap-1">
          {editingId === app.id ? (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => saveEdit(app.id)}>
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(app)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(app.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        {editingId === app.id ? (
          <>
            <Select value={editApplyVia} onValueChange={setEditApplyVia}>
              <SelectTrigger className="h-7 text-xs w-auto min-w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLY_VIA_OPTIONS.map((via) => (
                  <SelectItem key={via} value={via}>{via}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={editStatus} onValueChange={(v) => setEditStatus(v as ApplicationStatus)}>
              <SelectTrigger className="h-7 text-xs w-auto min-w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Badge variant="outline" className="text-xs">{app.apply_via}</Badge>
            <StatusBadge status={app.status} />
          </>
        )}
      </div>
    </div>
  );

  // Mobile add form
  const MobileAddForm = () => (
    <div className="bg-muted/30 rounded-lg p-3 space-y-3">
      <div className="text-xs text-muted-foreground">Lamaran Baru</div>
      <Input
        placeholder="Nama perusahaan"
        value={newCompany}
        onChange={(e) => setNewCompany(e.target.value)}
        className="h-9"
        autoFocus
      />
      <Input
        placeholder="Posisi (opsional)"
        value={newPosition}
        onChange={(e) => setNewPosition(e.target.value)}
        className="h-9"
      />
      <div className="flex gap-2">
        <Select value={newApplyVia} onValueChange={setNewApplyVia}>
          <SelectTrigger className="h-9 text-sm flex-1">
            <SelectValue placeholder="Apply Via" />
          </SelectTrigger>
          <SelectContent>
            {APPLY_VIA_OPTIONS.map((via) => (
              <SelectItem key={via} value={via}>{via}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ApplicationStatus)}>
          <SelectTrigger className="h-9 text-sm flex-1">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleAdd}
          disabled={!newCompany.trim()}
          className="flex-1 gradient-primary"
          size="sm"
        >
          <Check className="h-4 w-4 mr-2" />
          Simpan
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden sm:block rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 font-semibold">No</TableHead>
              <TableHead className="font-semibold">Perusahaan</TableHead>
              <TableHead className="font-semibold">Posisi</TableHead>
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
                    <Input
                      value={editPosition}
                      onChange={(e) => setEditPosition(e.target.value)}
                      className="h-8"
                      placeholder="Posisi"
                    />
                  ) : (
                    <span className="text-muted-foreground">{app.position || '-'}</span>
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
                  <Input
                    placeholder="Posisi"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="h-8"
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Belum ada lamaran di tanggal ini
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {applications.map((app, idx) => (
          <MobileApplicationCard key={app.id} app={app} idx={idx} />
        ))}
        
        {isAdding && <MobileAddForm />}
        
        {applications.length === 0 && !isAdding && (
          <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-lg">
            Belum ada lamaran di tanggal ini
          </div>
        )}
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
