import { useQuery } from '@tanstack/react-query';
import { hokApi, ContactMessage } from '@/services/hokApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactManagement = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => hokApi.fetchContactMessages(),
  });

  const messages: ContactMessage[] = data || [];

  return (
    <Card className="border border-border shadow-card">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-playfair text-xl">Contact Messages</CardTitle>
        <button
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : error ? (
          <p className="text-sm text-destructive">Unable to load messages.</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className="rounded-md border border-border p-3 bg-background/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{message.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </div>
                  {message.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {message.subject && <p className="text-sm font-medium">{message.subject}</p>}
                <p className="text-sm text-foreground leading-relaxed">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactManagement;
