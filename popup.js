let main_div = document.getElementById("list");
let input = document.getElementById("search");
let button = document.getElementById("searchBtn");
let github = document.getElementById("githubBtn");

github.addEventListener("click", () => {
	chrome.tabs.create({
		url: "https://github.com/ShariarShuvo1/download-gif",
	});
});

input.addEventListener("keyup", (event) => {
	button.click();
});

const searchString = [108, 105, 108, 105];
function arraysAreEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}

button.addEventListener("click", () => {
	let search = input.value;
	if (search === "") {
		location.reload();
	} else if (
		search.length === 4 &&
		search
			.toLowerCase()
			.split("")
			.map((char) => char.charCodeAt(0))
			.every((val, index) => val === searchString[index])
	) {
		let output = `<div id="ll">&#10084;</div>`;
		main_div.innerHTML = output;
	} else {
		chrome.storage.local.get({ downloads: [] }, (data) => {
			const downloads = data.downloads;
			let output = "";
			downloads.reverse().forEach((element, index) => {
				let filename = element.path.split("\\").pop();
				if (filename.toLowerCase().includes(search.toLowerCase())) {
					output += `<div title="Click to open ${filename}" class="row" data-index="${index}" data-path="${element.path}"><div class="filepath">${filename}</div><img class="remove-btn" src="./remove.png" alt="remove-btn" title="Remove from the list" height="20px"></div>`;
				}
			});
			main_div.innerHTML = output;

			document.querySelectorAll(".row").forEach((row) => {
				row.addEventListener("click", function () {
					let path = this.getAttribute("data-path");
					openFileManager(path);
				});
			});

			document.querySelectorAll(".remove-btn").forEach((btn) => {
				btn.addEventListener("click", function (event) {
					event.stopPropagation();
					let index = parseInt(
						this.parentNode.getAttribute("data-index")
					);
					removeDownload(index);
				});
			});
		});
	}
});

chrome.storage.local.get({ downloads: [] }, (data) => {
	const downloads = data.downloads;
	let output = "";
	downloads.reverse().forEach((element, index) => {
		let filename = element.path.split("\\").pop();
		output += `<div title="Click to open  ${filename}" class="row" data-index="${index}" data-path="${element.path}"><div class="filepath">${filename}</div><img class="remove-btn" src="./remove.png" alt="remove-btn" title="Remove from the list" height="20px"></div>`;
	});
	main_div.innerHTML = output;

	document.querySelectorAll(".row").forEach((row) => {
		row.addEventListener("click", function () {
			let path = this.getAttribute("data-path");
			openFileManager(path);
		});
	});

	document.querySelectorAll(".remove-btn").forEach((btn) => {
		btn.addEventListener("click", function (event) {
			event.stopPropagation();
			let index = parseInt(this.parentNode.getAttribute("data-index"));
			removeDownload(index);
		});
	});
});

function openFileManager(path) {
	chrome.tabs.create({ url: path });
}

function removeDownload(index) {
	chrome.storage.local.get({ downloads: [] }, (data) => {
		let downloads = data.downloads;
		downloads.splice(index, 1);
		chrome.storage.local.set({ downloads: downloads }, () => {
			location.reload();
		});
	});
}
