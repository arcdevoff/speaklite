'use client';
import AdminAddDialogForm from './components/AddForm';
import styles from './AdminDialogs.module.scss';
import React from 'react';
import { AdminDialogService } from '@/services/admin/dialog.service';
import Loading from '@/components/ui/Loading';
import LoadMoreButton from '@/components/ui/LoadMoreButton';
import { useInfiniteQuery } from '@tanstack/react-query';
import AdminDialogCard from '@/components/templates/Admin/Dialog/Card';

const limit = 12;
const AdminDialogs = () => {
  const [search, setSearch] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['adminDialogs', search],
      queryFn: async ({ pageParam }) => await AdminDialogService.getAll(pageParam),
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

  const deleteDialog = (id) => {
    if (window.confirm('Удалить диалог?')) {
      AdminDialogService.deleteById(id).then((req) => {
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
      {showAddForm && <AdminAddDialogForm />}

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
              {page.data.map((dialog, key) => (
                <AdminDialogCard data={dialog} deleteDialog={deleteDialog} key={key} />
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

export default AdminDialogs;
