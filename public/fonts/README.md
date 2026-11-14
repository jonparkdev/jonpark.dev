# Fonts

Garden Modern and Garden Modern Mono are modified versions of New Computer Modern 8.1.1 (NewCM10-Book, -BookItalic, -Bold, -BoldItalic and NewCMMono10-Book) from CTAN: https://ctan.org/pkg/newcomputermodern

They are distributed under the GUST Font License (see `LICENSE-NewComputerModern.txt`). Changes: subset to Latin and common punctuation, converted to WOFF2, and renamed as the license asks for modified versions.

To regenerate, subset the original OTFs with fontTools `pyftsubset` (`--flavor=woff2`, layout features kern, liga, smcp, c2sc, onum, lnum, tnum, pnum) and rename name IDs 1, 3, 4, 6 and 16.
