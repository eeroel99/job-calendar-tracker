import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useJobApplications } from '@/hooks/useJobApplications';
import { STATUS_CONFIG, ApplicationStatus } from '@/types/job-application';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchApplications } = useJobApplications();

  const results = searchApplications(query);

  const handleSearch = (value: string) => {
    setQuery(value);
    setShowResults(value.trim().length > 0);
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
  };

  const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const config = STATUS_CONFIG[status];
    return (
      <Badge className={cn("text-white font-medium", config.bgClass)}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari perusahaan..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-9 h-11 rounded-xl"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl max-h-[400px] overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Hasil Pencarian ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-medium">Perusahaan</TableHead>
                    <TableHead className="font-medium">Tanggal</TableHead>
                    <TableHead className="font-medium">Via</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.slice(0, 10).map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.company_name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(app.apply_date), 'd MMM yyyy', { locale: id })}
                      </TableCell>
                      <TableCell>{app.apply_via}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Tidak ada hasil untuk "{query}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
