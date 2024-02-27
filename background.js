chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "downloader",
		title: "Download Picture",
		contexts: ["image"],
	});
});

chrome.contextMenus.onClicked.addListener((info) => {
	const url = info.srcUrl;
	if (info.menuItemId === "downloader" && url) {
		chrome.downloads.download({
			url: url,
		});
	}
});

chrome.downloads.onChanged.addListener((downloadDelta) => {
	if (downloadDelta.filename) {
		const path = downloadDelta.filename.current;
		const id = downloadDelta.id;
		const fileExtension = path.split(".").pop().toLowerCase();
		const imageExtensions = [
			"jpg",
			"jpeg",
			"png",
			"gif",
			"bmp",
			"webp",
			"svg",
		];
		if (imageExtensions.includes(fileExtension)) {
			chrome.storage.local.get({ downloads: [] }, (data) => {
				const downloads = data.downloads;
				downloads.push({ id: id, path: path });
				chrome.storage.local.set({ downloads: downloads });
			});
		}
	}
});
