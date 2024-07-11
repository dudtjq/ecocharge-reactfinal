import React from 'react';

const InquiryItem = ({ info }) => {
  const { qtitle, qcontent } = info;
  return (
    <div className='inquiryItem'>
      <div className='inquiryTitle'>{qtitle}</div>
      <div className='inquiryContent'>{qcontent}</div>
    </div>
  );
};

export default InquiryItem;
