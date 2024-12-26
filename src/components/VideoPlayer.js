import React, { useState } from "react";
import "../styles/CustomVideoPlayer.css";

const VideoPlayer = ({ videoUrl, title, thumbnailUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        {!isPlaying ? (
          <div className="thumbnail-wrapper">
            <img
              src={thumbnailUrl}
              alt={`${title} thumbnail`}
              className="thumbnail"
            />
            <button className="play-button" onClick={handlePlay}>
              ▶
            </button>
          </div>
        ) : (
          <iframe
            src={`${videoUrl}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </div>
      <div className="video-details">
        <h2 className="video-title">{title}</h2>
        <p className="video-description">
          Enjoy this amazing video with our custom player!
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
