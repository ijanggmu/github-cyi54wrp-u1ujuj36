'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-store';
import { ErrorHandler } from '@/lib/error-handler';
import { useLoading } from '@/hooks/use-loading';
import Image from 'next/image';
import { Loader2, User, Lock } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { setLoading } = useLoading();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setError('');
      await login(values.username, values.password);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      ErrorHandler.handle(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
        <Image
          src="/images/pharmacy-bg.svg"
          alt="Pharmacy Background"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col justify-center items-center text-white p-8 text-center">
          <div className="w-24 h-24 mb-6 relative">
            <Image
              src="/images/logo.svg"
              alt="PharmaCare Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to PharmaCare</h1>
          <p className="text-xl text-white/90 max-w-md">
            Your trusted partner in pharmacy management. Streamline operations, manage inventory, and provide better patient care.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-sm text-white/80">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-sm text-white/80">Pharmacies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-background/50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <Image
                src="/images/logo.svg"
                alt="PharmaCare Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">Welcome to PharmaCare</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-8 border border-border/50 backdrop-blur-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter your username" 
                            {...field}
                            className="h-11 pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            className="h-11 pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1">
                <p>Admin: admin / admin123</p>
                <p>Manager: manager / manager123</p>
                <p>User: user / user123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}