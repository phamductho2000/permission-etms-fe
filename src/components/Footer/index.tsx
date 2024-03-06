import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={'Copyright by FPT Information System'}
      links={[
        {
          key: 'HCMA',
          title: 'HCMA',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
