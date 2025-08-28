import { createHash, createHmac, randomBytes, createCipher, createDecipher } from 'crypto';

// Enterprise Security Utilities
export interface SecurityConfig {
  encryptionAlgorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
  keyDerivation: 'pbkdf2' | 'scrypt' | 'argon2';
  hashAlgorithm: 'sha256' | 'sha384' | 'sha512';
  signatureAlgorithm: 'ecdsa' | 'rsa-pss' | 'ed25519';
  jwtAlgorithm: 'RS256' | 'ES256' | 'PS256';
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
  hsmEnabled: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'blocked';
  riskScore: number;
  ip: string;
  userAgent: string;
  geolocation?: {
    lat: number;
    lng: number;
    country: string;
  };
  threatIntelligence: {
    maliciousIP: boolean;
    vpnDetected: boolean;
    botDetected: boolean;
    reputationScore: number;
  };
}

export interface SecurityContext {
  userId: string;
  sessionId: string;
  permissions: string[];
  roles: string[];
  mfaVerified: boolean;
  lastActivity: number;
  deviceFingerprint: string;
  ipAddress: string;
  geoLocation: string;
}

// Default enterprise security configuration
export const ENTERPRISE_SECURITY_CONFIG: SecurityConfig = {
  encryptionAlgorithm: 'aes-256-gcm',
  keyDerivation: 'argon2',
  hashAlgorithm: 'sha256',
  signatureAlgorithm: 'ecdsa',
  jwtAlgorithm: 'ES256',
  sessionTimeout: 60, // 1 hour
  maxLoginAttempts: 3,
  passwordMinLength: 12,
  requireMFA: true,
  hsmEnabled: true
};

