export const fileTypesToMimesArray = (fileTypes) => {
  let accepted = [];
  fileTypes?.forEach((el) => {
    accepted = accepted.concat(acceptedFileTypes(el));
  });
  return accepted;
};

const acceptedFileTypes = (fileType) => {
  switch (fileType) {
    case "presentation":
      return [
        "application/mspowerpoint",
        "application/vnd.google-apps.presentation",
        "application/vnd.ms-powerpoint",
        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        "application/vnd.ms-powerpoint.presentation.macroenabled.12",
        "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
        "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
        "application/vnd.ms-powerpoint.template.macroEnabled.12",
        "application/vnd.ms-powerpoint.template.macroenabled.12",
        "application/vnd.oasis.opendocument.presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
      ];

    case "document":
      return [
        "application/vnd.google-apps.document",
        "application/vnd.ms-word",
        "application/vnd.ms-word.document.macroEnabled.12",
        "application/vnd.ms-word.document.macroenabled.12",
        "application/vnd.ms-word.template.macroEnabled.12",
        "application/vnd.ms-word.template.macroenabled.12",
        "application/vnd.oasis.opendocument.text",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "text/plain",
        "application/msword",
      ];

    case "spreadsheet":
      return [
        "application/msexcel",
        "application/vnd.google-apps.spreadsheet",
        "application/vnd.ms-excel",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.sheet.macroenabled.12",
        "application/vnd.ms-excel.template.macroEnabled.12",
        "application/vnd.ms-excel.template.macroenabled.12",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
        "text/csv",
      ];

    case "pdf":
      return ["application/pdf"];

    case "image":
      return [
        "image/bmp",
        "image/gif",
        "image/heic",
        "image/heif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/vnd.microsoft.icon",
        "image/webp",
        "image/x-ms-bmp",
      ];

    case "video":
      return [
        "application/vnd.google-apps.video",
        "video/3gpp",
        "video/3gpp2",
        "video/avi",
        "video/flv",
        "video/mp2t",
        "video/mp4",
        "video/mp4v-es",
        "video/mpeg",
        "video/ogg",
        "video/quicktime",
        "video/vnd.mts",
        "video/webm",
        "video/x-flv",
        "video/x-m4v",
        "video/x-matroska",
        "video/x-ms-asf",
        "video/x-ms-wm",
        "video/x-ms-wmv",
        "video/x-ms-wvx",
        "video/x-msvideo",
        "video/x-quicktime",
      ];

    case "audio":
      return [
        "application/vnd.google-apps.audio",
        "audio/mpeg",
        "audio/mp3",
        "audio/mp4",
        "audio/midi",
        "audio/x-mid",
        "audio/x-midi",
        "audio/wav",
        "audio/x-wav",
        "audio/vnd.wav",
        "audio/flac",
        "audio/ogg",
        "audio/vorbis",
      ];
  }
};
