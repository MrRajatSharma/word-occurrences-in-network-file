# word-occurrences-in-network-file  :sparkles:


- [x]  Fetch document from given url http://norvig.com/big.txt 
- [x]  Analyse the document using asynchronous mechanism, fetched in step 1 
- Find occurrences count of word in document
- Collect details for top 10 words(order by word Occurances) from https://dictionary.yandex.net/api/v1/dicservice.json/lookup, check details of API givien below
  - synonyms/means
  - part Of Speech/pos
- [x]  Show words list in JSON format for top 10 words.
- Word: text 
- Output 
  - Count of Occurrence in that Particular Document
  - Synonyms
  - Pos
	

API Details 
API: https://dictionary.yandex.net/api/v1/dicservice.json/lookup
Documentation: https://tech.yandex.com/dictionary/doc/dg/reference/lookup-docpage/

---
## Setup and Run
1. run `yarn install` 
2. run `npm start` 
3. check `REPL` for result`
