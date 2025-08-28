import { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Users,
  Lock,
  Award,
  Globe,
  Database,
  AlertCircle
} from 'lucide-react';
import { penTestSuite } from '../utils/penetrationTesting';
import { enterpriseSecurity, cryptoUtils } from '../utils/enterpriseSecurity';

interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'under_review';
  lastAssessment: number;
  nextAssessment: number;
  score: number; // 0-100
  requirements: ComplianceRequirement[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  certificationExpiry?: number;
}

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'met' | 'not_met' | 'partial' | 'not_applicable';
  evidence: string[];
  lastVerified: number;
  assignee: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  automatedCheck: boolean;
}

interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: 'user_action' | 'system_event' | 'security_event' | 'compliance_check' | 'data_access' | 'configuration_change';
  severity: 'info' | 'warning' | 'error' | 'critical';
  userId: string;
  userName: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure' | 'blocked';
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  geolocation?: {
    country: string;
    region: string;
    city: string;
  };
  metadata: {
    [key: string]: any;
  };
  riskScore: number;
  complianceFlags: string[];
}

interface ComplianceMetrics {
  overallScore: number;
  frameworksCompliant: number;
  totalFrameworks: number;
  criticalIssues: number;
  pendingRemediation: number;
  dataRetentionCompliance: number;
  privacyControlsScore: number;
  securityControlsScore: number;
  auditReadiness: number;
}

interface DataRetentionPolicy {
  id: string;
  name: string;
  dataType: string;
  retentionPeriod: number; // days
  destructionMethod: 'secure_delete' | 'crypto_shred' | 'physical_destruction';
  legalHold: boolean;
  complianceFrameworks: string[];
  autoEnforced: boolean;
  lastReview: number;
  nextReview: number;
}

