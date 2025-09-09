'use client';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import styles from './Topics.module.scss';
import Loading from '@/components/ui/Loading';
import LoadMoreButton from '@/components/ui/LoadMoreButton';
import { TopicService } from '@/services/topic.service';
import TopicCard from '@/components/templates/Topic/Card';
import TopicsLayout from '@/components/layouts/TopicsLayout';
import { dialogs_types } from '@/constants/dialogs_types';

const limit = 12;
const Topics = () => {
  const [search, setSearch] = React.useState('');
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['topics', search],
      queryFn: async ({ pageParam }) => await TopicService.getAll(pageParam),
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
  return (
    <div className={styles.root}>
      <div className="title">Темы диалогов</div>

      <input
        placeholder="Поиск"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', margin: '1.5rem 0' }}
      />

      {status === 'pending' ? (
        <Loading />
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <TopicsLayout>
            {data.pages.map((page) => (
              <React.Fragment key={page.nextPage}>
                {page.data.map((topic, key) => (
                  <TopicCard dialogs_types={dialogs_types} data={topic} key={key} />
                ))}
              </React.Fragment>
            ))}
          </TopicsLayout>

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

export default Topics;
