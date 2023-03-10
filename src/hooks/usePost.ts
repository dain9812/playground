import { useEffect, useState } from "react";
import { child, get, ref } from "firebase/database";
import { database } from "../firebase";

export type Post = {
  slug: string;
  title: string;
  contents: string;
  timestamp: number;
};

export const usePost = (slug: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);

      try {
        const snapshot = await get(child(ref(database), `posts`));
        if (snapshot.exists()) {
          snapshot.forEach((data) => {
            if (data.val().slug === slug) {
              setPost(data.val());
            }
          });
          setIsLoading(false);
        } else {
          console.log("No data available");
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    };

    getPost?.();
  }, [slug]);

  return { isLoading, post };
};
