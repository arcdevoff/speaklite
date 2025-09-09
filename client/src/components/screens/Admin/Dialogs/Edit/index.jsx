'use client';
import styles from '../components/AddForm/AdminAddDialogForm.module.scss';
import React from 'react';
import { dialogs_types } from '@/constants/dialogs_types';
import { AdminTopicService } from '@/services/admin/topic.service';
import { useDispatch } from 'react-redux';
import { setMessage } from '@/redux/reducers/ui/slice';
import { AdminDialogService } from '@/services/admin/dialog.service';
import { queryClient } from '@/components/providers/MainProvider';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

const AdminDialogEdit = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();
  const [dialog, setDialog] = React.useState();
  const [topic, setTopic] = React.useState();
  const [type, setType] = React.useState(dialogs_types[0].key);
  const [topics, setTopics] = React.useState();
  const [text, setText] = React.useState({
    0: {
      1: '',
      2: '',
    },
  });

  if (!params.id) router.push('/admin/dialogs');

  const onChangeText = ({ value, index, key }) => {
    const newText = { ...text };
    newText[index][key] = value;
    setText(newText);
  };

  const handleAddText = () => {
    const maxIndex = Math.max(...Object.keys(text).map(Number));
    const newIndex = maxIndex + 1;

    setText({
      ...text,
      [newIndex]: { 1: '', 2: '' },
    });
  };

  const onSave = () => {
    const filteredText = {};
    let index = 0;

    for (const key in text) {
      const item = text[key];
      if (item[1] !== '' || item[2] !== '') {
        filteredText[index] = item;
        index++;
      }
    }

    setText(filteredText);

    AdminDialogService.updateById({
      id: dialog.id,
      values: {
        type,
        text: filteredText,
        topic,
      },
    })
      .then(() => {
        dispatch(setMessage({ status: true, text: 'Успешно' }));
      })
      .catch(() => {
        dispatch(setMessage({ status: false, text: 'Ошибка' }));
      });
  };

  React.useEffect(() => {
    AdminTopicService.getAll({ page: 1, limit: 100 })
      .then((res) => {
        setTopics(res.data);
      })
      .catch(() => {
        dispatch(setMessage({ status: false, text: 'Ошибка' }));
      });

    AdminDialogService.getById(params.id)
      .then((data) => {
        setDialog(data);
      })
      .catch(() => {
        dispatch(setMessage({ status: false, text: 'Ошибка' }));
      });
  }, [dispatch]);

  React.useEffect(() => {
    if (dialog?.id) {
      setTopic(dialog.topic_id);
      setType(dialog.type);
      setText(dialog.text);
    }
  }, [dialog]);

  if (dialog?.id) {
    let person = 1;
    return (
      <div className={styles.root}>
        <div className="floatingInput">
          <select name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {dialogs_types.map((obj) => (
              <option key={obj.key} value={obj.key}>
                {obj.name}
              </option>
            ))}
          </select>
          <label>Сложность</label>
        </div>

        {topics && (
          <div className="floatingInput">
            <select
              name="topic"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}>
              {topics.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
            <label>Тема</label>
          </div>
        )}

        <div className={styles.textWrap}>
          {Object.values(text).map((obj, index) => (
            <div className={styles.text} key={index + 1}>
              <div className="floatingInput">
                <input
                  value={obj[1]}
                  onChange={(e) => onChangeText({ value: e.target.value, index, key: 1 })}
                />
                <label>Person {person}</label>
              </div>

              <div key={index} className="floatingInput">
                <input
                  value={obj[2]}
                  onChange={(e) => onChangeText({ value: e.target.value, index, key: 2 })}
                />
                <label>Персон {person}</label>
              </div>

              <span style={{ display: 'none' }}>
                {(person = person === 1 ? person + 1 : person - 1)}
              </span>
            </div>
          ))}
        </div>

        <button className={styles.addTextButton} onClick={() => handleAddText()}>
          ➕
        </button>

        <button type="submit" onClick={() => onSave()} className="btn-primary">
          Сохранить
        </button>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default AdminDialogEdit;
