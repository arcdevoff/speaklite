'use client';
import styles from './AdminTopics.module.scss';
import React from 'react';
import { AdminTopicService } from '@/services/admin/topic.service';

import { useInfiniteQuery } from '@tanstack/react-query';
import AdminAddTopicForm from './components/AddForm';
import LoadMoreButton from '@/components/ui/LoadMoreButton';
import Loading from '@/components/ui/Loading';
import AdminTopicCard from '@/components/templates/Admin/Topic/Card';

const limit = 12;
const AdminTopics = () => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['adminTopics', search],
      queryFn: async ({ pageParam }) => await AdminTopicService.getAll(pageParam),
      initialPageParam: { page: 1, search: search, limit },
      refetchOnWindowFocus: false,
      retry: 2,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, search: search, limit };
        } else {
          return undefined;
        }
      },
    });

  const deleteTopic = (id) => {
    if (window.confirm('Удалить тему?')) {
      AdminTopicService.deleteById(id).then((req) => {
        if (req.status === 200) {
          refetch();
        }
      });
    }
  };

  return (
    <div className={styles.root}>
      <button className={styles.showAddFormButton} onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? '❌ Скрыть' : '➕ Добавить'}
      </button>
      {showAddForm && <AdminAddTopicForm />}

      <input
        placeholder="Поиск"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: 20 }}
      />

      {status === 'pending' ? (
        <Loading />
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages.map((page) => (
            <React.Fragment key={page.nextPage}>
              {page.data.map((topic, key) => (
                <AdminTopicCard data={topic} key={key} deleteTopic={deleteTopic} />
              ))}
            </React.Fragment>
          ))}

          <LoadMoreButton
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminTopics;
