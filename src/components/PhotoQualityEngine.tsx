import { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  Eye, 
  Brain, 
  Zap, 
  Trash2, 
  Copy,
  Image,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scan,
  Filter,
  Settings,
  TrendingDown,
  TrendingUp,
  Target,
  Layers,
  Focus,
  Sparkles,
  Download,
  Archive,
  Shuffle,
  BarChart3,
  Camera,
  Search
} from 'lucide-react';

interface PhotoAnalysis {
  id: string;
  url: string;
  filename: string;
  uploadedAt: Date;
  size: number;
  dimensions: { width: number; height: number };
  qualityScore: number;
  blurScore: number;
  brightnessScore: number;
  contrastScore: number;
  colorScore: number;
  compositionScore: number;
  duplicateGroup?: string;
  similarityScore?: number;
  issues: string[];
  recommendations: string[];
  status: 'keep' | 'review' | 'delete';
  confidence: number;
}

interface DuplicateGroup {
  id: string;
  photos: PhotoAnalysis[];
  bestPhoto: PhotoAnalysis;
  averageQuality: number;
  totalSize: number;
  potentialSavings: number;
}

interface QualityMetrics {
  totalPhotos: number;
  highQuality: number;
  mediumQuality: number;
  lowQuality: number;
  duplicates: number;
  blurryPhotos: number;
  potentialSavings: number;
  averageQuality: number;
}

