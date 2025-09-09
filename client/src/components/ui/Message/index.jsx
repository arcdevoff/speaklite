'use client';
import React from 'react';
import { IconSquareRoundedCheckFilled, IconSquareRoundedXFilled } from '@tabler/icons-react';
import styles from './Message.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';

const Message = () => {
  const { message } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const onCloseMessage = React.useCallback(() => {
    dispatch(setMessage({ text: null, status: null }));
  }, [dispatch]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onCloseMessage();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message.text, onCloseMessage]);

  if (!message.text) {
    return '';
  } else {
    return (
      <div onClick={() => onCloseMessage()} className={styles.root}>
        <div className={`${message.status ? styles.success : styles.error}`}>
          {message.status ? <IconSquareRoundedCheckFilled /> : <IconSquareRoundedXFilled />}
          <span className={styles.text}>{message.text}</span>
        </div>
      </div>
    );
  }
};

export default Message;
