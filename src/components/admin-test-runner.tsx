"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ComprehensiveTestingService } from "@/lib/services/comprehensive-testing-service"
import type { TestSuite, TestResult } from "@/lib/services/comprehensive-testing-service"
import { toast } from "sonner"

export function AdminTestRunner() {
  const [running, setRunning] = useState(false)
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [selectedSuite, setSelectedSuite] = useState<string>('unit')

  const runTests = async () => {
    try {
      setRunning(true)
      const results = await ComprehensiveTestingService.runAllTests()
      setTestSuites(results.suites)
      setSummary(results.summary)
    } catch (error) {
      console.error('Failed to run tests:', error)
      toast.error('Failed to run tests')
    } finally {
      setRunning(false)
    }
  }

  const downloadTestReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      suites: testSuites
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Test report downloaded!')
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'skipped':
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'skipped':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Test Runner Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Test Suite Runner
            </CardTitle>
            <div className="flex gap-2">
              {summary && (
                <Button
                  onClick={downloadTestReport}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              )}
              <Button
                onClick={runTests}
                disabled={running}
                className="btn-primary"
              >
                {running ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {summary && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.totalTests}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {summary.passedTests}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {summary.failedTests}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.skippedTests}
                </div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{summary.successRate.toFixed(1)}%</span>
              </div>
              <Progress value={summary.successRate} className="h-2" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Test Results */}
      {testSuites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs value={selectedSuite} onValueChange={setSelectedSuite}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="unit">Unit</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="e2e">E2E</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="accessibility">A11y</TabsTrigger>
            </TabsList>

            {testSuites.map((suite) => (
              <TabsContent key={suite.name} value={suite.name.toLowerCase().split(' ')[0]}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{suite.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={suite.failedTests === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {suite.passedTests}/{suite.totalTests} Passed
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {suite.duration}ms
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {suite.tests.map((test) => (
                          <motion.div
                            key={test.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getStatusIcon(test.status)}
                              <div>
                                <div className="font-medium">{test.name}</div>
                                {test.error && (
                                  <div className="text-sm text-red-600 dark:text-red-400">
                                    {test.error}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {test.duration}ms
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      )}

      {/* No Results State */}
      {!running && testSuites.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Run Tests
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Run comprehensive tests to ensure platform quality and reliability
            </p>
            <Button onClick={runTests} className="btn-primary">
              <Play className="h-4 w-4 mr-2" />
              Start Testing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}