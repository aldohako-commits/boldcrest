'use client'

/**
 * Custom Studio document actions to delete ONE version of a document instead of
 * both. Sanity's built-in "Delete" removes the published doc AND its draft
 * together; these let you remove just the draft (keeping the live version) or
 * just the published version (keeping the draft). Each action only shows when
 * that version actually exists, and asks for confirmation first.
 *
 * `props.id` is the base (published) id with no `drafts.` prefix, so the draft
 * lives at `drafts.${id}` and the published doc at `${id}`.
 */
import {useState} from 'react'
import {useClient, useToast, type DocumentActionComponent} from 'sanity'
import {TrashIcon} from '@sanity/icons'

const API_VERSION = '2024-01-01'

function describeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  // Sanity blocks deleting a doc that other docs still reference.
  return /reference/i.test(msg)
    ? 'Other documents still reference this one, so Sanity won’t delete it.'
    : msg
}

export const deleteDraftAction: DocumentActionComponent = (props) => {
  const {id, draft, onComplete} = props
  const client = useClient({apiVersion: API_VERSION})
  const toast = useToast()
  const [open, setOpen] = useState(false)

  // Nothing to discard if there are no unpublished changes.
  if (!draft) return null

  return {
    label: 'Delete draft only',
    icon: TrashIcon,
    tone: 'caution',
    onHandle: () => setOpen(true),
    dialog: open && {
      type: 'confirm',
      tone: 'critical',
      message:
        'Delete the unpublished draft (your latest edits)? The published, live version stays exactly as it is. This cannot be undone.',
      onCancel: () => setOpen(false),
      onConfirm: async () => {
        try {
          await client.delete(`drafts.${id}`)
          toast.push({status: 'success', title: 'Draft deleted — published version kept'})
          setOpen(false)
          onComplete()
        } catch (err) {
          toast.push({status: 'error', title: 'Could not delete draft', description: describeError(err)})
          setOpen(false)
        }
      },
    },
  }
}

export const deletePublishedAction: DocumentActionComponent = (props) => {
  const {id, published, draft, onComplete} = props
  const client = useClient({apiVersion: API_VERSION})
  const toast = useToast()
  const [open, setOpen] = useState(false)

  // Nothing to delete if it was never published.
  if (!published) return null

  return {
    label: 'Delete published only',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: () => setOpen(true),
    dialog: open && {
      type: 'confirm',
      tone: 'critical',
      message: draft
        ? 'Delete the published (live) version? The draft stays, so you can re-publish later. This cannot be undone.'
        : 'Delete the published (live) version? There is no draft, so the whole document will be removed from the site. This cannot be undone.',
      onCancel: () => setOpen(false),
      onConfirm: async () => {
        try {
          await client.delete(id)
          toast.push({
            status: 'success',
            title: draft ? 'Published version deleted — draft kept' : 'Published document deleted',
          })
          setOpen(false)
          onComplete()
        } catch (err) {
          toast.push({status: 'error', title: 'Could not delete published version', description: describeError(err)})
          setOpen(false)
        }
      },
    },
  }
}
