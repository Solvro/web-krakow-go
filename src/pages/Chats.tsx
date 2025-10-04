import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hardcoded volunteer ID for demo
const DEMO_VOLUNTEER_ID = 'vol-ania';

interface ChatWithDetails {
  id: string;
  type: string;
  eventId: string | null;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participantName?: string;
  eventName?: string;
}

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ChatMessage'
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchChats = async () => {
    try {
      setIsLoading(true);

      // Get chats where user is a participant
      const { data: participations, error: participationsError } = await supabase
        .from('ChatParticipant')
        .select('chatId')
        .eq('volunteerId', DEMO_VOLUNTEER_ID);

      if (participationsError) throw participationsError;

      const chatIds = participations?.map(p => p.chatId) || [];

      if (chatIds.length === 0) {
        setChats([]);
        setIsLoading(false);
        return;
      }

      // Get chat details
      const { data: chatsData, error: chatsError } = await supabase
        .from('Chat')
        .select('*')
        .in('id', chatIds);

      if (chatsError) throw chatsError;

      // Get last messages and unread counts
      const chatsWithDetails = await Promise.all(
        (chatsData || []).map(async (chat) => {
          // Get last message
          const { data: lastMsg } = await supabase
            .from('ChatMessage')
            .select('content, createdAt')
            .eq('chatId', chat.id)
            .order('createdAt', { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get other participant name (for private chats)
          let participantName = '';
          if (chat.type === 'PRIVATE') {
            const { data: otherParticipant } = await supabase
              .from('ChatParticipant')
              .select('volunteerId, organizationId')
              .eq('chatId', chat.id)
              .neq('volunteerId', DEMO_VOLUNTEER_ID)
              .maybeSingle();

            if (otherParticipant?.volunteerId) {
              const { data: volunteer } = await supabase
                .from('Volunteer')
                .select('name')
                .eq('id', otherParticipant.volunteerId)
                .single();
              participantName = volunteer?.name || 'Nieznany';
            } else if (otherParticipant?.organizationId) {
              const { data: org } = await supabase
                .from('Organization')
                .select('name')
                .eq('id', otherParticipant.organizationId)
                .single();
              participantName = org?.name || 'Organizacja';
            }
          }

          // Get event name (for event chats)
          let eventName = '';
          if (chat.eventId) {
            const { data: event } = await supabase
              .from('Event')
              .select('title')
              .eq('id', chat.eventId)
              .single();
            eventName = event?.title || '';
          }

          return {
            id: chat.id,
            type: chat.type,
            eventId: chat.eventId,
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.createdAt,
            unreadCount: 0, // TODO: implement unread tracking
            participantName,
            eventName
          };
        })
      );

      setChats(chatsWithDetails);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać czatów.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Teraz';
    if (diffMins < 60) return `${diffMins}m temu`;
    if (diffHours < 24) return `${diffHours}h temu`;
    if (diffDays < 7) return `${diffDays}d temu`;
    
    return date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getChatTitle = (chat: ChatWithDetails) => {
    if (chat.type === 'EVENT') {
      return chat.eventName || 'Czat wydarzenia';
    }
    return chat.participantName || 'Rozmowa';
  };

  const getChatSubtitle = (chat: ChatWithDetails) => {
    if (chat.type === 'EVENT') {
      return 'Czat grupowy';
    }
    return chat.lastMessage || 'Brak wiadomości';
  };

  const eventChats = chats.filter(c => c.type === 'EVENT');
  const privateChats = chats.filter(c => c.type === 'PRIVATE');

  if (isLoading) {
    return (
      <Layout title="Czaty">
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <p className="text-center text-muted-foreground">Ładowanie...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Czaty">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="all">
                Wszystkie ({chats.length})
              </TabsTrigger>
              <TabsTrigger value="events">
                Wydarzenia ({eventChats.length})
              </TabsTrigger>
              <TabsTrigger value="private">
                Prywatne ({privateChats.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {chats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Brak czatów</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <ChatCard
                    key={chat.id}
                    chat={chat}
                    title={getChatTitle(chat)}
                    subtitle={getChatSubtitle(chat)}
                    time={formatTime(chat.lastMessageTime)}
                    onClick={() => navigate(`/czaty/${chat.id}`)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              {eventChats.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Brak czatów wydarzeń</p>
                </div>
              ) : (
                eventChats.map((chat) => (
                  <ChatCard
                    key={chat.id}
                    chat={chat}
                    title={getChatTitle(chat)}
                    subtitle={getChatSubtitle(chat)}
                    time={formatTime(chat.lastMessageTime)}
                    onClick={() => navigate(`/czaty/${chat.id}`)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="private" className="space-y-4">
              {privateChats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Brak prywatnych czatów</p>
                </div>
              ) : (
                privateChats.map((chat) => (
                  <ChatCard
                    key={chat.id}
                    chat={chat}
                    title={getChatTitle(chat)}
                    subtitle={getChatSubtitle(chat)}
                    time={formatTime(chat.lastMessageTime)}
                    onClick={() => navigate(`/czaty/${chat.id}`)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface ChatCardProps {
  chat: ChatWithDetails;
  title: string;
  subtitle: string;
  time: string;
  onClick: () => void;
}

const ChatCard = ({ chat, title, subtitle, time, onClick }: ChatCardProps) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {chat.type === 'EVENT' ? (
              <Users className="w-6 h-6 text-primary" />
            ) : (
              <MessageCircle className="w-6 h-6 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {title}
              </h3>
              {time && (
                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                  {time}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate flex-1">
                {subtitle}
              </p>
              {chat.unreadCount > 0 && (
                <Badge variant="default" className="shrink-0">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chats;
