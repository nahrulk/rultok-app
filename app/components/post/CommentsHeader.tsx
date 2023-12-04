"use client";

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

export default function CommentsHeader({
  post,
  params,
}: CommentsHeaderCompTypes) {
  const router = useRouter();

  const [hasClickedLiked, setHasClickedLike] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const deletePost = () => {
    console.log("deletePost");
  };

  const likeOrUnlike = () => {
    console.log("likeOrUnlike");
  };

  return (
    <>
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center">
          <Link href={`/profile/${post?.user_id}`}>
            {post?.profile?.image ? (
              <img
                className="rounded-full lg:mx-0 mx-auto"
                src={post?.profile.image}
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
              <span className="font-medium">{post?.created_at}</span>
            </div>
          </div>
        </div>

        {true ? (
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
                <AiFillHeart size="25" />
              ) : (
                <BiLoaderCircle className="animate-spin" size="25" />
              )}
            </button>
            <span className="text-xs pl-2 pr-4 text-gray-800 font-semibold">
              50
            </span>
          </div>
        </ClientOnly>

        <div className="pb-4 flex items-center text-center">
          <div className="rounded-full bg-gray-200 p-2 cursor-pointer">
            <BsChatDots size={25} />
          </div>
          <span className="text-xs pl-2 text-gray-800 font-semibold">88</span>
        </div>
      </div>
    </>
  );
}
