import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Shield, Bell, Database, Palette, Key } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-blue-500/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                DWC Settings Console
              </h1>
              <p className="text-blue-400 font-bold text-sm">DWC Systems LLC - Configuration Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              SETTINGS
            </Badge>
            <Button 
              onClick={() => window.history.back()}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="general" className="data-[state=active]:bg-blue-500/20">
              <User className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500/20">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-500/20">
              <Database className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Display Name</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Your display name"
                      defaultValue="DWC Administrator"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Email</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="your.email@dwcsystems.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Company</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      defaultValue="DWC Systems LLC"
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-purple-400" />
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Customize the look and feel of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Dark Mode</Label>
                      <p className="text-sm text-white/60">Enable dark theme interface</p>
                    </div>
                    <Switch 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Auto-save Changes</Label>
                      <p className="text-sm text-white/60">Automatically save configuration changes</p>
                    </div>
                    <Switch 
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Key className="w-5 h-5 mr-2 text-yellow-400" />
                    Access Control
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Manage authentication and access permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Current Password</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">New Password</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Confirm Password</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button className="w-full bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30">
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    Security Status
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Current security configuration and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Two-Factor Authentication</span>
                    <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Session Encryption</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">API Access</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Restricted</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Last Login</span>
                    <span className="text-white/60">2 minutes ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-orange-400" />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-white/70">
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">System Alerts</Label>
                    <p className="text-sm text-white/60">Receive notifications for system events</p>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-white/60">Send alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Performance Alerts</Label>
                    <p className="text-sm text-white/60">Notify when system performance drops</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/20" />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Security Warnings</Label>
                    <p className="text-sm text-white/60">Alert for security-related events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Database className="w-5 h-5 mr-2 text-cyan-400" />
                    System Configuration
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Advanced system settings and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Database Connection</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-400">Connected</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Cache Settings</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      defaultValue="Redis - localhost:6379"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Log Level</Label>
                    <Input 
                      className="bg-white/10 border-white/20 text-white"
                      defaultValue="INFO"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">System Information</CardTitle>
                  <CardDescription className="text-white/70">
                    Current system status and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Version</span>
                    <span className="text-white">DWC v2.0.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Environment</span>
                    <span className="text-white">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Uptime</span>
                    <span className="text-white">7d 14h 23m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Memory Usage</span>
                    <span className="text-white">2.1GB / 8GB</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}