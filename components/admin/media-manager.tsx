'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import JSZip from 'jszip'
import { AdminSidebar, AdminSidebarToggleButton } from '@/components/admin/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { deleteMediaFile, fetchMediaFiles, updateMediaFile, uploadMediaFile } from '@/lib/media-client'
import type { MediaRecord, MediaScope } from '@/lib/types/media'
import type { SubmissionRecord } from '@/lib/types/submissions'
import {
  Archive,
  Copy,
  Download,
  EllipsisVertical,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'

const DEFAULT_PORTFOLIO_CATEGORIES = [
  'Technology',
  'Automotive',
  'Fashion and Beauty',
  'Food Industry',
  'Healthcare',
  'Environment',
]

const SHARED_CATEGORY_OPTIONS = ['Shared Files', 'Events Files', 'Event Content Files']

type SharedGroupLabel = 'Shared Files' | 'Events Files' | 'Event Content Files'

type SubmissionAttachmentRecord = {
  id: string
  fileName: string
  fileSize: number
  url: string
  downloadUrl?: string
}

type UploadFormState = {
  files: File[]
  category: string
  title: string
  description: string
}

function createInitialForm(scope: MediaScope): UploadFormState {
  return {
    files: [],
    category: scope === 'portfolio' ? DEFAULT_PORTFOLIO_CATEGORIES[0] : 'Shared Files',
    title: '',
    description: '',
  }
}

function formatFileSize(value: number) {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
  return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function isImage(file: MediaRecord) {
  return file.contentType.startsWith('image/')
}

function sortByDate(files: MediaRecord[]) {
  return [...files].sort((left, right) => right.createdAt - left.createdAt)
}

function normalizeSharedCategory(category?: string): SharedGroupLabel {
  const value = (category || '').trim().toLowerCase()
  if (value === 'events' || value === 'events files') return 'Events Files'
  if (value === 'event content' || value === 'event content files') return 'Event Content Files'
  return 'Shared Files'
}

function getBreakdownPercent(size: number, total: number) {
  if (total <= 0) return 0
  return Math.round((size / total) * 100)
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

export function AdminMediaManager({ initialTab = 'portfolio' }: { initialTab?: MediaScope }) {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<MediaScope>(initialTab)
  const [files, setFiles] = useState<MediaRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [uploadingScope, setUploadingScope] = useState<MediaScope | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadLabel, setUploadLabel] = useState('')
  const [portfolioForm, setPortfolioForm] = useState<UploadFormState>(createInitialForm('portfolio'))
  const [sharedForm, setSharedForm] = useState<UploadFormState>(createInitialForm('shared'))
  const [submissionAttachments, setSubmissionAttachments] = useState<SubmissionAttachmentRecord[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [actioning, setActioning] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const portfolioInputRef = useRef<HTMLInputElement | null>(null)
  const sharedInputRef = useRef<HTMLInputElement | null>(null)

  async function getUserToken() {
    const token = await user?.getIdToken()
    if (!token) {
      throw new Error('You must be signed in to manage storage.')
    }
    return token
  }

  async function loadFiles(showSpinner = true) {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      if (showSpinner) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      const token = await getUserToken()
      const [nextFiles, submissionsResponse] = await Promise.all([
        fetchMediaFiles(token),
        fetch('/api/submissions', {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      const submissionsData = (await submissionsResponse.json().catch(() => null)) as { submissions?: Record<string, SubmissionRecord>; error?: string } | null
      if (!submissionsResponse.ok) {
        throw new Error(submissionsData?.error || 'Failed to load form attachments.')
      }
      const nextAttachments = Object.values(submissionsData?.submissions || {})
        .filter((submission) => submission.attachment?.url && submission.attachment?.fileSize)
        .map((submission) => ({
          id: submission.id,
          fileName: submission.attachment!.fileName,
          fileSize: submission.attachment!.fileSize,
          url: submission.attachment!.url,
          downloadUrl: submission.attachment!.downloadUrl,
        }))
      setFiles(sortByDate(nextFiles))
      setSubmissionAttachments(nextAttachments)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load media files.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      loadFiles()
    }
    if (!authLoading && !user) {
      setLoading(false)
    }
  }, [authLoading, user])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      if (!target?.closest('[data-row-menu]')) {
        setOpenMenuId(null)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const portfolioFiles = useMemo(() => files.filter((file) => file.scope === 'portfolio'), [files])
  const sharedFiles = useMemo(() => files.filter((file) => file.scope === 'shared'), [files])
  const groupedPortfolioFiles = useMemo(() => {
    return portfolioFiles.reduce<Record<string, MediaRecord[]>>((groups, file) => {
      const key = file.category || 'Uncategorized'
      groups[key] = groups[key] ? [...groups[key], file] : [file]
      return groups
    }, {})
  }, [portfolioFiles])
  const groupedSharedFiles = useMemo(() => {
    return sharedFiles.reduce<Record<SharedGroupLabel, MediaRecord[]>>(
      (groups, file) => {
        const key = normalizeSharedCategory(file.category)
        groups[key] = groups[key] ? [...groups[key], file] : [file]
        return groups
      },
      {
        'Shared Files': [],
        'Events Files': [],
        'Event Content Files': [],
      },
    )
  }, [sharedFiles])
  const totalStorage = useMemo(
    () => files.reduce((total, file) => total + file.size, 0) + submissionAttachments.reduce((total, file) => total + file.fileSize, 0),
    [files, submissionAttachments],
  )
  const storageBreakdown = useMemo(() => {
    const portfolioSize = portfolioFiles.reduce((total, file) => total + file.size, 0)
    const sharedSize = groupedSharedFiles['Shared Files'].reduce((total, file) => total + file.size, 0)
    const eventSize = groupedSharedFiles['Events Files'].reduce((total, file) => total + file.size, 0)
    const contentSize = groupedSharedFiles['Event Content Files'].reduce((total, file) => total + file.size, 0)
    const formSize = submissionAttachments.reduce((total, file) => total + file.fileSize, 0)
    return [
      { label: 'Portfolios', size: portfolioSize },
      { label: 'Shared Files', size: sharedSize },
      { label: 'Events Files', size: eventSize },
      { label: 'Content Files', size: contentSize },
      { label: 'Form Attachments', size: formSize },
    ]
  }, [groupedSharedFiles, portfolioFiles, submissionAttachments])

  function updateForm(scope: MediaScope, updater: (current: UploadFormState) => UploadFormState) {
    if (scope === 'portfolio') {
      setPortfolioForm((current) => updater(current))
      return
    }
    setSharedForm((current) => updater(current))
  }

  function resetForm(scope: MediaScope) {
    if (scope === 'portfolio') {
      setPortfolioForm(createInitialForm('portfolio'))
      if (portfolioInputRef.current) portfolioInputRef.current.value = ''
      return
    }
    setSharedForm(createInitialForm('shared'))
    if (sharedInputRef.current) sharedInputRef.current.value = ''
  }

  function toggleSelection(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  function setCategorySelection(items: MediaRecord[], shouldSelect: boolean) {
    const categoryIds = items.map((item) => item.id)
    setSelectedIds((current) => {
      if (shouldSelect) {
        return Array.from(new Set([...current, ...categoryIds]))
      }
      return current.filter((id) => !categoryIds.includes(id))
    })
  }

  async function handleUpload(scope: MediaScope) {
    const form = scope === 'portfolio' ? portfolioForm : sharedForm
    if (form.files.length === 0) {
      toast.error('Choose at least one file to upload.')
      return
    }

    try {
      const token = await getUserToken()
      setUploadingScope(scope)
      setUploadProgress(0)

      const uploadedFiles: MediaRecord[] = []
      for (let index = 0; index < form.files.length; index += 1) {
        const file = form.files[index]
        setUploadLabel(file.name)
        const uploadedFile = await uploadMediaFile({
          token,
          file,
          scope,
          category: form.category,
          title: form.files.length === 1 ? form.title : '',
          description: form.description,
          onProgress: (progress) => {
            const combinedProgress = ((index + progress / 100) / form.files.length) * 100
            setUploadProgress(Math.min(100, Math.round(combinedProgress)))
          },
        })
        uploadedFiles.push(uploadedFile)
      }

      setFiles((current) => sortByDate([...uploadedFiles, ...current]))
      resetForm(scope)
      toast.success(`${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's were' : ' was'} uploaded.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setUploadingScope(null)
      setUploadProgress(0)
      setUploadLabel('')
    }
  }

  async function handleDelete(file: MediaRecord) {
    if (!window.confirm(`Delete ${file.originalName}?`)) {
      return
    }

    try {
      const token = await getUserToken()
      await deleteMediaFile(file.id, token)
      setFiles((current) => current.filter((item) => item.id !== file.id))
      setSelectedIds((current) => current.filter((item) => item !== file.id))
      setOpenMenuId(null)
      toast.success('File deleted.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete file.')
    }
  }
  async function handleArchive(file: MediaRecord) {
    try {
      const token = await getUserToken()
      const updatedFile = await updateMediaFile(file.id, token, {
        status: file.status === 'active' ? 'archived' : 'active',
      })
      setFiles((current) => current.map((item) => (item.id === updatedFile.id ? updatedFile : item)))
      setOpenMenuId(null)
      toast.success(file.status === 'active' ? 'File archived.' : 'File restored.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update file status.')
    }
  }

  async function handleCopyLink(file: MediaRecord) {
    try {
      await navigator.clipboard.writeText(file.url)
      setOpenMenuId(null)
      toast.success('Public link copied.')
    } catch {
      toast.error('Failed to copy the link.')
    }
  }

  function openPreview(file: MediaRecord) {
    setOpenMenuId(null)
    window.open(`/api/media/${file.id}?action=preview`, '_blank', 'noopener,noreferrer')
  }

  function openDownload(file: MediaRecord) {
    setOpenMenuId(null)
    window.open(`/api/media/${file.id}?action=download`, '_blank', 'noopener,noreferrer')
  }

  async function handleBulkArchive(items: MediaRecord[]) {
    if (items.length === 0) {
      toast.error('Select at least one asset first.')
      return
    }

    try {
      setActioning('archive')
      const token = await getUserToken()
      const updatedItems = await Promise.all(items.map((item) => updateMediaFile(item.id, token, { status: 'archived' })))
      setFiles((current) => current.map((file) => updatedItems.find((item) => item.id === file.id) || file))
      setSelectedIds((current) => current.filter((id) => !items.some((item) => item.id === id)))
      toast.success(`${updatedItems.length} asset${updatedItems.length > 1 ? 's archived.' : ' archived.'}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to archive selected assets.')
    } finally {
      setActioning(null)
    }
  }

  async function handleBulkDelete(items: MediaRecord[]) {
    if (items.length === 0) {
      toast.error('Select at least one asset first.')
      return
    }

    if (!window.confirm(`Delete ${items.length} selected asset${items.length > 1 ? 's' : ''}?`)) {
      return
    }

    try {
      setActioning('delete')
      const token = await getUserToken()
      await Promise.all(items.map((item) => deleteMediaFile(item.id, token)))
      const removedIds = new Set(items.map((item) => item.id))
      setFiles((current) => current.filter((item) => !removedIds.has(item.id)))
      setSelectedIds((current) => current.filter((id) => !removedIds.has(id)))
      toast.success(`${items.length} asset${items.length > 1 ? 's deleted.' : ' deleted.'}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete selected assets.')
    } finally {
      setActioning(null)
    }
  }

  async function handleBulkDownload(items: MediaRecord[], category: string) {
    if (items.length === 0) {
      toast.error('Select at least one asset first.')
      return
    }

    try {
      setActioning('download')
      const zip = new JSZip()
      await Promise.all(
        items.map(async (item) => {
          const response = await fetch(item.url)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${item.originalName}`)
          }
          const fileBlob = await response.blob()
          zip.file(item.originalName || item.storedName, fileBlob)
        }),
      )

      const archiveBlob = await zip.generateAsync({ type: 'blob' })
      triggerBrowserDownload(archiveBlob, `${category.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'portfolio'}-assets.zip`)
      toast.success(`Downloaded ${items.length} selected asset${items.length > 1 ? 's' : ''}.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download selected assets.')
    } finally {
      setActioning(null)
    }
  }

  return (
    <div className="flex min-h-screen max-h-[80vh] overflow-hidden bg-card">
      <AdminSidebar />
      <main className="w-full overflow-y-auto px-2 md:px-8 lg:px-8 lg:pb-4">
        <div className="mb-8 flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground"><AdminSidebarToggleButton /> Blob Storage</h1>
            <p className="mt-1 text-muted-foreground">
              Manage portfolio media, public share files, and reusable upload endpoints from one place.
            </p>
          </div>
          <button
            className="flex items-center gap-2 rounded-full border border-white/10 bg-background p-3 px-5 text-white hover:bg-card/70"
            onClick={() => loadFiles(false)}
            disabled={refreshing || loading || !user}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="All Files" value={String(files.length)} subtitle="Blob metadata records" />
          <SummaryCard title="Portfolio Assets" value={String(portfolioFiles.length)} subtitle="Website media grouped by category" />
          <SummaryCard title="Public Share Files" value={String(sharedFiles.length)} subtitle="Shared, event, and event-content uploads" />
          <SummaryCard title="Storage Used" value={formatFileSize(totalStorage)} subtitle="Includes form attachments" />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {storageBreakdown.map((item) => (
            <StorageBreakdownCard
              key={item.label}
              title={item.label}
              value={formatFileSize(item.size)}
              percent={getBreakdownPercent(item.size, totalStorage)}
            />
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MediaScope)}>
          <TabsList className="mb-6 h-auto rounded-full border border-white/20 bg-card p-1">
            <TabsTrigger value="portfolio" className="rounded-full px-5 data-[state=active]:bg-primary data-[state=active]:text-black">
              Portfolio Assets
            </TabsTrigger>
            <TabsTrigger value="shared" className="rounded-full px-5 data-[state=active]:bg-primary data-[state=active]:text-black">
              Public Share Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6 bg-card">
            <UploadPanel
              title="Upload Portfolio Images"
              description="Images are compressed before upload, stored in Vercel Blob, and grouped by category for portfolio use."
              form={portfolioForm}
              scope="portfolio"
              categories={DEFAULT_PORTFOLIO_CATEGORIES}
              inputRef={portfolioInputRef}
              uploading={uploadingScope === 'portfolio'}
              progress={uploadProgress}
              uploadLabel={uploadLabel}
              onChange={updateForm}
              onUpload={handleUpload}
            />

            {authLoading || loading ? (
              <LoadingState />
            ) : !user ? (
              <EmptyState message="Sign in to access Blob storage." />
            ) : portfolioFiles.length === 0 ? (
              <EmptyState message="No portfolio assets uploaded yet." />
            ) : (
              Object.entries(groupedPortfolioFiles)
                .sort(([left], [right]) => left.localeCompare(right))
                .map(([category, items]) => {
                  const sortedItems = sortByDate(items)
                  const selectedItems = sortedItems.filter((item) => selectedIds.includes(item.id))
                  const allSelected = sortedItems.length > 0 && selectedItems.length === sortedItems.length

                  return (
                    <Card key={category} className="border-white/10 bg-card">
                      <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-4 bg-card pb-3">
                        <div className="w-full">
                          <CardTitle className="text-xl text-foreground">{category}</CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{items.length} asset{items.length > 1 ? 's' : ''}</p>
                          <div className="my-3 flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-2 rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={allSelected}
                                onChange={(event) => setCategorySelection(sortedItems, event.target.checked)}
                              />
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </label>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-black/50"
                              onClick={() => handleBulkDownload(selectedItems, category)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'download' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                              Download ZIP
                            </button>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-black/50"
                              onClick={() => handleBulkArchive(selectedItems)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'archive' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                              Archive
                            </button>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-red-600"
                              onClick={() => handleBulkDelete(selectedItems)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              Delete
                            </button>
                            <span className="text-sm text-muted-foreground">{selectedItems.length} selected</span>
                          </div>
                          <hr className="bg-white/10" />
                        </div>
                      </CardHeader>
                      <CardContent className="grid max-h-screen items-start min-h-80 grid-cols-1 gap-3 overflow-auto">
                        {sortedItems.map((file) => (
                          <MediaRow
                            key={file.id}
                            file={file}
                            selected={selectedIds.includes(file.id)}
                            menuOpen={openMenuId === file.id}
                            onToggleSelect={toggleSelection}
                            onToggleMenu={setOpenMenuId}
                            onPreview={openPreview}
                            onDownload={openDownload}
                            onCopyLink={handleCopyLink}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </TabsContent>
          <TabsContent value="shared" className="space-y-6">
            <UploadPanel
              title="Upload Public Share Files"
              description="Use this for brochures, docs, ZIPs, PDFs, and any file you want to host publicly and share directly."
              form={sharedForm}
              scope="shared"
              categories={SHARED_CATEGORY_OPTIONS}
              inputRef={sharedInputRef}
              uploading={uploadingScope === 'shared'}
              progress={uploadProgress}
              uploadLabel={uploadLabel}
              onChange={updateForm}
              onUpload={handleUpload}
            />

            {authLoading || loading ? (
              <LoadingState />
            ) : !user ? (
              <EmptyState message="Sign in to access Blob storage." />
            ) : sharedFiles.length === 0 ? (
              <EmptyState message="No share files uploaded yet." />
            ) : (
              (Object.entries(groupedSharedFiles) as [SharedGroupLabel, MediaRecord[]][])
                .filter(([, items]) => items.length > 0)
                .map(([category, items]) => {
                  const sortedItems = sortByDate(items)
                  const selectedItems = sortedItems.filter((item) => selectedIds.includes(item.id))
                  const allSelected = sortedItems.length > 0 && selectedItems.length === sortedItems.length

                  return (
                    <Card key={category} className="border-white/10 bg-card">
                      <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-4 bg-card pb-3">
                        <div className="w-full">
                          <CardTitle className="text-xl text-foreground">{category}</CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{items.length} asset{items.length > 1 ? 's' : ''}</p>
                          <div className="my-3 flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-2 rounded border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={allSelected}
                                onChange={(event) => setCategorySelection(sortedItems, event.target.checked)}
                              />
                              {allSelected ? 'Deselect All' : 'Select All'}
                            </label>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-black/50"
                              onClick={() => handleBulkDownload(selectedItems, category)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'download' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                              Download ZIP
                            </button>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-black/50"
                              onClick={() => handleBulkArchive(selectedItems)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'archive' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                              Archive
                            </button>
                            <button
                              className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 disabled:opacity-50 hover:bg-red-600"
                              onClick={() => handleBulkDelete(selectedItems)}
                              disabled={selectedItems.length === 0 || actioning !== null}
                            >
                              {actioning === 'delete' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              Delete
                            </button>
                            <span className="text-sm text-muted-foreground">{selectedItems.length} selected</span>
                          </div>
                          <hr className="bg-white/10" />
                        </div>
                      </CardHeader>
                      <CardContent className="grid max-h-screen items-start min-h-80 grid-cols-1 gap-3 overflow-auto">
                        {sortedItems.map((file) => (
                          <MediaRow
                            key={file.id}
                            file={file}
                            selected={selectedIds.includes(file.id)}
                            menuOpen={openMenuId === file.id}
                            onToggleSelect={toggleSelection}
                            onToggleMenu={setOpenMenuId}
                            onPreview={openPreview}
                            onDownload={openDownload}
                            onCopyLink={handleCopyLink}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function UploadPanel({
  title,
  description,
  form,
  scope,
  categories,
  inputRef,
  uploading,
  progress,
  uploadLabel,
  onChange,
  onUpload,
}: {
  title: string
  description: string
  form: UploadFormState
  scope: MediaScope
  categories: string[]
  inputRef: RefObject<HTMLInputElement | null>
  uploading: boolean
  progress: number
  uploadLabel: string
  onChange: (scope: MediaScope, updater: (current: UploadFormState) => UploadFormState) => void
  onUpload: (scope: MediaScope) => void
}) {
  return (
    <Card className="border-white/10 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Category</label>
            <input
              list={`${scope}-categories`}
              value={form.category}
              onChange={(event) => onChange(scope, (current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-white/20 px-4 py-3"
              placeholder="Select or type a category"
            />
            <datalist id={`${scope}-categories`}>
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Custom Title</label>
            <input
              value={form.title}
              onChange={(event) => onChange(scope, (current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-white/20 px-4 py-3"
              placeholder="Optional for single-file uploads"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-white/80">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => onChange(scope, (current) => ({ ...current, description: event.target.value }))}
              className="min-h-[120px] w-full rounded-xl border border-white/20 px-4 py-3"
              placeholder="Optional notes, usage context, or campaign details"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="space-y-3">
            <label className="mb-5 text-sm text-white/80">Files</label>
            <label className="mt-3 flex min-h-[156px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/30 bg-black/20 px-4 py-6 text-center transition hover:border-white/55 hover:bg-black/30">
              <FolderOpen className="mb-3 h-7 w-7 text-white" />
              <span className="text-sm text-foreground">Choose file{scope === 'portfolio' ? 's' : ''}</span>
              <span className="mt-1 text-xs text-muted-foreground">
                {form.files.length > 0 ? `${form.files.length} selected` : scope === 'portfolio' ? 'Images recommended' : 'Images, PDFs, docs, ZIPs, and more'}
              </span>
              <input
                ref={inputRef}
                type="file"
                multiple={scope === 'portfolio'}
                accept={scope === 'portfolio' ? 'image/*' : undefined}
                className="hidden"
                onChange={(event) => {
                  const nextFiles = event.target.files ? Array.from(event.target.files) : []
                  onChange(scope, (current) => ({ ...current, files: nextFiles }))
                }}
              />
            </label>
            {form.files.length > 0 && (
              <div className="max-h-[180px] overflow-auto rounded-2xl border border-white/10 bg-black/15 p-3 text-sm text-white/75">
                {form.files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="grid grid-cols-[20px_1fr_70px]">
                    <span>{index + 1}.</span>
                    <span>{file.name}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mx-auto mt-4 max-w-80 space-y-10">
            <button className="flex w-full items-center gap-2 rounded border border-white/20 px-3 py-3 text-primary" disabled={uploading} onClick={() => onUpload(scope)}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload to Blob'}
            </button>
            {uploading && (
              <div className="space-y-2 rounded-2xl border border-white/20 bg-black/20 p-4">
                <div className="text-sm text-white/80">{uploadLabel || 'Preparing upload...'}</div>
                <Progress value={progress} className="h-2 bg-white/10" />
                <div className="text-xs text-muted-foreground">{progress}% complete</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
function MediaRow({
  file,
  selected,
  menuOpen,
  onToggleSelect,
  onToggleMenu,
  onPreview,
  onDownload,
  onCopyLink,
  onArchive,
  onDelete,
}: {
  file: MediaRecord
  selected: boolean
  menuOpen: boolean
  onToggleSelect: (id: string) => void
  onToggleMenu: (id: string | null) => void
  onPreview: (file: MediaRecord) => void
  onDownload: (file: MediaRecord) => void
  onCopyLink: (file: MediaRecord) => void
  onArchive: (file: MediaRecord) => void
  onDelete: (file: MediaRecord) => void
}) {
  return (
    <div className={`relative grid w-full items-start gap-3 rounded-lg p-2 md:grid-cols-[30px_100px_1.2fr_1fr_72px] ${selected ? 'bg-primary/10 ring-1 ring-primary/30' : file.status === 'archived' ? 'bg-white/10' : 'bg-black/30 hover:bg-black/50'}`}>
      <div className="pt-2">
        <input className="h-5 w-5" type="checkbox" checked={selected} onChange={() => onToggleSelect(file.id)} />
      </div>
      <div className="pt-1">
        {isImage(file) ? (
          <img className="max-h-20 max-w-32 rounded object-contain" alt={file.title} width={70} src={file.url} />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded bg-black/30 text-primary"><FileText className="h-8 w-8" /></div>
        )}
      </div>
      <div className="pt-1">
        <h4 className="text-sm font-semibold uppercase text-foreground">{file.title}</h4>
        <div className="mt-1 text-sm text-muted-foreground">{file.originalName}</div>
      </div>
      <div className="pt-1">
        <div className="my-1 text-xs uppercase tracking-[0.16em] text-primary/75">
          {formatFileSize(file.size)}
          {file.compressed ? ` from ${formatFileSize(file.originalSize)}` : ''}
        </div>
        <div className="text-xs uppercase tracking-[0.16em] text-white/55">Status: {file.status}</div>
      </div>
      <div className="relative grid grid-cols-2 gap-1 pt-1" data-row-menu>
        <button className="rounded p-2 hover:bg-white/10" onClick={() => onPreview(file)}><Eye className="h-4 w-4" /></button>
        <button className="rounded p-2 hover:bg-white/10" onClick={() => onToggleMenu(menuOpen ? null : file.id)}><EllipsisVertical className="h-4 w-4" /></button>
        {menuOpen && (
          <div className="absolute right-0 top-10 z-50 w-44 rounded border border-white/10 bg-[#222] p-2 shadow-xl">
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-1 hover:bg-black/80" onClick={() => onDownload(file)}><Download className="h-4 w-4" /> Download</button>
              <button className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-1 hover:bg-black/80" onClick={() => onCopyLink(file)}><Copy className="h-4 w-4" /> Copy Link</button>
              <button className="flex items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-1 hover:bg-black/80" onClick={() => onArchive(file)}><Archive className="h-4 w-4" /> {file.status === 'active' ? 'Archive' : 'Restore'}</button>
              <button className="flex items-center justify-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-1 hover:bg-red-600" onClick={() => onDelete(file)}>
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <Card className="border-white/10 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-serif text-3xl text-white">{value}</div>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function StorageBreakdownCard({ title, value, percent }: { title: string; value: string; percent: number }) {
  return (
    <Card className="border-white/10 bg-card">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="mt-1 text-lg font-semibold text-white">{value}</div>
          </div>
          <div className="text-sm font-semibold text-primary">{percent}%</div>
        </div>
        <Progress value={percent} className="h-2 bg-white/10" />
      </CardContent>
    </Card>
  )
}

function LoadingState() {
  return (
    <Card className="brand-panel border-white/10">
      <CardContent className="flex min-h-[240px] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading media files...
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-white/10 bg-card">
      <CardContent className="flex min-h-[180px] items-center justify-center text-center text-xl text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  )
}
