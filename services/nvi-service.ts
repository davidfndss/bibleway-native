import { BibleBook } from "interfaces/BibleBook";
import { Verse } from "interfaces/Verse";
import nvi from '../assets/json/nvi.json';

export class NviService {

    public getVerse(book: number | String, chapter?: number, verse?: number): Verse {
        let bibleBook: BibleBook | undefined;
        
        if (typeof book === "string") {
            bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book)
        } else if (typeof book === "number") {
            bibleBook = nvi[book]
        }

        if (!bibleBook) {
            throw new Error("Livro não encontrado");
        }

        return {
            verse: bibleBook.chapters[chapter || 0][verse || 0],
            book: bibleBook,
            chapter: chapter || 1,
            index: verse || 1
        };
    }

    public getChapter(book: number | String, chapter?: number): BibleBook {
        let bibleBook: BibleBook | undefined;
        
        if (typeof book === "string") {
            bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book)
        } else if (typeof book === "number") {
            bibleBook = nvi[book]
        }

        if (!bibleBook) {
            throw new Error("Livro não encontrado");
        }

        return bibleBook;
    }


    public getNumberOfChapters(book: number | String): number {
        let bibleBook: BibleBook | undefined;
        
        if (typeof book === "string") {
            bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book)
        } else if (typeof book === "number") {
            bibleBook = nvi[book]
        }

        if (!bibleBook) {
            throw new Error("Livro não encontrado");
        }

        return bibleBook.chapters.length;
    }

    public getNumberOfVerses(book: number | String, chapter?: number): number {
        let bibleBook: BibleBook | undefined;
        
        if (typeof book === "string") {
            bibleBook = nvi.find((bookFound: BibleBook) => bookFound.abbrev === book)
        } else if (typeof book === "number") {
            bibleBook = nvi[book]
        }

        if (!bibleBook) {
            throw new Error("Livro não encontrado");
        }

        return bibleBook.chapters[chapter || 0].length;
    }
}