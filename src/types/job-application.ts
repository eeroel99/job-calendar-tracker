export type ApplicationStatus = 
  | 'no_applied' 
  | 'applied' 
  | 'interviewed' 
  | 'rejected' 
  | 'accepted';

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  position?: string;
  apply_via: string;
  status: ApplicationStatus;
  apply_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  application_id: string;
  reminder_date: string;
  message?: string;
  is_completed: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bgClass: string }> = {
  no_applied: { label: 'No Applied', color: 'hsl(var(--status-no-applied))', bgClass: 'status-no-applied' },
  applied: { label: 'Applied', color: 'hsl(var(--status-applied))', bgClass: 'status-applied' },
  interviewed: { label: 'Interviewed', color: 'hsl(var(--status-interviewed))', bgClass: 'status-interviewed' },
  rejected: { label: 'Rejected', color: 'hsl(var(--status-rejected))', bgClass: 'status-rejected' },
  accepted: { label: 'Accepted', color: 'hsl(var(--status-accepted))', bgClass: 'status-accepted' },
};

export const APPLY_VIA_OPTIONS = [
  'LinkedIn',
  'Jobstreet',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Email',
  'Other',
];
