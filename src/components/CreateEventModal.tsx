import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Eye, Upload, UserCog, QrCode, Share, Link } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal = ({ isOpen, onClose }: CreateEventModalProps) => {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState('wedding');
  const [isPublic, setIsPublic] = useState(false);
  const [guestPermissions, setGuestPermissions] = useState('upload');
  const [maxGuests, setMaxGuests] = useState('50');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique event ID and access link
    const eventId = Math.random().toString(36).substring(2, 15);
    const accessLink = `laurencephotohub.com/event/${eventId}`;
    
    // Mock event creation
    const eventData = {
      id: eventId,
      name: eventName,
      description: eventDescription,
      date: eventDate,
      location: eventLocation,
      type: eventType,
      isPublic,
      guestPermissions,
      maxGuests: parseInt(maxGuests),
      accessLink,
      qrCode: `qr-${eventId}`,
      createdAt: new Date().toISOString()
    };

    console.log('Created event:', eventData);
    alert(`Event "${eventName}" created successfully!\n\nAccess Link: ${accessLink}\nEvent ID: ${eventId}\n\nQR code and invitation links have been generated.`);
    
    // Reset form
    setEventName('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
    setEventType('wedding');
    setIsPublic(false);
    setGuestPermissions('upload');
    setMaxGuests('50');
    
    onClose();
  };

  const eventTypes = [
    { value: 'wedding', label: 'Wedding', icon: '💒' },
    { value: 'birthday', label: 'Birthday Party', icon: '🎂' },
    { value: 'corporate', label: 'Corporate Event', icon: '🏢' },
    { value: 'graduation', label: 'Graduation', icon: '🎓' },
    { value: 'family', label: 'Family Gathering', icon: '👨‍👩‍👧‍👦' },
    { value: 'vacation', label: 'Vacation', icon: '🏖️' },
    { value: 'sports', label: 'Sports Event', icon: '⚽' },
    { value: 'other', label: 'Other', icon: '📸' },
  ];

  const permissionLevels = [
    { value: 'view', label: 'View Only', description: 'Guests can only view photos', icon: Eye },
    { value: 'upload', label: 'Upload & View', description: 'Guests can upload and view photos', icon: Upload },
    { value: 'cohost', label: 'Co-Host', description: 'Full permissions including moderation', icon: UserCog },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Set up a photo sharing hub for your event with custom permissions and invitation options
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateEvent} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Sarah & John's Wedding"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                placeholder="Tell your guests about this special event..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventLocation">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="eventLocation"
                    placeholder="Venue or city"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Privacy & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Privacy & Permissions</h3>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <Label htmlFor="isPublic" className="font-medium">Public Event</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPublic ? 'Anyone with the link can view' : 'Only invited guests can access'}
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Default Guest Permissions</Label>
              <div className="grid gap-3">
                {permissionLevels.map((level) => {
                  const IconComponent = level.icon;
                  return (
                    <div
                      key={level.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        guestPermissions === level.value 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setGuestPermissions(level.value)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            guestPermissions === level.value 
                              ? 'border-primary bg-primary' 
                              : 'border-muted-foreground'
                          }`}>
                            {guestPermissions === level.value && (
                              <div className="w-full h-full rounded-full bg-background m-0.5"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="h-4 w-4" />
                            <span className="font-medium">{level.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxGuests">Maximum Guests</Label>
              <Select value={maxGuests} onValueChange={setMaxGuests}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 guests</SelectItem>
                  <SelectItem value="50">50 guests</SelectItem>
                  <SelectItem value="100">100 guests</SelectItem>
                  <SelectItem value="250">250 guests</SelectItem>
                  <SelectItem value="500">500 guests</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invitation Methods Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invitation Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <QrCode className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">QR Code</h4>
                <p className="text-sm text-muted-foreground">Generated after creation</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Link className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">Share Link</h4>
                <p className="text-sm text-muted-foreground">Unique access URL</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Share className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium">NFC Tap</h4>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;