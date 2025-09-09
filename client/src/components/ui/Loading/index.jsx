import Image from 'next/image';
import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.root}>
      <Image title="Loading..." src="/images/loading.png" width={50} height={50} alt="Loading..." />
    </div>
  );
};

export default Loading;
