import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Award,
  BookOpen,
  Video,
  Mic,
  Coffee,
  Lightbulb,
  TrendingUp
} from 'lucide-react'

export function CommunityPlatform() {
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [mentors, setMentors] = useState([])
  const [newPost, setNewPost] = useState('')

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = () => {
    // Mock community data
    setPosts([
      {
        id: 1,
        author: 'Sarah Chen',
        company: 'TechFlow AI',
        avatar: '👩‍💻',
        time: '2 hours ago',
        content: 'Just got accepted to Y Combinator W25! The application process was intense but the PlatFormula.One resources really helped structure my pitch. Happy to share insights with anyone applying.',
        likes: 24,
        comments: 8,
        tags: ['YC', 'Success Story', 'AI']
      },
      {
        id: 2,
        author: 'Marcus Rodriguez',
        company: 'GreenTech Solutions',
        avatar: '👨‍🔬',
        time: '5 hours ago',
        content: 'Looking for a technical co-founder with experience in renewable energy systems. We have strong market traction and are preparing for Series A. DM me if interested!',
        likes: 12,
        comments: 15,
        tags: ['Co-founder', 'CleanTech', 'Series A']
      },
      {
        id: 3,
        author: 'Emily Watson',
        company: 'HealthLink',
        avatar: '👩‍⚕️',
        time: '1 day ago',
        content: 'Sharing our pitch deck template that helped us raise $2M seed round. Focus on the problem-solution fit and show clear traction metrics. Link in comments.',
        likes: 45,
        comments: 22,
        tags: ['Fundraising', 'Resources', 'Healthcare']
      }
    ])

    setEvents([
      {
        id: 1,
        title: 'Pitch Deck Workshop',
        date: '2025-10-05',
        time: '2:00 PM PST',
        type: 'Workshop',
        attendees: 45,
        description: 'Learn how to create compelling pitch decks that get investor attention'
      },
      {
        id: 2,
        title: 'Founder Networking Mixer',
        date: '2025-10-08',
        time: '6:00 PM PST',
        type: 'Networking',
        attendees: 120,
        description: 'Connect with fellow founders, share experiences, and build relationships'
      },
      {
        id: 3,
        title: 'VC Panel: What Investors Look For',
        date: '2025-10-12',
        time: '1:00 PM PST',
        type: 'Panel',
        attendees: 200,
        description: 'Top VCs share insights on what makes a fundable startup'
      }
    ])

    setMentors([
      {
        id: 1,
        name: 'David Kim',
        title: 'Former YC Partner',
        company: 'Sequoia Capital',
        expertise: ['Fundraising', 'Product Strategy', 'Go-to-Market'],
        rating: 4.9,
        sessions: 150,
        avatar: '👨‍💼'
      },
      {
        id: 2,
        name: 'Lisa Zhang',
        title: 'Serial Entrepreneur',
        company: '3x Founder (2 exits)',
        expertise: ['Team Building', 'Operations', 'Scaling'],
        rating: 4.8,
        sessions: 89,
        avatar: '👩‍💼'
      },
      {
        id: 3,
        name: 'Alex Thompson',
        title: 'Growth Expert',
        company: 'Former Stripe',
        expertise: ['Growth Hacking', 'Marketing', 'Analytics'],
        rating: 4.7,
        sessions: 67,
        avatar: '👨‍💻'
      }
    ])
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return
    
    const post = {
      id: posts.length + 1,
      author: 'You',
      company: 'Your Startup',
      avatar: '👤',
      time: 'Just now',
      content: newPost,
      likes: 0,
      comments: 0,
      tags: ['Discussion']
    }
    
    setPosts([post, ...posts])
    setNewPost('')
    alert('Post created successfully!')
  }

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const handleJoinEvent = (eventId) => {
    alert(`Joined event! You'll receive a calendar invite and reminder.`)
  }

  const handleBookMentor = (mentorId) => {
    alert(`Booking session with mentor. This would open a calendar to schedule your 1-on-1 session.`)
  }

  const handleJoinCommunity = () => {
    alert('Welcome to the PlatFormula.One community! You now have access to all community features.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Founder Community</h2>
        <p className="text-gray-600 mb-6">
          Connect with fellow entrepreneurs, learn from experts, and grow together
        </p>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Badge className="bg-blue-100 text-blue-800">
            <Users className="w-3 h-3 mr-1" />
            2,500+ Members
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Award className="w-3 h-3 mr-1" />
            150+ Mentors
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <Calendar className="w-3 h-3 mr-1" />
            Weekly Events
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'feed', label: 'Community Feed', icon: MessageCircle },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'mentors', label: 'Mentors', icon: Users }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Community Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Share with the Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your startup journey, ask for advice, or celebrate wins..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Badge variant="outline">💡 Tip</Badge>
                  <Badge variant="outline">❓ Question</Badge>
                  <Badge variant="outline">🎉 Win</Badge>
                  <Badge variant="outline">🤝 Looking for</Badge>
                </div>
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{post.author}</h4>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.company}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{event.type}</Badge>
                    <span className="text-sm text-gray-500">{event.attendees} attending</span>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      Join Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mentors Tab */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Expert Mentors</h3>
            <div className="flex space-x-2">
              <Input placeholder="Search mentors..." className="w-64" />
              <Button variant="outline">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(mentor => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{mentor.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <CardDescription>{mentor.title}</CardDescription>
                      <p className="text-sm text-gray-600">{mentor.company}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{mentor.rating}</span>
                    </div>
                    <span className="text-gray-600">{mentor.sessions} sessions</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleBookMentor(mentor.id)}
                  >
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Join Community CTA */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
          <p className="text-blue-100 mb-6">
            Connect with 2,500+ founders, access expert mentors, and accelerate your startup journey
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={handleJoinCommunity}
          >
            Join Community
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
