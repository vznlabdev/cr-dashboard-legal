"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Pencil,
  CheckCircle2,
  XCircle,
  Ticket,
  Clock,
  BarChart3,
  Calendar,
  Trophy,
} from "lucide-react"
import { getTeamMemberById, mockTickets } from "@/lib/mock-data/creative"
import { RoleBadge, WorkloadBar, TicketCard } from "@/components/creative"
import { format } from "date-fns"

export default function TeamMemberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const memberId = params.id as string
  const member = getTeamMemberById(memberId)

  // Get tickets for this member
  const memberTickets = mockTickets.filter((t) => t.assigneeId === memberId)
  const activeTickets = memberTickets.filter((t) => t.status !== "delivered")
  const completedTickets = memberTickets.filter((t) => t.status === "delivered")

  // Calculate stats
  const totalTrackedTime = memberTickets.reduce((acc, t) => acc + t.trackedTime, 0)
  const avgTimePerTicket = completedTickets.length > 0
    ? Math.round(totalTrackedTime / completedTickets.length)
    : 0

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Team Member Not Found</h1>
        <p className="text-muted-foreground">
          The team member you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push("/creative/team")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Team
        </Button>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/creative/team")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {member.name}
                </h1>
                {member.isAvailable ? (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <XCircle className="mr-1 h-3 w-3" />
                    Unavailable
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Mail className="h-4 w-4" />
                {member.email}
              </p>
              <div className="mt-2">
                <RoleBadge role={member.role} size="md" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTickets.length}</div>
            <p className="text-xs text-muted-foreground">currently assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTickets.length}</div>
            <p className="text-xs text-muted-foreground">tickets delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrackedTime}h</div>
            <p className="text-xs text-muted-foreground">total time logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workload</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.currentLoad}%</div>
            <WorkloadBar
              current={member.currentLoad}
              max={member.maxCapacity}
              showLabel={false}
              size="sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments ({activeTickets.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTickets.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Areas of specialization</CardDescription>
              </CardHeader>
              <CardContent>
                {member.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No skills added yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Workload Details */}
            <Card>
              <CardHeader>
                <CardTitle>Current Workload</CardTitle>
                <CardDescription>Capacity and utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <WorkloadBar
                  current={member.currentLoad}
                  max={member.maxCapacity}
                  size="lg"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Load</p>
                    <p className="font-semibold">{member.currentLoad}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Capacity</p>
                    <p className="font-semibold">{member.maxCapacity}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available Capacity</p>
                    <p className="font-semibold">{member.maxCapacity - member.currentLoad}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Time/Ticket</p>
                    <p className="font-semibold">{avgTimePerTicket}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Work statistics and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-primary">{memberTickets.length}</p>
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-emerald-500">{completedTickets.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-amber-500">{totalTrackedTime}h</p>
                    <p className="text-sm text-muted-foreground">Hours Logged</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-blue-500">
                      {completedTickets.length > 0 ? Math.round((completedTickets.length / memberTickets.length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          {activeTickets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">
                No active assignments
              </p>
              <Link href="/creative/tickets">
                <Button variant="outline">View All Tickets</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed">
          {completedTickets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No completed tickets yet
              </p>
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Work history and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock activity items */}
                {[
                  { action: "Uploaded version 3 for", ticket: "Logo Refresh", time: "2 hours ago" },
                  { action: "Started working on", ticket: "Homepage Banner Redesign", time: "5 hours ago" },
                  { action: "Completed", ticket: "Mobile App UI Mockups", time: "Yesterday" },
                  { action: "Added comments on", ticket: "Social Media Pack Q1", time: "2 days ago" },
                  { action: "Was assigned to", ticket: "Business Card Redesign", time: "3 days ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{activity.action}</span>
                    <span className="font-medium">{activity.ticket}</span>
                    <span className="text-muted-foreground ml-auto">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

