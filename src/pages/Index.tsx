
import { useState } from 'react';
import WebViewContainer from '@/components/WebViewContainer';
import CameraTest from '@/components/CameraTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Camera, Smartphone, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="erp" className="h-screen flex flex-col">
        <div className="border-b bg-card">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="erp" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              ERP System
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Camera Test
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              App Info
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="erp" className="flex-1 m-0">
          <WebViewContainer />
        </TabsContent>

        <TabsContent value="camera" className="flex-1 p-4">
          <CameraTest />
        </TabsContent>

        <TabsContent value="info" className="flex-1 p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                ERP Mobile App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 mt-1 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Web Content Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Displays erp.beryl-solutions.com with full JavaScript support and secure iframe integration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Camera className="w-5 h-5 mt-1 text-green-500" />
                  <div>
                    <h3 className="font-medium">Camera Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Native camera integration with permission handling for seamless photo capture functionality.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 mt-1 text-purple-500" />
                  <div>
                    <h3 className="font-medium">Security & Permissions</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure permission management ensuring camera access works within the embedded web content.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Setup Instructions for Mobile:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Export project to GitHub via "Export to Github" button</li>
                  <li>Clone the repository locally</li>
                  <li>Run `npm install` to install dependencies</li>
                  <li>Add platforms: `npx cap add ios` and/or `npx cap add android`</li>
                  <li>Build the project: `npm run build`</li>
                  <li>Sync with native platforms: `npx cap sync`</li>
                  <li>Run on device: `npx cap run android` or `npx cap run ios`</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
