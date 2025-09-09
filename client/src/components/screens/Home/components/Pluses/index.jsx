'use client';
import {
  IconAdjustmentsFilled,
  IconCreditCardFilled,
  IconMessageFilled,
} from '@tabler/icons-react';
import styles from './HomePluses.module.scss';

const pluses = [
  {
    icon: <IconCreditCardFilled />,
    text: '99 рублей в месяц',
  },
  {
    icon: <IconMessageFilled />,
    text: 'Множество диалогов',
  },
  {
    icon: <IconAdjustmentsFilled />,
    text: 'Уровни сложности',
  },
];

const HomePluses = () => {
  return (
    <div className={styles.root}>
      <div className={styles.items}>
        {pluses.map((obj, key) => (
          <div key={key} className={styles.item}>
            {obj.icon}
            <span className={styles.text}>{obj.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePluses;
