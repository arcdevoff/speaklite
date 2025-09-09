import Image from 'next/image';
import styles from './TopicCard.module.scss';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useState } from 'react';

const TopicCard = ({ data, dialogs_types }) => {
  const [showTypes, setShowTypes] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.language}>{data.language}</div>

      <div className={styles.image}>
        <Image src={data.image} width={500} height={500} alt="image" />
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{data.name}</div>

        {data.description && <div className={styles.description}>{data.description}</div>}

        {showTypes && (
          <div className={styles.types}>
            {dialogs_types.map((obj) => (
              <Link
                onMouseDown={(e) => e.preventDefault()}
                key={obj.key}
                href={`/topics/${data.slug}/${obj.key}`}>
                {obj.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className={styles.read}>
        <button onBlur={() => setShowTypes(false)} onClick={() => setShowTypes(!showTypes)}>
          Читать <IconArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TopicCard;
