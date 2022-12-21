import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slice/auth';
import { useSelector } from 'react-redux';
import { instance as axios } from '../../axios';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState('');
  const [isLoading, setLodaing] = React.useState(false);
  const [tags, setTags] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEdit = Boolean(id);
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
      console.log(data);
    } catch (error) {
      console.log(error);
      alert('failed to load image');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    console.log('starrt');
    try {
      setLodaing(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };
      console.log(fields);
      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEdit ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert('failed to load ' + error);
    }
  };

  React.useEffect(() => {
    console.log(id);
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      });
    }
  }, []);

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text..',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to={'/'} />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Download preview
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            delete
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title.."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags.."
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdit ? 'save' : 'publish'}
        </Button>
        <a href="/">
          <Button size="large">cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
