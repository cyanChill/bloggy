import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

import styles from "./index.module.css";
import StyledInput from "../formElements/styledInput";

const PostForm = ({ prevContents, submitHandler }) => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(!prevContents ? "" : prevContents.title);
  const [url, setUrl] = useState(
    !prevContents ? "" : prevContents.thumbnailUrl
  );
  const [isPublished, setIsPublished] = useState(
    !prevContents ? false : prevContents.published
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentVal = editorRef.current.getContent();
    await submitHandler(title, contentVal, url, isPublished);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.postForm}
      autoComplete="off"
    >
      <StyledInput
        type="text"
        config={{
          required: true,
          value: title,
          onChange: (e) => setTitle(e.target.value),
        }}
        labelText="Title"
      />
      <StyledInput
        type="url"
        config={{
          required: true,
          value: url,
          onChange: (e) => setUrl(e.target.value),
        }}
        labelText="Thumbnail Url"
      />

      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={!prevContents ? "" : prevContents.content}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
      />

      <label className={styles.checkboxInput}>
        Published
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
      </label>

      <button type="submit" className="btn compressed green">
        {prevContents ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default PostForm;
