const axios = require('axios');
const es = require('event-stream');
const fs = require('fs');
const path = require("path");

const url = 'http://norvig.com/big.txt';
const dictAPI = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${process.env.API_KEY}&lang=en-en&text=`;
const freq = {};
let totalLines = 0;

const getTop10Occurrences = (obj) => {
	const top10Occurrences = {};
	const sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
	sortedKeys.slice(0, 10).every(key => top10Occurrences[key] = obj[key]);
	return top10Occurrences;
}

const getTop10WordsSynAndPos = async (words) => {
	const wordKeys = Object.keys(words);
	const promises = wordKeys.map((word) => {
		const url = `${dictAPI}${word}`;
		// console.log("Looking at", url);
		return axios.get(url);
	})

	const responses = await Promise.all(promises);
	const res = [];
	responses.map((response, idx) => {
		try {
			const data = response.data;
			// console.log("Data", data);
			const pos = data && data.def[0] && data.def[0].pos;
			const syn = data && data.def[0] && data.def[0].tr.map((syn) => syn.text);
			res.push({
				Word: wordKeys[idx],
				Output: {
					Count: words[wordKeys[idx]],
					Pos: pos || [],
					Synonyms: syn || []
				}
			})
		} catch (error) {
			console.error(error);
		}
	})

	return res;
}

const getWordsFromLine = (line) => {
	return line.toLowerCase().match(/\b(\w+)\b/g);
}

const getFileStreamFromDir = () => {
	const filePath = path.resolve(__dirname, 'big.txt')

	return fs
		.createReadStream(filePath);
}

const setWordsFrequency = (words) => {
	if (words) {
		words.forEach(function (word) {
			if (freq.hasOwnProperty(word)) freq[word] += 1;
			else freq[word] = 1;
		});
	}
}

(async () => {
	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream'
	})

	// either write into a file using a write stream
	// const writer = fs.createWriteStream(filePath)
	// response.data.pipe(writer);
	// and use file read stream and pipe into event-stream to handle big files which cannot be handled by fs stream directly
	// fs
	// 	.createReadStream(filePath)

	// getFileStreamFromDir()				// uncomment if reading using getFileStreamFromDir
	response												// comment if reading using getFileStreamFromDir
		.data													// comment if reading using getFileStreamFromDir
		.pipe(es.split())
		.pipe(
			es
				.mapSync((line) => {
					totalLines++;
					// const words = line.trim().split(" ");
					const words = getWordsFromLine(line);
					// console.log(line, words);
					setWordsFrequency(words);
				})
				.on('error', function (err) {
					console.log('Error while reading file.', err);
				})
				.on('end', async () => {
					const top10Occurrences = getTop10Occurrences(freq);
					// console.log(
					// 	'\nOccurences:', freq,
					// 	'\nTop 10 Occurrences:', top10Occurrences,
					// 	'\nTotal Lines:', totalLines,
					// 	'\nTotal words:', Object.entries(freq).length
					// );

					// find 
					const top10WordsSynAndPos = await getTop10WordsSynAndPos(top10Occurrences);
					console.log('Top 10 Words and its occurrences, syn, and pos', top10WordsSynAndPos);
				}),
		);
})()
