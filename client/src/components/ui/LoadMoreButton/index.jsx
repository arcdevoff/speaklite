import styles from './LoadMoreButton.module.scss';

const LoadMoreButton = ({ fetchNextPage, hasNextPage, isFetchingNextPage }) => {
  if (hasNextPage) {
    return (
      <button
        className={styles.root}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Загрузка...' : hasNextPage && 'Показать еще'}
      </button>
    );
  } else {
    return '';
  }
};

export default LoadMoreButton;
