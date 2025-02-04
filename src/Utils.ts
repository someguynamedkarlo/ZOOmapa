
export function croatiaToEnglishLetters(s: string): string {
    return s.split("").map(ch => {
        switch (ch) {
            case "č": return "c";
            case "Č": return "C";
            case "ć": return "c";
            case "Ć": return "C";
            case "ž": return "z";
            case "Ž": return "Z";
            case "š": return "s";
            case "Š": return "S";
            case "đ": return "d";
            case "Đ": return "D";
            default: return ch;
        }
    }).join("");
}

export function croatiaStringIncludes(s1: string, s2: string) {
    return croatiaToEnglishLetters(s1).trim().toLocaleLowerCase().includes(croatiaToEnglishLetters(s2).trim());
}