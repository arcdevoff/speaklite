'use client';
import AdminUserCard from '@/components/templates/Admin/User/Card';
import LoadMoreButton from '@/components/ui/LoadMoreButton';
import Loading from '@/components/ui/Loading';
import { AdminUserService } from '@/services/admin/user.service';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React from 'react';

const AdminUsers = () => {
  const [search, setSearch] = React.useState('');
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['adminUsers', search],
      queryFn: async ({ pageParam }) => await AdminUserService.getAll(pageParam),
      initialPageParam: { page: 1, search: search },
      refetchOnWindowFocus: false,
      retry: 2,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, search: search };
        } else {
          return undefined;
        }
      },
    });

  const deleteUser = (id) => {
    if (window.confirm('Удалить пользователя?')) {
      AdminUserService.deleteById(id).then((req) => {
        if (req.status === 200) {
          refetch();
        }
      });
    }
  };

  return (
    <div>
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
              {page.data.map((user, key) => (
                <AdminUserCard deleteUser={deleteUser} data={user} key={key} />
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

export default AdminUsers;
