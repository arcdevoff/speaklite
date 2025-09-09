'use client';
import styles from '../Auth.module.scss';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AuthService } from '@/services/auth.service';
import getApiMessage from '@/utils/getApiMessage';
import { setMessage } from '@/redux/reducers/ui/slice';

const Signup = () => {
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = React.useState(false);
  const [successSignup, setSuccessSignup] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onSubmit = (values) => {
    setFormLoading(true);

    AuthService.signup(values)
      .then((res) => {
        if (res.status === 200) {
          setEmail(values.email);
          setSuccessSignup(true);
        }
      })
      .catch((error) => {
        const msg = getApiMessage(error.response);

        if (msg) {
          dispatch(setMessage(msg));
        }
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  return (
    <div className={styles.root}>
      <h1 className="title">{successSignup ? '✉️ Письмо отправлено' : 'Регистрация'}</h1>

      {!successSignup ? (
        <>
          <small>
            Есть аккаунт? <Link href="/auth/login">Войдите</Link>
          </small>

          <Formik initialValues={{ name: '', email: '', password: '' }} onSubmit={onSubmit}>
            <Form>
              <Field type="text" name="name" placeholder="Имя" />

              <Field name="email" type="email" placeholder="Эл. почта" />
              <Field name="password" type="password" placeholder="Пароль" />

              <button disabled={formLoading} className="btn-primary" type="submit">
                Зарегистрироваться
              </button>

              <small className={styles.rules}>
                Нажав на кнопку регистрации, вы даете согласие на обработку персональных данных и
                принимаете <Link href="/page/terms-of-use">пользовательское соглашение</Link>
              </small>
            </Form>
          </Formik>
        </>
      ) : (
        <span className={styles.message}>
          Мы отправили письмо для подтверждения почтового адреса на{' '}
          <span className={styles.email}>{email}</span>
        </span>
      )}
    </div>
  );
};

export default Signup;
