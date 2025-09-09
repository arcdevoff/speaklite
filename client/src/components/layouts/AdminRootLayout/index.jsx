'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import styles from './AdminRootLayout.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  {
    name: 'Пользователи',
    url: '/admin/users',
  },
  {
    name: 'Темы диалогов',
    url: '/admin/topics',
  },
  {
    name: 'Диалоги',
    url: '/admin/dialogs',
  },
];

const AdminRootLayout = ({ children }) => {
  const user = useSelector((state) => state.user.data);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (user?.role) {
      if (user.role !== 'admin') {
        notFound();
      }
    }
  }, [user]);

  if (user.role === 'admin') {
    return (
      <div className={styles.root}>
        <div className={styles.sidebar}>
          {sidebarItems.map((obj, key) => (
            <Link
              className={`${styles.item} ${pathname.startsWith(obj.url) ? styles.active : ''}`}
              key={key}
              href={obj.url}>
              {obj.name}
            </Link>
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            {pathname !== '/admin' && (
              <button className={styles.backButton} onClick={() => router.back()}>
                Назад
              </button>
            )}
            <div className={styles.title}>
              {sidebarItems[sidebarItems.findIndex((obj) => pathname.startsWith(obj.url))]?.name}
            </div>
          </div>

          {children}
        </div>
      </div>
    );
  }
};

export default AdminRootLayout;
