import { useState } from 'react';
import { useAppStore } from '../../store';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Github, Key, Database, LogOut, Link } from 'lucide-react';
import { githubSync } from '../../services';
import { format } from 'date-fns';

export function Sync() {
  const { syncState, githubConfig, configureGitHub, disconnectGitHub, sync } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
    password: '',
  });

  const handleConfigure = async () => {
    configureGitHub(
      {
        token: formData.token,
        owner: formData.owner,
        repo: formData.repo,
        branch: formData.branch,
      },
      formData.password
    );
    setIsDialogOpen(false);
  };

  const handleTestConnection = async () => {
    if (!githubConfig) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await githubSync.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: (error as Error).message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSync = async () => {
    await sync();
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect GitHub sync? Your local data will not be deleted.')) {
      disconnectGitHub();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sync</h2>
        {githubConfig ? (
          <Button variant="destructive" onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        ) : (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Key className="mr-2 h-4 w-4" />
            Configure GitHub
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {syncState.isSyncing ? (
                <span className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Syncing...
                </span>
              ) : syncState.syncError ? (
                <span className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  Error
                </span>
              ) : githubConfig ? (
                <span className="flex items-center gap-2 text-sm text-green-500">
                  <Link className="h-4 w-4" />
                  Auto-sync enabled
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Not configured
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sync</span>
              <span className="text-sm">
                {syncState.lastSyncAt
                  ? format(syncState.lastSyncAt, 'MMM d, yyyy HH:mm')
                  : 'Never'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Changes</span>
              <span className="text-sm font-medium">{syncState.pendingChanges}</span>
            </div>

            {syncState.syncError && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{syncState.syncError}</p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleSync}
              disabled={!githubConfig || syncState.isSyncing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
              {syncState.isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Repository
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {githubConfig ? (
              <>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Repository</span>
                  <p className="text-sm font-medium">
                    {githubConfig.owner}/{githubConfig.repo}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Branch</span>
                  <p className="text-sm font-medium">{githubConfig.branch}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Encryption</span>
                  <p className="text-sm font-medium text-green-500">AES-256 Encrypted</p>
                </div>
                
                {testResult && (
                  <div className={`rounded-md p-3 ${testResult.success ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                    <p className={`text-sm ${testResult.success ? 'text-green-500' : 'text-destructive'}`}>
                      {testResult.message}
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Github className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Configure your GitHub repository to enable sync.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your data will be encrypted before uploading.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Sync Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>All data is stored locally in your browser using IndexedDB</li>
            <li>When syncing, data is encrypted using AES-256 with your password</li>
            <li>Encrypted data is pushed to your GitHub repository</li>
            <li>Changes are merged using version-based conflict resolution</li>
            <li>Higher version wins; equal versions are merged and incremented</li>
          </ol>
          <div className="rounded-md bg-yellow-500/10 p-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              Never share your GitHub token or encryption password.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleConfigure(); }}>
            <DialogHeader>
              <DialogTitle>Configure GitHub Sync</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">GitHub Personal Access Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxx"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Token needs repo scope permissions
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Repository Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository Name</Label>
                <Input
                  id="repo"
                  value={formData.repo}
                  onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                  placeholder="interviewiq-data"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="main"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Encryption Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Your encryption password"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This password encrypts your data before uploading to GitHub
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
