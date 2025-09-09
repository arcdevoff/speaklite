'use client';
import Image from 'next/image';
import styles from './HomeBanner.module.scss';
import { IconCornerDownRight } from '@tabler/icons-react';
import { UserService } from '@/services/user.service';
import { redirect, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import getApiMessage from '@/utils/getApiMessage';
import { setMessage } from '@/redux/reducers/ui/slice';

const HomeBanner = () => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const router = useRouter();

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

  return (
    <div className={styles.root}>
      <div className={styles.animationTop}></div>
      <div className={styles.animationBottom}></div>

      <div>
        <h1 className={styles.title}>Диалоги на любой случай жизни</h1>
        <span className={styles.description}>Читай, повторяй, проверяй - побеждай!</span>

        <div className={styles.subscribe}>
          <IconCornerDownRight />
          <button onClick={onClickSubscribe} disabled={user.subscription?.is_active}>
            {user.subscription?.is_active ? 'Подписка оформлена' : 'Оформить подписку'}
          </button>
        </div>
      </div>
      <div>
        <Image
          className={styles.image}
          src="/images/dialog.png"
          width={440}
          height={370}
          quality={100}
          alt="banner image"
        />
      </div>
    </div>
  );
};

export default HomeBanner;
