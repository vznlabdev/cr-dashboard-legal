"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { SettingsPageHeader } from "@/components/settings/SettingsPageHeader";

export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SettingsPageHeader
        title="Notification Preferences"
        description="Which alerts to receive"
      />

      {/* Legal & compliance alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Legal & compliance alerts</CardTitle>
          </div>
          <CardDescription>
            Choose which alerts you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compliance alerts</Label>
              <p className="text-sm text-muted-foreground">
                Portfolio-wide compliance issues, risk changes, open items
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contract expirations</Label>
              <p className="text-sm text-muted-foreground">
                Upcoming contract end dates and renewal reminders
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Review assignments</Label>
              <p className="text-sm text-muted-foreground">
                When an item is assigned to you for legal review
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Legislation changes</Label>
              <p className="text-sm text-muted-foreground">
                Updates on relevant legislation and jurisdiction changes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Real-time browser notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications in your browser
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show desktop notifications when browser is not active
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
          <CardDescription>
            Control when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quiet-hours">Quiet Hours</Label>
            <Select defaultValue="none">
              <SelectTrigger id="quiet-hours">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Quiet Hours</SelectItem>
                <SelectItem value="evenings">Evenings (6 PM - 9 AM)</SelectItem>
                <SelectItem value="nights">Nights (10 PM - 7 AM)</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Notifications will be paused during these hours
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Digest Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Digest Preferences</CardTitle>
          <CardDescription>
            Combine notifications into periodic digests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="digest-frequency">Digest Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="digest-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (no digest)</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Group non-urgent notifications into periodic emails
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Activity Summary</Label>
              <p className="text-sm text-muted-foreground">
                Add a summary of team activity to digest emails
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={() => toast.success("Notification preferences saved!")}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
