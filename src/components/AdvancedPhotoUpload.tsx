import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Image, 
  Video, 
  Zap, 
  Users, 
  Shield, 
  Eye,
  Download,
  Clock,
  Brain,
  Archive,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdvancedPhotoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [compressionLevel, setArchiveionLevel] = useState('high');
  const [enableAITagging, setEnableAITagging] = useState(true);
  const [enableFacialClustering, setEnableFacialClustering] = useState(true);
  const [downloadPermissions, setDownloadPermissions] = useState('organizer-only');
  const [autoExpire, setAutoExpire] = useState(false);
  const [expireDays, setExpireDays] = useState('30');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      
      // Simulate compression and AI processing
      const compressionTime = compressionLevel === 'high' ? 2000 : 1000;
      const aiProcessingTime = enableAITagging ? 1500 : 0;
      const facialProcessingTime = enableFacialClustering ? 2000 : 0;
      
      // Simulate upload progress
      const totalSteps = 100;
      for (let step = 0; step <= totalSteps; step++) {
        setTimeout(() => {
          setUploadProgress((prevProgress) => {
            const fileProgress = ((i * totalSteps + step) / (files.length * totalSteps)) * 100;
            return Math.min(fileProgress, 100);
          });
        }, (step * (compressionTime + aiProcessingTime + facialProcessingTime)) / totalSteps);
      }

      // Add processed file to uploaded files
      setTimeout(() => {
        const processedFile = {
          id: Date.now() + i,
          name: file.name,
          type: isVideo ? 'video' : 'photo',
          size: file.size,
          originalSize: file.size,
          compressedSize: Math.floor(file.size * (compressionLevel === 'high' ? 0.3 : 0.6)),
          compressionRatio: compressionLevel === 'high' ? 70 : 40,
          aiTags: enableAITagging ? ['outdoor', 'group', 'celebration', 'sunset'] : [],
          facesDetected: enableFacialClustering ? Math.floor(Math.random() * 5) + 1 : 0,
          uploadedAt: new Date(),
          expiresAt: autoExpire ? new Date(Date.now() + parseInt(expireDays) * 24 * 60 * 60 * 1000) : null
        };

        setUploadedFiles(prev => [...prev, processedFile]);
      }, compressionTime + aiProcessingTime + facialProcessingTime);
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(100);
    }, (compressionTime + aiProcessingTime + facialProcessingTime) * files.length);
  }, [compressionLevel, enableAITagging, enableFacialClustering, autoExpire, expireDays]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Upload Settings
          </CardTitle>
          <CardDescription>
            Configure compression, AI features, and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Archiveion Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archiveion & Optimization
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Archiveion Level</Label>
                <Select value={compressionLevel} onValueChange={setArchiveionLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (40% reduction)</SelectItem>
                    <SelectItem value="high">High (70% reduction)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Processing
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-tagging</Label>
                  <p className="text-sm text-muted-foreground">Automatically detect objects, scenes, and activities</p>
                </div>
                <Switch checked={enableAITagging} onCheckedChange={setEnableAITagging} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Facial Clustering</Label>
                  <p className="text-sm text-muted-foreground">Group photos by people (private, no names stored)</p>
                </div>
                <Switch checked={enableFacialClustering} onCheckedChange={setEnableFacialClustering} />
              </div>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy & Control
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Download Permissions</Label>
                <Select value={downloadPermissions} onValueChange={setDownloadPermissions}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Everyone</SelectItem>
                    <SelectItem value="guests-only">Guests Only</SelectItem>
                    <SelectItem value="organizer-only">Organizer Only</SelectItem>
                    <SelectItem value="disabled">Downloads Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Auto-expire Content</Label>
                  <Switch checked={autoExpire} onCheckedChange={setAutoExpire} />
                </div>
                {autoExpire && (
                  <Select value={expireDays} onValueChange={setExpireDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Photos & Videos</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center gap-1">
                <Archive className="h-4 w-4" />
                Smart Archiveion
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4" />
                AI Enhanced
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              aria-label="Select photos and videos to upload"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing files...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground">
                Archiveing, analyzing, and encrypting your content...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Uploaded Content
            </CardTitle>
            <CardDescription>
              {uploadedFiles.length} files processed and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {file.type === 'video' ? (
                      <Video className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Image className="h-8 w-8 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.compressedSize)}</span>
                        <Badge variant="secondary">
                          {file.compressionRatio}% compressed
                        </Badge>
                        {file.facesDetected > 0 && (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {file.facesDetected} faces
                          </Badge>
                        )}
                        {file.expiresAt && (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeLeft(file.expiresAt)} left
                          </Badge>
                        )}
                      </div>
                      {file.aiTags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {file.aiTags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={downloadPermissions === 'disabled'}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedPhotoUpload;