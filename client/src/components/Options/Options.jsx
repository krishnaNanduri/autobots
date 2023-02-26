import React from 'react';

import './Options.css';

const Options = (props) => {
  const quickReplies = props.payload.options.quickReplies;
  
  const options = quickReplies.map((option, index) => ({
    text: option,
    handler: () => {
      props.actions.handleMessage(option, 'options');
    },
    id: index,
  }));

  if(quickReplies.length > 2) {
    options.push({
      text: '...',
      handler: () => {
        props.actions.handleMessage('more', 'options');
      },
      id: 3,
    });
  }
    

  const buttonsMarkup = options.map((option) => (
    <button key={option.id} onClick={option.handler} className='option-button'>
      {option.text}
    </button>
  ));

  return <div className='options-container'>{buttonsMarkup}</div>;
};

export default Options;
