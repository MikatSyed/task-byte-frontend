import OrganizationDetails from '@/components/page/OrganizationDetails';
import React from 'react';

type IDProps = {
    params: any;
  };

const page = ({ params }: IDProps) => {
    const { id } = params;
    return (
        <>
           <OrganizationDetails id={id} />
        </>
    );
};

export default page;
