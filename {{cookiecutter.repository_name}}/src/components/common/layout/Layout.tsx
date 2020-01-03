import React, { memo, ReactNode } from 'react';
import NextHead from 'next/head';

interface LayoutProps {
  children?: ReactNode;
  title?: string;
}

export default memo(({ title, children }: LayoutProps) => (
  <>
    <NextHead>
      <title>{title || `Awesome`}</title>
    </NextHead>

    {children}
  </>
));
