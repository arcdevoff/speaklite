import Image from 'next/image';
import styles from './HomePromo.module.scss';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const HomePromo = () => {
  const router = useRouter();
  const user = useSelector((state) => state.user);

  if (!user.accessToken) {
    return (
      <div className={styles.root}>
        <div className={styles.image}>
          <Image src="/images/shooting-star.png" width={105} height={105} alt="heart" />
        </div>

        <div className={styles.text}>
          Зарегистрируйся прямо сейчас и получи подписку на 7 дней абсолютно бесплатно
        </div>

        <button onClick={() => router.push('/auth/signup')} className={styles.signupButton}>
          Зарегистрироваться
        </button>
      </div>
    );
  } else {
    return '';
  }
};

export default HomePromo;
