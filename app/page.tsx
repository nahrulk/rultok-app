import ClientOnly from "./components/ClientOnly";
import PostMain from "./components/PostMain";
import UploadLayout from "./layouts/UploadLayout";

export default function Home() {
  return (
    <>
      <UploadLayout>
        <div className="mt-[80px] w-[calc(100%-90px)] max-w-[690px] ml-auto">
          <ClientOnly>
            <PostMain
              post={{
                id: "123",
                user_id: "456",
                video_url: "/vid1.mp4",
                text: "Rounded corners. Use utilities like rounded-sm , rounded , or rounded-lg to apply different border radius sizes to an element",
                created_at: "date here",
                profile: {
                  user_id: "456",
                  name: "User 1",
                  image: "https://placehold.co/100",
                },
              }}
            />
          </ClientOnly>
        </div>
      </UploadLayout>
    </>
  );
}
