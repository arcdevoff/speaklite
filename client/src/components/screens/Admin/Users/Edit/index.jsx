'use client';
import { AdminUserService } from '@/services/admin/user.service';
import { Field, Form, Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import styles from './AdminUserEdit.module.scss';
import getApiMessage from '@/utils/getApiMessage';
import { useDispatch } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';
import Loading from '@/components/ui/Loading';

const AdminUserEdit = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = React.useState([]);

  if (!params.id) {
    router.push('/admin/users');
  }

  React.useEffect(() => {
    AdminUserService.getById(params.id)
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        dispatch(setMessage({ status: false, text: 'Ошибка' }));
      });
  }, [params.id]);

  const onSave = (values) => {
    let msg;

    AdminUserService.updateById({ id: params.id, values })
      .then((res) => {
        msg = getApiMessage(res);
      })
      .catch((error) => {
        msg = getApiMessage(error.response);
      })
      .finally(() => {
        if (msg) {
          dispatch(setMessage(msg));
        }
      });
  };

  if (user.email) {
    return (
      <div className={styles.root}>
        <Formik
          onSubmit={onSave}
          initialValues={{ name: user.name, email: user.email, role: user.role }}>
          <Form>
            <div className="floatingInput">
              <Field type="text" name="name" />
              <label>Имя</label>
            </div>

            <div className="floatingInput">
              <Field type="email" name="email" />
              <label>Эл. почта</label>
            </div>

            <div className="floatingInput">
              <Field as="select" name="role">
                <option value="admin">Администратор</option>
                <option value="user">Пользователь</option>
              </Field>

              <label>Роль</label>
            </div>

            <button type="submit" className="btn-primary">
              Сохранить
            </button>
          </Form>
        </Formik>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AdminUserEdit;
