import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Search, AlertTriangle } from 'lucide-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/enhanced-auth-provider'
import { UnifiedDatabaseService } from '@/lib/services/unified-database-service'
import { InlineLoading } from '@/components/ui/global-loading'
import { formatRelativeTime } from '@/lib/utils/format'
import { toast } from 'sonner'
import type { Conversation, Message } from '@/lib/database/types'

export default function AdminMessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadConversations()
  }, [user])

  const loadConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      const conversationData = await UnifiedDatabaseService.getAllConversations()
      setConversations(conversationData)
    } catch (error) {
      console.error('Failed to load conversations:', error)
      setError('Failed to load conversations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const messageData = await UnifiedDatabaseService.getMessages(conversationId)
      setMessages(messageData)
    } catch (error) {
      console.error('Failed to load messages:', error)
      toast.error('Failed to load messages')
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    loadMessages(conversation.id)
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true
    
    const clientName = conv.client?.full_name || ''
    const creativeName = conv.creative?.title || ''
    
    return clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           creativeName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex justify-center py-12">
          <InlineLoading size="lg" message="Loading conversations..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Messages</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={loadConversations} className="btn-primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Message Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform communications for quality and safety
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="professional-card h-full">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No conversations found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No platform conversations match your search
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-emerald-50 dark:bg-emerald-950' : ''
                      }`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage 
                              src={conversation.client?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${conversation.client?.full_name || 'Client'}&backgroundColor=059669&textColor=ffffff`} 
                            />
                            <AvatarFallback>C</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage 
                              src={conversation.creative?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${conversation.creative?.title || 'Creative'}&backgroundColor=059669&textColor=ffffff`} 
                            />
                            <AvatarFallback>P</AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                              {conversation.client?.full_name} ↔ {conversation.creative?.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(conversation.last_message_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {conversation.booking ? 'Booking Chat' : 'General'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {conversation.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Messages View */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="professional-card h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage 
                          src={selectedConversation.client?.avatar_url} 
                          alt={selectedConversation.client?.full_name} 
                        />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage 
                          src={selectedConversation.creative?.avatar_url} 
                          alt={selectedConversation.creative?.title} 
                        />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConversation.client?.full_name} ↔ {selectedConversation.creative?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Conversation ID: {selectedConversation.id}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages (Read-only) */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No messages in this conversation</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {message.sender_id === selectedConversation.client_id ? 'Client' : 'Creative'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>

                {/* Admin Note */}
                <div className="border-t p-4 bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 text-center">
                    👁️ Admin View - Read Only Mode
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a conversation from the list to monitor messages
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}