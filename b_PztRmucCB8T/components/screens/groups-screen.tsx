"use client"

import { Plus, Users, MessageCircle, ChevronRight, Crown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface GroupsScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const groups = [
  {
    id: 1,
    name: "Sunday League Legends",
    members: 24,
    avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop",
    lastMessage: {
      user: "Marcus",
      text: "Game confirmed for Sunday 10am!",
      time: "5m ago",
    },
    unread: 3,
    isAdmin: true,
  },
  {
    id: 2,
    name: "Shoreditch FC",
    members: 18,
    avatar: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=100&h=100&fit=crop",
    lastMessage: {
      user: "Sarah",
      text: "Anyone free for a kickabout Wednesday?",
      time: "1h ago",
    },
    unread: 0,
    isAdmin: false,
  },
  {
    id: 3,
    name: "Work Footy",
    members: 12,
    avatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&h=100&fit=crop",
    lastMessage: {
      user: "James",
      text: "Booking the usual spot for Friday",
      time: "3h ago",
    },
    unread: 1,
    isAdmin: false,
  },
  {
    id: 4,
    name: "5-a-side Addicts",
    members: 32,
    avatar: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=100&h=100&fit=crop",
    lastMessage: {
      user: "David",
      text: "Great game yesterday lads!",
      time: "1d ago",
    },
    unread: 0,
    isAdmin: false,
  },
]

const recentActivity = [
  { id: 1, type: "game", group: "Sunday League Legends", text: "New game scheduled", time: "5m ago" },
  { id: 2, type: "member", group: "Shoreditch FC", text: "Alex joined the group", time: "2h ago" },
  { id: 3, type: "chat", group: "Work Footy", text: "15 new messages", time: "3h ago" },
]

export function GroupsScreen({ onNavigate }: GroupsScreenProps) {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Groups</h1>
          <Button size="sm" className="bg-primary text-primary-foreground rounded-full">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search groups..." 
            className="pl-10 bg-secondary border-none rounded-xl"
          />
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Your Groups */}
        <section>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Your Groups
          </h2>
          <div className="space-y-3">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="p-4 bg-card border-none cursor-pointer hover:bg-card/80 transition-colors"
                onClick={() => onNavigate("groupChat", { groupId: group.id })}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    {group.isAdmin && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 p-1 rounded-full">
                        <Crown className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{group.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {group.lastMessage.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3" />
                      {group.members} members
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      <span className="text-foreground font-medium">{group.lastMessage.user}:</span>{" "}
                      {group.lastMessage.text}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {group.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                        {group.unread}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="font-semibold mb-3">Recent Activity</h2>
          <Card className="bg-card border-none divide-y divide-border">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === "game" ? "bg-primary/20" :
                  activity.type === "member" ? "bg-green-500/20" :
                  "bg-blue-500/20"
                }`}>
                  {activity.type === "game" ? (
                    <Users className="w-4 h-4 text-primary" />
                  ) : activity.type === "member" ? (
                    <Users className="w-4 h-4 text-green-500" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.group}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-secondary/50 border-none text-center cursor-pointer hover:bg-secondary/70 transition-colors">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Find Groups</p>
            <p className="text-xs text-muted-foreground">Join local teams</p>
          </Card>
          <Card className="p-4 bg-secondary/50 border-none text-center cursor-pointer hover:bg-secondary/70 transition-colors">
            <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Create Group</p>
            <p className="text-xs text-muted-foreground">Start your own</p>
          </Card>
        </section>
      </div>
    </div>
  )
}
