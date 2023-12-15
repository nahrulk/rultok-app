import { useUser } from "@/app/context/user";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
import useDeleteComment from "@/app/hooks/useDeleteComment";
import { useCommentStore } from "@/app/stores/comment";
import { SingleCommentCompTypes } from "@/app/types";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";

export default function SingleComment({
  comment,
  params,
}: SingleCommentCompTypes) {
  const contexUser = useUser();
  let { setCommentsByPost } = useCommentStore();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteThisComment = async () => {
    let res = confirm("Are you sure want to delete this comment?");
    if (!res) return;

    try {
      setIsDeleting(true);
      useDeleteComment(comment.id);
      setCommentsByPost(params?.postId);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between px-8 mt-4"
        id="SingleComment"
      >
        <div className="flex items-center relative w-full">
          <Link href={`/profile/${comment?.profile?.user_id}`}>
            <img
              className="absolute top-0 rounded-full lg:mx-0 mx-auto"
              width={40}
              src={useCreateBucketUrl(comment?.profile?.image)}
            />
          </Link>
          <div className="ml-14 pt-0.5 w-full">
            <div className="text-[18px] font-semibold flex items-center justify-between ">
              <span className="flex items-center">
                {comment?.profile?.name} -{" "}
                <span className="text-[12px] text-gray-600 font-light ml-1">
                  {moment(comment?.created_at).calendar()}
                </span>
              </span>
              {contexUser?.user?.id == comment.profile.user_id ? (
                <button
                  className=""
                  disabled={isDeleting}
                  onClick={() => deleteThisComment()}
                >
                  {isDeleting ? (
                    <BiLoaderCircle
                      size={20}
                      className="animate-spin"
                      color="#E91E62"
                    />
                  ) : (
                    <BsTrash3 className="cursor-pointer" size={25} />
                  )}
                </button>
              ) : null}
            </div>
            <p className="text-[15px] font-light">{comment?.text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
