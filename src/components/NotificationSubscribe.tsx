import { Bell, BellRing, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';


export function NotificationSubscribe() {
  const { isSupported, isSubscribed, isLoading, permission, subscribe, unsubscribe, recheckPermission } = usePushNotifications();
  const { toast } = useToast();

  // Recheck permission on every page load/focus
  useEffect(() => {
    recheckPermission();
    
    const handleFocus = () => recheckPermission();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [recheckPermission]);

  const handleToggle = async () => {
    if (isSubscribed) {
      const result = await unsubscribe();
      if (result.success) {
        toast({
          title: "Unsubscribed",
          description: "You will no longer receive notice notifications.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to unsubscribe",
          variant: "destructive",
        });
      }
    } else {
      const result = await subscribe();
      if (result.success) {
        toast({
          title: "Subscribed!",
          description: "You will now receive notifications for new important notices.",
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: result.error || "Failed to subscribe to notifications",
          variant: "destructive",
        });
      }
    }
  };

  // Show fallback if push not supported
  if (!isSupported) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="w-4 h-4" />
            Get Notified
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="end">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">
              Push notifications not available
            </p>
            <p className="text-xs">
              Your browser doesn't support push notifications. Check back
              here for the latest announcements.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Permission denied — show a helper popover, no external channels
  if (permission === 'denied') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-amber-500/50 text-amber-600 dark:text-amber-400"
          >
            <Bell className="w-4 h-4" />
            Click to allow
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="end">
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Notifications blocked</p>
            <p className="text-xs text-muted-foreground">
              To enable, click the lock icon in your browser's address bar
              and allow notifications for this site.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }


  return (
    <Button 
      variant={isSubscribed ? "secondary" : "outline"}
      size="sm" 
      className="gap-2"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSubscribed ? (
        <BellRing className="w-4 h-4" />
      ) : (
        <Bell className="w-4 h-4" />
      )}
      {isSubscribed ? "Subscribed" : "Enable Notifications"}
    </Button>
  );
}
