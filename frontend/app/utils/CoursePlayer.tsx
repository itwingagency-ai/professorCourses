/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react'
import axios from 'axios';
import { normalizeApiUrl } from "@/lib/apiConfig";

type Props = {
  videoUrl: string;
  title: string;
  courseId: string;
  contentId: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title, courseId, contentId }) => {

  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    if (!videoUrl) {
      console.error("videoUrl is undefined or empty.");
      return;
    }

    axios.post(
      normalizeApiUrl("getVdoCipherOpt"),
      {
        videoId: videoUrl,
        courseId,
        contentId,
      },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        setVideoData(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Error Response Data:", err.response.data);
          console.error("Status Code:", err.response.status);
        } else {
          console.error("Error Message:", err.message);
        }
      });
  }, [videoUrl]);

  return (
    <div style={{ paddingTop: "41%", position: "relative" }}>
      {
        videoData.otp && videoData.playbackInfo !== "" && (
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=XzWhNFvrz43qlJqZ`}
            style={{
              border: 0,
              width: "90%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            allowFullScreen={true}
            allow="encrypted-media"
          >

          </iframe>
        )
      }
    </div>
  )
}

export default CoursePlayer;