export function ComplianceAuditDashboard() {
  const [complianceFrameworks, setComplianceFrameworks] = useState<ComplianceFramework[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    overallScore: 0,
    frameworksCompliant: 0,
    totalFrameworks: 0,
    criticalIssues: 0,
    pendingRemediation: 0,
    dataRetentionCompliance: 0,
    privacyControlsScore: 0,
    securityControlsScore: 0,
    auditReadiness: 0
  });
  const [retentionPolicies, setRetentionPolicies] = useState<DataRetentionPolicy[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'frameworks' | 'audit' | 'retention' | 'reports'>('overview');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  useEffect(() => {
    initializeComplianceData();
    
    if (realTimeMonitoring) {
      const interval = setInterval(() => {
        updateRealTimeMetrics();
        generateNewAuditEvents();
      }, 10000); // Update every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [realTimeMonitoring]);

  const initializeComplianceData = useCallback(() => {
    const frameworks: ComplianceFramework[] = [
      {
        id: 'gdpr-2018',
        name: 'GDPR (General Data Protection Regulation)',
        version: '2018',
        status: 'compliant',
        lastAssessment: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        nextAssessment: Date.now() + 335 * 24 * 60 * 60 * 1000, // 335 days from now
        score: 94,
        riskLevel: 'low',
        requirements: [
          {
            id: 'gdpr-art-17',
            title: 'Right to be Forgotten',
            description: 'Users can request deletion of their personal data',
            status: 'met',
            evidence: ['User deletion endpoint', 'Data purging process', 'Audit logs'],
            lastVerified: Date.now() - 7 * 24 * 60 * 60 * 1000,
            assignee: 'Privacy Officer',
            priority: 'high',
            automatedCheck: true
          },
          {
            id: 'gdpr-art-32',
            title: 'Security of Processing',
            description: 'Appropriate technical and organizational measures',
            status: 'met',
            evidence: ['Encryption implementation', 'Access controls', 'Security audit'],
            lastVerified: Date.now() - 14 * 24 * 60 * 60 * 1000,
            assignee: 'Security Team',
            priority: 'critical',
            automatedCheck: true
          }
        ]
      },
      {
        id: 'ccpa-2020',
        name: 'CCPA (California Consumer Privacy Act)',
        version: '2020',
        status: 'compliant',
        lastAssessment: Date.now() - 45 * 24 * 60 * 60 * 1000,
        nextAssessment: Date.now() + 320 * 24 * 60 * 60 * 1000,
        score: 91,
        riskLevel: 'low',
        requirements: [
          {
            id: 'ccpa-1798.110',
            title: 'Right to Know',
            description: 'Consumers have right to know about personal information collection',
            status: 'met',
            evidence: ['Privacy policy', 'Data collection disclosure', 'User portal'],
            lastVerified: Date.now() - 10 * 24 * 60 * 60 * 1000,
            assignee: 'Legal Team',
            priority: 'high',
            automatedCheck: false
          }
        ]
      },
      {
        id: 'sox-404',
        name: 'Sarbanes-Oxley Act Section 404',
        version: '2002',
        status: 'partial',
        lastAssessment: Date.now() - 60 * 24 * 60 * 60 * 1000,
        nextAssessment: Date.now() + 90 * 24 * 60 * 60 * 1000,
        score: 78,
        riskLevel: 'medium',
        requirements: [
          {
            id: 'sox-404-icfr',
            title: 'Internal Controls over Financial Reporting',
            description: 'Adequate internal control structure and procedures',
            status: 'partial',
            evidence: ['Financial controls documentation', 'Audit trail logs'],
            lastVerified: Date.now() - 30 * 24 * 60 * 60 * 1000,
            assignee: 'Finance Team',
            priority: 'high',
            automatedCheck: true
          }
        ]
      },
      {
        id: 'iso-27001',
        name: 'ISO 27001 Information Security',
        version: '2013',
        status: 'compliant',
        lastAssessment: Date.now() - 90 * 24 * 60 * 60 * 1000,
        nextAssessment: Date.now() + 275 * 24 * 60 * 60 * 1000,
        score: 96,
        riskLevel: 'low',
        certificationExpiry: Date.now() + 700 * 24 * 60 * 60 * 1000,
        requirements: [
          {
            id: 'iso-a.9.1.1',
            title: 'Access Control Policy',
            description: 'Access control policy should be established',
            status: 'met',
            evidence: ['Access control policy document', 'RBAC implementation'],
            lastVerified: Date.now() - 5 * 24 * 60 * 60 * 1000,
            assignee: 'CISO',
            priority: 'critical',
            automatedCheck: true
          }
        ]
      },
      {
        id: 'pci-dss',
        name: 'PCI DSS (Payment Card Industry Data Security Standard)',
        version: '4.0',
        status: 'under_review',
        lastAssessment: Date.now() - 20 * 24 * 60 * 60 * 1000,
        nextAssessment: Date.now() + 10 * 24 * 60 * 60 * 1000,
        score: 85,
        riskLevel: 'medium',
        requirements: [
          {
            id: 'pci-req-3',
            title: 'Protect Stored Cardholder Data',
            description: 'Encryption of cardholder data at rest',
            status: 'met',
            evidence: ['Encryption implementation', 'Key management procedures'],
            lastVerified: Date.now() - 3 * 24 * 60 * 60 * 1000,
            assignee: 'Payment Security Team',
            priority: 'critical',
            automatedCheck: true
          }
        ]
      }
    ];

    const mockAuditEvents: AuditEvent[] = [
      {
        id: cryptoUtils.generateSecureRandom(16),
        timestamp: Date.now() - 3600000,
        eventType: 'user_action',
        severity: 'info',
        userId: 'user-001',
        userName: 'john.doe@company.com',
        action: 'PHOTO_UPLOAD',
        resource: '/api/photos/upload',
        outcome: 'success',
        ipAddress: '203.0.113.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        sessionId: 'sess_abc123',
        geolocation: {
          country: 'United States',
          region: 'California',
          city: 'San Francisco'
        },
        metadata: {
          fileSize: 2457600,
          mimeType: 'image/jpeg',
          encryptionUsed: true
        },
        riskScore: 15,
        complianceFlags: ['GDPR_CONSENT_VERIFIED', 'DATA_ENCRYPTED']
      },
      {
        id: cryptoUtils.generateSecureRandom(16),
        timestamp: Date.now() - 7200000,
        eventType: 'security_event',
        severity: 'warning',
        userId: 'system',
        userName: 'Security Monitor',
        action: 'FAILED_LOGIN_ATTEMPT',
        resource: '/api/auth/login',
        outcome: 'blocked',
        ipAddress: '198.51.100.42',
        userAgent: 'curl/7.68.0',
        sessionId: 'none',
        geolocation: {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown'
        },
        metadata: {
          attemptCount: 5,
          blocked: true,
          suspiciousActivity: true
        },
        riskScore: 75,
        complianceFlags: ['SECURITY_INCIDENT', 'AUTO_BLOCKED']
      }
    ];

    const mockRetentionPolicies: DataRetentionPolicy[] = [
      {
        id: 'policy-photos',
        name: 'Photo Data Retention',
        dataType: 'User Photos',
        retentionPeriod: 2555, // 7 years
        destructionMethod: 'crypto_shred',
        legalHold: false,
        complianceFrameworks: ['GDPR', 'CCPA', 'SOX'],
        autoEnforced: true,
        lastReview: Date.now() - 90 * 24 * 60 * 60 * 1000,
        nextReview: Date.now() + 275 * 24 * 60 * 60 * 1000
      },
      {
        id: 'policy-audit-logs',
        name: 'Audit Log Retention',
        dataType: 'System Audit Logs',
        retentionPeriod: 3650, // 10 years
        destructionMethod: 'secure_delete',
        legalHold: false,
        complianceFrameworks: ['SOX', 'ISO27001'],
        autoEnforced: true,
        lastReview: Date.now() - 30 * 24 * 60 * 60 * 1000,
        nextReview: Date.now() + 335 * 24 * 60 * 60 * 1000
      }
    ];

    setComplianceFrameworks(frameworks);
    setAuditEvents(mockAuditEvents);
    setRetentionPolicies(mockRetentionPolicies);
    
    // Calculate metrics
    const compliantFrameworks = frameworks.filter(f => f.status === 'compliant').length;
    const avgScore = frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length;
    const criticalIssues = frameworks.reduce((sum, f) => 
      sum + f.requirements.filter(r => r.status === 'not_met' && r.priority === 'critical').length, 0
    );
    
    setMetrics({
      overallScore: Math.round(avgScore),
      frameworksCompliant: compliantFrameworks,
      totalFrameworks: frameworks.length,
      criticalIssues,
      pendingRemediation: frameworks.reduce((sum, f) => 
        sum + f.requirements.filter(r => r.status === 'not_met' || r.status === 'partial').length, 0
      ),
      dataRetentionCompliance: 98,
      privacyControlsScore: 94,
      securityControlsScore: 96,
      auditReadiness: 92
    });
  }, []);

  const updateRealTimeMetrics = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      overallScore: Math.max(85, Math.min(100, prev.overallScore + (Math.random() - 0.5) * 2)),
      auditReadiness: Math.max(80, Math.min(100, prev.auditReadiness + (Math.random() - 0.5) * 1.5))
    }));
  }, []);

  const generateNewAuditEvents = useCallback(() => {
    if (Math.random() < 0.3) { // 30% chance of new event
      const newEvent: AuditEvent = {
        id: cryptoUtils.generateSecureRandom(16),
        timestamp: Date.now(),
        eventType: 'user_action',
        severity: 'info',
        userId: `user-${Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % 1000)}`,
        userName: 'system.user@company.com',
        action: 'DATA_ACCESS',
        resource: '/api/data/access',
        outcome: 'success',
        ipAddress: '203.0.113.' + Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % 255),
        userAgent: 'Enterprise App v1.0',
        sessionId: `sess_${cryptoUtils.generateSecureRandom(8)}`,
        metadata: {
          automated: true,
          realTime: true
        },
        riskScore: Math.floor(Math.random() * 30) + 10,
        complianceFlags: ['AUTOMATED_EVENT']
      };
      
      setAuditEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep latest 100 events
    }
  }, []);

  const getFrameworkStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-400 bg-green-500/20';
      case 'non_compliant': return 'text-red-400 bg-red-500/20';
      case 'partial': return 'text-yellow-400 bg-yellow-500/20';
      case 'under_review': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const exportAuditLogs = () => {
    const csvContent = auditEvents.map(event => 
      `"${event.timestamp}","${event.eventType}","${event.severity}","${event.userId}","${event.action}","${event.outcome}","${event.ipAddress}","${event.riskScore}"`
    ).join('\n');
    
    const blob = new Blob([`Timestamp,Event Type,Severity,User ID,Action,Outcome,IP Address,Risk Score\n${csvContent}`], 
      { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAuditEvents = auditEvents.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.resource.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Shield className="text-blue-400" />
          <span>Enterprise Compliance & Audit Dashboard</span>
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20 text-sm"
            aria-label="Select time range for compliance data"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={realTimeMonitoring}
              onChange={(e) => setRealTimeMonitoring(e.target.checked)}
              className="sr-only peer"
              aria-label="Toggle real-time compliance monitoring"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-2 text-sm text-gray-300">Real-time</span>
          </label>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white/10 rounded-xl p-1 mb-6">
        {['overview', 'frameworks', 'audit', 'retention', 'reports'].map((tab) => (
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
          {/* Compliance Metrics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{metrics.overallScore}%</p>
              <p className="text-sm text-gray-300">Overall Compliance</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{metrics.frameworksCompliant}/{metrics.totalFrameworks}</p>
              <p className="text-sm text-gray-300">Compliant Frameworks</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{metrics.criticalIssues}</p>
              <p className="text-sm text-gray-300">Critical Issues</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{metrics.auditReadiness}%</p>
              <p className="text-sm text-gray-300">Audit Readiness</p>
            </div>
          </div>

          {/* Compliance Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-medium text-white mb-4">Framework Status</h4>
              <div className="space-y-3">
                {complianceFrameworks.slice(0, 5).map((framework) => (
                  <div key={framework.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="text-sm text-white">{framework.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">{framework.score}%</span>
                      <span className={`px-2 py-1 rounded text-xs ${getFrameworkStatusColor(framework.status)}`}>
                        {framework.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-medium text-white mb-4">Recent Security Events</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {auditEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    {getSeverityIcon(event.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{event.action}</p>
                      <p className="text-xs text-gray-400">{event.userName} • {new Date(event.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.outcome === 'success' ? 'bg-green-500/20 text-green-300' :
                      event.outcome === 'failure' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {event.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Compliance Issues */}
          {metrics.criticalIssues > 0 && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <XCircle className="text-red-400" />
                <h4 className="text-lg font-medium text-white">Critical Compliance Issues</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceFrameworks.flatMap(framework => 
                  framework.requirements
                    .filter(req => req.status === 'not_met' && req.priority === 'critical')
                    .map(req => (
                      <div key={req.id} className="bg-black/20 rounded-lg p-4">
                        <h5 className="text-red-300 font-medium mb-2">{req.title}</h5>
                        <p className="text-sm text-gray-300 mb-3">{req.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Assignee: {req.assignee}</span>
                          <button 
                            type="button"
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Remediate
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Audit Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audit events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:border-blue-500 transition-colors"
                />
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
                aria-label="Filter audit events by severity"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
            <button
              type="button"
              onClick={exportAuditLogs}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>

          {/* Audit Events Table */}
          <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-black/40 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Timestamp</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Severity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Action</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Outcome</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Risk</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditEvents.map((event) => (
                    <tr key={event.id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3 text-sm text-white">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(event.severity)}
                          <span className="text-sm text-gray-300 capitalize">{event.severity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white truncate max-w-32">{event.userName}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{event.action}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.outcome === 'success' ? 'bg-green-500/20 text-green-300' :
                          event.outcome === 'failure' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {event.outcome}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${
                          event.riskScore >= 70 ? 'text-red-400' :
                          event.riskScore >= 40 ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {event.riskScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300 font-mono">{event.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Monitoring Status */}
      {realTimeMonitoring && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 font-medium">Real-time Compliance Monitoring Active</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Continuously monitoring for compliance violations, audit events, and security incidents. 
            Overall compliance score: {metrics.overallScore}% • Audit readiness: {metrics.auditReadiness}%
          </p>
        </div>
      )}
    </div>
  );
}