import { Verse } from 'interfaces/Verse';
import nvi from '../assets/json/nvi.json';

export default function getRandomVerse(): Verse {
    const randomBook = Math.floor(Math.random() * nvi.length);
    const randomChapter = Math.floor(Math.random() * nvi[randomBook].chapters.length);
    const randomVerse = Math.floor(Math.random() * nvi[randomBook].chapters[randomChapter].length);
    const verse = nvi[randomBook].chapters[randomChapter][randomVerse];

    return {
        verse,
        book: nvi[randomBook],
        chapter: randomChapter + 1,
        index: randomVerse + 1
    }
}