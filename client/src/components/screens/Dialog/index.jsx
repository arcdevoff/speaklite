'use client';
import Loading from '@/components/ui/Loading';
import { DialogService } from '@/services/dialog.service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';
import styles from './Dialog.module.scss';
import { dialogs_types } from '@/constants/dialogs_types';
import { useRouter } from 'next/navigation';

const emojis = ['✨', '👁️', '🤠', '🔥', '👾', '🐣', '😀', '🖋️', '🙂', '😎', '👻', '🦖'];

const Dialog = () => {
  const params = useParams();
  const router = useRouter();
  const { data, status, error } = useQuery({
    queryFn: async () => await DialogService.getBySlug({ slug: params.slug, type: params.type }),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (status === 'pending') {
    return <Loading />;
  }

  if (status === 'error') {
    if (error.response?.status === 401) {
      return router.push('/auth/login');
    }

    if (error.response?.data.error === 'no_subscription') {
      return <div className="title">❌ У вас нет подписки</div>;
    }

    return <p>Error: {error.message}</p>;
  }

  let person = 1;
  return (
    <div className={styles.root}>
      <div className="title">
        {emojis[Math.floor(Math.random() * emojis.length)]} {data.name} /{' '}
        {dialogs_types.find((obj) => obj.key === data.type).name}
      </div>

      <div className={styles.text}>
        {Object.values(data.text).map((obj, key) => (
          <div key={key}>
            <span className={styles.bold}>
              Person {person}: {obj[1]}
            </span>
            <span>
              Персона {person}: {obj[2]}
            </span>
            <span style={{ display: 'none' }}>
              {(person = person === 1 ? person + 1 : person - 1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dialog;
