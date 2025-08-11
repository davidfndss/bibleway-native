import { BibleBook } from 'interfaces/BibleBook';
import { Verse } from 'interfaces/Verse';
import nvi from '../assets/json/nvi.json';

export class NviService {
  public getVerse(book: number | String, chapter?: number, verse?: number): Verse {
    let bibleBook: BibleBook | undefined;

    if (typeof book === 'string') {
      bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book);
    } else if (typeof book === 'number') {
      bibleBook = nvi[book];
    }

    if (!bibleBook) {
      throw new Error('Livro não encontrado');
    }

    return {
      verse: bibleBook.chapters[chapter || 0][verse || 0],
      book: bibleBook,
      chapter: chapter || 1,
      index: verse || 1,
    };
  }

  public getChapter(book: string, chapter?: number): string[] {
    let bibleBook: BibleBook | undefined;

    bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book)!;

    if (!chapter) {
      return bibleBook.chapters[0];
    }

    return bibleBook.chapters[chapter - 1];
  }

  public getNumberOfChapters(book: number | String): number {
    let bibleBook: BibleBook | undefined;

    if (typeof book === 'string') {
      bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book);
    } else if (typeof book === 'number') {
      bibleBook = nvi[book];
    }

    if (!bibleBook) {
      throw new Error('Livro não encontrado');
    }

    return bibleBook.chapters.length;
  }

  public getNumberOfVerses(book: String, chapter?: number): number {
    let bibleBook: BibleBook | undefined;

    bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book);

    if (!bibleBook) {
      throw new Error('Livro não encontrado');
    }

    if (chapter) {
      chapter = chapter - 1;
    }

    return bibleBook.chapters[chapter || 0].length;
  }

  public getBookInfoByAbbrev(abbrev: string): BibleBook {
    const book = nvi.find((bookFound: BibleBook) => bookFound.abbrev === abbrev)!;
    const bookIndex = nvi.findIndex((bookFound: BibleBook) => bookFound.abbrev === abbrev);
    const group = this.findBookgroupDivisionByIndex(bookIndex);
    return {
      abbrev: book.abbrev,
      chapters: book.chapters,
      name: book.name,
      index: bookIndex,
    };
  }

  // ----------------------------------------------
  // Group 1 (Genesis): Genesis
  // Group 2 (Mosaic Law Divison): Exodus - Deuteronomy
  // Group 3 (Historical Books Division): Joshua - Esther
  // Group 4 (The Wisdom Books Division): Job - Song of Songs
  // Group 5 (Prophets Division): Isaiah - Malachi
  // Group 6 (Gospels Division): Matthew - John
  // Group 7 (Acts Division): Acts
  // Group 8 (The Epistles Disivision): Romans - Jude
  // Group 9 (The Revelation Division): Revelation
  // ----------------------------------------------
  public findBookgroupDivisionByIndex(index: number): number | null {
    if (index === 0)
      return 1; // Genesis
    else if (index >= 1 && index <= 4)
      return 2; // Exodus - Deuteronomy
    else if (index >= 5 && index <= 12)
      return 3; // Joshua - Esther
    else if (index >= 13 && index <= 22)
      return 4; // Job - Song of Songs
    else if (index >= 23 && index <= 38)
      return 5; // Isaiah - Malachi
    else if (index >= 39 && index <= 42)
      return 6; // Matthew - John
    else if (index === 43)
      return 7; // Acts
    else if (index >= 44 && index <= 64)
      return 8; // Romans - Jude
    else if (index === 65) return 9; // Revelation

    return null;
  }

  public getBookInfoByIndex(index: number): BibleBook | undefined {
    if (index < 0 || index >= nvi.length) return undefined;
    const book = nvi[index];
    return {
      abbrev: book.abbrev,
      chapters: book.chapters,
      name: book.name,
      index,
    };
  }

  public getTotalBooks(): number {
    return nvi.length;
  }
}
