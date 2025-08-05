'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, RefreshCw, Database, FileText } from 'lucide-react'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [syncResult, setSyncResult] = useState<string | null>(null)

  const triggerSync = async (direction: 'notion-to-supabase' | 'supabase-to-notion' | 'two-way') => {
    setIsLoading(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      })

      const data = await response.json()

      if (data.success) {
        setSyncResult(data.message)
        setLastSync(new Date().toLocaleString())
      } else {
        setSyncResult(`Error: ${data.error}`)
      }
    } catch (error) {
      setSyncResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-vision-charcoal/70">
            Manage your data sync between Notion and Supabase
          </p>
        </div>

        {/* Sync Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Notion to Supabase */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notion → Supabase
              </CardTitle>
              <CardDescription>
                Sync all data from Notion to Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => triggerSync('notion-to-supabase')}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                Sync to Supabase
              </Button>
            </CardContent>
          </Card>

          {/* Supabase to Notion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Supabase → Notion
              </CardTitle>
              <CardDescription>
                Sync all data from Supabase to Notion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => triggerSync('supabase-to-notion')}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowLeft className="h-4 w-4 mr-2" />
                )}
                Sync to Notion
              </Button>
            </CardContent>
          </Card>

          {/* Two-way Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Two-way Sync
              </CardTitle>
              <CardDescription>
                Sync data in both directions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => triggerSync('two-way')}
                disabled={isLoading}
                className="w-full"
                variant="vision"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Two-way Sync
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Status</CardTitle>
            <CardDescription>
              Monitor your sync operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastSync && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Last Sync</Badge>
                <span className="text-sm text-vision-charcoal/70">{lastSync}</span>
              </div>
            )}
            
            {syncResult && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={syncResult.includes('Error') ? 'destructive' : 'default'}>
                    {syncResult.includes('Error') ? 'Error' : 'Success'}
                  </Badge>
                </div>
                <p className="text-sm text-vision-charcoal/80">{syncResult}</p>
              </div>
            )}

            {!lastSync && !syncResult && (
              <p className="text-sm text-vision-charcoal/60">
                No sync operations have been performed yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-vision-charcoal">Notion → Supabase</h4>
              <p className="text-sm text-vision-charcoal/70">
                Fetches all blog posts, projects, and agents from your Notion databases and creates/updates them in Supabase.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-vision-charcoal">Supabase → Notion</h4>
              <p className="text-sm text-vision-charcoal/70">
                Checks for items in Supabase that don't exist in Notion and creates them in your Notion databases.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-vision-charcoal">Two-way Sync</h4>
              <p className="text-sm text-vision-charcoal/70">
                Performs both operations to ensure your data is synchronized in both directions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 