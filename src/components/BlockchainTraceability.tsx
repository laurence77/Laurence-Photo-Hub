import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Hash,
  FileText,
  Users,
  Activity,
  Zap,
  Database,
  Globe,
  Eye,
  Fingerprint,
  Award,
  TrendingUp
} from 'lucide-react';

// Enterprise-grade cryptographic interfaces
interface BlockchainTransaction {
  id: string;
  blockHash: string;
  transactionHash: string;
  timestamp: number;
  action: BlockchainAction;
  actor: ActorIdentity;
  resource: ResourceIdentifier;
  metadata: TransactionMetadata;
  signature: DigitalSignature;
  merkleProof: MerkleProof;
  gasUsed: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface BlockchainAction {
  type: 'photo_upload' | 'event_creation' | 'access_grant' | 'share_action' | 'metadata_update' | 'carbon_offset' | 'partnership_event';
  operation: string;
  permissions: string[];
  dataHash: string;
  previousHash?: string;
}

interface ActorIdentity {
  walletAddress: string;
  publicKey: string;
  identity: {
    userId: string;
    role: 'organizer' | 'photographer' | 'guest' | 'admin' | 'partner';
    organizationId?: string;
    certifications: string[];
  };
  authentication: {
    method: 'metamask' | 'wallet_connect' | 'enterprise_sso' | 'biometric';
    mfaEnabled: boolean;
    lastAuth: number;
  };
}

interface ResourceIdentifier {
  resourceType: 'photo' | 'event' | 'user_profile' | 'partnership' | 'carbon_credit';
  resourceId: string;
  contentHash: string;
  location: {
    storageProvider: string;
    region: string;
    encryption: EncryptionDetails;
  };
  compliance: ComplianceMetadata;
}

interface TransactionMetadata {
  ipfsHash?: string;
  fileSize?: number;
  mimeType?: string;
  geolocation?: GeoLocation;
  exifData?: ExifMetadata;
  privacyLevel: 'public' | 'private' | 'restricted' | 'confidential';
  retentionPolicy: RetentionPolicy;
  complianceFlags: string[];
}

interface DigitalSignature {
  algorithm: 'ECDSA' | 'RSA-PSS' | 'EdDSA';
  signature: string;
  publicKey: string;
  certificateChain?: string[];
  timestampAuthority?: string;
}

interface MerkleProof {
  root: string;
  leaf: string;
  path: string[];
  indices: number[];
}

interface EncryptionDetails {
  algorithm: 'AES-256-GCM' | 'ChaCha20-Poly1305';
  keyId: string;
  iv: string;
  authTag: string;
  hsmProtected: boolean;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  privacyRadius: number;
}

interface ExifMetadata {
  camera?: string;
  lens?: string;
  settings?: {
    iso: number;
    aperture: string;
    shutterSpeed: string;
  };
  timestamp: number;
  hash: string;
}

interface RetentionPolicy {
  retentionPeriod: number; // days
  autoDelete: boolean;
  archiveAfter: number; // days
  complianceRequirement: string[];
}

interface ComplianceMetadata {
  gdprApplicable: boolean;
  ccpaApplicable: boolean;
  sox404Applicable: boolean;
  iso27001Compliant: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  auditRequired: boolean;
}

interface SecurityMetrics {
  totalTransactions: number;
  uniqueActors: number;
  dataIntegrityScore: number; // 0-100
  complianceScore: number; // 0-100
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastSecurityScan: number;
  vulnerabilityCount: number;
  encryptionStrength: number;
}

interface AuditTrail {
  id: string;
  eventType: 'access' | 'modification' | 'deletion' | 'creation' | 'export' | 'share';
  severity: 'info' | 'warning' | 'error' | 'critical';
  actor: ActorIdentity;
  timestamp: number;
  resource: ResourceIdentifier;
  outcome: 'success' | 'failure' | 'partial';
  risk_score: number;
  forensicData: ForensicData;
}

interface ForensicData {
  ip_address: string;
  user_agent: string;
  session_id: string;
  device_fingerprint: string;
  geolocation: GeoLocation;
  network_path: string[];
  threat_intelligence: ThreatIntelligence;
}

interface ThreatIntelligence {
  reputation_score: number;
  known_threats: string[];
  anomaly_detection: AnomalyFlags;
  behavioral_analysis: BehavioralMetrics;
}

interface AnomalyFlags {
  unusual_access_pattern: boolean;
  geographic_anomaly: boolean;
  time_based_anomaly: boolean;
  volume_anomaly: boolean;
  device_change: boolean;
}

interface BehavioralMetrics {
  typing_patterns: number[];
  mouse_movements: number[];
  session_duration: number;
  page_interactions: number;
  risk_score: number;
}

export function BlockchainTraceability() {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalTransactions: 0,
    uniqueActors: 0,
    dataIntegrityScore: 0,
    complianceScore: 0,
    threatLevel: 'low',
    lastSecurityScan: Date.now(),
    vulnerabilityCount: 0,
    encryptionStrength: 256
  });
  const [auditTrail, setAuditTrail] = useState<AuditTrail[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'audit' | 'compliance' | 'security'>('overview');
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  useEffect(() => {
    initializeBlockchainSystem();
    
    if (realTimeMonitoring) {
      const interval = setInterval(() => {
        updateRealTimeMetrics();
        scanForThreats();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [realTimeMonitoring]);

  const initializeBlockchainSystem = useCallback(() => {
    // Initialize with enterprise-grade security parameters
    const mockTransactions: BlockchainTransaction[] = [
      {
        id: 'tx-001',
        blockHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        timestamp: Date.now() - 3600000,
        action: {
          type: 'photo_upload',
          operation: 'SECURE_UPLOAD',
          permissions: ['READ', 'SHARE_RESTRICTED'],
          dataHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          previousHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba'
        },
        actor: {
          walletAddress: '0x742d35Cc6C4C4F5e5b4e1e5c5d4c5b4a39291234',
          publicKey: '0x04a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd5b8dec5235a0fa8722476c7709c02559e3aa73aa03918ba2d492eea75abea235',
          identity: {
            userId: 'photographer-001',
            role: 'photographer',
            organizationId: 'creative-lens-studios',
            certifications: ['ISO27001', 'SOC2_TYPE_II', 'GDPR_CERTIFIED']
          },
          authentication: {
            method: 'enterprise_sso',
            mfaEnabled: true,
            lastAuth: Date.now() - 1800000
          }
        },
        resource: {
          resourceType: 'photo',
          resourceId: 'photo-uuid-001',
          contentHash: 'sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
          location: {
            storageProvider: 'AWS-S3-ENTERPRISE',
            region: 'us-east-1',
            encryption: {
              algorithm: 'AES-256-GCM',
              keyId: 'kms-key-001',
              iv: '0x123456789abcdef0',
              authTag: '0xfedcba0987654321',
              hsmProtected: true
            }
          },
          compliance: {
            gdprApplicable: true,
            ccpaApplicable: true,
            sox404Applicable: false,
            iso27001Compliant: true,
            dataClassification: 'confidential',
            auditRequired: true
          }
        },
        metadata: {
          ipfsHash: 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
          fileSize: 2457600,
          mimeType: 'image/jpeg',
          geolocation: {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 10,
            timestamp: Date.now() - 3600000,
            privacyRadius: 1000
          },
          privacyLevel: 'restricted',
          retentionPolicy: {
            retentionPeriod: 2555, // 7 years
            autoDelete: false,
            archiveAfter: 365,
            complianceRequirement: ['GDPR', 'CCPA', 'ISO27001']
          },
          complianceFlags: ['GDPR_CONSENT_VERIFIED', 'BIOMETRIC_CONSENT', 'LOCATION_CONSENT']
        },
        signature: {
          algorithm: 'ECDSA',
          signature: '0x30450221009f2b8c4e7e4d1c2b3a4567890abcdef1234567890abcdef1234567890abcdef12022000123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
          publicKey: '0x04a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd',
          certificateChain: ['cert-chain-001', 'cert-chain-002'],
          timestampAuthority: 'DigiCert-TSA'
        },
        merkleProof: {
          root: '0xmerkle_root_hash_001',
          leaf: '0xleaf_hash_001',
          path: ['0xproof_1', '0xproof_2', '0xproof_3'],
          indices: [0, 1, 1]
        },
        gasUsed: 21000,
        confirmations: 15,
        status: 'confirmed'
      }
    ];

    const mockAuditTrail: AuditTrail[] = [
      {
        id: 'audit-001',
        eventType: 'access',
        severity: 'info',
        actor: mockTransactions[0].actor,
        timestamp: Date.now() - 1800000,
        resource: mockTransactions[0].resource,
        outcome: 'success',
        risk_score: 15,
        forensicData: {
          ip_address: '203.0.113.195',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          session_id: 'sess_1234567890abcdef',
          device_fingerprint: 'fp_abcdef1234567890',
          geolocation: {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 50,
            timestamp: Date.now() - 1800000,
            privacyRadius: 500
          },
          network_path: ['router-001', 'firewall-002', 'load-balancer-003'],
          threat_intelligence: {
            reputation_score: 85,
            known_threats: [],
            anomaly_detection: {
              unusual_access_pattern: false,
              geographic_anomaly: false,
              time_based_anomaly: false,
              volume_anomaly: false,
              device_change: false
            },
            behavioral_analysis: {
              typing_patterns: [150, 175, 160, 140],
              mouse_movements: [1.2, 0.8, 1.5, 0.9],
              session_duration: 1800,
              page_interactions: 45,
              risk_score: 12
            }
          }
        }
      }
    ];

    setTransactions(mockTransactions);
    setAuditTrail(mockAuditTrail);
    setSecurityMetrics({
      totalTransactions: mockTransactions.length,
      uniqueActors: new Set(mockTransactions.map(t => t.actor.walletAddress)).size,
      dataIntegrityScore: 98.7,
      complianceScore: 94.2,
      threatLevel: 'low',
      lastSecurityScan: Date.now(),
      vulnerabilityCount: 2,
      encryptionStrength: 256
    });
  }, []);

  const updateRealTimeMetrics = useCallback(() => {
    setSecurityMetrics(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
      dataIntegrityScore: Math.max(90, Math.min(100, prev.dataIntegrityScore + (Math.random() - 0.5) * 2)),
      complianceScore: Math.max(85, Math.min(100, prev.complianceScore + (Math.random() - 0.5) * 1.5)),
      lastSecurityScan: Date.now()
    }));
  }, []);

  const scanForThreats = useCallback(() => {
    // Advanced threat detection simulation
    const threats = ['brute_force', 'sql_injection', 'xss_attempt', 'unauthorized_access'];
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    if (Math.random() < 0.1) { // 10% chance of threat detection
      console.warn(`🚨 Security Alert: ${randomThreat} detected and blocked`);
    }
  }, []);

  const getTransactionStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const selectedTx = transactions.find(tx => tx.id === selectedTransaction);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Shield className="text-blue-400" />
          <span>Enterprise Blockchain Traceability</span>
        </h3>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-xl text-sm font-medium ${getThreatLevelColor(securityMetrics.threatLevel)}`}>
            Threat Level: {securityMetrics.threatLevel.toUpperCase()}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={realTimeMonitoring}
              onChange={(e) => setRealTimeMonitoring(e.target.checked)}
              className="sr-only peer"
              aria-label="Toggle real-time monitoring"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm text-gray-300">Live Monitoring</span>
          </label>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-6">
        {['overview', 'transactions', 'audit', 'compliance', 'security'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Security Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{securityMetrics.totalTransactions}</p>
              <p className="text-sm text-gray-300">Blockchain Transactions</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{securityMetrics.uniqueActors}</p>
              <p className="text-sm text-gray-300">Verified Actors</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Fingerprint className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{securityMetrics.dataIntegrityScore.toFixed(1)}%</p>
              <p className="text-sm text-gray-300">Data Integrity</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{securityMetrics.complianceScore.toFixed(1)}%</p>
              <p className="text-sm text-gray-300">Compliance Score</p>
            </div>
          </div>

          {/* Enterprise Security Status */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="text-blue-400" />
              <h4 className="text-lg font-medium text-white">Enterprise Security Status</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Encryption Strength</span>
                  <span className="text-sm font-medium text-green-300">{securityMetrics.encryptionStrength}-bit AES</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">HSM Protection</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Multi-Factor Auth</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Certificate Pinning</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Zero-Trust Network</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">SIEM Integration</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Penetration Testing</span>
                  <span className="text-xs text-green-300">Weekly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Vulnerabilities</span>
                  <span className="text-xs text-yellow-300">{securityMetrics.vulnerabilityCount} Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="bg-black/20 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
              <Activity className="text-green-400" />
              <span>Real-time Security Feed</span>
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white">Blockchain transaction verified</span>
                </div>
                <span className="text-xs text-gray-400">Just now</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm text-white">Security scan completed - No threats</span>
                </div>
                <span className="text-xs text-gray-400">2m ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm text-white">Compliance audit - 94.2% score</span>
                </div>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`bg-black/20 rounded-xl p-4 border cursor-pointer transition-colors ${
                    selectedTransaction === transaction.id
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedTransaction(transaction.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        {getTransactionStatusIcon(transaction.status)}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{transaction.action.operation}</h5>
                        <p className="text-sm text-gray-400">{transaction.action.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-300">#{transaction.confirmations}</p>
                      <p className="text-xs text-gray-400">confirmations</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Gas Used</p>
                      <p className="text-sm text-white">{transaction.gasUsed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Block Hash</p>
                      <p className="text-sm text-white font-mono">{transaction.blockHash.slice(0, 16)}...</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>View Details</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction Details */}
            <div>
              {selectedTx ? (
                <div className="bg-black/20 rounded-xl p-4 border border-white/10 space-y-4">
                  <h5 className="font-medium text-white">Transaction Details</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Actor Identity</p>
                      <p className="text-sm text-white">{selectedTx.actor.identity.role}</p>
                      <p className="text-xs text-blue-300">{selectedTx.actor.walletAddress.slice(0, 20)}...</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Resource</p>
                      <p className="text-sm text-white">{selectedTx.resource.resourceType}</p>
                      <p className="text-xs text-gray-300">{selectedTx.resource.location.storageProvider}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Encryption</p>
                      <p className="text-sm text-green-300">{selectedTx.resource.location.encryption.algorithm}</p>
                      <div className="flex items-center space-x-1">
                        {selectedTx.resource.location.encryption.hsmProtected && (
                          <>
                            <Shield className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-300">HSM Protected</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400">Compliance</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTx.metadata.complianceFlags.map((flag) => (
                          <span key={flag} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                            {flag.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/20 rounded-xl p-8 border border-white/10 text-center">
                  <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a transaction to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional tabs would continue here... */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-red-400" />
              <h4 className="text-lg font-medium text-white">Critical Security Vulnerabilities Detected</h4>
            </div>
            
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-red-300 font-medium">CRITICAL: XSS Vulnerability</h5>
                    <p className="text-sm text-gray-400">ui/chart.tsx:79-89</p>
                  </div>
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">CRITICAL</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  dangerouslySetInnerHTML usage with unsanitized user input allows XSS attacks
                </p>
                <button 
                  type="button"
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                >
                  View Remediation
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-orange-300 font-medium">HIGH: Hardcoded Credentials</h5>
                    <p className="text-sm text-gray-400">SignInModal.tsx:17-18</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">HIGH</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Hardcoded credentials found in source code present authentication bypass risk
                </p>
                <button 
                  type="button"
                  className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg text-sm hover:bg-orange-500/30 transition-colors"
                >
                  View Remediation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {realTimeMonitoring && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 font-medium">Enterprise Security System Active</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Real-time blockchain monitoring, threat detection, and compliance scanning enabled. 
            Last security scan: {new Date(securityMetrics.lastSecurityScan).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}