'use client';
import React from 'react';
import { Field, Form, Formik } from 'formik';
import styles from './AdminAddTopicForm.module.scss';
import getApiMessage from '@/utils/getApiMessage';
import { useDispatch } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';
import { UploadService } from '@/services/upload.service';
import Image from 'next/image';
import Loading from '@/components/ui/Loading';
import { IconUpload } from '@tabler/icons-react';
import { AdminTopicService } from '@/services/admin/topic.service';
import { queryClient } from '@/components/providers/MainProvider';

const AdminAddTopicForm = () => {
  const dispatch = useDispatch();
  const fileInputRef = React.useRef();
  const [image, setImage] = React.useState({
    status: null,
    url: null,
  });

  const handleUploadImage = (event) => {
    if (event.target.files[0]) {
      const formData = new FormData();
      formData.append('image', event.target.files[0]);

      setImage({ status: 'pending' });

      UploadService.image(formData)
        .then((data) => {
          setImage({
            status: 'success',
            url: data.url,
          });
        })
        .catch((error) => {
          setImage({ status: 'error' });
          const msg = getApiMessage(error.response);

          if (msg) {
            dispatch(setMessage(msg));
          }
        });
    }
  };

  const onSubmit = (values, { resetForm }) => {
    values.image = image.url;

    AdminTopicService.add(values)
      .then(() => {
        dispatch(setMessage({ status: true, text: 'Успешно' }));

        fileInputRef.current.value = null;
        setImage({ status: null, url: null });

        resetForm();
        queryClient.refetchQueries('adminTopics');
      })
      .catch((error) => {
        const msg = getApiMessage(error.response);

        if (msg) {
          dispatch(setMessage(msg));
        }
      });
  };

  return (
    <div className={styles.root}>
      <Formik onSubmit={onSubmit} initialValues={{ name: '', description: '', language: '' }}>
        <Form>
          <Field type="text" name="name" placeholder="Название" />
          <Field as="textarea" name="description" placeholder="Описание" rows="4" />
          <Field type="text" name="language" placeholder="Язык" />
          <input ref={fileInputRef} type="file" hidden name="image" onChange={handleUploadImage} />

          <button
            className={styles.uploadImageButton}
            type="button"
            onClick={() => fileInputRef.current?.click()}>
            {image.status === 'pending' ? (
              <Loading />
            ) : (
              <>
                <IconUpload />
                <span className={styles.text}>Загрузить изображение</span>
              </>
            )}
          </button>

          {image.status === 'success' && image.url && (
            <Image src={image.url} width={300} height={300} alt="image" />
          )}

          <button type="submit" className="btn-primary">
            Добавить
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default AdminAddTopicForm;
