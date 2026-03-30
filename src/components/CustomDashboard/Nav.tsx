import React from 'react'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { buildFilteredUrl, getCollectionTypes, getUserSiteInfo } from '@/components/utilities'
import NavClient from './NavClient'

const Nav: React.FC<{ payload: BasePayload }> = async ({ payload }) => {
  const headers = nextHeaders()

  const collectionTypes = await getCollectionTypes(payload, headers)
  const collectionTypeLinks = collectionTypes.docs.map(ct => ({
    id: ct.id.toString(),
    title: ct.title,
    slug: ct.slug,
    href: buildFilteredUrl(ct.id),
  }));

  const { user, selectedSiteRole } = await getUserSiteInfo(payload, headers)

  return (
    <NavClient
      collectionTypeLinks={collectionTypeLinks}
      user={user}
      selectedSiteRole={selectedSiteRole}
    />
  );
};

export default Nav;
