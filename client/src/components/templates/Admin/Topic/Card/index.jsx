import Image from 'next/image';
import styles from './AdminTopicCard.module.scss';
import Link from 'next/link';

const AdminTopicCard = ({ data, deleteTopic }) => {
  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <Image src={data.image} alt={data.name} width={500} height={500} />
      </div>

      <div>
        <div className={styles.info}>
          <div>Название: {data.name}</div>
          <div>Язык: {data.language}</div>
          <div>
            Описание: <br /> {data.description}
          </div>
        </div>

        <div className={styles.control}>
          <button onClick={() => deleteTopic(data.id)} className={styles.delete}>
            Удалить
          </button>
          <Link className={styles.edit} href={`/admin/topics/${data.id}`}>
            Редактировать
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminTopicCard;
