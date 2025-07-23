import { BibleBook } from "./BibleBook";

export interface Verse {
    verse: string;
    book: BibleBook;
    chapter: number;
    index: number;
}