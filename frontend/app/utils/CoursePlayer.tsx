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
  const getEmbedUrl = (url: string) => {
    if (!url) return url;
    
    // Convert standard YouTube watch URLs to embed URLs
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Convert standard Vimeo URLs
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }

    return url;
  };

  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    if (!videoUrl || !courseId || !contentId) {
      return;
    }

    if (/^https?:\/\//i.test(videoUrl)) {
      // Don't fetch VdoCipher OTP if it's a standard HTTP URL
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
        if (process.env.NODE_ENV === "development") {
          console.error("OTP API Error:", err.message);
        }
      });
  }, [videoUrl, courseId, contentId]);

  return (
    <div style={{ paddingTop: "41%", position: "relative" }}>
      {/^https?:\/\//i.test(videoUrl) ? (
        <iframe
          src={getEmbedUrl(videoUrl)}
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      ) : videoData.otp && videoData.playbackInfo !== "" ? (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=XzWhNFvrz43qlJqZ`}
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      ) : null}
    </div>
  );
}

export default CoursePlayer;