import React, { memo } from 'react';
import { NextPage } from 'next';

import Layout from 'components/common/layout';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <div>Home Page</div>
    </Layout>
  );
};

export default memo(HomePage);
