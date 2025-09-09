'use client';
import React from 'react';
import styles from './HeaderUser.module.scss';
import ContentLoader from 'react-content-loader';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { UserService } from '@/services/user.service';
import getApiMessage from '@/utils/getApiMessage';
import { useDispatch } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';

const HeaderUser = () => {
  const { user, isLoading, logout } = useUser();
  const [showUserProfile, setShowUserProfile] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onClickSubscribe = () => {
    UserService.subscribe()
      .then((data) => {
        router.push(data.redirect);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          router.push('/auth/login');
        } else {
          const msg = getApiMessage(error.response);

          if (msg) {
            dispatch(setMessage(msg));
          }
        }
      });
  };

  if (isLoading) {
    return (
      <div className={styles.root}>
        <ContentLoader
          speed={2}
          width={110}
          height={38}
          viewBox="0 0 110 38"
          backgroundColor="#f3f3f3"
          foregroundColor="#e5ddf9">
          <rect x="0" y="0" rx="10" ry="10" width="110" height="38" />
        </ContentLoader>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {user?.id && (
        <button
          onBlur={() => setShowUserProfile(false)}
          onClick={() => setShowUserProfile(!showUserProfile)}>
          Профиль
        </button>
      )}

      {!user?.id && <button onClick={() => router.push('/auth/login')}>Войти</button>}

      {showUserProfile && user?.name && (
        <div className={styles.profile}>
          <div className={styles.info}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.email}>{user.email}</span>

            {user.role === 'admin' && (
              <Link onMouseDown={(e) => e.preventDefault()} href="/admin">
                Админ-панель
              </Link>
            )}
          </div>

          <div
            className={`${styles.subscription} ${
              user.subscription.is_active ? styles.active : styles.notactive
            }`}>
            {' '}
            Подписка:
            <div className={styles.status}>
              {user.subscription.is_active ? (
                <span>
                  активна (до{' '}
                  {DateTime.fromSeconds(user.subscription.end_date).toFormat('dd.MM.yyyy HH:mm')})
                </span>
              ) : (
                <span>неактивна</span>
              )}
            </div>
          </div>

          {!user.subscription.is_active && (
            <div className={styles.subscribe}>
              <button onMouseDown={(e) => e.preventDefault()} onClick={onClickSubscribe}>
                Оформить подписку
              </button>
            </div>
          )}

          <div
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => logout()}
            className={styles.logout}>
            <button>Выйти</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUser;
