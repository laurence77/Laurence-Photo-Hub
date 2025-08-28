import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cooldownMs, setCooldownMs] = useState(0);
  const attemptsRef = useRef(0);
  const { login } = useAuth();

  useEffect(() => {
    if (cooldownMs <= 0) return;
    const t = setTimeout(() => setCooldownMs((ms) => Math.max(ms - 1000, 0)), 1000);
    return () => clearTimeout(t);
  }, [cooldownMs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownMs > 0) return;

    const ok = await login(email, password);
    if (ok) {
      setError('');
      attemptsRef.current = 0;
      onLogin();
      return;
    }

    // Exponential backoff to slow brute-force in demo/dev
    attemptsRef.current += 1;
    const backoff = Math.min(30000, 1000 * Math.pow(2, attemptsRef.current - 1));
    setCooldownMs(backoff);
    setError(
      import.meta.env.PROD
        ? 'Admin access is disabled on the production demo. Please integrate backend authentication.'
        : 'Invalid credentials.'
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Sign in to access the administration portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="laurence@laurence"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 px-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
                {cooldownMs > 0 && (
                  <span className="block text-xs text-red-500 mt-1">Please wait {Math.ceil(cooldownMs / 1000)}s before retrying.</span>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={cooldownMs > 0}>
              Sign In to Admin
            </Button>
          </form>

          {!import.meta.env.PROD && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-2">Demo Credentials (development only):</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Email:</strong> laurence@laurence</div>
                <div><strong>Password:</strong> 12345</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
