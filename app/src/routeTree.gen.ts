/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PartyNewImport } from './routes/party/new'
import { Route as PartyIdMemberImport } from './routes/party/$id.member'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const PartyIdOwnerLazyImport = createFileRoute('/party/$id/owner')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const PartyNewRoute = PartyNewImport.update({
  id: '/party/new',
  path: '/party/new',
  getParentRoute: () => rootRoute,
} as any)

const PartyIdOwnerLazyRoute = PartyIdOwnerLazyImport.update({
  id: '/party/$id/owner',
  path: '/party/$id/owner',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/party/$id.owner.lazy').then((d) => d.Route),
)

const PartyIdMemberRoute = PartyIdMemberImport.update({
  id: '/party/$id/member',
  path: '/party/$id/member',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/party/new': {
      id: '/party/new'
      path: '/party/new'
      fullPath: '/party/new'
      preLoaderRoute: typeof PartyNewImport
      parentRoute: typeof rootRoute
    }
    '/party/$id/member': {
      id: '/party/$id/member'
      path: '/party/$id/member'
      fullPath: '/party/$id/member'
      preLoaderRoute: typeof PartyIdMemberImport
      parentRoute: typeof rootRoute
    }
    '/party/$id/owner': {
      id: '/party/$id/owner'
      path: '/party/$id/owner'
      fullPath: '/party/$id/owner'
      preLoaderRoute: typeof PartyIdOwnerLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/party/new': typeof PartyNewRoute
  '/party/$id/member': typeof PartyIdMemberRoute
  '/party/$id/owner': typeof PartyIdOwnerLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/party/new': typeof PartyNewRoute
  '/party/$id/member': typeof PartyIdMemberRoute
  '/party/$id/owner': typeof PartyIdOwnerLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/party/new': typeof PartyNewRoute
  '/party/$id/member': typeof PartyIdMemberRoute
  '/party/$id/owner': typeof PartyIdOwnerLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/party/new' | '/party/$id/member' | '/party/$id/owner'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/party/new' | '/party/$id/member' | '/party/$id/owner'
  id: '__root__' | '/' | '/party/new' | '/party/$id/member' | '/party/$id/owner'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  PartyNewRoute: typeof PartyNewRoute
  PartyIdMemberRoute: typeof PartyIdMemberRoute
  PartyIdOwnerLazyRoute: typeof PartyIdOwnerLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  PartyNewRoute: PartyNewRoute,
  PartyIdMemberRoute: PartyIdMemberRoute,
  PartyIdOwnerLazyRoute: PartyIdOwnerLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/party/new",
        "/party/$id/member",
        "/party/$id/owner"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/party/new": {
      "filePath": "party/new.tsx"
    },
    "/party/$id/member": {
      "filePath": "party/$id.member.tsx"
    },
    "/party/$id/owner": {
      "filePath": "party/$id.owner.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
