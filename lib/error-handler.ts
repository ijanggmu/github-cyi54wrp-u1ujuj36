import { toast } from '@/components/ui/use-toast';

export class ErrorHandler {
  static handle(error: any) {
    console.error('Error:', error);

    const message = error?.response?.data?.message || error?.message || 'An unexpected error occurred';
    
    toast({
      variant: 'destructive',
      title: 'Error',
      description: message,
    });
  }
}