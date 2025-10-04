import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Hardcoded volunteer ID for demo
const DEMO_VOLUNTEER_ID = 'vol-ania';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName?: string;
  isSelf: boolean;
}

interface ChatDetails {
  id: string;
  type: string;
  eventId: string | null;
  title: string;
}

const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchChatDetails();
      fetchMessages();

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat-${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ChatMessage',
            filter: `chatId=eq.${id}`
          },
          (payload) => {
            handleNewMessage(payload.new as any);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatDetails = async () => {
    try {
      const { data: chat, error } = await supabase
        .from('Chat')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      let title = 'Czat';
      
      if (chat.type === 'EVENT' && chat.eventId) {
        const { data: event } = await supabase
          .from('Event')
          .select('title')
          .eq('id', chat.eventId)
          .single();
        title = event?.title || 'Czat wydarzenia';
      } else if (chat.type === 'PRIVATE') {
        const { data: otherParticipant } = await supabase
          .from('ChatParticipant')
          .select('volunteerId, organizationId')
          .eq('chatId', id)
          .neq('volunteerId', DEMO_VOLUNTEER_ID)
          .maybeSingle();

        if (otherParticipant?.volunteerId) {
          const { data: volunteer } = await supabase
            .from('Volunteer')
            .select('name')
            .eq('id', otherParticipant.volunteerId)
            .single();
          title = volunteer?.name || 'Rozmowa';
        } else if (otherParticipant?.organizationId) {
          const { data: org } = await supabase
            .from('Organization')
            .select('name')
            .eq('id', otherParticipant.organizationId)
            .single();
          title = org?.name || 'Organizacja';
        }
      }

      setChatDetails({
        id: chat.id,
        type: chat.type,
        eventId: chat.eventId,
        title
      });
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);

      const { data: messagesData, error } = await supabase
        .from('ChatMessage')
        .select('*')
        .eq('chatId', id)
        .order('createdAt', { ascending: true });

      if (error) throw error;

      const messagesWithNames = await Promise.all(
        (messagesData || []).map(async (msg) => {
          let senderName = 'Ty';
          const isSelf = msg.senderId === DEMO_VOLUNTEER_ID;

          if (!isSelf) {
            // Try to get volunteer name
            const { data: volunteer } = await supabase
              .from('Volunteer')
              .select('name')
              .eq('id', msg.senderId)
              .maybeSingle();

            if (volunteer) {
              senderName = volunteer.name;
            } else {
              // Try to get organization name
              const { data: org } = await supabase
                .from('Organization')
                .select('name')
                .eq('id', msg.senderId)
                .maybeSingle();
              senderName = org?.name || 'Nieznany';
            }
          }

          return {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
            senderName,
            isSelf
          };
        })
      );

      setMessages(messagesWithNames);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać wiadomości.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = async (newMsg: any) => {
    let senderName = 'Ty';
    const isSelf = newMsg.senderId === DEMO_VOLUNTEER_ID;

    if (!isSelf) {
      const { data: volunteer } = await supabase
        .from('Volunteer')
        .select('name')
        .eq('id', newMsg.senderId)
        .maybeSingle();

      if (volunteer) {
        senderName = volunteer.name;
      } else {
        const { data: org } = await supabase
          .from('Organization')
          .select('name')
          .eq('id', newMsg.senderId)
          .maybeSingle();
        senderName = org?.name || 'Nieznany';
      }
    }

    setMessages(prev => [...prev, {
      id: newMsg.id,
      content: newMsg.content,
      createdAt: newMsg.createdAt,
      senderId: newMsg.senderId,
      senderName,
      isSelf
    }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('ChatMessage')
        .insert({
          id: `msg-${Date.now()}`,
          chatId: id!,
          senderId: DEMO_VOLUNTEER_ID,
          content: newMessage.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/czaty')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {chatDetails?.title || 'Czat'}
              </h1>
              {chatDetails?.type === 'EVENT' && (
                <p className="text-sm text-muted-foreground">Czat grupowy</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 max-w-3xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.isSelf
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {!message.isSelf && chatDetails?.type === 'EVENT' && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {message.senderName}
                  </p>
                )}
                <p className="text-sm leading-relaxed break-words">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    message.isSelf ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Wpisz wiadomość..."
              className="flex-1"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || isSending}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
