'use client';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import styles from './UserSubscribed.module.scss';
import { useRouter } from 'next/navigation';

const UserSubscribed = () => {
  const user = useSelector((state) => state.user.data);
  const router = useRouter();

  if (user.subscription) {
    return (
      <div className={styles.root}>
        {user.subscription.is_active ? (
          <>
            <div className="title">✨ Подписка успешно оформлена</div>
            <p>
              Подписка активна до{' '}
              {DateTime.fromSeconds(user.subscription.end_date).toFormat('dd.MM.yyyy HH:mm')}
            </p>
          </>
        ) : (
          <>
            <div className="title">❌ Подписка не оформлена</div>
          </>
        )}

        <button onClick={() => router.push('/')}>Домой</button>
      </div>
    );
  }
};

export default UserSubscribed;
