'use client';
import { Field, Form, Formik } from 'formik';
import styles from '../components/AddForm/AdminAddTopicForm.module.scss';
import Loading from '@/components/ui/Loading';
import { IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import React from 'react';
import { AdminTopicService } from '@/services/admin/topic.service';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';
import getApiMessage from '@/utils/getApiMessage';
import { UploadService } from '@/services/upload.service';

const AdminTopicEdit = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [topic, setTopic] = React.useState();
  const fileInputRef = React.useRef();
  const [image, setImage] = React.useState({
    status: null,
    url: null,
  });

  React.useEffect(() => {
    if (!params.id) router.push('/admin/topics');

    AdminTopicService.getById(params.id)
      .then((data) => {
        setTopic(data);
      })
      .catch(() => {
        dispatch(setMessage({ status: false, text: 'Ошибка' }));
      });
  }, [dispatch, params.id, router]);

  React.useEffect(() => {
    if (topic?.id) {
      setImage({
        url: topic.image,
        status: 'success',
      });
    }
  }, [topic]);

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

  const onSave = (values) => {
    values.image = image.url;
    let msg;

    AdminTopicService.updateById({ id: params.id, values })
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
  if (topic?.id) {
    return (
      <div className={styles.root} style={{ border: 'none', padding: 0 }}>
        <Formik
          onSubmit={onSave}
          initialValues={{
            name: topic.name,
            description: topic.description,
            language: topic.language,
          }}>
          <Form>
            <div className="floatingInput">
              <Field type="text" name="name" placeholder="Название" />
              <label>Название</label>
            </div>

            <div className="floatingInput">
              <Field as="textarea" name="description" rows="4" />
              <label>Описание</label>
            </div>

            <div className="floatingInput">
              <Field type="text" name="language" />
              <label>Язык</label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              name="image"
              onChange={handleUploadImage}
            />

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

export default AdminTopicEdit;
