"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";

export default function SettingsPage() {
  const { setTheme } = useTheme();

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <TypographyH2>Settings</TypographyH2>
          <TypographyMuted>
            Manage your application preferences and configuration.
          </TypographyMuted>
        </div>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTheme("system")}
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose what you want to be notified about.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="marketing-emails" className="flex-1">
                Marketing Emails
                <p className="text-sm font-normal text-muted-foreground">
                  Receive emails about new features and promotions.
                </p>
              </Label>
              <input
                id="marketing-emails"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="security-alerts" className="flex-1">
                Security Alerts
                <p className="text-sm font-normal text-muted-foreground">
                  Receive emails about your account security.
                </p>
              </Label>
              <input
                id="security-alerts"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
              />
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and all data.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
