import { dialogs_types } from '@/constants/dialogs_types';
import styles from './AdminDialogCard.module.scss';
import Link from 'next/link';

const AdminDialogCard = ({ data, deleteDialog }) => {
  const type = dialogs_types.find((type) => type.key === data.type);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div>
          <Link target="_blank" href={`/topics/${data.slug}/${data.type}`}>
            ID: {data.id}
          </Link>
        </div>
        <div>Тема: {data.name}</div>
        <div>Сложность: {type.name}</div>
      </div>

      <div className={styles.control}>
        <button onClick={() => deleteDialog(data.id)} className={styles.delete}>
          Удалить
        </button>
        <Link className={styles.edit} href={`/admin/dialogs/${data.id}`}>
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default AdminDialogCard;
