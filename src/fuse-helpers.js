const searchOptions = {
  includeScore: true,
  includeMatches: true,
  shouldSort: true,
  minMatchCharLength: 3,
  ignoreLocation: true,
  threshold: 0.3,
  keys: [{ name: "name", weight: 4 }],
};

const highlightMatch = (text, match) => {
  let highlightedText = text;
  if (match) {
    let start = match[0];
    let end = match[1];
    highlightedText = [text, start, end];
  }
  return highlightedText;
};

const getBestMatch = (matches) => {
  if (matches.length) {
    let indices = matches[0].indices;
    if (indices) {
      const lengthsArray = indices.map((indices) => indices[1] - indices[0]);
      return matches[0].indices[
        lengthsArray.indexOf(Math.max(...lengthsArray))
      ];
    }
  }
};

export { searchOptions, highlightMatch, getBestMatch };
