import React from 'react';

const MyReviewItem = ({ info }) => {
  const { content, statNm } = info;
  return (
    <div className='chargeSpaceItem'>
      <div className='chargeSpaceTitle'>{content}</div>
      <div className='chargeSpaceInfo'>{statNm}</div>
    </div>
  );
};

export default MyReviewItem;
