import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../components/ui';
import { Building2, Star, Calendar, Lightbulb, MessageCircleQuestion, ListOrdered, X, ExternalLink } from 'lucide-react';
import type { Company } from '../../types';

const pipelineStages = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { value: 'screening', label: 'Screening', color: 'bg-purple-500' },
  { value: 'technical', label: 'Technical', color: 'bg-orange-500' },
  { value: 'hr-round', label: 'HR Round', color: 'bg-green-500' },
  { value: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

type TabType = 'description' | 'tips' | 'qa' | 'rounds';

export function CompanyDetail() {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const company = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        return JSON.parse(decodeURIComponent(data)) as Company;
      } catch {
        console.error('Failed to parse company data');
        return null;
      }
    }
    return null;
  }, []);

  if (!company) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">
          No company data found.
        </div>
      </div>
    );
  }

  const getPipelineColor = (stage?: string) => {
    return pipelineStages.find(s => s.value === stage)?.color || 'bg-gray-500';
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'description', label: 'Description', icon: <Building2 className="h-4 w-4" /> },
    { key: 'tips', label: 'Tips & Tricks', icon: <Lightbulb className="h-4 w-4" /> },
    { key: 'qa', label: 'Q&A', icon: <MessageCircleQuestion className="h-4 w-4" /> },
    { key: 'rounds', label: 'Rounds', icon: <ListOrdered className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{company.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getPipelineColor(company.pipeline)}>
                      {pipelineStages.find(s => s.value === company.pipeline)?.label || 'Applied'}
                    </Badge>
                    {company.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < company.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                    {company.interviewDate && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(company.interviewDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.close()}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex gap-2 border-b">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  {company.description ? (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground whitespace-pre-wrap">{company.description}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No description added yet.</p>
                  )}
                  {company.website && (
                    <div>
                      <h4 className="font-medium mb-2">Website</h4>
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-3">
                  {company.tips && company.tips.length > 0 ? (
                    company.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No tips added yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-4">
                  {company.qa && company.qa.length > 0 ? (
                    company.qa.map((item) => (
                      <div key={item.id} className="p-4 rounded-lg border">
                        <h4 className="font-medium mb-2 text-primary">Q: {item.question}</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">A: {item.answer}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No Q&A added yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'rounds' && (
                <div className="space-y-4">
                  {company.roundDetails && company.roundDetails.length > 0 ? (
                    company.roundDetails.map((round) => (
                      <div key={round.id} className="p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Round {round.roundNumber}</Badge>
                          <h4 className="font-medium">{round.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{round.description}</p>
                        {round.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {round.topics.map((topic, idx) => (
                              <Badge key={idx} variant="secondary">{topic}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No rounds added yet.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
