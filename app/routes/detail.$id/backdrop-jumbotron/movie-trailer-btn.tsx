import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { PlayIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import VStack from "~/components/vstack";

type MovieTrailerButtonProps = {
  trailer: any;
};

const youtubeBaseURL = "https://www.youtube.com/embed/";
const vimeoBaseURL = "https://player.vimeo.com/video/";

const onYoutubePlayerReady = (event: any) => {
  // fix for mobile devices
  event.target.mute();
  event.target.playVideo();
};

export default function MovieTrailerButton({
  trailer,
}: MovieTrailerButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const handleOpen = () => {
    onOpen();
  };

  useEffect(() => {
    if (trailer?.site === "YouTube") {
      setTrailerUrl(`${youtubeBaseURL}${trailer.key}`);
    } else if (trailer?.site === "Vimeo") {
      setTrailerUrl(`${vimeoBaseURL}${trailer.key}`);
    } else {
      setTrailerUrl(null);
    }
  }, [trailer]);

  const youtubePlayerOpts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      controls: 1,
      loop: 1,
      playlist: trailer?.key,
      modestbranding: 1, // hide youtube logo
      rel: 0, // hide related videos
      fs: 0, // hide fullscreen button,
      start: 0,
      end: 30,
    },
    width: "100%",
    height: "100%",
  };

  if (!trailer) return <></>;

  return (
    <>
      {/* Circle play button no text */}
      <Button
        variant="flat"
        size="sm"
        color="default"
        className="p-2 rounded-full w-10 h-10 min-w-0"
        onPress={handleOpen}
      >
        <PlayIcon />
      </Button>
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
        size="4xl"
        className="w-[90%] h-[90%] lg:w-[80%] lg:h-[80%]"
      >
        <ModalContent className="pb-5 h-full">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">&nbsp;</ModalHeader>
              <ModalBody>
                <VStack className="w-full h-full">
                  {trailer.site === "YouTube" ? (
                    <YouTube
                      className="w-full h-full p-4"
                      videoId={trailer.key}
                      opts={youtubePlayerOpts}
                      onReady={onYoutubePlayerReady}
                      onEnd={() => {
                        console.log("youtube error");
                      }}
                      onPause={() => {
                        console.log("youtube loading...");
                      }}
                    />
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      className="absolute top-0 left-0 w-full h-full lg:translate-y-[-80px]"
                      src={trailerUrl || ""}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ pointerEvents: "none" }}
                    ></iframe>
                  )}
                </VStack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
