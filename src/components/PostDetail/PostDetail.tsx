import styles from "./PostDetail.module.scss";
import classNames from "classnames/bind";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../../firebase";
import MDEditor from "@uiw/react-md-editor";

const cx = classNames.bind(styles);

export type Post = {
  path: string;
  title: string;
  contents: string;
  timestamp: number;
};

const PostDetail = () => {
  const { postTitle } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    const getPost = async () => {
      try {
        const snapshot = await get(child(ref(database), `posts/${postTitle}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPost(data);
        } else {
          console.log("No data available");
        }
      } catch (e) {
        console.error(e);
      }
    };

    getPost();
  }, [postTitle]);

  return (
    <>
      {post && (
        <article className={cx("post-detail")}>
          <div>
            <button onClick={() => navigate(`/edit/${post.path}`)}>Edit</button>
            <button>Delete</button>
          </div>
          <MDEditor.Markdown source={post.contents} />
        </article>
      )}
    </>
  );
};

export default PostDetail;
