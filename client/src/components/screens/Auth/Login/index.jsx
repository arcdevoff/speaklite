'use client';
import styles from '../Auth.module.scss';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AuthService } from '@/services/auth.service';
import getApiMessage from '@/utils/getApiMessage';
import { setMessage } from '@/redux/reducers/ui/slice';
import { useRouter } from 'next/navigation';
import { setAccessToken, setUserDataRefresh } from '@/redux/reducers/user/slice';

const Login = () => {
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = (values) => {
    setFormLoading(true);
    AuthService.login(values)
      .then((res) => {
        dispatch(setAccessToken(res.data.accessToken));
        dispatch(setUserDataRefresh(true));

        router.push('/');
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
      <h1 className="title">Вход в аккаунт</h1>

      <small>
        Нет аккаунта? <Link href="/auth/signup">Зарегистрируйтесь</Link>
      </small>

      <Formik onSubmit={onSubmit} initialValues={{ email: '', password: '' }}>
        <Form>
          <Field name="email" type="email" placeholder="Эл. почта" />
          <Field name="password" type="password" placeholder="Пароль" />

          <button disabled={formLoading} className="btn-primary" type="submit">
            Войти
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
