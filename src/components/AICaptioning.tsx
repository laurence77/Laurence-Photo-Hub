import { useState, useEffect, useRef } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  MessageCircle,
  Heart,
  Laugh,
  Coffee,
  Crown,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Edit,
  Save,
  X,
  Palette,
  Settings,
  Camera,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Mic,
  Globe,
  Smile
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  filename: string;
  timestamp: Date;
  location?: string;
  detectedObjects: string[];
  detectedPeople: number;
  dominantColors: string[];
  mood: string;
  activity: string;
  setting: string;
}

interface CaptionSuggestion {
  id: string;
  text: string;
  style: 'witty' | 'elegant' | 'casual' | 'poetic' | 'humorous' | 'professional';
  tone: 'playful' | 'romantic' | 'nostalgic' | 'excited' | 'serene' | 'formal';
  length: 'short' | 'medium' | 'long';
  confidence: number;
  hashtags: string[];
  emojis: string[];
  isCustom: boolean;
  votes: number;
}

interface GenerationSettings {
  style: string;
  tone: string;
  length: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  includeLocation: boolean;
  includeTime: boolean;
  personality: string;
  language: string;
  contextAware: boolean;
}

const AICaptioning = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [suggestions, setSuggestions] = useState<CaptionSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [settings, setSettings] = useState<GenerationSettings>({
    style: 'witty',
    tone: 'playful',
    length: 'medium',
    includeHashtags: true,
    includeEmojis: true,
    includeLocation: false,
    includeTime: false,
    personality: 'friendly',
    language: 'english',
    contextAware: true
  });
  const [customPrompt, setCustomPrompt] = useState('');
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [voiceInput, setVoiceInput] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Mock photos
  const mockPhotos: Photo[] = [
    {
      id: '1',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      filename: 'wedding_ceremony.jpg',
      timestamp: new Date('2024-08-15T16:30:00'),
      location: 'Garden Venue, San Francisco',
      detectedObjects: ['wedding dress', 'bouquet', 'flowers', 'arch'],
      detectedPeople: 2,
      dominantColors: ['white', 'pink', 'green'],
      mood: 'romantic',
      activity: 'ceremony',
      setting: 'outdoor'
    },
    {
      id: '2',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      filename: 'group_celebration.jpg',
      timestamp: new Date('2024-08-15T19:45:00'),
      location: 'Reception Hall',
      detectedObjects: ['champagne', 'glasses', 'table', 'decorations'],
      detectedPeople: 8,
      dominantColors: ['gold', 'cream', 'amber'],
      mood: 'joyful',
      activity: 'celebration',
      setting: 'indoor'
    },
    {
      id: '3',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      filename: 'sunset_dance.jpg',
      timestamp: new Date('2024-08-15T20:15:00'),
      location: 'Terrace Overlooking Bay',
      detectedObjects: ['dancing', 'sunset', 'city lights'],
      detectedPeople: 2,
      dominantColors: ['orange', 'purple', 'gold'],
      mood: 'romantic',
      activity: 'dancing',
      setting: 'outdoor'
    }
  ];

  useEffect(() => {
    if (mockPhotos.length > 0) {
      setSelectedPhoto(mockPhotos[0]);
    }
  }, []);

  const generateCaptions = async () => {
    if (!selectedPhoto) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    const steps = [
      { name: 'Analyzing image content...', duration: 1500 },
      { name: 'Understanding context and mood...', duration: 1200 },
      { name: 'Generating witty suggestions...', duration: 2000 },
      { name: 'Creating elegant variations...', duration: 1800 },
      { name: 'Adding personality touches...', duration: 1000 },
      { name: 'Optimizing for engagement...', duration: 800 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    // Generate mock suggestions based on photo content
    const newSuggestions: CaptionSuggestion[] = [
      {
        id: '1',
        text: "When you find your person, everything else becomes background music 🎵✨",
        style: 'witty',
        tone: 'romantic',
        length: 'medium',
        confidence: 0.94,
        hashtags: ['#WeddingBliss', '#LoveStory', '#ForeverStarts', '#WeddingMagic'],
        emojis: ['🎵', '✨', '💕', '🥂'],
        isCustom: false,
        votes: 127
      },
      {
        id: '2',
        text: "Plot twist: The fairy tale was real all along 👑",
        style: 'witty',
        tone: 'playful',
        length: 'short',
        confidence: 0.89,
        hashtags: ['#PlotTwist', '#FairyTale', '#WeddingDay'],
        emojis: ['👑', '✨', '💫'],
        isCustom: false,
        votes: 98
      },
      {
        id: '3',
        text: "In this moment, surrounded by love and bathed in golden light, we wrote the first page of forever. Some stories don't need words—they need witnesses.",
        style: 'elegant',
        tone: 'romantic',
        length: 'long',
        confidence: 0.92,
        hashtags: ['#ForeverBegins', '#LoveStory', '#WeddingMoments', '#Timeless'],
        emojis: ['🌅', '💫', '📖', '💍'],
        isCustom: false,
        votes: 156
      },
      {
        id: '4',
        text: "Current status: Living in a rom-com and loving every minute of it 🎬",
        style: 'casual',
        tone: 'playful',
        length: 'medium',
        confidence: 0.87,
        hashtags: ['#RomCom', '#LivingMyBestLife', '#WeddingVibes'],
        emojis: ['🎬', '😍', '💕'],
        isCustom: false,
        votes: 73
      },
      {
        id: '5',
        text: "They say when you know, you know. Turns out, 'they' were absolutely right ✨",
        style: 'poetic',
        tone: 'nostalgic',
        length: 'medium',
        confidence: 0.91,
        hashtags: ['#WhenYouKnow', '#SoulMate', '#TrueLove'],
        emojis: ['✨', '💫', '💎'],
        isCustom: false,
        votes: 134
      }
    ];

    setSuggestions(newSuggestions);
    setIsGenerating(false);
    
    setTimeout(() => setGenerationProgress(0), 2000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEditing = (id: string, currentText: string) => {
    setEditingCaption(id);
    setEditText(currentText);
  };

  const saveEdit = (id: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { ...s, text: editText, isCustom: true } : s
    ));
    setEditingCaption(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingCaption(null);
    setEditText('');
  };

  const voteOnCaption = (id: string, isUpvote: boolean) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, votes: s.votes + (isUpvote ? 1 : -1) }
        : s
    ));
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'witty': return <Zap className="h-4 w-4" />;
      case 'elegant': return <Crown className="h-4 w-4" />;
      case 'casual': return <Coffee className="h-4 w-4" />;
      case 'poetic': return <Palette className="h-4 w-4" />;
      case 'humorous': return <Laugh className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'witty': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'elegant': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'casual': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'poetic': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'humorous': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            AI Caption Generator
          </CardTitle>
          <CardDescription>
            Generate witty, elegant, and engaging captions with AI-powered creativity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Selection */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Select Photo
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {mockPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedPhoto?.id === photo.id 
                      ? 'border-electric-blue ring-2 ring-electric-blue/20' 
                      : 'border-muted hover:border-electric-blue/50'
                  }`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            
            {selectedPhoto && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="aspect-square w-20 rounded-lg overflow-hidden">
                      <img src={selectedPhoto.url} alt={selectedPhoto.filename} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium">{selectedPhoto.filename}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(selectedPhoto.timestamp)}
                        </div>
                        {selectedPhoto.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedPhoto.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedPhoto.detectedPeople} people
                        </div>
                        <div className="flex items-center gap-1">
                          <Smile className="h-3 w-3" />
                          {selectedPhoto.mood} mood
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedPhoto.detectedObjects.slice(0, 4).map((obj, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {obj}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generation Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Style & Tone
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Caption Style</Label>
                  <Select value={settings.style} onValueChange={(v) => setSettings(prev => ({ ...prev, style: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="witty">Witty & Clever</SelectItem>
                      <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="poetic">Poetic & Artistic</SelectItem>
                      <SelectItem value="humorous">Humorous & Fun</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={settings.tone} onValueChange={(v) => setSettings(prev => ({ ...prev, tone: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="playful">Playful</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="nostalgic">Nostalgic</SelectItem>
                      <SelectItem value="excited">Excited</SelectItem>
                      <SelectItem value="serene">Serene</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={settings.length} onValueChange={(v) => setSettings(prev => ({ ...prev, length: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-20 words)</SelectItem>
                      <SelectItem value="medium">Medium (20-50 words)</SelectItem>
                      <SelectItem value="long">Long (50+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Enhancement Options
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Include Emojis</Label>
                    <p className="text-sm text-muted-foreground">Add relevant emojis</p>
                  </div>
                  <Switch 
                    checked={settings.includeEmojis} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeEmojis: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Include Hashtags</Label>
                    <p className="text-sm text-muted-foreground">Suggest relevant hashtags</p>
                  </div>
                  <Switch 
                    checked={settings.includeHashtags} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeHashtags: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Context Awareness</Label>
                    <p className="text-sm text-muted-foreground">Use photo context for better captions</p>
                  </div>
                  <Switch 
                    checked={settings.contextAware} 
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, contextAware: checked }))} 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Voice Input</Label>
                    <p className="text-sm text-muted-foreground">Use microphone for custom prompts</p>
                  </div>
                  <Switch 
                    checked={voiceInput} 
                    onCheckedChange={setVoiceInput} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Custom Context (Optional)
            </h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="Add context, mood, or specific instructions for the AI... (e.g., 'Make it funny', 'Focus on the sunset', 'Wedding anniversary caption')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="flex-1 min-h-[80px]"
              />
              {voiceInput && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsListening(!isListening)}
                  className={isListening ? 'bg-red-100 text-red-600' : ''}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button 
              onClick={generateCaptions}
              disabled={isGenerating || !selectedPhoto}
              size="lg"
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Captions
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="mt-4 space-y-2">
                <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Creating personalized captions with AI creativity...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Suggestions */}
      {suggestions.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-electric-blue" />
              Generated Captions
            </CardTitle>
            <CardDescription>
              AI-generated captions ranked by engagement potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions
                .sort((a, b) => b.confidence - a.confidence)
                .map((suggestion) => (
                <Card key={suggestion.id} className="border border-muted">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${getStyleColor(suggestion.style)} border`}>
                            {getStyleIcon(suggestion.style)}
                            <span className="ml-1 capitalize">{suggestion.style}</span>
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {(suggestion.confidence * 100).toFixed(0)}% match
                          </Badge>
                          {suggestion.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              <Edit className="h-3 w-3 mr-1" />
                              Edited
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          {suggestion.votes}
                        </div>
                      </div>

                      {/* Caption Text */}
                      <div className="space-y-3">
                        {editingCaption === suggestion.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="min-h-[100px]"
                              placeholder="Edit your caption..."
                            />
                            <div className="flex gap-2">
                              <Button onClick={() => saveEdit(suggestion.id)} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={cancelEdit} variant="outline" size="sm">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-lg leading-relaxed">{suggestion.text}</p>
                            
                            {/* Hashtags */}
                            {suggestion.hashtags.length > 0 && settings.includeHashtags && (
                              <div className="flex flex-wrap gap-2">
                                {suggestion.hashtags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {suggestion.length}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {suggestion.tone}
                              </div>
                              {settings.includeEmojis && suggestion.emojis.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {suggestion.emojis.slice(0, 3).join(' ')}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => voteOnCaption(suggestion.id, true)}
                            variant="outline"
                            size="sm"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                          </Button>
                          <Button
                            onClick={() => voteOnCaption(suggestion.id, false)}
                            variant="outline"
                            size="sm"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                          </Button>
                          <Button
                            onClick={() => startEditing(suggestion.id, suggestion.text)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => copyToClipboard(
                              suggestion.text + 
                              (settings.includeHashtags && suggestion.hashtags.length > 0 
                                ? '\n\n' + suggestion.hashtags.join(' ') 
                                : ''), 
                              suggestion.id
                            )}
                            variant="outline"
                            size="sm"
                          >
                            {copiedId === suggestion.id ? (
                              <Check className="h-4 w-4 mr-1" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            {copiedId === suggestion.id ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Use This
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Regenerate Options */}
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <RefreshCw className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Want different suggestions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting the style, tone, or adding custom context
                  </p>
                  <Button onClick={generateCaptions} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Captions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AICaptioning;