
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Server } from 'lucide-react';
import { useState } from 'react';
import { erpConfigurations, getCurrentConfig, setCurrentConfig, addCustomConfig, type ErpConfig } from '@/utils/erpUrls';

interface ConfigSelectorProps {
  onConfigChange: (configIndex: number) => void;
  onRefresh: () => void;
}

const ConfigSelector = ({ onConfigChange, onRefresh }: ConfigSelectorProps) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customConfig, setCustomConfig] = useState({
    name: '',
    baseUrl: '',
    description: ''
  });

  const currentConfig = getCurrentConfig();

  const handleConfigChange = (value: string) => {
    const configIndex = parseInt(value);
    setCurrentConfig(configIndex);
    onConfigChange(configIndex);
  };

  const handleAddCustomConfig = () => {
    if (customConfig.name && customConfig.baseUrl) {
      const newConfig: ErpConfig = {
        ...customConfig,
        patterns: [
          '/web/login?redirect=false',
          '/web?redirect=false',
          '?mobile=1&no_redirect=1',
          '/web/database/selector',
          ''
        ]
      };
      
      addCustomConfig(newConfig);
      setCurrentConfig(erpConfigurations.length - 1);
      onConfigChange(erpConfigurations.length - 1);
      setShowCustomForm(false);
      setCustomConfig({ name: '', baseUrl: '', description: '' });
      onRefresh();
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          ERP Server Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select ERP Server</Label>
          <Select value={erpConfigurations.indexOf(currentConfig).toString()} onValueChange={handleConfigChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose ERP configuration" />
            </SelectTrigger>
            <SelectContent>
              {erpConfigurations.map((config, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{config.name}</span>
                    <span className="text-xs text-muted-foreground">{config.baseUrl}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium">{currentConfig.name}</div>
          <div className="text-xs text-muted-foreground">{currentConfig.description}</div>
          <div className="text-xs text-muted-foreground mt-1">
            URL: {currentConfig.baseUrl}
          </div>
        </div>

        {!showCustomForm ? (
          <Button
            variant="outline"
            onClick={() => setShowCustomForm(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Server
          </Button>
        ) : (
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="configName">Server Name</Label>
              <Input
                id="configName"
                placeholder="e.g., Production Server"
                value={customConfig.name}
                onChange={(e) => setCustomConfig(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="configUrl">Base URL</Label>
              <Input
                id="configUrl"
                placeholder="https://your-erp-server.com"
                value={customConfig.baseUrl}
                onChange={(e) => setCustomConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="configDesc">Description (optional)</Label>
              <Input
                id="configDesc"
                placeholder="Brief description"
                value={customConfig.description}
                onChange={(e) => setCustomConfig(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCustomConfig} size="sm">
                Add Server
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomForm(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigSelector;
