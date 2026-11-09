import { lazy, Suspense, useEffect } from 'react'
import { usePath } from './router'
import { loadDocs, loadLanding } from './routes'
import { pageByPath, SITE_NAME } from './site'

const LandingPage = lazy(loadLanding)
const DocsApp = lazy(loadDocs)

function App() {
  const path = usePath()
  const page = pageByPath.get(path)

  useEffect(() => {
    document.title = path === '/' ? SITE_NAME : !page ? `Page not found · ${SITE_NAME}` : `${page.title} · ${SITE_NAME}`
  }, [page, path])

  // A deep link to a heading: the browser looked for it before React rendered, so jump once the page is there.
  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    const jump = () => document.getElementById(id)?.scrollIntoView()
    if (document.getElementById(id)) return jump()
    const observer = new MutationObserver(() => {
      if (!document.getElementById(id)) return
      observer.disconnect()
      jump()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const timer = setTimeout(() => observer.disconnect(), 5000)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return <Suspense fallback={null}>{path === '/' ? <LandingPage /> : <DocsApp path={path} />}</Suspense>
}

export default App
