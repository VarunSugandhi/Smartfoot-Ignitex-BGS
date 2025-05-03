import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateEventDialog } from './neighborhood/CreateEventDialog';
import { CreatePostDialog } from './neighborhood/CreatePostDialog';
import { CommunityPost } from './neighborhood/CommunityPost';

interface Event {
  id: number;
  title: string;
  type: string;
  distance: number;
  participants: number;
  time: string;
  date: string;
  location: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Community Bike Tour",
    type: "Cycling",
    distance: 3.2,
    participants: 12,
    time: "10:00 AM",
    date: "Saturday, May 1",
    location: "Central Park"
  },
  {
    id: 2,
    title: "Morning Group Walk",
    type: "Walking",
    distance: 1.5,
    participants: 8,
    time: "7:30 AM",
    date: "Every Tuesday",
    location: "Riverside Trail"
  },
  {
    id: 3,
    title: "Downtown Carpool",
    type: "Carpool",
    distance: 4.7,
    participants: 4,
    time: "8:00 AM",
    date: "Weekdays",
    location: "Community Center"
  },
  {
    id: 4,
    title: "Historical Tour",
    type: "Walking",
    distance: 2.3,
    participants: 15,
    time: "3:00 PM",
    date: "Sunday, May 2",
    location: "Old Town Square"
  },
  {
    id: 5,
    title: "Eco Cycling",
    type: "Cycling",
    distance: 8.5,
    participants: 7,
    time: "9:00 AM",
    date: "Saturday, May 8",
    location: "Green Valley"
  }
];

const mockPosts = [
  {
    author: "Jane Smith",
    content: "Just joined the morning walk group! Such a great way to start the day and meet neighbors.",
    avatar: "/placeholder.svg",
    time: "2 hours ago",
    likes: 12,
    comments: 4,
  },
  {
    author: "John Doe",
    content: "The new bike paths are amazing! Can't wait for the next community bike tour.",
    avatar: "/placeholder.svg",
    time: "3 hours ago",
    likes: 8,
    comments: 2,
  },
];

const NeighborhoodSection = () => {
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const { toast } = useToast();

  useEffect(() => {
    if (distanceFilter === "all") {
      setFilteredEvents(mockEvents);
    } else {
      const maxDistance = parseInt(distanceFilter);
      const filtered = mockEvents.filter(event => event.distance <= maxDistance);
      setFilteredEvents(filtered);
    }
  }, [distanceFilter]);

  const handleJoinEvent = (eventId: number) => {
    toast({
      title: "Event Joined!",
      description: "You have successfully joined this event.",
    });
  };

  return (
    <section id="neighborhood" className="section-padding bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Neighbourhood Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with your community through local events and activities.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <CreateEventDialog />
              <CreatePostDialog />
            </div>
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="5">Within 5km</SelectItem>
                <SelectItem value="10">Within 10km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Community Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="bg-primary/10 text-primary rounded-lg px-3 py-1 inline-block mb-4 text-sm">
                      {event.type}
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location} ({event.distance}km away)</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.participants} participants</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      Join Event
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Community Posts</h3>
              <div className="grid gap-4">
                {mockPosts.map((post, index) => (
                  <CommunityPost key={index} {...post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeighborhoodSection;