const PhotoQualityEngine = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [photos, setPhotos] = useState<PhotoAnalysis[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'duplicates' | 'quality' | 'recommendations'>('overview');
  const [qualityThreshold, setQualityThreshold] = useState([6.5]);
  const [blurThreshold, setBlurThreshold] = useState([4.0]);
  const [duplicateSensitivity, setDuplicateSensitivity] = useState('medium');
  const [autoDelete, setAutoDelete] = useState(false);
  const [preserveBest, setPreserveBest] = useState(true);
  const [advancedAnalysis, setAdvancedAnalysis] = useState(true);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  const mockPhotos: PhotoAnalysis[] = [
    {
      id: '1',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      filename: 'wedding_ceremony_01.jpg',
      uploadedAt: new Date(Date.now() - 3600000),
      size: 2048576,
      dimensions: { width: 4032, height: 3024 },
      qualityScore: 8.7,
      blurScore: 8.9,
      brightnessScore: 8.2,
      contrastScore: 8.5,
      colorScore: 9.1,
      compositionScore: 8.8,
      duplicateGroup: 'group1',
      similarityScore: 0.92,
      issues: [],
      recommendations: ['Consider slight brightness adjustment'],
      status: 'keep',
      confidence: 0.94
    },
    {
      id: '2',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      filename: 'wedding_ceremony_02.jpg',
      uploadedAt: new Date(Date.now() - 3580000),
      size: 1887435,
      dimensions: { width: 4032, height: 3024 },
      qualityScore: 8.4,
      blurScore: 8.6,
      brightnessScore: 7.9,
      contrastScore: 8.2,
      colorScore: 8.8,
      compositionScore: 8.5,
      duplicateGroup: 'group1',
      similarityScore: 0.92,
      issues: ['Slightly underexposed'],
      recommendations: ['Increase brightness', 'Enhance contrast'],
      status: 'review',
      confidence: 0.89
    },
    {
      id: '3',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      filename: 'reception_dance_blur.jpg',
      uploadedAt: new Date(Date.now() - 1800000),
      size: 1456789,
      dimensions: { width: 3024, height: 4032 },
      qualityScore: 3.2,
      blurScore: 2.1,
      brightnessScore: 6.5,
      contrastScore: 5.8,
      colorScore: 7.2,
      compositionScore: 6.0,
      issues: ['Motion blur detected', 'Low sharpness'],
      recommendations: ['Consider deletion', 'Check for better alternatives'],
      status: 'delete',
      confidence: 0.91
    },
    {
      id: '4',
      url: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'),
      filename: 'group_photo_perfect.jpg',
      uploadedAt: new Date(Date.now() - 900000),
      size: 3245678,
      dimensions: { width: 6000, height: 4000 },
      qualityScore: 9.5,
      blurScore: 9.8,
      brightnessScore: 9.2,
      contrastScore: 9.4,
      colorScore: 9.6,
      compositionScore: 9.7,
      issues: [],
      recommendations: ['Perfect quality - keep as is'],
      status: 'keep',
      confidence: 0.98
    },
    {
      id: '5',
      url: getImagePath('/uploads/dabbf929-5dd0-4794-a011-fe43bf4b3418.png'),
      filename: 'duplicate_test.jpg',
      uploadedAt: new Date(Date.now() - 600000),
      size: 2156789,
      dimensions: { width: 4032, height: 3024 },
      qualityScore: 7.8,
      blurScore: 8.1,
      brightnessScore: 7.6,
      contrastScore: 8.0,
      colorScore: 8.3,
      compositionScore: 7.9,
      duplicateGroup: 'group2',
      similarityScore: 0.96,
      issues: ['Near duplicate detected'],
      recommendations: ['Compare with similar photos'],
      status: 'review',
      confidence: 0.87
    }
  ];

  useEffect(() => {
    setPhotos(mockPhotos);
    generateDuplicateGroups();
    calculateMetrics();
  }, []);

  const generateDuplicateGroups = () => {
    const groups = new Map<string, PhotoAnalysis[]>();
    
    mockPhotos.forEach(photo => {
      if (photo.duplicateGroup) {
        if (!groups.has(photo.duplicateGroup)) {
          groups.set(photo.duplicateGroup, []);
        }
        groups.get(photo.duplicateGroup)!.push(photo);
      }
    });

    const duplicateGroups: DuplicateGroup[] = Array.from(groups.entries()).map(([id, photos]) => {
      const bestPhoto = photos.reduce((best, current) => 
        current.qualityScore > best.qualityScore ? current : best
      );
      
      return {
        id,
        photos,
        bestPhoto,
        averageQuality: photos.reduce((sum, p) => sum + p.qualityScore, 0) / photos.length,
        totalSize: photos.reduce((sum, p) => sum + p.size, 0),
        potentialSavings: photos.filter(p => p.id !== bestPhoto.id).reduce((sum, p) => sum + p.size, 0)
      };
    });

    setDuplicateGroups(duplicateGroups);
  };

  const calculateMetrics = () => {
    const metrics: QualityMetrics = {
      totalPhotos: mockPhotos.length,
      highQuality: mockPhotos.filter(p => p.qualityScore >= 8).length,
      mediumQuality: mockPhotos.filter(p => p.qualityScore >= 6 && p.qualityScore < 8).length,
      lowQuality: mockPhotos.filter(p => p.qualityScore < 6).length,
      duplicates: mockPhotos.filter(p => p.duplicateGroup).length,
      blurryPhotos: mockPhotos.filter(p => p.blurScore < 5).length,
      potentialSavings: duplicateGroups.reduce((sum, g) => sum + g.potentialSavings, 0),
      averageQuality: mockPhotos.reduce((sum, p) => sum + p.qualityScore, 0) / mockPhotos.length
    };

    setQualityMetrics(metrics);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const steps = [
      { name: 'Loading photo metadata...', duration: 1000 },
      { name: 'Analyzing image sharpness...', duration: 2500 },
      { name: 'Detecting motion blur...', duration: 2000 },
      { name: 'Computing perceptual hashes...', duration: 1500 },
      { name: 'Finding duplicate clusters...', duration: 2000 },
      { name: 'Evaluating composition quality...', duration: 1800 },
      { name: 'Generating recommendations...', duration: 1200 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setAnalysisProgress(((i + 1) / steps.length) * 100);
    }

    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 8) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 6) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'keep': return 'bg-green-100 text-green-800 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            Photo Quality Engine
          </CardTitle>
          <CardDescription>
            AI-powered duplicate detection and quality analysis for photo optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quality Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quality Thresholds
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Quality Score: {qualityThreshold[0]}/10</Label>
                  <Slider
                    value={qualityThreshold}
                    onValueChange={setQualityThreshold}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blur Detection Sensitivity: {blurThreshold[0]}/10</Label>
                  <Slider
                    value={blurThreshold}
                    onValueChange={setBlurThreshold}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duplicate Sensitivity</Label>
                  <Select value={duplicateSensitivity} onValueChange={setDuplicateSensitivity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (only exact matches)</SelectItem>
                      <SelectItem value="medium">Medium (similar photos)</SelectItem>
                      <SelectItem value="high">High (minor variations)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Processing Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Processing Options
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Advanced Analysis</Label>
                    <p className="text-sm text-muted-foreground">Include composition and color analysis</p>
                  </div>
                  <Switch checked={advancedAnalysis} onCheckedChange={setAdvancedAnalysis} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Preserve Best Photos</Label>
                    <p className="text-sm text-muted-foreground">Keep highest quality from duplicate groups</p>
                  </div>
                  <Switch checked={preserveBest} onCheckedChange={setPreserveBest} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Delete Low Quality</Label>
                    <p className="text-sm text-muted-foreground">Automatically remove photos below threshold</p>
                  </div>
                  <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
                </div>

                <div className="text-center">
                  <Button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Scan className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze Photos
                      </>
                    )}
                  </Button>
                  
                  {isAnalyzing && (
                    <div className="mt-4 space-y-2">
                      <Progress value={analysisProgress} />
                      <p className="text-sm text-muted-foreground">
                        Processing {photos.length} photos with AI analysis...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {qualityMetrics && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-electric-blue" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
                <TabsTrigger value="quality">Quality Issues</TabsTrigger>
                <TabsTrigger value="recommendations">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-electric-blue" />
                      <p className="text-2xl font-bold">{qualityMetrics.totalPhotos}</p>
                      <p className="text-sm text-muted-foreground">Total Photos</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-2xl font-bold">{qualityMetrics.highQuality}</p>
                      <p className="text-sm text-muted-foreground">High Quality</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Copy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                      <p className="text-2xl font-bold">{qualityMetrics.duplicates}</p>
                      <p className="text-sm text-muted-foreground">Duplicates</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Focus className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p className="text-2xl font-bold">{qualityMetrics.blurryPhotos}</p>
                      <p className="text-sm text-muted-foreground">Blurry Photos</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quality Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quality Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span>High Quality (8-10)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{qualityMetrics.highQuality}</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(qualityMetrics.highQuality / qualityMetrics.totalPhotos) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                          <span>Medium Quality (6-8)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{qualityMetrics.mediumQuality}</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${(qualityMetrics.mediumQuality / qualityMetrics.totalPhotos) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span>Low Quality (&lt;6)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{qualityMetrics.lowQuality}</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${(qualityMetrics.lowQuality / qualityMetrics.totalPhotos) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Average Quality Score</h4>
                          <p className="text-sm text-muted-foreground">Overall photo collection quality</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{qualityMetrics.averageQuality.toFixed(1)}/10</p>
                          <Badge variant="outline" className={getQualityColor(qualityMetrics.averageQuality)}>
                            {qualityMetrics.averageQuality >= 8 ? 'Excellent' : 
                             qualityMetrics.averageQuality >= 6 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="duplicates" className="space-y-4">
                {duplicateGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Duplicate Group {group.id.toUpperCase()}
                        </CardTitle>
                        <Badge variant="outline">
                          {formatFileSize(group.potentialSavings)} savings
                        </Badge>
                      </div>
                      <CardDescription>
                        {group.photos.length} similar photos • Average quality: {group.averageQuality.toFixed(1)}/10
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.photos.map((photo) => (
                          <div key={photo.id} className={`border rounded-lg overflow-hidden ${photo.id === group.bestPhoto.id ? 'ring-2 ring-electric-blue' : ''}`}>
                            <div className="aspect-video relative">
                              <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                              {photo.id === group.bestPhoto.id && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-electric-blue">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Best
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-medium text-sm truncate">{photo.filename}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                  {getQualityIcon(photo.qualityScore)}
                                  <span className="text-sm">{photo.qualityScore.toFixed(1)}/10</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {formatFileSize(photo.size)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => togglePhotoSelection(photo.id)}
                                  className={selectedPhotos.has(photo.id) ? 'bg-electric-blue text-white' : ''}
                                >
                                  {selectedPhotos.has(photo.id) ? 'Selected' : 'Select'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="quality" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.filter(photo => photo.issues.length > 0).map((photo) => (
                    <Card key={photo.id}>
                      <div className="aspect-video relative">
                        <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover rounded-t-lg" />
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className={getStatusColor(photo.status)}>
                            {photo.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{photo.filename}</h3>
                        <div className="flex items-center gap-2 mt-2 mb-3">
                          {getQualityIcon(photo.qualityScore)}
                          <span className="text-sm">Quality: {photo.qualityScore.toFixed(1)}/10</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            {(photo.confidence * 100).toFixed(0)}% confident
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium text-red-600 mb-1">Issues:</h4>
                            <ul className="text-xs space-y-1">
                              {photo.issues.map((issue, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                  {issue}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-blue-600 mb-1">Recommendations:</h4>
                            <ul className="text-xs space-y-1">
                              {photo.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-blue-500" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => togglePhotoSelection(photo.id)}
                            className={selectedPhotos.has(photo.id) ? 'bg-electric-blue text-white' : ''}
                          >
                            {selectedPhotos.has(photo.id) ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Recommended Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhotos.size} photos selected for batch operations
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedPhotos(new Set())}>
                      Clear Selection
                    </Button>
                    <Button variant="outline">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Select All Low Quality
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Trash2 className="h-12 w-12 mx-auto mb-4 text-red-500" />
                      <h3 className="font-semibold mb-2">Delete Low Quality</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Remove {photos.filter(p => p.status === 'delete').length} photos below quality threshold
                      </p>
                      <Badge variant="secondary" className="mb-4">
                        Save {formatFileSize(photos.filter(p => p.status === 'delete').reduce((sum, p) => sum + p.size, 0))}
                      </Badge>
                      <br />
                      <Button variant="destructive" size="sm" className="mt-2">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Archive className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                      <h3 className="font-semibold mb-2">Archive Duplicates</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Keep best from each duplicate group, archive {duplicateGroups.reduce((sum, g) => sum + g.photos.length - 1, 0)} others
                      </p>
                      <Badge variant="secondary" className="mb-4">
                        Save {formatFileSize(duplicateGroups.reduce((sum, g) => sum + g.potentialSavings, 0))}
                      </Badge>
                      <br />
                      <Button variant="outline" size="sm" className="mt-2">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive Duplicates
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Download className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="font-semibold mb-2">Export Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Download detailed analysis report with all recommendations
                      </p>
                      <Badge variant="secondary" className="mb-4">
                        {photos.length} photos analyzed
                      </Badge>
                      <br />
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoQualityEngine;