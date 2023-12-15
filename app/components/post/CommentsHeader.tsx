"use client";

import { useEffect } from "react";
import { CommentsHeaderCompTypes } from "@/app/types";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsChatDots, BsTrash3 } from "react-icons/bs";
import { ImMusic } from "react-icons/im";
import ClientOnly from "../ClientOnly";
import { AiFillHeart } from "react-icons/ai";
import { useLikeStore } from "@/app/stores/like";
import { useCommentStore } from "@/app/stores/comment";
import { useGeneralStore } from "@/app/stores/general";
import { useUser } from "@/app/context/user";
import useIsLiked from "@/app/hooks/useIsLiked";
import useCreateLike from "@/app/hooks/useCreateLike";
import useDeleteLike from "@/app/hooks/useDeleteLike";
import useDeletePostById from "@/app/hooks/useDeletePostById";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";

export default function CommentsHeader({
  post,
  params,
}: CommentsHeaderCompTypes) {
  let { likesByPost, setLikesByPost } = useLikeStore();
  let { commentsByPost, setCommentsByPost } = useCommentStore();
  let { isLoginOpen, setIsLoginOpen } = useGeneralStore();

  const router = useRouter();

  const contextUser = useUser();
  const [hasClickedLiked, setHasClickedLike] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  useEffect(() => {
    setCommentsByPost(params.postId);
    setLikesByPost(params.postId);
  }, [post]);

  useEffect(() => {
    hasUserLikePost();
  }, [likesByPost]);

  const hasUserLikePost = () => {
    if (likesByPost.length < 1 || !contextUser?.user?.id) {
      setUserLiked(false);
      return;
    }

    let res = useIsLiked(contextUser?.user?.id, params.postId, likesByPost);
    setUserLiked(res ? true : false);
  };

  const like = async () => {
    try {
      setHasClickedLike(true);
      await useCreateLike(contextUser?.user?.id || "", params.postId);
      setLikesByPost(params?.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false);
    }
  };

  const unlike = async (id: string) => {
    try {
      setHasClickedLike(true);
      await useDeleteLike(id);
      setLikesByPost(params?.postId);
      setHasClickedLike(false);
    } catch (error) {
      console.log(error);
      alert(error);
      setHasClickedLike(false);
    }
  };

  const likeOrUnlike = () => {
    if (!contextUser?.user) return setIsLoginOpen(true);

    let res = useIsLiked(contextUser?.user?.id, params.postId, likesByPost);

    if (!res) {
      like();
    } else {
      likesByPost.forEach((like) => {
        if (
          contextUser?.user?.id &&
          contextUser?.user?.id == like.user_id &&
          like.post_id == params.postId
        ) {
          unlike(like.id);
        }
      });
    }
  };

  const deletePost = async () => {
    let res = confirm("Are you sure do you wanna delete this post?");
    if (!res) return;

    setIsDeleting(true);

    try {
      await useDeletePostById(params?.postId, post.video_url);
      router.push(`/profile/${params?.userId}`);
      setIsDeleting(false);
    } catch (error) {
      console.log(error);
      setIsDeleting(false);
      alert(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center">
          <Link href={`/profile/${post?.user_id}`}>
            {post?.profile?.image ? (
              <img
                className="rounded-full lg:mx-0 mx-auto"
                src={useCreateBucketUrl(post?.profile.image)}
                width={40}
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-gray-200 rounded-full" />
            )}
          </Link>

          <div className="ml-3 pt-0.5">
            <Link
              href={`/profile/${post?.user_id}`}
              className="relative z-10 text-[17px] font-semibold hover:underline"
            >
              {post?.profile?.name}
            </Link>

            <div className="relative z-0 text-[13px] -mt-5 font-light">
              {post?.profile.name}
              <span className="relative -top-[2px] text-[30px] pl-1 pr-0.5 ">
                .
              </span>
              <span className="font-medium">
                {moment(post?.created_at).calendar()}
              </span>
            </div>
          </div>
        </div>

        {contextUser?.user?.id == post?.user_id ? (
          <div>
            {isDeleting ? (
              <BiLoaderCircle className="animate-spin" size="25" />
            ) : (
              <button disabled={isDeleting} onClick={() => deletePost()}>
                <BsTrash3 className="cursor-pointer" size="25" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      <p className="px-8 mt-4 text-sm">{post?.text}</p>
      <p className="flex items-center gap-2 px-8 mt-4 text-sm font-bold">
        <ImMusic size={17} />
        original sound - {post?.profile?.name}
      </p>

      <div className="items-center flex px-8 mt-8">
        <ClientOnly>
          <div className="pb-4 text-center flex items-center">
            <button
              disabled={hasClickedLiked}
              className="rounded-full bg-gray-200 p-2 cursor-pointer"
              onClick={() => likeOrUnlike()}
            >
              {!hasClickedLiked ? (
                <AiFillHeart
                  color={likesByPost.length > 0 && userLiked ? "#ff2626" : ""}
                  size="25"
                />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              {likesByPost.length}
            </span>
          </div>
        </ClientOnly>

        <div className="pb-4 flex items-center text-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            <BsChatDots size={25} />
          </div>
          <span className="text-xs pl-2 text-gray-800 font-semibold">
            {commentsByPost?.length}
          </span>
        </div>
      </div>
    </>
  );
}
