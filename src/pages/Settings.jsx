import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Settings as SettingsIcon, Save, DollarSign, Globe, CheckCircle } from 'lucide-react';
import { useSupabase } from '../hooks/useSupabase';

export function Settings() {
  const [settings, setSettings] = useState({
    currency_code: 'USD',
    delivery_cost: '0.00'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { getAppSettings, updateAppSettings } = useSupabase();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await getAppSettings();
    if (data) {
      setSettings({
        currency_code: data.currency_code || 'USD',
        delivery_cost: data.delivery_cost?.toString() || '0.00'
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const settingsData = {
        currency_code: settings.currency_code,
        delivery_cost: parseFloat(settings.delivery_cost)
      };
      
      await updateAppSettings(settingsData);
      setSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="max-w-2xl space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your application settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">تم حفظ الإعدادات بنجاح!</span>
          </div>
        )}

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency Code</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="currency"
                  value={settings.currency_code}
                  onChange={(e) => handleInputChange('currency_code', e.target.value)}
                  placeholder="USD"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-gray-500">
                The default currency code for your store (e.g., USD, EUR, GBP)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery">Delivery Cost</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="delivery"
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.delivery_cost}
                  onChange={(e) => handleInputChange('delivery_cost', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-gray-500">
                The default delivery cost for orders
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>

        {/* Additional Settings Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Version</Label>
                <p className="text-sm text-gray-900">1.0.0</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Environment</Label>
                <p className="text-sm text-gray-900">Development</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Database</Label>
                <p className="text-sm text-gray-900">Supabase</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Authentication</Label>
                <p className="text-sm text-gray-900">Firebase Auth</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

