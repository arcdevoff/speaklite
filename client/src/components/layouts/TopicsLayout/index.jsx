import styles from './TopicsLayout.module.scss';

const TopicsLayout = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default TopicsLayout;
