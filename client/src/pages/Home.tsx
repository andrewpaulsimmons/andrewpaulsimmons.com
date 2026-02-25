import React, { useState } from "react";
import { useGreeting } from "@/hooks/use-greeting";
import { useMessages, useCreateMessage } from "@/hooks/use-messages";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { MessageSquare, Terminal, Send, AlertCircle } from "lucide-react";

export default function Home() {
  const { data: greeting, isLoading: isLoadingGreeting, error: greetingError } = useGreeting();
  const { data: messages, isLoading: isLoadingMessages } = useMessages();
  const createMessage = useCreateMessage();

  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    createMessage.mutate(
      { text: newMessage },
      {
        onSuccess: () => {
          setNewMessage("");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/10">
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-24 flex flex-col gap-16">
        
        {/* Hero Section */}
        <section className="flex flex-col gap-6 animate-fade-in-up opacity-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium w-fit">
            <Terminal className="w-3.5 h-3.5" />
            <span>Fullstack Initialized</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl tracking-tight text-primary">
            {isLoadingGreeting ? (
              <span className="animate-pulse text-muted">Connecting...</span>
            ) : greetingError ? (
              <span className="text-destructive flex items-center gap-3">
                <AlertCircle className="w-8 h-8" />
                API Unreachable
              </span>
            ) : (
              greeting?.message || "Hello, World."
            )}
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-lg leading-relaxed font-light">
            Your pristine foundation is ready. Built with React, TypeScript, and a refined minimal aesthetic.
          </p>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-border/0 via-border to-border/0 animate-fade-in-up stagger-1 opacity-0" />

        {/* Database Interaction Section */}
        <section className="flex flex-col gap-8 animate-fade-in-up stagger-2 opacity-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-medium">Message Log</h2>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="flex gap-3 relative group"
          >
            <div className="absolute -inset-1 bg-primary/5 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Leave a message in the database..."
              className="relative z-10 bg-background/50 backdrop-blur-sm"
              disabled={createMessage.isPending}
            />
            <Button 
              type="submit" 
              className="relative z-10 shrink-0 gap-2 w-28"
              isLoading={createMessage.isPending}
            >
              {!createMessage.isPending && <Send className="w-4 h-4" />}
              Send
            </Button>
          </form>

          <div className="flex flex-col gap-3">
            {isLoadingMessages ? (
              // Skeleton loading state
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-border/50 bg-secondary/20 animate-pulse h-16" />
              ))
            ) : messages?.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border/50 text-muted-foreground flex flex-col items-center gap-3">
                <MessageSquare className="w-8 h-8 opacity-20" />
                <p>No messages yet. Be the first to write something.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages?.map((msg, idx) => (
                  <div 
                    key={msg.id} 
                    className="group p-4 rounded-xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all flex flex-col gap-1 animate-fade-in-up"
                    style={{ animationDelay: `${(idx % 5) * 100}ms` }}
                  >
                    <span className="text-xs text-muted-foreground font-mono">
                      #{msg.id.toString().padStart(4, '0')}
                    </span>
                    <p className="text-foreground text-sm sm:text-base">
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
