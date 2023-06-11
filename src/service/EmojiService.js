export const emojiConfigs = {
  away: {
    icon: "icon-bbb-time",
    defaultMessage: "Away",
  },
  neutral: {
    icon: "icon-bbb-undecided",
    defaultMessage: "Undecided",
  },
  confused: {
    icon: "icon-bbb-confused",
    defaultMessage: "Confused",
  },
  sad: {
    icon: "icon-bbb-sad",
    defaultMessage: "Sad",
  },
  happy: {
    icon: "icon-bbb-happy",
    defaultMessage: "Happy",
  },
  applause: {
    icon: "icon-bbb-applause",
    defaultMessage: "Applaud",
  },
  thumbsUp: {
    icon: "icon-bbb-thumbs_up",
    defaultMessage: "Thumbs up",
  },
  thumbsDown: {
    icon: "icon-bbb-thumbs_down",
    defaultMessage: "Thumbs down",
  },
  raiseHand: {
    icon: "icon-bbb-hand",
    defaultMessage: "Raise hand",
  },
};

export function getUserEmojisSummary(user, skipNames = null, start = null, end = null) {
  const userEmojis = {};
  user.emojis.forEach((emoji) => {
    if (typeof emojiConfigs[emoji.name] === "undefined") return;
    if (skipNames != null && skipNames.split(",").indexOf(emoji.name) > -1) return;
    if (start != null && emoji.sentOn < start) return;
    if (end != null && emoji.sentOn > end) return;
    if (typeof userEmojis[emoji.name] === "undefined") {
      userEmojis[emoji.name] = 0;
    }
    userEmojis[emoji.name] += 1;
  });
  return userEmojis;
}

export function filterUserEmojis(user, skipNames = null, start = null, end = null) {
  const userEmojis = [];
  user.emojis.forEach((emoji) => {
    if (typeof emojiConfigs[emoji.name] === "undefined") return;
    if (skipNames != null && skipNames.split(",").indexOf(emoji.name) > -1) return;
    if (start != null && emoji.sentOn < start) return;
    if (end != null && emoji.sentOn > end) return;
    userEmojis.push(emoji);
  });
  return userEmojis;
}
