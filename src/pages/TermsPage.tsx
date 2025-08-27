import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = "December 1, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-blue-600 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-sm">
                  Last updated: {lastUpdated}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  Version 2.1
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Important Notice</h3>
                <p className="text-orange-800 text-sm">
                  By using Laurence Photo Hub, you agree to be bound by these Terms of Service. 
                  Please read them carefully before using our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using Laurence Photo Hub ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Laurence Photo Hub is a photo sharing and management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Upload, organize, and share photos</li>
                <li>Create and manage photo events</li>
                <li>Collaborate with other users on photo collections</li>
                <li>Access advanced photo management tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">Your Content</h4>
              <p>
                You retain ownership of all photos and content you upload. By uploading content, you grant us a limited, non-exclusive license to store, display, and distribute your content as necessary to provide the Service.
              </p>
              
              <h4 className="text-lg font-semibold mt-4">Our Content</h4>
              <p>
                The Service and its original content, features, and functionality are owned by Laurence Photo Hub and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Upload illegal, harmful, or inappropriate content</li>
                <li>Violate any intellectual property rights</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Spam or engage in unauthorized commercial activities</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Use the Service for any unlawful purpose</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using the Service, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Subscription and Billing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4 className="text-lg font-semibold">Free and Premium Services</h4>
              <p>
                We offer both free and premium subscription plans. Premium features require a paid subscription.
              </p>
              
              <h4 className="text-lg font-semibold mt-4">Billing</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Subscriptions are billed in advance</li>
                <li>All fees are non-refundable unless required by law</li>
                <li>We may change our pricing with 30 days notice</li>
                <li>You may cancel your subscription at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Either party may terminate this agreement at any time. We may suspend or terminate your account if you violate these terms. Upon termination, your right to use the Service will cease immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Disclaimers and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
              </p>
              <p>
                IN NO EVENT SHALL LAURENCE PHOTO HUB BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-1"><strong>Email:</strong> legal@laurencephotohub.com</p>
                <p className="mb-1"><strong>Address:</strong> 123 Photo Street, San Francisco, CA 94105</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Legal Compliance</span>
          </div>
          <p className="text-sm text-gray-600">
            These terms are governed by the laws of California, United States. Any disputes will be resolved in the courts of San Francisco County, California.
          </p>
        </div>
      </div>
    </div>
  );
}