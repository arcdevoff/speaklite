'use client';
import React from 'react';
import styles from './AdminUserCard.module.scss';
import Link from 'next/link';
import { DateTime } from 'luxon';

const AdminUserCard = ({ data, deleteUser }) => {
  return (
    <div className={styles.root}>
      <span>{data.name}</span>
      <span>{data.email}</span>

      <span>
        Почта:{' '}
        <small style={data.confirmed ? { color: 'green' } : { color: 'red' }}>
          {data.confirmed ? 'подтверждена' : 'не подтверждена'}
        </small>
      </span>

      <span>
        Подписка:{' '}
        <small style={data.subscription.is_active ? { color: 'green' } : { color: 'red' }}>
          {data.subscription.is_active ? (
            <>
              активна (до{' '}
              {DateTime.fromSeconds(data.subscription.end_date).toFormat('dd.MM.yyyy HH:mm')})
            </>
          ) : (
            'неактивна'
          )}
        </small>
      </span>

      <span>
        Роль: <small>{data.role}</small>
      </span>

      <div className={styles.control}>
        <button onClick={() => deleteUser(data.id)} className={styles.delete}>
          Удалить
        </button>
        <Link className={styles.edit} href={`/admin/users/${data.id}`}>
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default AdminUserCard;
