import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Users, Search, Plus, MessageCircle, Heart, Share2, Video, Image as ImageIcon, Calendar, MapPin, UserPlus } from 'lucide-react';
import CreateCommunityModal from './CreateCommunityModal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const CommunitySection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('discover');
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const { toast } = useToast();

  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: "Green Valley Apartments",
      members: 156,
      posts: 324,
      image: "/communities/green-valley.jpg"
    },
    {
      id: 2,
      name: "Sunset Heights",
      members: 89,
      posts: 142,
      image: "/communities/sunset-heights.jpg"
    }
  ];

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Community Bike Tour",
      date: "2024-03-20",
      time: "09:00 AM",
      location: "Green Valley Park",
      participants: 12,
      maxParticipants: 20,
      type: "Sports",
      description: "Join us for a scenic bike tour around the neighborhood. All skill levels welcome!"
    },
    {
      id: 2,
      title: "Carpool Group",
      date: "2024-03-21",
      time: "08:00 AM",
      location: "Community Center",
      participants: 8,
      maxParticipants: 10,
      type: "Transportation",
      description: "Daily carpool to downtown. Save money and reduce traffic!"
    },
    {
      id: 3,
      title: "Evening Walk Group",
      date: "2024-03-19",
      time: "06:00 PM",
      location: "Main Entrance",
      participants: 15,
      maxParticipants: 25,
      type: "Fitness",
      description: "Safe and social evening walks with neighbors."
    }
  ];

  // Mock data for posts
  const posts = [
    {
      id: 1,
      author: {
        name: "John Doe",
        avatar: "/avatars/john.jpg"
      },
      content: "Just organized a community cleanup drive! Great turnout from everyone. 🌿♻️",
      likes: 24,
      comments: 8,
      timestamp: "2h ago",
      media: {
        type: "image",
        url: "/posts/cleanup.jpg"
      }
    },
    {
      id: 2,
      author: {
        name: "Sarah Wilson",
        avatar: "/avatars/sarah.jpg"
      },
      content: "Important notice: Building maintenance scheduled for next weekend. Please check your emails for details.",
      likes: 15,
      comments: 12,
      timestamp: "4h ago"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const handleJoinEvent = (eventId: number) => {
    toast({
      title: "Joined Event!",
      description: "You have successfully joined the event. Check your email for details.",
    });
  };

  return (
    <section id="community" className="section-padding bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.6 
          }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 dark:from-primary/90 dark:to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Community Connect
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Join your residential community, connect with neighbors, and participate in local events.
          </motion.p>
        </motion.div>

        <Tabs defaultValue="discover" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
            {["discover", "my-community", "events"].map((tab) => (
              <motion.div
                key={tab}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TabsTrigger 
                  value={tab}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 transition-colors duration-300"
                >
                  {tab === "discover" ? "Discover" : 
                   tab === "my-community" ? "My Community" : "Events"}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="discover">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <div className="flex gap-4 mb-8">
                  <motion.div 
                    className="flex-1 relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button onClick={() => setShowCreateCommunity(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Community
                    </Button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communities.map((community, index) => (
                    <motion.div
                      key={community.id}
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <Card className="h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={community.image} alt={community.name} />
                              <AvatarFallback>{community.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{community.name}</CardTitle>
                              <CardDescription>
                                {community.members} members • {community.posts} posts
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter>
                          <Button className="w-full">
                            <Users className="h-4 w-4 mr-2" />
                            Join Community
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="my-community">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Create New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea placeholder="Share something with your community..." className="mb-4" />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Add Video
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button>Post</Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{post.author.name}</CardTitle>
                              <CardDescription>{post.timestamp}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300 mb-4">{post.content}</p>
                          {post.media && (
                            <div className="rounded-lg overflow-hidden mb-4 ring-1 ring-gray-200 dark:ring-gray-700 transition-colors duration-300">
                              {post.media.type === 'image' && (
                                <img src={post.media.url} alt="" className="w-full h-auto" />
                              )}
                            </div>
                          )}
                          <div className="flex gap-6">
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-300">
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="events">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                <motion.div 
                  className="flex justify-between items-center mb-8"
                  variants={itemVariants}
                >
                  <h3 className="text-2xl font-bold">Upcoming Events</h3>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      variants={cardVariants}
                      whileHover="hover"
                      custom={index}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{event.title}</CardTitle>
                              <CardDescription className="mt-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(event.date).toLocaleDateString()} at {event.time}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </div>
                              </CardDescription>
                            </div>
                            <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary/90 transition-colors duration-300">
                              {event.type}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300 mb-4">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            <UserPlus className="h-4 w-4" />
                            <span>{event.participants}/{event.maxParticipants} participants</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full"
                            disabled={event.participants >= event.maxParticipants}
                            onClick={() => handleJoinEvent(event.id)}
                          >
                            {event.participants >= event.maxParticipants ? 'Event Full' : 'Join Event'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <CreateCommunityModal
        isOpen={showCreateCommunity}
        onClose={() => setShowCreateCommunity(false)}
        onSubmit={(data) => {
          toast({
            title: "Community Created!",
            description: `${data.name} has been created successfully.`,
          });
          setShowCreateCommunity(false);
        }}
      />
    </section>
  );
};

export default CommunitySection; 