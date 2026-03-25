import { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea, Select, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui';
import { Plus, Pencil, Trash2, Calendar, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, History, Send, ThumbsUp } from 'lucide-react';
import type { Interview, InterviewType, InterviewStatus } from '../../types';
import { format } from 'date-fns';

const interviewTypes: { label: string; value: InterviewType }[] = [
  { label: 'Phone', value: 'phone' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Video', value: 'video' },
  { label: 'Coding', value: 'coding' },
  { label: 'Behavioral', value: 'behavioral' },
];

const interviewStatuses: { label: string; value: InterviewStatus }[] = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Pending', value: 'pending' },
];

const statusColors: Record<InterviewStatus, string> = {
  scheduled: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  pending: 'bg-yellow-500',
};

const statusIcons: Record<InterviewStatus, React.ReactNode> = {
  scheduled: <Clock className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
  pending: <AlertCircle className="h-4 w-4" />,
};

const thankYouMessages = [
  "Thank you for the opportunity. I appreciate your time and consideration.",
  "I wanted to express my gratitude for the interview today. It was a pleasure learning more about the role and your team.",
  "Thank you for taking the time to meet with me. I remain very interested in this opportunity.",
  "I appreciate the opportunity to discuss this role further. Please don't hesitate to reach out if you need anything else.",
  "Thank you for the wonderful conversation. I'm excited about the possibility of joining your team.",
];

export function Interviews() {
  const { companies, interviews, addInterview, updateInterview, deleteInterview } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [thankYouDialog, setThankYouDialog] = useState<Interview | null>(null);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCompany, setFilterCompany] = useState<string>('');
  
  const [formData, setFormData] = useState({
    companyId: 0,
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'phone' as InterviewType,
    status: 'pending' as InterviewStatus,
    notes: '',
    outcome: '',
    link: '',
    thankYouSent: false,
  });

  const upcomingInterviews = useMemo(() => {
    return interviews
      .filter((i) => i.status === 'scheduled' || i.status === 'pending')
      .filter((i) => {
        const matchesStatus = !filterStatus || i.status === filterStatus;
        const matchesCompany = !filterCompany || String(i.companyId) === filterCompany;
        return matchesStatus && matchesCompany;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [interviews, filterStatus, filterCompany]);

  const historyInterviews = useMemo(() => {
    return interviews
      .filter((i) => i.status === 'completed' || i.status === 'cancelled')
      .filter((i) => {
        const matchesCompany = !filterCompany || String(i.companyId) === filterCompany;
        return matchesCompany;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [interviews, filterCompany]);

  const stats = useMemo(() => {
    const completed = interviews.filter(i => i.status === 'completed');
    const passed = completed.filter(i => i.outcome === 'passed');
    return {
      upcoming: interviews.filter(i => i.status === 'scheduled' || i.status === 'pending').length,
      totalCompleted: completed.length,
      successRate: completed.length > 0 ? Math.round((passed.length / completed.length) * 100) : 0,
    };
  }, [interviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const [hours, minutes] = formData.time.split(':').map(Number);
    const interviewDate = new Date(formData.date);
    interviewDate.setHours(hours, minutes, 0, 0);
    
    const interviewData = {
      companyId: formData.companyId,
      date: interviewDate,
      type: formData.type,
      status: formData.status,
      notes: formData.notes,
      outcome: formData.outcome,
      link: formData.link,
      thankYouSent: formData.thankYouSent,
    };

    if (editingInterview) {
      await updateInterview(editingInterview.id!, interviewData);
      if (formData.status === 'completed') {
        setThankYouDialog({ ...editingInterview, ...interviewData });
      }
    } else {
      await addInterview(interviewData);
    }
    
    setIsDialogOpen(false);
    setEditingInterview(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      companyId: companies[0]?.id || 0,
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'phone',
      status: 'pending',
      notes: '',
      outcome: '',
      link: '',
      thankYouSent: false,
    });
  };

  const handleEdit = (interview: Interview) => {
    const interviewDate = new Date(interview.date);
    setEditingInterview(interview);
    setFormData({
      companyId: interview.companyId,
      date: interviewDate.toISOString().split('T')[0],
      time: `${String(interviewDate.getHours()).padStart(2, '0')}:${String(interviewDate.getMinutes()).padStart(2, '0')}`,
      type: interview.type,
      status: interview.status,
      notes: interview.notes || '',
      outcome: interview.outcome || '',
      link: interview.link || '',
      thankYouSent: (interview as Partial<Interview> & { thankYouSent?: boolean }).thankYouSent || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this interview?')) {
      await deleteInterview(id);
    }
  };

  const handleSendThankYou = async () => {
    if (thankYouDialog) {
      await updateInterview(thankYouDialog.id!, { ...thankYouDialog, thankYouSent: true } as Partial<Interview> & { thankYouSent: boolean });
      setThankYouDialog(null);
    }
  };

  const getCompanyName = (companyId: number) => {
    return companies.find(c => c.id === companyId)?.name || 'Unknown';
  };

  const getRandomThankYouMessage = useMemo(() => {
    return () => thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
  }, []);

  const InterviewCard = ({ interview, showActions = true }: { interview: Interview; showActions?: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{getCompanyName(interview.companyId)}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {interview.type}
            </Badge>
            <Badge className={statusColors[interview.status]}>
              {statusIcons[interview.status]}
              <span className="ml-1 capitalize">{interview.status}</span>
            </Badge>
            <Badge variant="secondary">
              {format(new Date(interview.date), 'MMM d, yyyy')} at {format(new Date(interview.date), 'h:mm a')}
            </Badge>
            {interview.link && interview.status === 'scheduled' && (
              <a href={interview.link} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Join
                </Badge>
              </a>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            {interview.status === 'scheduled' && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => {
                  handleEdit(interview);
                  setFormData(prev => ({ ...prev, status: 'completed' }));
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Complete
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleEdit(interview)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(interview.id!)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      {(interview.notes || interview.outcome || (interview as Partial<Interview> & { thankYouSent?: boolean }).thankYouSent) && (
        <CardContent>
          {interview.notes && (
            <p className="text-sm text-muted-foreground mb-2">{interview.notes}</p>
          )}
          {interview.outcome && (
            <Badge variant={interview.outcome === 'passed' ? 'default' : 'destructive'}>
              {interview.outcome === 'passed' ? 'Passed' : 'Failed'}
            </Badge>
          )}
          {(interview as Partial<Interview> & { thankYouSent?: boolean }).thankYouSent && (
            <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-950/50">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Thank You Sent
            </Badge>
          )}
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Interviews</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'Show Upcoming' : 'View History'}
          </Button>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} disabled={companies.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Log Interview
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {showHistory ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Interview History
            </h3>
            <Badge variant="secondary">{historyInterviews.length} interviews</Badge>
          </div>
          
          {historyInterviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <History className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No interview history yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historyInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} showActions={false} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-wrap gap-4 p-4">
              <Select
                options={[{ label: 'All Statuses', value: '' }, ...interviewStatuses]}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-[160px]"
              />
              <Select
                options={[{ label: 'All Companies', value: '' }, ...companies.map(c => ({ label: c.name, value: String(c.id) }))]}
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-[160px]"
              />
            </CardContent>
          </Card>

          {upcomingInterviews.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming interviews.</p>
                <Button 
                  variant="link" 
                  onClick={() => setShowHistory(true)}
                  className="mt-2"
                >
                  View Interview History
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingInterview ? 'Edit Interview' : 'Log Interview'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select
                  options={companies.map(c => ({ label: c.name, value: String(c.id) }))}
                  value={String(formData.companyId)}
                  onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    options={interviewTypes}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as InterviewType })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    options={interviewStatuses}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as InterviewStatus })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Interview notes..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Meeting Link (optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
              </div>
              {formData.status === 'completed' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome</Label>
                    <Select
                      options={[
                        { label: 'Select outcome', value: '' },
                        { label: 'Passed', value: 'passed' },
                        { label: 'Failed', value: 'failed' },
                      ]}
                      value={formData.outcome}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    />
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span className="font-medium">Send a Thank You Note?</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Professional follow-up after an interview can make a great impression.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="thankYouSent"
                        checked={formData.thankYouSent}
                        onChange={(e) => setFormData({ ...formData, thankYouSent: e.target.checked })}
                        className="h-4 w-4 rounded border-input"
                      />
                      <Label htmlFor="thankYouSent" className="text-sm font-normal">
                        Mark as thank you sent
                      </Label>
                    </div>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingInterview ? 'Save' : 'Log'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!thankYouDialog} onOpenChange={() => setThankYouDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Interview Completed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Great job completing the interview at <span className="font-medium text-foreground">{thankYouDialog && getCompanyName(thankYouDialog.companyId)}</span>!
            </p>
            
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Suggested Follow-up Message
              </h4>
              <p className="text-sm text-muted-foreground italic">
                "{getRandomThankYouMessage()}"
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Sending a thank you email within 24 hours shows professionalism and keeps you top of mind with the hiring team.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setThankYouDialog(null)}>
              Maybe Later
            </Button>
            <Button onClick={handleSendThankYou}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Mark as Thank You Sent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
