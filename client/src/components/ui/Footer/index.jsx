'use client';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.root}>
      <span className={styles.info}>
        8 960 250-02-11
        <br />
        ИНН 780266011642
        <br />
        ОГРН 324784700092212
      </span>

      <span className={styles.copy}>
        Сайт не является публичной афертой и носит информационный характер. Все материалы данного
        сайта являются объектами авторского права (в том числе дизайн). Запрещается копирование,
        распространение (в том числе путем копирования на другие сайты и ресурсы в интернете) или
        любое иное испольование информации без предварительного согласия правообладателя.
      </span>
    </div>
  );
};

export default Footer;
