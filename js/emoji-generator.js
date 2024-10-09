import emojiFromText from 'emoji-from-text';

export function generateEmoji(text) {
  const list_of_emoji_names = [];

  const processText = text.replace(/[-_ ‎]/g, ',');
  const data = emojiFromText(processText);
  data.forEach((emoji) => {
    list_of_emoji_names.push(emoji.match.emoji.char);
  });

  let final_emoji = list_of_emoji_names[0];

  if (text.toLowerCase().includes('foxxo')) {
    final_emoji = '🦊';
  }

  if (text.toLowerCase().includes('nimo')) {
    final_emoji = '🦝';
  }

  if (text.toLowerCase().includes('john')) {
    final_emoji = '🚽';
  }

  return final_emoji;
}
