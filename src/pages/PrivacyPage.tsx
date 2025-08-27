import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, Globe, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = "December 1, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-sm">
                  Last updated: {lastUpdated}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  GDPR Compliant
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Commitment */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Our Privacy Commitment</h3>
                <p className="text-green-800 text-sm">
                  Your privacy is fundamental to us. We're committed to protecting your personal information and being transparent about how we collect, use, and share your data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Database className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Minimal Data Collection</h3>
              <p className="text-sm text-gray-600">We only collect what's necessary to provide our service</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Lock className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Strong Encryption</h3>
              <p className="text-sm text-gray-600">All data is encrypted in transit and at rest</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <UserCheck className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">User Control</h3>
              <p className="text-sm text-gray-600">You control your data and can delete it anytime</p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">Information you provide directly:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account information (name, email, password)</li>
                <li>Profile information and preferences</li>
                <li>Photos and content you upload</li>
                <li>Communications with our support team</li>
              </ul>
              
              <h4 className="text-lg font-semibold mt-4">Information we collect automatically:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device information and IP address</li>
                <li>Usage patterns and feature interactions</li>
                <li>Technical data for service improvement</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and maintain our photo sharing service</li>
                <li>Process your photos and enable sharing features</li>
                <li>Send important account and service notifications</li>
                <li>Improve our service and develop new features</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">We DO NOT sell your personal information.</h4>
              <p>We may share your information only in these limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>With your explicit consent</li>
                <li>With service providers who assist in operations</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights and prevent abuse</li>
                <li>In connection with a business transfer</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We implement comprehensive security measures including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>End-to-end encryption for all data transmission</li>
                <li>Advanced encryption for data storage</li>
                <li>Regular security audits and monitoring</li>
                <li>Secure data centers with physical security</li>
                <li>Multi-factor authentication options</li>
                <li>Employee security training and access controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">You have the right to:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate information</li>
                <li><strong>Erasure:</strong> Delete your account and personal data</li>
                <li><strong>Portability:</strong> Export your data in a standard format</li>
                <li><strong>Restrict processing:</strong> Limit how we use your data</li>
                <li><strong>Object:</strong> Opt-out of certain data processing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Photo and Content Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">Your Photo Ownership:</h4>
              <p>You retain full ownership of all photos and content you upload. We never claim ownership of your content.</p>
              
              <h4 className="text-lg font-semibold mt-4">Sharing Controls:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>You control who can view your photos</li>
                <li>Set privacy levels for each album or event</li>
                <li>Create password-protected sharing links</li>
                <li>Control download permissions</li>
                <li>Remove access at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Authentication and account security</li>
                <li>Remembering your preferences</li>
                <li>Analytics to improve our service</li>
                <li>Essential website functionality</li>
              </ul>
              <p className="mt-4">You can control cookie settings through your browser preferences.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your data may be processed in countries other than your own. We ensure adequate protection through:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Standard contractual clauses</li>
                <li>Adequacy decisions from relevant authorities</li>
                <li>Appropriate safeguards and security measures</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this Privacy Policy to reflect changes in our practices or applicable laws. We will notify you of significant changes by:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Posting the updated policy on this page</li>
                <li>Sending email notifications for material changes</li>
                <li>Updating the "Last updated" date</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                For privacy-related questions or to exercise your rights, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-1"><strong>Privacy Officer:</strong> privacy@laurencephotohub.com</p>
                <p className="mb-1"><strong>Data Protection Officer:</strong> dpo@laurencephotohub.com</p>
                <p className="mb-1"><strong>Address:</strong> 123 Photo Street, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Footer */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}