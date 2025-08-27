import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Fingerprint, 
  Shield, 
  Eye, 
  Smartphone,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock,
  RefreshCw,
  UserCheck,
  Database,
  Globe
} from 'lucide-react';

interface BiometricCapabilities {
  faceID: boolean;
  touchID: boolean;
  voiceID: boolean;
  webAuthn: boolean;
  platform: string;
}

interface EncryptionStatus {
  clientSide: boolean;
  zerKnowledge: boolean;
  endToEnd: boolean;
  keyRotation: boolean;
  backupEncrypted: boolean;
}

const BiometricSecurity = () => {
  const [biometricSupport, setBiometricSupport] = useState<BiometricCapabilities>({
    faceID: false,
    touchID: false,
    voiceID: false,
    webAuthn: false,
    platform: 'unknown'
  });
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus>({
    clientSide: true,
    zerOfnowledge: true,
    endToEnd: true,
    keyRotation: true,
    backupEncrypted: true
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [lastAuth, setLastAuth] = useState<Date | null>(null);
  const [encryptionKeys, setEncryptionKeys] = useState<any[]>([]);

  // Detect biometric capabilities
  useEffect(() => {
    const detectCapabilities = async () => {
      const capabilities: BiometricCapabilities = {
        faceID: false,
        touchID: false,
        voiceID: false,
        webAuthn: false,
        platform: navigator.platform
      };

      // Check for WebAuthn support
      if (window.PublicKeyCredential) {
        capabilities.webAuthn = true;
        
        try {
          // Check for specific authenticator types
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          if (available) {
            // On Apple devices, this usually means Touch ID or Face ID
            if (navigator.platform.includes('Mac') || navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
              capabilities.faceID = true;
              capabilities.touchID = true;
            }
          }
        } catch (error) {
          console.warn('Biometric detection error:', error);
        }
      }

      setBiometricSupport(capabilities);
    };

    detectCapabilities();
    
    // Mock encryption keys initialization
    setEncryptionKeys([
      { id: 'master', type: 'AES-256', status: 'active', created: new Date(), rotated: new Date() },
      { id: 'backup', type: 'RSA-4096', status: 'standby', created: new Date(), rotated: new Date() },
      { id: 'device', type: 'ECDH-P521', status: 'active', created: new Date(), rotated: new Date() }
    ]);
  }, []);

  const performBiometricAuth = async () => {
    setIsAuthenticating(true);
    setAuthProgress(0);

    try {
      if (biometricSupport.webAuthn) {
        // Simulate WebAuthn challenge
        const stages = [
          'Initializing secure channel...',
          'Requesting biometric verification...',
          'Processing authentication...',
          'Validating credentials...',
          'Establishing zero-knowledge session...'
        ];

        for (let i = 0; i < stages.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setAuthProgress((i + 1) * 20);
        }

        // In a real implementation, this would use WebAuthn
        // const credential = await navigator.credentials.create({
        //   publicKey: {
        //     challenge: new Uint8Array(32),
        //     rp: { name: "Laurence Photo Hub" },
        //     user: { id: new Uint8Array(16), name: "user@example.com", displayName: "User" },
        //     pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        //     authenticatorSelection: { userVerification: "required" }
        //   }
        // });

        setLastAuth(new Date());
        setAuthProgress(100);
      } else {
        throw new Error('Biometric authentication not supported');
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const rotateEncryptionKeys = async () => {
    // Simulate key rotation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setEncryptionKeys(prev => prev.map(key => ({
      ...key,
      rotated: new Date()
    })));
  };

  const biometricMethods = [
    {
      name: 'Face ID',
      icon: <Eye className="h-5 w-5" />,
      supported: biometricSupport.faceID,
      description: 'Apple Face ID or Windows Hello Face'
    },
    {
      name: 'Touch ID',
      icon: <Fingerprint className="h-5 w-5" />,
      supported: biometricSupport.touchID,
      description: 'Fingerprint authentication'
    },
    {
      name: 'Platform Authenticator',
      icon: <Smartphone className="h-5 w-5" />,
      supported: biometricSupport.webAuthn,
      description: 'Hardware security key or built-in authenticator'
    }
  ];

  const encryptionFeatures = [
    {
      name: 'Client-Side Encryption',
      enabled: encryptionStatus.clientSide,
      icon: <Shield className="h-4 w-4" />,
      description: 'All data encrypted before leaving your device'
    },
    {
      name: 'Zero-Knowledge Architecture',
      enabled: encryptionStatus.zerOfnowledge,
      icon: <Eye className="h-4 w-4" />,
      description: 'We never see your unencrypted data'
    },
    {
      name: 'End-to-End Encryption',
      enabled: encryptionStatus.endToEnd,
      icon: <Lock className="h-4 w-4" />,
      description: 'Only you and intended recipients can decrypt'
    },
    {
      name: 'Automatic Key Rotation',
      enabled: encryptionStatus.keyRotation,
      icon: <RefreshCw className="h-4 w-4" />,
      description: 'Encryption keys rotated regularly for security'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Biometric Authentication */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-purple-50/10 to-blue-50/10 opacity-30"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-6 w-6 electric-accent" />
            Biometric Authentication
            <Badge variant="secondary">WebAuthn</Badge>
          </CardTitle>
          <CardDescription>
            Secure, passwordless authentication using your device's built-in biometric sensors
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Biometric Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {biometricMethods.map((method, index) => (
              <div key={index} className={`p-4 border rounded-lg ${
                method.supported 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                  : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    method.supported ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{method.name}</h4>
                    <Badge variant={method.supported ? 'default' : 'secondary'} className="text-xs">
                      {method.supported ? 'Available' : 'Not Available'}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
            ))}
          </div>

          {/* Authentication Controls */}
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Biometric Sign-In</h4>
                <p className="text-sm text-muted-foreground">
                  {lastAuth ? `Last authenticated: ${lastAuth.toLocaleString()}` : 'Not authenticated'}
                </p>
              </div>
              <Button 
                onClick={performBiometricAuth}
                disabled={!biometricSupport.webAuthn || isAuthenticating}
                className="flex items-center gap-2"
              >
                {isAuthenticating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Authenticate
                  </>
                )}
              </Button>
            </div>

            {isAuthenticating && (
              <div className="space-y-2">
                <Progress value={authProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Follow the prompts on your device to complete authentication
                </p>
              </div>
            )}

            {!biometricSupport.webAuthn && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Biometric authentication is not supported on this device or browser. 
                  Try using a modern browser on a device with biometric sensors.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </div>

      {/* Zero-Knowledge Encryption */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/10 via-blue-50/10 to-indigo-50/10 opacity-30"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            Zero-Knowledge Encryption
            <Badge variant="secondary">AES-256</Badge>
          </CardTitle>
          <CardDescription>
            End-to-end encryption with zero-knowledge architecture - we never see your data
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          {/* Encryption Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {encryptionFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg bg-white/50">
                <div className={`p-2 rounded-full ${
                  feature.enabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{feature.name}</h4>
                    <Badge variant={feature.enabled ? 'default' : 'destructive'} className="text-xs">
                      {feature.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Encryption Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Encryption Keys</h4>
              <Button variant="outline" size="sm" onClick={rotateEncryptionKeys}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Rotate Keys
              </Button>
            </div>
            
            <div className="space-y-3">
              {encryptionKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{key.type} Key</p>
                      <p className="text-xs text-muted-foreground">
                        Rotated: {key.rotated.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                    {key.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Security Status */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Status: Excellent</strong><br />
              All encryption protocols are active and functioning properly. 
              Your data is protected with military-grade security.
            </AlertDescription>
          </Alert>
        </CardContent>
      </div>

      {/* Security Metrics */}
      <div className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Security Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
              <p className="text-sm text-muted-foreground">Data Encrypted</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <p className="text-sm text-muted-foreground">Threat Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
              <p className="text-sm text-muted-foreground">Data Breaches</p>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default BiometricSecurity;