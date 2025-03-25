'use client';

import { useState, useMemo } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Trash2, Check, X, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'system' | 'inventory' | 'sales' | 'user';
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Stock Updated',
      message: 'Inventory levels have been successfully updated.',
      timestamp: '2024-03-25T10:30:00',
      read: false,
      category: 'inventory',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Paracetamol is running low on stock.',
      timestamp: '2024-03-25T09:15:00',
      read: false,
      category: 'inventory',
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update',
      message: 'A new version of the system is available.',
      timestamp: '2024-03-25T08:45:00',
      read: true,
      category: 'system',
    },
    {
      id: '4',
      type: 'error',
      title: 'Connection Error',
      message: 'Failed to connect to the server.',
      timestamp: '2024-03-25T08:30:00',
      read: false,
      category: 'system',
    },
    {
      id: '5',
      type: 'success',
      title: 'Sale Completed',
      message: 'Transaction #12345 has been completed successfully.',
      timestamp: '2024-03-25T07:20:00',
      read: true,
      category: 'sales',
    },
    {
      id: '6',
      type: 'info',
      title: 'New User Registration',
      message: 'John Doe has registered as a new user.',
      timestamp: '2024-03-25T06:15:00',
      read: false,
      category: 'user',
    },
  ]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notifications, searchQuery, selectedCategory]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryColor = (category: Notification['category']) => {
    switch (category) {
      case 'system':
        return 'bg-purple-100 text-purple-800';
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'user':
        return 'bg-orange-100 text-orange-800';
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
      toast({
        title: 'Notification marked as read',
        description: 'The notification has been marked as read successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark notification as read.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(notifications.filter(notification => notification.id !== id));
      toast({
        title: 'Notification deleted',
        description: 'The notification has been deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete notification.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast({
        title: 'All notifications marked as read',
        description: 'All notifications have been marked as read successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark all notifications as read.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications([]);
      toast({
        title: 'All notifications cleared',
        description: 'All notifications have been cleared successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear notifications.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your system notifications and alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={isLoading || unreadCount === 0}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Mark all as read
          </Button>
          <Button
            variant="destructive"
            onClick={clearAll}
            disabled={isLoading || notifications.length === 0}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Clear all
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ScrollArea className="h-[600px] pr-4">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4" />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border mb-4 ${
                        notification.read ? 'bg-muted/50' : 'bg-background'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getNotificationIcon(notification.type)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{notification.title}</h3>
                              <Badge variant="secondary" className={getNotificationColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              <Badge variant="outline" className={getCategoryColor(notification.category)}>
                                {notification.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              <ScrollArea className="h-[600px] pr-4">
                {filteredNotifications.filter(n => !n.read).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4" />
                    <p>No unread notifications</p>
                  </div>
                ) : (
                  filteredNotifications
                    .filter(n => !n.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg border mb-4 bg-background"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getNotificationIcon(notification.type)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge variant="secondary" className={getNotificationColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                                <Badge variant="outline" className={getCategoryColor(notification.category)}>
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              <ScrollArea className="h-[600px] pr-4">
                {filteredNotifications.filter(n => n.read).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4" />
                    <p>No read notifications</p>
                  </div>
                ) : (
                  filteredNotifications
                    .filter(n => n.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg border mb-4 bg-muted/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getNotificationIcon(notification.type)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge variant="secondary" className={getNotificationColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                                <Badge variant="outline" className={getCategoryColor(notification.category)}>
                                  {notification.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 