"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DbStructurePage() {
  const [dbInfo, setDbInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchDbStructure() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/db-structure')
      const data = await response.json()
      
      setDbInfo(data)
    } catch (err) {
      setError('Error fetching database information')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Structure</CardTitle>
          <CardDescription>View database table structures</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={fetchDbStructure} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? 'Loading...' : 'Fetch Database Structure'}
          </Button>
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md mb-4">{error}</div>
          )}
          
          {dbInfo && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Profiles Table</h3>
                {dbInfo.profiles.error ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-md">
                    Error: {JSON.stringify(dbInfo.profiles.error)}
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">Columns: {dbInfo.profiles.columns.join(', ')}</p>
                    <pre className="p-4 bg-slate-100 rounded-md overflow-auto text-xs">
                      {JSON.stringify(dbInfo.profiles.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Roles Table</h3>
                {dbInfo.roles.error ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-md">
                    Error: {JSON.stringify(dbInfo.roles.error)}
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">Columns: {dbInfo.roles.columns.join(', ')}</p>
                    <pre className="p-4 bg-slate-100 rounded-md overflow-auto text-xs">
                      {JSON.stringify(dbInfo.roles.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 