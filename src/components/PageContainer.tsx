interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="p-6 lg:p-8 h-full">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      <h2 className="text-lg font-semibold text-foreground">{children}</h2>
    </div>
  );
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon?: React.ElementType; 
  title: string; 
  description?: string; 
  action?: React.ReactNode; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
