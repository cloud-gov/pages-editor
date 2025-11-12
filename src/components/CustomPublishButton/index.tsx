'use client';

import React from 'react';
import { PublishButton, useAuth } from '@payloadcms/ui';
import { PublishButtonClientProps } from 'payload';

const CustomPublishButton: React.FC<PublishButtonClientProps> = (props) => {
  const { user } = useAuth();
  const selectedSiteId = user?.selectedSiteId;
  // Check if the user has the "manager" role
  const isManager = user?.sites?.some(site => site.site?.id === selectedSiteId && site.role === 'manager');

  if (isManager) {
    return <PublishButton  {...props} />;
  }

  // If the user is not a manager, do not render the button
  return null;
};

export default CustomPublishButton;
