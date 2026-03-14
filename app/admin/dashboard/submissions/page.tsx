'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminSidebar, AdminSidebarToggleButton } from '@/components/admin/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Paperclip, Eye, Loader2, Copy, EllipsisVertical, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { SubmissionRecord, SubmissionStatus } from '@/lib/types/submissions'
import { submissionStatusLabels, submissionStatusOptions, submissionTypeLabels } from '@/lib/types/submissions'
import { useAuth } from '@/lib/auth-context'

const statusStyles: Record<SubmissionStatus, string> = {
  new: 'bg-primary/15 text-white border-primary/30',
  in_progress: 'bg-blue-500/15 text-blue-200 border-blue-400/30',
  answered: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  ignored: 'bg-orange-500/15 text-orange-200 border-orange-400/30',
  archived: 'bg-zinc-500/15 text-zinc-200 border-zinc-400/30',
}

export default function AdminSubmissionsPage() {
  const { user, loading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionRecord | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | SubmissionRecord['type']>('all')

  async function getAuthHeaders() {
    const token = await user?.getIdToken()
    if (!token) {
      throw new Error('You must be signed in to access submissions.')
    }
    return { Authorization: `Bearer ${token}` }
  }

  async function fetchSubmissions() {
    if (!user) return

    try {
      setLoading(true)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/submissions', { cache: 'no-store', headers })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to load submissions.')
      }

      const nextSubmissions = Object.values(data.submissions || {}) as SubmissionRecord[]
      nextSubmissions.sort((a, b) => b.createdAt - a.createdAt)
      setSubmissions(nextSubmissions)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchSubmissions()
    }
    if (!authLoading && !user) {
      setLoading(false)
    }
  }, [authLoading, user])

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      if (statusFilter !== 'all' && submission.status !== statusFilter) return false
      if (typeFilter !== 'all' && submission.type !== typeFilter) return false
      return true
    })
  }, [statusFilter, submissions, typeFilter])

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      newCount: submissions.filter((submission) => submission.status === 'new').length,
      answered: submissions.filter((submission) => submission.status === 'answered').length,
      ignored: submissions.filter((submission) => submission.status === 'ignored').length,
    }
  }, [submissions])

  async function updateSubmissionStatus(submissionId: string, status: SubmissionStatus) {
    try {
      setSavingId(submissionId)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ submissionId, status }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update status.')
      }

      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === submissionId
            ? {
              ...submission,
              status,
              updatedAt: Date.now(),
              answeredAt: status === 'answered' ? Date.now() : submission.answeredAt,
            }
            : submission,
        ),
      )
      toast.success('Submission status updated.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status.')
    } finally {
      setSavingId(null)
    }
  }

  function CopyItem(target: HTMLElement, item: string) {
    navigator.clipboard.writeText(item);

    const label = target.querySelector("span");

    if (label) {
      const originalText = label.innerText;
      label.innerText = "Copied!";

      setTimeout(() => {
        label.innerText = originalText;
      }, 2000);
    }
  }

  function downloadAttachment(target: any, link: string) {
    let a = document.createElement("a");
    a.href = link
    a.target = "_blank"
    a.download = link.split("/")[link.split("/").length - 1]
    document.body.append(a);
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex min-h-screen max-h-[80vh] bg-background justify-between">
      <AdminSidebar />
      <main className="flex-1 p-2 mt-4 md:p-6 w-full md:pt-0 overflow-y-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground"><AdminSidebarToggleButton /> Submissions</h1>
            <p className="mt-1 text-muted-foreground">Review contact, quote, and brochure requests submitted from the website.</p>
          </div>
          <Button variant="ghost" className="bg-card shadow-lg border-white/10 rounded-full hover:text-white hover:bg-card/80 text-white/80" onClick={fetchSubmissions} disabled={loading || !user}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>

        <div className="mb-6 grid gap-4 grid-cols-2 xl:grid-cols-4 lg:grid-cols-4">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="New" value={stats.newCount} />
          <StatCard title="Answered" value={stats.answered} />
          <StatCard title="Ignored" value={stats.ignored} />
        </div>

        <Card className="bg-card shadow-lg border-white/10">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-foreground">Lead Inbox</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'all' | SubmissionRecord['type'])} className="brand-input border-white/10 min-w-[180px] bg-card rounded-lg px-3 py-2 text-sm">
                <option value="all">All types</option>
                <option value="contact">Contact</option>
                <option value="quote">Quote</option>
                <option value="brochure">Brochure</option>
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | SubmissionStatus)} className="brand-input border-white/10 bg-card min-w-[180px] rounded-lg px-3 py-2 text-sm">
                <option value="all">All statuses</option>
                {submissionStatusOptions.map((status) => (
                  <option key={status} value={status}>{submissionStatusLabels[status]}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {authLoading || loading ? (
              <div className="flex min-h-[240px] items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading submissions...
              </div>
            ) : !user ? (
              <div className="rounded-2xl border border-primary/15 bg-black/10 p-10 text-center text-muted-foreground">
                Sign in to access submission records.
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="rounded-2xl border border-primary/15 bg-black/10 p-10 text-center text-muted-foreground">
                No submissions found for the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-primary/15 text-xs uppercase tracking-[0.18em] text-white/70">
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission, index) => (
                      <tr
                        // onClick={(e) => {
                        //   if (e.target.tagName === "TD") {
                        //     document.getElementById(`${submission.id}view`)?.classList.add("hidden")
                        //   }

                        // }}
                        key={submission.id} className="border-b border-primary/10 align-top text-foreground/85">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-foreground">{submission.contactName}</div>
                          <div className="text-muted-foreground">{submission.companyName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            className={`border-primary/20 
                            ${submissionTypeLabels[submission.type].toLowerCase() === 'contact form' ? "bg-green-600/40" : submissionTypeLabels[submission.type].toLowerCase() === 'brochure request' ? "bg-blue-600/40" : "bg-cyan-600/40"} text-white`}>
                            {submissionTypeLabels[submission.type]}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">
                          {new Date(submission.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Badge className={statusStyles[submission.status]}>{submissionStatusLabels[submission.status]}</Badge>
                            <select value={submission.status} onChange={(event) => updateSubmissionStatus(submission.id, event.target.value as SubmissionStatus)} className="brand-input bg-card rounded-md px-2 py-1 text-xs" disabled={savingId === submission.id}>
                              {submissionStatusOptions.map((status) => (
                                <option key={status} value={status}>{submissionStatusLabels[status]}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-4 relative">
                          {/* <button><EllipsisVertical onClick={(e) => console.log(e.target.parentElement.nextElementSibling.classList.toggle("hidden"))} /></button> */}
                          <button className="bg-secondary rounded pe-4 pl-2 py-1 hover:bg-[#444] flex gap-3 text-sm items-center justify-start" onClick={() => setSelectedSubmission(submission)}>
                            <Eye className="h-4 w-4" /> <span>View</span>
                          </button>
                          <div id={`${submission.id}view`} className="flex flex-wrap gap-1 hidden flex-col position absolute bottom-end z-50 left-0 bg-secondary border rounded-xl p-2">
                            <button className="bg-secondary rounded pe-4 pl-2 py-1 hover:bg-[#444] flex gap-3 text-sm items-center justify-start" onClick={() => setSelectedSubmission(submission)}>
                              <Eye className="h-4 w-4" /> <span>View</span>
                            </button>
                            <button className="bg-secondary rounded pe-4 pl-2 py-1 hover:bg-[#444] flex gap-3 text-sm items-center justify-start" onClick={() => setSelectedSubmission(submission)}>
                              <Mail className="h-4 w-4" /> <span>Email</span>
                            </button>
                            <button className="bg-secondary rounded pe-4 pl-2 py-1 hover:bg-[#444] flex gap-3 text-sm items-center justify-start" onClick={() => setSelectedSubmission(submission)}>
                              <Phone className="h-4 w-4" /> <span>Call</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="max-w-3xl max-h-[95vh] py-3 overflow-auto">
            {selectedSubmission && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-primary text-start">{submissionTypeLabels[selectedSubmission.type]}</DialogTitle>
                </DialogHeader>
                <hr />
                <div className="container">
                  <div className="text-white/70 m-0 p-0">{new Date(selectedSubmission.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                  <div className="flex gap-1 flex-col py-2">
                    <div className="flex gap-2">
                      <div className="flex gap-2 flex-col me-auto">
                        <span className="text-white/60"><span className="text-white/90">Name</span>: {selectedSubmission.contactName}</span>
                        <span className="text-white/60"><span className="text-white/90">Company</span> : {selectedSubmission.companyName}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 me-auto flex-col">
                      <span className="text-white/60"><span className="text-white/90">Email</span> : {selectedSubmission.email}</span>
                      <span className="text-white/60"> <span className="text-white/90">Phone</span> : {`${selectedSubmission.countryCode || ''} ${selectedSubmission.phone}`.trim()}</span>
                    </div>
                  </div>

                  {submissionTypeLabels[selectedSubmission.type].toLowerCase() === 'contact form' &&
                    <>
                      <hr className="my-3" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 text-white/70">
                        <div className="flex flex-row gap-2">Exhibition : {selectedSubmission.exhibition && <span >{selectedSubmission.exhibition} </span>}</div>
                        <div className="flex flex-row gap-2">Stand Size : {selectedSubmission.standSize && <span >{selectedSubmission.standSize} </span>}</div>
                        <div className="flex flex-row gap-2">Event Type :  {selectedSubmission.eventType && <span >{selectedSubmission.eventType} </span>}</div>
                        <div className="flex flex-row gap-2">Budget : {selectedSubmission.budget && <span >{selectedSubmission.budget} </span>}</div>
                        <div className="flex flex-row gap-2">Source: {selectedSubmission.sourcePage && <span >{selectedSubmission.sourcePage === "/" ? "Home" : selectedSubmission.sourcePage} </span>}</div>

                      </div>
                      <hr className="my-2" />
                    </>
                  }
                  <div>
                    {selectedSubmission.message && (
                      <div className="mt-2 rounded-2xl">
                        <div className="mb-2 flex items-start justify-start gap-2 font-semibold text-white/60">
                          Message-:
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/80">{selectedSubmission.message}</p>
                      </div>
                    )}
                  </div>
                </div>
                <hr />
                <div className="flex justify-start flex-wrap gap-5">
                  <button onClick={(e:any) => CopyItem(e.target, selectedSubmission.email)}
                    className="bg-black/30 hover:bg-black/60 px-5 py-1 rounded-full flex gap-2 items-center">
                    <div className="pointer-events-none flex gap-2 items-center">
                      <Copy size={16} /> <span className="label">Email</span>
                    </div>
                  </button>
                  <button onClick={(e:any) => CopyItem(e.target, selectedSubmission.phone)}
                    className="bg-black/30 hover:bg-black/60 px-5 py-1 rounded-full flex gap-2 items-center">
                    <div className="pointer-events-none flex gap-2 items-center">
                      <Copy size={16} /> <span className="label">Phone</span>
                    </div>
                  </button>
                  {!selectedSubmission.attachment && <button onClick={(e) => downloadAttachment(e.target, 'https://www.expoexhibitionstands.co.in/wp-content/uploads/2021/03/exhibition-stall-design-catalogue-2021.pdf')}
                    className="bg-black/30 hover:bg-black/60 px-5 py-1 rounded-full flex gap-2 items-center">
                    <div className="pointer-events-none flex gap-2 items-center">
                      <Download size={16} /> <span className="label">Attachment</span>
                    </div>
                  </button>}

                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div >
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="bransd-panel border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-serif text-3xl text-white">{value}</div>
      </CardContent>
    </Card>
  )
}

