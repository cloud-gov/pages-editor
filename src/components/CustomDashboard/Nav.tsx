import React from 'react'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { buildFilteredUrl, getCollectionTypes, getTagTypes, getUserSiteInfo } from '@/components/utilities'
import NavClient from './NavClient'

const Nav: React.FC<{ payload: BasePayload }> = async ({ payload }) => {
  const headers = await nextHeaders()

  const collectionTypes = await getCollectionTypes(payload, headers)
  const collectionTypeLinks = collectionTypes.docs.map(ct => ({
    id: ct.id.toString(),
    title: ct.title,
    slug: ct.slug,
    href: buildFilteredUrl(ct.id, 'collection-entries', 'collectionType'),
  }));

  const { user, selectedSiteRole } = await getUserSiteInfo(payload, headers)

  const tagTypes = await getTagTypes(payload, headers)
  const tagTypeLinks = tagTypes.docs.map(tt => ({
    id: tt.id.toString(),
    title: tt.title,
    slug: tt.slug,
    href: buildFilteredUrl(tt.id, 'tags', 'tagTypes'),
  }));

  return (
    <NavClient
      collectionTypeLinks={collectionTypeLinks}
      user={user}
      selectedSiteRole={selectedSiteRole}
      tagTypeLinks={tagTypeLinks}
    />
  );
};

export default Nav;
