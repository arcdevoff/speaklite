'use client';
import Link from 'next/link';
import styles from './Header.module.scss';
import { IconMenu2 } from '@tabler/icons-react';
import React from 'react';
import { usePathname } from 'next/navigation';
import HeaderUser from './components/User';
import { AppProgressBar } from 'next-nprogress-bar';

const menuItems = [
  {
    text: 'О компании',
    url: '/page/about',
  },
  {
    text: 'Темы диалогов',
    url: '/topics',
  },
  {
    text: 'Партнерство',
    url: '/page/partners',
  },

  {
    text: 'Контакты',
    url: '/page/contacts',
  },
];

const Header = () => {
  const [showMobMenu, setShowMobMenu] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (showMobMenu) {
      setShowMobMenu(false);
    }
  }, [pathname]);

  return (
    <div className={styles.root}>
      <AppProgressBar
        height="4px"
        color="#973db7"
        startPosition={0.3}
        stopDelayMs={200}
        options={{ easing: 'ease', speed: 500 }}
      />

      <div className={styles.logo}>
        <button
          onBlur={() => setShowMobMenu(false)}
          onClick={() => setShowMobMenu(!showMobMenu)}
          className={styles.showMobMenuButton}>
          <IconMenu2 />
        </button>

        <Link href="/">{process.env.NEXT_PUBLIC_SITENAME}</Link>
      </div>

      <div className={styles.menu}>
        {menuItems.map((obj, key) => (
          <Link
            className={pathname === obj.url ? styles.active : ''}
            onMouseDown={(e) => e.preventDefault()}
            key={key}
            href={obj.url}>
            {obj.text}
          </Link>
        ))}
      </div>

      {showMobMenu && (
        <div className={styles.mobMenu}>
          {menuItems.map((obj, key) => (
            <Link
              className={pathname === obj.url ? styles.active : ''}
              onMouseDown={(e) => e.preventDefault()}
              key={key}
              href={obj.url}>
              {obj.text}
            </Link>
          ))}
        </div>
      )}

      <HeaderUser />
    </div>
  );
};

export default Header;
