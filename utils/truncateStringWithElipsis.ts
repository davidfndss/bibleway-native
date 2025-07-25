function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }

  if (maxLength <= 3) {
    return '...'.slice(0, maxLength);
  }

  return str.slice(0, maxLength - 3) + '...';
}

export default truncateString;