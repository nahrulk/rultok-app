import { useEffect, useState } from "react";
import { Comment, Like, PostMainLikesCompType } from "../types";
import { AiFillHeart } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCommentDots, FaShare } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "../stores/general";
import { useUser } from "../context/user";
import useGetCommentsByPostId from "../hooks/useGetCommentsByPostId";
import useGetLikesByPostId from "../hooks/useGetLikesByPostId";
import useIsLiked from "../hooks/useIsLiked";
import useCreateLike from "../hooks/useCreateLike";
import useDeleteLike from "../hooks/useDeleteLike";

export default function PostMainLikes({ post }: PostMainLikesCompType) {
  let { setIsLoginOpen } = useGeneralStore();

  const router = useRouter();
  const contextUser = useUser();
  const [hasClickedLike, setHasClickedLike] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    getAllLikesByPost();
    getAllCommentsByPost();
  }, [post]);

  useEffect(() => {
    hasUserLikedPost();
  }, [likes, contextUser]);

  const getAllCommentsByPost = async () => {
    let result = await useGetCommentsByPostId(post?.id);
    setComments(result);
  };

  const getAllLikesByPost = async () => {
    let result = await useGetLikesByPostId(post?.id);
    setLikes(result);
  };

  const hasUserLikedPost = () => {
    if (!contextUser) return;

    if (likes?.length < 1 || contextUser.user?.id) {
      setUserLiked(false);
      return;
    }

    let res = useIsLiked(contextUser?.user?.id || "", post?.id, likes);

    setUserLiked(res ? true : false);
  };

  const like = async () => {
    try {
      setHasClickedLike(true);
      await useCreateLike(contextUser?.user?.id || "", post.id);
      await getAllLikesByPost();
      hasUserLikedPost();
      setHasClickedLike(false);
    } catch (error) {
      alert(error);
    }
  };

  const unlike = async (id: string) => {
    try {
      setHasClickedLike(true);
      await useDeleteLike(id);
      await getAllLikesByPost();
      hasUserLikedPost();
      setHasClickedLike(false);
    } catch (error) {
      alert(error);
    }
  };

  const likeOrUnlike = () => {
    if (!contextUser?.user) return setIsLoginOpen(true);

    let res = useIsLiked(contextUser?.user?.id, post?.id, likes);

    if (!res) {
      like();
    } else {
      likes.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser?.user?.id == like.user_id &&
          like.post_id == post?.id
        ) {
          unlike(like.id);
        }
      });
    }
  };

  return (
    <>
      <div className="relative mr-[75px]" id={`PostMainLikes-${post?.id}`}>
        <div className="absolute top-0 pl-2">
          <div className="pb-4 text-center">
            <button
              className="rounded-full bg-gray-200 p-2 cursor-pointer "
              disabled={hasClickedLike}
              onClick={() => likeOrUnlike()}
            >
              {!hasClickedLike ? (
                <AiFillHeart
                  color={likes?.length > 0 && userLiked ? "#FF2626" : ""}
                  size="25"
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs text-gray-800 font-semibold">
              {likes?.length}
            </span>
          </div>

          <button
            onClick={() =>
              router.push(`/post/${post.id}/${post?.profile?.user_id}`)
            }
            className="pb-4 text-center"
          >
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaCommentDots size={25} />
            </div>
            <span className="text-xs text-gray-800 font-semibold">
              {comments.length}
            </span>
          </button>

          <button className="text-center">
            <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
              <FaShare size={25} />
            </div>
            <span className="text-xs text-gray-800 font-semibold">55</span>
          </button>
        </div>
      </div>
    </>
  );
}
