import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

/**
 * Live 1-based position of each document of a type in its drag-and-drop
 * (orderRank) order, so the number column updates right after you reorder.
 *
 * One query + one listener per type, shared across all rows via a module cache.
 * On any change to a doc of that type (e.g. a drag updating orderRank) it
 * refetches and re-numbers. Returns null while loading / on error, so callers
 * fall back to the static `order` field and the column is never blank.
 */
type Entry = {
  map: Record<string, number>
  listeners: Set<() => void>
  started: boolean
}
const cache: Record<string, Entry> = {}

function ensure(type: string, client: ReturnType<typeof useClient>): Entry {
  let entry = cache[type]
  if (entry) return entry
  entry = cache[type] = { map: {}, listeners: new Set(), started: false }
  const query = `*[_type == $type && !(_id in path("drafts.**"))] | order(orderRank){ _id }`
  const params = { type }
  const refresh = () => {
    client
      .fetch<{ _id: string }[]>(query, params)
      .then((rows) => {
        const m: Record<string, number> = {}
        rows.forEach((r, i) => {
          m[r._id] = i + 1
        })
        entry!.map = m
        entry!.listeners.forEach((fn) => fn())
      })
      .catch(() => {})
  }
  entry.started = true
  refresh()
  try {
    client
      .listen(query, params, { visibility: 'query', includeResult: false })
      .subscribe({ next: () => refresh(), error: () => {} })
  } catch {
    /* listen unsupported — static fallback still works */
  }
  return entry
}

export function useOrderPosition(type?: string, id?: string): number | null {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [, force] = useState(0)
  useEffect(() => {
    if (!type) return
    const entry = ensure(type, client)
    const fn = () => force((x) => x + 1)
    entry.listeners.add(fn)
    return () => {
      entry.listeners.delete(fn)
    }
  }, [type, client])
  if (!type || !id) return null
  const base = id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
  return cache[type]?.map[base] ?? null
}