// Enterprise-grade input sanitization
export class InputSanitizer {
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script[\s>])<[^<]*)*<\/script[\s>][^>]*>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe[\s>])<[^<]*)*<\/iframe[\s>][^>]*>/gi,
    /<object\b[^<]*(?:(?!<\/object[\s>])<[^<]*)*<\/object[\s>][^>]*>/gi,
    /<embed\b[^<]*(?:(?!<\/embed[\s>])<[^<]*)*<\/embed[\s>][^>]*>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi
  ];

  private static readonly SQL_INJECTION_PATTERNS = [
    /('|(\\')|(;)|(\-\-)|(\|)|(%7C))/gi,
    /((union(.*?)select)|(union(.*?)all(.*?)select)|(select(.*?)from)|(insert(.*?)into)|(delete(.*?)from)|(drop(.*?)table))/gi
  ];

  private static readonly PATH_TRAVERSAL_PATTERNS = [
    /\.\.\//g,
    /\.\.\\/g,
    /%2e%2e%2f/gi,
    /%2e%2e\\/gi
  ];

  static sanitizeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove XSS patterns
    this.XSS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // HTML encode dangerous characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }

  static sanitizeSQL(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove SQL injection patterns
    this.SQL_INJECTION_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Escape single quotes
    sanitized = sanitized.replace(/'/g, "''");
    
    return sanitized;
  }

  static sanitizePath(input: string): string {
    if (typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove path traversal patterns
    this.PATH_TRAVERSAL_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Only allow alphanumeric, hyphens, underscores, and dots
    sanitized = sanitized.replace(/[^a-zA-Z0-9\-_\.]/g, '');
    
    return sanitized;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validateURL(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}

// Cryptographic utilities
export class CryptoUtils {
  static generateSecureHash(data: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'): string {
    return createHash(algorithm).update(data, 'utf8').digest('hex');
  }

  static generateHMAC(data: string, secret: string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'): string {
    return createHmac(algorithm, secret).update(data, 'utf8').digest('hex');
  }

  static generateSecureRandom(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  static hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const saltToUse = salt || this.generateSecureRandom(32);
    const hash = this.generateHMAC(password, saltToUse, 'sha256');
    return { hash, salt: saltToUse };
  }

  static verifyPassword(password: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hashPassword(password, salt);
    return this.constantTimeCompare(hash, computedHash);
  }

  // Constant-time comparison to prevent timing attacks
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
}

// Rate limiting and DDoS protection
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts || now > userAttempts.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userAttempts.count >= this.maxAttempts) {
      return false;
    }

    userAttempts.count++;
    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts || Date.now() > userAttempts.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - userAttempts.count);
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Session management with security features
export class SecureSessionManager {
  private sessions: Map<string, SecurityContext> = new Map();
  private config: SecurityConfig;

  constructor(config: SecurityConfig = ENTERPRISE_SECURITY_CONFIG) {
    this.config = config;
    
    // Clean up expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
  }

  createSession(userId: string, permissions: string[], roles: string[], deviceInfo: any): string {
    const sessionId = CryptoUtils.generateSecureRandom(64);
    const now = Date.now();

    const context: SecurityContext = {
      userId,
      sessionId,
      permissions,
      roles,
      mfaVerified: false,
      lastActivity: now,
      deviceFingerprint: this.generateDeviceFingerprint(deviceInfo),
      ipAddress: deviceInfo.ip || 'unknown',
      geoLocation: deviceInfo.country || 'unknown'
    };

    this.sessions.set(sessionId, context);
    return sessionId;
  }

  validateSession(sessionId: string, deviceInfo?: any): SecurityContext | null {
    const context = this.sessions.get(sessionId);
    if (!context) return null;

    const now = Date.now();
    const sessionAge = now - context.lastActivity;

    // Check session timeout
    if (sessionAge > this.config.sessionTimeout * 60 * 1000) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Update last activity
    context.lastActivity = now;

    // Verify device fingerprint if provided
    if (deviceInfo) {
      const currentFingerprint = this.generateDeviceFingerprint(deviceInfo);
      if (currentFingerprint !== context.deviceFingerprint) {
        // Potential session hijacking - invalidate session
        this.sessions.delete(sessionId);
        return null;
      }
    }

    return context;
  }

  invalidateSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  private generateDeviceFingerprint(deviceInfo: any): string {
    const fingerprint = JSON.stringify({
      userAgent: deviceInfo.userAgent || '',
      language: deviceInfo.language || '',
      timezone: deviceInfo.timezone || '',
      screen: deviceInfo.screen || '',
      plugins: deviceInfo.plugins || []
    });
    
    return CryptoUtils.generateSecureHash(fingerprint);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const timeout = this.config.sessionTimeout * 60 * 1000;

    for (const [sessionId, context] of this.sessions.entries()) {
      if (now - context.lastActivity > timeout) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Audit logging system
export class AuditLogger {
  private logs: AuditLog[] = [];
  private riskScoreThreshold = 75;

  constructor(private maxLogs: number = 10000) {}

  log(
    userId: string,
    sessionId: string,
    action: string,
    resource: string,
    result: 'success' | 'failure' | 'blocked',
    additionalData?: any
  ): void {
    const auditLog: AuditLog = {
      id: CryptoUtils.generateSecureRandom(16),
      timestamp: Date.now(),
      userId,
      sessionId,
      action,
      resource,
      result,
      riskScore: this.calculateRiskScore(action, result, additionalData),
      ip: additionalData?.ip || 'unknown',
      userAgent: additionalData?.userAgent || 'unknown',
      geolocation: additionalData?.geolocation,
      threatIntelligence: {
        maliciousIP: this.checkMaliciousIP(additionalData?.ip || ''),
        vpnDetected: this.detectVPN(additionalData?.ip || ''),
        botDetected: this.detectBot(additionalData?.userAgent || ''),
        reputationScore: this.calculateReputationScore(additionalData?.ip || '')
      }
    };

    this.logs.push(auditLog);

    // Trim logs if exceeding max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Trigger security alerts for high-risk activities
    if (auditLog.riskScore > this.riskScoreThreshold) {
      this.triggerSecurityAlert(auditLog);
    }
  }

  private calculateRiskScore(action: string, result: string, data?: any): number {
    let score = 0;

    // Base score by action type
    const actionScores: { [key: string]: number } = {
      'login_failed': 30,
      'multiple_login_attempts': 50,
      'password_change': 20,
      'data_export': 40,
      'admin_action': 60,
      'suspicious_access': 80
    };

    score += actionScores[action] || 10;

    // Result-based scoring
    if (result === 'failure') score += 20;
    if (result === 'blocked') score += 40;

    // IP reputation scoring
    if (data?.threatIntelligence?.maliciousIP) score += 50;
    if (data?.threatIntelligence?.vpnDetected) score += 30;

    return Math.min(100, score);
  }

  private checkMaliciousIP(ip: string): boolean {
    // In production, this would check against threat intelligence feeds
    const knownMaliciousIPs = ['10.0.0.1', '192.168.1.100'];
    return knownMaliciousIPs.includes(ip);
  }

  private detectVPN(ip: string): boolean {
    // In production, this would use VPN detection services
    return ip.startsWith('10.') || ip.startsWith('172.') || ip.startsWith('192.168.');
  }

  private detectBot(userAgent: string): boolean {
    const botPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i];
    return botPatterns.some(pattern => pattern.test(userAgent));
  }

  private calculateReputationScore(ip: string): number {
    // In production, this would integrate with threat intelligence services
    if (this.checkMaliciousIP(ip)) return 10;
    if (this.detectVPN(ip)) return 50;
    return 85; // Good reputation
  }

  private triggerSecurityAlert(log: AuditLog): void {
    console.warn(`🚨 HIGH RISK ACTIVITY DETECTED: ${log.action} by ${log.userId} (Risk Score: ${log.riskScore})`);
    
    // In production, this would:
    // - Send alerts to SIEM systems
    // - Notify security teams
    // - Trigger automated responses
    // - Update threat intelligence
  }

  getHighRiskLogs(): AuditLog[] {
    return this.logs.filter(log => log.riskScore > this.riskScoreThreshold);
  }

  getLogsByUser(userId: string): AuditLog[] {
    return this.logs.filter(log => log.userId === userId);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Content Security Policy generator
export class CSPGenerator {
  static generate(config: {
    allowInlineStyles?: boolean;
    allowInlineScripts?: boolean;
    trustedDomains?: string[];
    enableReporting?: boolean;
  } = {}): string {
    const directives: string[] = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' https:",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ];

    if (config.allowInlineStyles) {
      directives[2] += " 'unsafe-inline'";
    }

    if (config.allowInlineScripts) {
      directives[1] += " 'unsafe-inline'";
    }

    if (config.trustedDomains?.length) {
      const domains = config.trustedDomains.join(' ');
      directives[1] += ` ${domains}`;
      directives[2] += ` ${domains}`;
    }

    if (config.enableReporting) {
      directives.push("report-uri /api/csp-report");
      directives.push("report-to csp-endpoint");
    }

    return directives.join('; ');
  }
}

// Enterprise security middleware
export class SecurityMiddleware {
  private rateLimiter: RateLimiter;
  private sessionManager: SecureSessionManager;
  private auditLogger: AuditLogger;

  constructor(config?: SecurityConfig) {
    this.rateLimiter = new RateLimiter();
    this.sessionManager = new SecureSessionManager(config);
    this.auditLogger = new AuditLogger();
  }

  // Comprehensive security check
  validateRequest(request: {
    sessionId?: string;
    ip: string;
    userAgent: string;
    path: string;
    method: string;
    body?: any;
    headers: { [key: string]: string };
  }): {
    allowed: boolean;
    context?: SecurityContext;
    violations: string[];
    riskScore: number;
  } {
    const violations: string[] = [];
    let riskScore = 0;

    // Rate limiting
    if (!this.rateLimiter.isAllowed(request.ip)) {
      violations.push('Rate limit exceeded');
      riskScore += 50;
    }

    // Session validation
    let context: SecurityContext | null = null;
    if (request.sessionId) {
      context = this.sessionManager.validateSession(request.sessionId, {
        userAgent: request.userAgent,
        ip: request.ip
      });
      
      if (!context) {
        violations.push('Invalid or expired session');
        riskScore += 40;
      }
    }

    // Input validation
    if (request.body) {
      const sanitizedBody = this.sanitizeRequestBody(request.body);
      if (JSON.stringify(sanitizedBody) !== JSON.stringify(request.body)) {
        violations.push('Malicious input detected');
        riskScore += 60;
      }
    }

    // Header validation
    const suspiciousHeaders = this.checkSuspiciousHeaders(request.headers);
    if (suspiciousHeaders.length > 0) {
      violations.push(`Suspicious headers: ${suspiciousHeaders.join(', ')}`);
      riskScore += 30;
    }

    // Log the request
    this.auditLogger.log(
      context?.userId || 'anonymous',
      request.sessionId || 'none',
      `${request.method} ${request.path}`,
      request.path,
      violations.length > 0 ? 'blocked' : 'success',
      {
        ip: request.ip,
        userAgent: request.userAgent,
        riskScore,
        violations
      }
    );

    return {
      allowed: violations.length === 0,
      context: context || undefined,
      violations,
      riskScore
    };
  }

  private sanitizeRequestBody(body: any): any {
    if (typeof body === 'string') {
      return InputSanitizer.sanitizeHTML(body);
    }
    
    if (Array.isArray(body)) {
      return body.map(item => this.sanitizeRequestBody(item));
    }
    
    if (body && typeof body === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(body)) {
        sanitized[InputSanitizer.sanitizePath(key)] = this.sanitizeRequestBody(value);
      }
      return sanitized;
    }
    
    return body;
  }

  private checkSuspiciousHeaders(headers: { [key: string]: string }): string[] {
    const suspicious: string[] = [];
    
    // Check for common attack vectors in headers
    for (const [key, value] of Object.entries(headers)) {
      if (key.toLowerCase() === 'x-forwarded-for' && value.includes('script')) {
        suspicious.push(key);
      }
      
      if (key.toLowerCase() === 'referer' && !InputSanitizer.validateURL(value)) {
        suspicious.push(key);
      }
      
      if (value.includes('<script') || value.includes('javascript:')) {
        suspicious.push(key);
      }
    }
    
    return suspicious;
  }
}

// Global security instance
export const enterpriseSecurity = new SecurityMiddleware(ENTERPRISE_SECURITY_CONFIG);
export const inputSanitizer = InputSanitizer;
export const cryptoUtils = CryptoUtils;
export const cspGenerator = CSPGenerator;