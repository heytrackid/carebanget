'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Bot, Send, Sparkles, BookOpen, Heart, Baby, Lightbulb, MessageCircle } from 'lucide-react';
import { getAIResponse } from '@/data/aiKnowledgeBase';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Halo! Saya AI Assistant untuk parenting dan meal planning. Saya memiliki pengetahuan lengkap tentang:\n\n🍽️ **Meal Planning & Nutrisi**\n- MPASI sesuai usia WHO\n- Menu seimbang untuk keluarga\n- Tips mengatasi picky eater\n\n👶 **Parenting Tips**\n- Metode Montessori untuk kemandirian\n- Pendekatan Cambridge untuk perkembangan kognitif\n- Tips Kak Seto untuk komunikasi positif\n- Panduan WHO untuk tumbuh kembang\n\nAda yang ingin Anda tanyakan?',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { text: 'Menu MPASI 6 bulan', category: 'nutrition' },
    { text: 'Anak susah makan, bagaimana?', category: 'parenting' },
    { text: 'Aktivitas Montessori untuk balita', category: 'montessori' },
    { text: 'Tips komunikasi ala Kak Seto', category: 'communication' },
    { text: 'Milestone perkembangan WHO', category: 'development' }
  ];


  const generateAIResponse = (userMessage: string): string => {
    return getAIResponse(userMessage);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        category: 'response'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Assistant</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            AI Parenting Assistant
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            Asisten AI dengan pengetahuan lengkap meal planning, Montessori, Cambridge, WHO, dan tips Kak Seto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[500px] sm:h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">AI Parenting Expert</CardTitle>
                    <CardDescription>Online • Siap membantu 24/7</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                        message.type === 'user'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1 sm:mt-2">
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          U
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-3 sm:p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tanyakan tentang meal planning, parenting..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 text-sm"
                  />
                  <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping} size="sm" className="sm:size-default">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 mt-6 lg:mt-0">
            {/* Quick Questions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  Pertanyaan Populer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-2 sm:p-3"
                    onClick={() => handleQuickQuestion(question.text)}
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{question.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Knowledge Areas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Area Keahlian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <Baby className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium">WHO Guidelines</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium">Montessori Method</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium">Cambridge Approach</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                  <span className="text-xs sm:text-sm font-medium">Kak Seto Tips</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Tips Bertanya</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <li>• Sebutkan usia anak untuk saran yang tepat</li>
                  <li>• Jelaskan situasi spesifik yang dihadapi</li>
                  <li>• Tanyakan tentang nutrisi, perkembangan, atau perilaku</li>
                  <li>• Minta contoh aktivitas atau menu konkret</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
