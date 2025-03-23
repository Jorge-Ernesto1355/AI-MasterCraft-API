interface MediaType {
  isMatch(url: string): boolean;
  getType(): string;
}

class VideoMediaType implements MediaType {
  private readonly videoExtensions: string[] = [
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "webm",
  ];

  isMatch(url: string): boolean {
    const extension = url.split(".").pop()?.toLocaleLowerCase() || "";
    return this.videoExtensions.includes(extension);
  }

  getType(): string {
    return "video";
  }
}

class ImageMediaType implements MediaType {
  private readonly imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

  isMatch(url: string): boolean {
    const extension = url.slice(url.lastIndexOf(".")).toLowerCase();
    return this.imageExtensions.includes(extension);
  }

  getType(): string {
    return "image";
  }
}

class AudioMediaType implements MediaType {
  private readonly audioExtensions = [".wav", ".mp3", ".ogg"];

  isMatch(url: string): boolean {
    const extension = url.slice(url.lastIndexOf(".")).toLowerCase();
    return this.audioExtensions.includes(extension);
  }

  getType(): string {
    return "audio";
  }
}

class MediaTypeDetector {
  private mediaTypes: MediaType[];
  constructor(mediaTypes: MediaType[]) {
    this.mediaTypes = mediaTypes;
  }

  public detect(url: string): string | null {
    for (const mediaType of this.mediaTypes) {
      if (mediaType.isMatch(url)) {
        return mediaType.getType();
      }
    }
    return null;
  }
}

export class MediatypeDetectorFactory {
  static createDefaultDtector(): MediaTypeDetector {
    const videoMediaType = new VideoMediaType();
    const imageMediaType = new ImageMediaType();
    const audioMediaType = new AudioMediaType();
    return new MediaTypeDetector([
      videoMediaType,
      imageMediaType,
      audioMediaType,
    ]);
  }
}
