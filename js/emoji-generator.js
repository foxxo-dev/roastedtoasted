import { emojiFromText } from 'emoji-from-text';

export function generateEmoji(text) {
  const list_of_emoji_names = [];

  const processText = text.replace(/[-_ ‎]/g, '');
  const data = emojiFromText(processText);
  data.forEach((emoji) => {
    list_of_emoji_names.push(emoji.match.emoji.char);
  });

  return list_of_emoji_names[0];
}
